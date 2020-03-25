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
            if (_obj.status != "000") return _obj;

            foreach (DataRow dr1 in dt_user.Rows)
            {
                LeaveBalance _obj1 = new LeaveBalance();
                User user = new User();
                user.userName = (string)dr1[nameof(user.userName)];
                user.userFullName = (string)dr1[nameof(user.userFullName)];
                user.userDeptCode = (string)dr1[nameof(user.userDeptCode)];
                user.userTitleCode = (string)dr1[nameof(user.userTitleCode)];
                _obj1.user = user;
                _obj1.leaveTypes = new List<LeaveType>();
                foreach (DataRow dr2 in dt_leaveType.Rows)
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
    }
}