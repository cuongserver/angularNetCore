using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using AngularNETcore.Models;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Diagnostics;
using AngularNETcore.Common;

namespace AngularNETcore.DataAccessLayer
{
    public class LeaveManagementDataAccessLayer : DataAccessLayerBase
    {
        public LeaveManagementDataAccessLayer(string _connString)
        {
            _connectionString = _connString;
        }

        public async Task<LeaveBalanceSummary> GetLeaveLimitSummary(long pageSize, long requestPage, SearchCondition filters, string getAllOrNot)
        {
            long _pageSize = pageSize;
            long _requestPage = requestPage;
            string _getAllOrNot = getAllOrNot;
            string _condition = Utility.CompleteConditionString(filters);
            string condition = String.IsNullOrEmpty(_condition) ? "1 = 1" : "(" + _condition + ")";
            LeaveBalanceSummary _obj = new LeaveBalanceSummary();
            _obj.summary = new List<LeaveBalance>();
            _obj.leaveCodes = new List<string>();
            DataTable dt_leaveType = new DataTable();
            DataTable dt_user = new DataTable();
            DataTable dt_leaveLimit = new DataTable();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "LeaveLimitSummary";
                cmd.Parameters.AddWithValue("@pageSize", _pageSize);
                cmd.Parameters.AddWithValue("@requestPage", _requestPage);
                cmd.Parameters.AddWithValue("@condition", condition);
                cmd.Parameters.AddWithValue("@getAll", _getAllOrNot);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@collectionSize",
                    SqlDbType = SqlDbType.BigInt,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@activePage",
                    SqlDbType = SqlDbType.BigInt,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm2);

                DataSet ds = new DataSet();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(ds);

                    _obj.collectionSize = (Int64)prm1.Value;
                    _obj.pageSize = _pageSize;
                    _obj.activePage = (Int64)prm2.Value;                    
                    if (ds.Tables.Count == 3)
                    {
                        dt_leaveType = ds.Tables[0];
                        dt_user = ds.Tables[1];
                        dt_leaveLimit = ds.Tables[2];
                        _obj.status = "000";
                    }
                    else
                    {
                        _obj.status = "-001";
                    }
                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt_leaveType.Dispose();
                    dt_user.Dispose();
                    dt_leaveLimit.Dispose();
                    ds.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            if( _obj.status != "000") return _obj;

            foreach(DataRow dr1 in dt_user.Rows)
            {
                LeaveBalance _obj1 = new LeaveBalance();
                User user = new User();
                user.userName = (string)dr1[nameof(user.userName)];
                user.userFullName = (string)dr1[nameof(user.userFullName)];
                user.userDeptCode = (string)dr1[nameof(user.userDeptCode)];
                user.userTitleCode = (string)dr1[nameof(user.userTitleCode)];
                _obj1.user = user;
                _obj1.leaveTypes = new List<LeaveType>();
                foreach(DataRow dr2 in dt_leaveType.Rows)
                {                   
                    LeaveType leave = new LeaveType();
                    string leaveCode = (string)dr2[nameof(leave.leaveCode)];
                    var rows = dt_leaveLimit.AsEnumerable();
                    var row = rows.FirstOrDefault(x => x["leaveCode"].ToString() == leaveCode && x["userName"].ToString() == user.userName);
                    leave.leaveCode = leaveCode;
                    if (row != null && !row.IsNull("limit")) leave.limit = Convert.ToInt32(row["limit"]);
                    _obj1.leaveTypes.Add(leave);                   
                }
                _obj.summary.Add(_obj1);                
            }
            foreach (DataRow dr2 in dt_leaveType.Rows)
            {
                _obj.leaveCodes.Add((string)dr2["leaveCode"]);
            }
            return _obj;
        }

        public async Task<LeaveBalanceSummary> AdjustLeaveLimit(LeaveBalance model)
        {
            LeaveBalanceSummary _obj = new LeaveBalanceSummary();
            DataTable dt_leaveType = new DataTable();
            using (SqlConnection con = SqlCon())
            {
                DataTable dt = leaveLimit();
                foreach(var x in model.leaveTypes)
                {
                    DataRow dr = dt.NewRow();
                    dr["userName"] = model.user.userName;
                    dr["leaveCode"] = x.leaveCode;
                    dr["limit"] = x.limit ?? (object)DBNull.Value;
                    dt.Rows.Add(dr);
                }


                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "AdjustLeaveLimit";
                SqlParameter prm0 = new SqlParameter
                {
                    ParameterName = "@leaveTypes",
                    SqlDbType = SqlDbType.Structured,
                    Direction = ParameterDirection.Input,
                    Value = dt
                };
                cmd.Parameters.Add(prm0);
                cmd.Parameters.AddWithValue("@userName", model.user.userName);
                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);


                DataSet ds = new DataSet();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(ds);
                    _obj.status = (string)prm1.Value;                    
                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    ds.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            
            return _obj;
        }

        public async Task<LeaveApplicationResponse> GetLeaveApplication(string userName)
        {
            LeaveApplicationResponse _obj = new LeaveApplicationResponse();
            LeaveApplication app = new LeaveApplication();
            List<string> leaveCodes = new List<string>();
            List<SysParam> sysParams = new List<SysParam>();
            List<Holiday> holidays = new List<Holiday>();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "InitializeLeaveApplication";
                cmd.Parameters.AddWithValue("@applicantUserName", userName);


                DataSet ds = new DataSet();
                DataTable dt0 = new DataTable();
                DataTable dt1 = new DataTable();
                DataTable dt2 = new DataTable();
                DataTable dt3 = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(ds);
                    dt0 = ds.Tables[0];
                    dt1 = ds.Tables[1];
                    dt2 = ds.Tables[2];
                    dt3 = ds.Tables[3];
                    _obj.status = "000";

                    foreach(DataRow dr in dt0.Rows)
                    {
                        app.trackingRef = (string)dr[nameof(app.trackingRef)];
                        app.createdAt = (string)dr[nameof(app.createdAt)];
                        app.applicantUserName = (string)dr[nameof(app.applicantUserName)];
                        app.applicantDeptCode = (string)dr[nameof(app.applicantDeptCode)];
                        app.applicantTitleCode = (string)dr[nameof(app.applicantTitleCode)];
                        app.fromTime = (dr[nameof(app.fromTime)] as string) ?? String.Empty;
                        app.toTime = (dr[nameof(app.toTime)] as string) ?? String.Empty;
                        app.timeConsumed = (dr[nameof(app.timeConsumed)] as int?) ?? 0;
                        app.applicantDescription = (dr[nameof(app.applicantDescription)] as string) ?? String.Empty;
                        app.leaveCode = (dr[nameof(app.leaveCode)] as string) ?? String.Empty;
                        app.isValid = (bool)dr[nameof(app.isValid)];
                        app.progress = (string)dr[nameof(app.progress)];
                        app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                        app.approverDescription = (dr[nameof(app.approverDescription)] as string) ?? String.Empty;
                        app.createdByAdmin = (bool)dr[nameof(app.createdByAdmin)];
                        app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                        app.finalStatus = (bool)dr[nameof(app.finalStatus)];
                        app.applicantUserFullName = (string)dr[nameof(app.applicantUserFullName)];
                        //app.approverUserFullName = (string)dr[nameof(app.approverUserFullName)];
                    }
                    _obj.application = app;

                    foreach(DataRow dr in dt1.Rows)
                    {
                        leaveCodes.Add((string)dr[0]);
                    }
                    _obj.leaveCodes = leaveCodes;

                    foreach(DataRow dr in dt3.Rows)
                    {
                        SysParam param = new SysParam();
                        param.paramKey = (string)dr[nameof(param.paramKey)];
                        param.paramValue = (string)dr[nameof(param.paramValue)];
                        sysParams.Add(param);
                    }
                    _obj.sysParams = sysParams;
                    foreach (DataRow dr in dt2.Rows)
                    {
                        Holiday holiday = new Holiday();
                        holiday.holidayDate = (string)dr[nameof(holiday.holidayDate)];
                        holidays.Add(holiday);
                    }
                    _obj.holidays = holidays;
                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt0.Dispose();
                    dt1.Dispose();
                    ds.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }

        public async Task<LeaveApplicationResponse> SubmitLeaveApplication(LeaveApplication model)
        {
            LeaveApplicationResponse _obj = new LeaveApplicationResponse();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "SubmitLeaveApplication";
                cmd.Parameters.AddWithValue("@trackingRef", model.trackingRef);
                cmd.Parameters.AddWithValue("@applicantUserName", model.applicantUserName);
                cmd.Parameters.AddWithValue("@leaveCode", model.leaveCode);
                cmd.Parameters.AddWithValue("@applicantDescription", model.applicantDescription);
                cmd.Parameters.AddWithValue("@fromTime", model.fromTime);
                cmd.Parameters.AddWithValue("@toTime", model.toTime);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                DataSet ds = new DataSet();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(ds);
                    _obj.status = (string)prm1.Value;

                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    ds.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }

        public async Task<LeaveApplications> PendingLeaveApplication(string userName)
        {
            LeaveApplications _obj = new LeaveApplications();
            List<LeaveApplication> list = new List<LeaveApplication>();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetPendingApplication";
                cmd.Parameters.AddWithValue("@userName", userName);


                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(dt);
                    if(dt.Rows.Count > 0)
                    {
                        foreach(DataRow dr in dt.Rows)
                        {
                            LeaveApplication app = new LeaveApplication();
                            app.trackingRef = (string)dr[nameof(app.trackingRef)];
                            app.createdAt = (string)dr[nameof(app.createdAt)];
                            app.applicantUserName = (string)dr[nameof(app.applicantUserName)];
                            app.applicantDeptCode = (string)dr[nameof(app.applicantDeptCode)];
                            app.applicantTitleCode = (string)dr[nameof(app.applicantTitleCode)];
                            app.fromTime = (dr[nameof(app.fromTime)] as string) ?? String.Empty;
                            app.toTime = (dr[nameof(app.toTime)] as string) ?? String.Empty;
                            app.timeConsumed = (dr[nameof(app.timeConsumed)] as int?) ?? 0;
                            app.applicantDescription = (dr[nameof(app.applicantDescription)] as string) ?? String.Empty;
                            app.leaveCode = (dr[nameof(app.leaveCode)] as string) ?? String.Empty;
                            app.isValid = (bool)dr[nameof(app.isValid)];
                            app.progress = (string)dr[nameof(app.progress)];
                            app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                            app.approverDescription = (dr[nameof(app.approverDescription)] as string) ?? String.Empty;
                            app.createdByAdmin = (bool)dr[nameof(app.createdByAdmin)];
                            app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                            app.finalStatus = (bool)dr[nameof(app.finalStatus)];
                            app.applicantUserFullName = (string)dr[nameof(app.applicantUserFullName)];

                            list.Add(app);
                        }
                        _obj.apps = list;
                    }
                    _obj.status = (string)prm1.Value;

                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }

        public async Task<LeaveApplications> ApproveLeaveApplication(LeaveApplication model)
        {
            LeaveApplications _obj = new LeaveApplications();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "ApproveLeaveApplication";
                cmd.Parameters.AddWithValue("@approverUserName", model.approverUserName);
                cmd.Parameters.AddWithValue("@trackingRef", model.trackingRef);
                cmd.Parameters.AddWithValue("@approverDescription", model.approverDescription);
                cmd.Parameters.AddWithValue("@approverCommand", model.approverCommand);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(dt);                
                    _obj.status = (string)prm1.Value;

                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }

        public async Task<LeaveBalance> ShowLeaveBalance(LeaveBalance model)
        {
            LeaveBalance _obj = new LeaveBalance();
            _obj.user = model.user;
            _obj.reportYear = model.reportYear;
            List<LeaveType> list = new List<LeaveType>();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "ShowLeaveBalance";
                cmd.Parameters.AddWithValue("@userName", model.user.userName);
                cmd.Parameters.AddWithValue("@reportYear", model.reportYear);


                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(dt);
                    
                    foreach(DataRow dr in dt.Rows)
                    {
                        LeaveType leave = new LeaveType();
                        leave.leaveCode = (dr[nameof(leave.leaveCode)] as string) ?? String.Empty;
                        leave.limit = dr[nameof(leave.limit)] == DBNull.Value? default(int?) : Convert.ToInt32(dr[nameof(leave.limit)]);
                        leave.used = dr[nameof(leave.used)] == DBNull.Value ? default(int?) : Convert.ToInt32(dr[nameof(leave.used)]);
                        leave.pending = dr[nameof(leave.pending)] == DBNull.Value ? default(int?) : Convert.ToInt32(dr[nameof(leave.pending)]);
                        leave.balance = dr[nameof(leave.balance)] == DBNull.Value ? default(int?) : Convert.ToInt32(dr[nameof(leave.balance)]);
                        list.Add(leave);
                    }
                    _obj.status = (string)prm1.Value;
                    _obj.leaveTypes = list;

                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }

        public async Task<LeaveApplications> GetSingleLeaveAppplication (string applicantUserName, long pageSize, long requestPage, SearchCondition filters, string getAllOrNot)
        {
            string _applicantUserName = applicantUserName;
            long _pageSize = pageSize;
            long _requestPage = requestPage;
            string _getAllOrNot = getAllOrNot;
            string _condition = Utility.CompleteConditionString(filters);
            string condition = String.IsNullOrEmpty(_condition) ? "1 = 1" : "(" + _condition + ")";
            LeaveApplications _obj = new LeaveApplications();
            List<LeaveApplication> list = new List<LeaveApplication>();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetSingleApplicationList";
                cmd.Parameters.AddWithValue("@applicantUserName", _applicantUserName);
                cmd.Parameters.AddWithValue("@pageSize", _pageSize);
                cmd.Parameters.AddWithValue("@requestPage", _requestPage);
                cmd.Parameters.AddWithValue("@condition", condition);
                cmd.Parameters.AddWithValue("@getAll", _getAllOrNot);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@collectionSize",
                    SqlDbType = SqlDbType.BigInt,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@activePage",
                    SqlDbType = SqlDbType.BigInt,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm2);

                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(dt);

                    _obj.collectionSize = (Int64)prm1.Value;
                    _obj.pageSize = _pageSize;
                    _obj.activePage = (Int64)prm2.Value;
                    _obj.status = "000";
                    if (dt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            LeaveApplication app = new LeaveApplication();
                            app.trackingRef = (string)dr[nameof(app.trackingRef)];
                            app.createdAt = (string)dr[nameof(app.createdAt)];
                            app.applicantUserName = (string)dr[nameof(app.applicantUserName)];
                            app.applicantDeptCode = (string)dr[nameof(app.applicantDeptCode)];
                            app.applicantTitleCode = (string)dr[nameof(app.applicantTitleCode)];
                            app.fromTime = (dr[nameof(app.fromTime)] as string) ?? String.Empty;
                            app.toTime = (dr[nameof(app.toTime)] as string) ?? String.Empty;
                            app.timeConsumed = (dr[nameof(app.timeConsumed)] as int?) ?? 0;
                            app.applicantDescription = (dr[nameof(app.applicantDescription)] as string) ?? String.Empty;
                            app.leaveCode = (dr[nameof(app.leaveCode)] as string) ?? String.Empty;
                            app.isValid = (bool)dr[nameof(app.isValid)];
                            app.progress = (string)dr[nameof(app.progress)];
                            app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                            app.approverDescription = (dr[nameof(app.approverDescription)] as string) ?? String.Empty;
                            app.createdByAdmin = (bool)dr[nameof(app.createdByAdmin)];
                            app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                            app.finalStatus = (bool)dr[nameof(app.finalStatus)];
                            app.applicantUserFullName = (string)dr[nameof(app.applicantUserFullName)];
                            app.approverUserFullName = (dr[nameof(app.approverUserFullName)] as string) ?? String.Empty;
                            app.approverCommand = (dr[nameof(app.approverCommand)] as string) ?? String.Empty;
                            list.Add(app);
                        }
                        _obj.apps = list;
                    }
                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _obj;
        }

        public async Task<LeaveApplications> GetFullLeaveAppplication(long pageSize, long requestPage, SearchCondition filters, string getAllOrNot)
        {
            long _pageSize = pageSize;
            long _requestPage = requestPage;
            string _getAllOrNot = getAllOrNot;
            string _condition = Utility.CompleteConditionString(filters);
            string condition = String.IsNullOrEmpty(_condition) ? "1 = 1" : "(" + _condition + ")";
            LeaveApplications _obj = new LeaveApplications();
            List<LeaveApplication> list = new List<LeaveApplication>();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetFullApplicationList";
                cmd.Parameters.AddWithValue("@pageSize", _pageSize);
                cmd.Parameters.AddWithValue("@requestPage", _requestPage);
                cmd.Parameters.AddWithValue("@condition", condition);
                cmd.Parameters.AddWithValue("@getAll", _getAllOrNot);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@collectionSize",
                    SqlDbType = SqlDbType.BigInt,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);

                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@activePage",
                    SqlDbType = SqlDbType.BigInt,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm2);

                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(dt);

                    _obj.collectionSize = (Int64)prm1.Value;
                    _obj.pageSize = _pageSize;
                    _obj.activePage = (Int64)prm2.Value;
                    _obj.status = "000";
                    if (dt.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt.Rows)
                        {
                            LeaveApplication app = new LeaveApplication();
                            app.trackingRef = (string)dr[nameof(app.trackingRef)];
                            app.createdAt = (string)dr[nameof(app.createdAt)];
                            app.applicantUserName = (string)dr[nameof(app.applicantUserName)];
                            app.applicantDeptCode = (string)dr[nameof(app.applicantDeptCode)];
                            app.applicantTitleCode = (string)dr[nameof(app.applicantTitleCode)];
                            app.fromTime = (dr[nameof(app.fromTime)] as string) ?? String.Empty;
                            app.toTime = (dr[nameof(app.toTime)] as string) ?? String.Empty;
                            app.timeConsumed = (dr[nameof(app.timeConsumed)] as int?) ?? 0;
                            app.applicantDescription = (dr[nameof(app.applicantDescription)] as string) ?? String.Empty;
                            app.leaveCode = (dr[nameof(app.leaveCode)] as string) ?? String.Empty;
                            app.isValid = (bool)dr[nameof(app.isValid)];
                            app.progress = (string)dr[nameof(app.progress)];
                            app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                            app.approverDescription = (dr[nameof(app.approverDescription)] as string) ?? String.Empty;
                            app.createdByAdmin = (bool)dr[nameof(app.createdByAdmin)];
                            app.approverUserName = (dr[nameof(app.approverUserName)] as string) ?? String.Empty;
                            app.finalStatus = (bool)dr[nameof(app.finalStatus)];
                            app.applicantUserFullName = (string)dr[nameof(app.applicantUserFullName)];
                            app.approverUserFullName = (dr[nameof(app.approverUserFullName)] as string) ?? String.Empty;
                            app.approverCommand = (dr[nameof(app.approverCommand)] as string) ?? String.Empty;
                            list.Add(app);
                        }
                        _obj.apps = list;
                    }
                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _obj;
        }

        public async Task<LeaveApplications> DisableLeaveApplication(LeaveApplication model)
        {
            LeaveApplications _obj = new LeaveApplications();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "DisableLeaveApplication";
                cmd.Parameters.AddWithValue("@trackingRef", model.trackingRef);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);
                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                    _obj.status = (string)prm1.Value;

                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }

        public async Task<DataForDirectLeaveDeduction> PrepareDataForDirectLeaveDeduction()
        {
            DataForDirectLeaveDeduction _obj = new DataForDirectLeaveDeduction();
            List<User> users = new List<User>();
            List<string> leaveCodes = new List<string>();
            List<SysParam> sysParams = new List<SysParam>();
            List<Holiday> holidays = new List<Holiday>();

            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetDataForDirectLeaveDeduction";
                DataSet ds = new DataSet();
                DataTable dt0 = new DataTable();
                DataTable dt1 = new DataTable();
                DataTable dt2 = new DataTable();
                DataTable dt3 = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(ds);
                    dt0 = ds.Tables[0];
                    dt1 = ds.Tables[1];
                    dt2 = ds.Tables[2];
                    dt3 = ds.Tables[3];
                    _obj.status = "000";

                    foreach (DataRow dr in dt0.Rows)
                    {
                        User user = new User();
                        user.userName = (string)dr[nameof(user.userName)];
                        user.userFullName = (string)dr[nameof(user.userFullName)];
                        user.userDeptCode = (string)dr[nameof(user.userDeptCode)];
                        user.userTitleCode = (string)dr[nameof(user.userTitleCode)];
                        users.Add(user);
                    }
                    _obj.users = users;

                    foreach (DataRow dr in dt1.Rows)
                    {
                        leaveCodes.Add((string)dr[0]);
                    }
                    _obj.leaveCodes = leaveCodes;

                    foreach (DataRow dr in dt3.Rows)
                    {
                        SysParam param = new SysParam();
                        param.paramKey = (string)dr[nameof(param.paramKey)];
                        param.paramValue = (string)dr[nameof(param.paramValue)];
                        sysParams.Add(param);
                    }
                    _obj.sysParams = sysParams;
                    foreach (DataRow dr in dt2.Rows)
                    {
                        Holiday holiday = new Holiday();
                        holiday.holidayDate = (string)dr[nameof(holiday.holidayDate)];
                        holidays.Add(holiday);
                    }
                    _obj.holidays = holidays;
                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    dt0.Dispose();
                    dt1.Dispose();
                    dt2.Dispose();
                    dt3.Dispose();
                    ds.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _obj;
        }

        public async Task<LeaveApplicationResponse> DirectLeaveDeduction(LeaveApplication model)
        {
            LeaveApplicationResponse _obj = new LeaveApplicationResponse();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "LeaveDeductionByAdmin";
                cmd.Parameters.AddWithValue("@applicantUserName", model.applicantUserName);
                cmd.Parameters.AddWithValue("@leaveCode", model.leaveCode);
                cmd.Parameters.AddWithValue("@applicantDescription", model.applicantDescription);
                cmd.Parameters.AddWithValue("@fromTime", model.fromTime);
                cmd.Parameters.AddWithValue("@toTime", model.toTime);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm1);
                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@message",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(prm2);
                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                    _obj.status = (string)prm1.Value;
                    _obj.message = (string)prm2.Value;

                }
                catch (SqlException ex)
                {
                    _obj.status = ex.Number.ToString();
                    _obj.message = ex.Message;
                }
                finally
                {
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }

            return _obj;
        }
    }
}

    
