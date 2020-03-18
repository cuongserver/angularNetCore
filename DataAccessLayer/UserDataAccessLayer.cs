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
    public class UserDataAccessLayer : DataAccessLayerBase
    {

        public UserDataAccessLayer(string _connString)
        {
            _connectionString = _connString;
        }
        public async Task<LoginValidationStatus> loginStatus(User model)
        {
            LoginValidationStatus _status = new LoginValidationStatus();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "ValidateLogin";
                cmd.Parameters.AddWithValue("@userName", model.userName);
                cmd.Parameters.AddWithValue("@userPass", model.userPass);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@message",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(prm1);
                cmd.Parameters.Add(prm2);
                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                try
                {
                    con.Open();
                    da.Fill(dt);
                    _status.validateResult = (string)prm1.Value;
                    _status.validateMessage = (string)prm2.Value;
                    if (dt.Rows.Count > 0)
                    {
                        User user = new User();
                        DataRow dr = dt.Rows[0];
                        user.userName = (string)dr[nameof(user.userName)];
                        user.userFullName = (string)dr[nameof(user.userFullName)];
                        user.userTitleCode = (string)dr[nameof(user.userTitleCode)];
                        user.userDeptCode = (string)dr[nameof(user.userDeptCode)];
                        _status.user = user;
                    }
                }
                catch (SqlException ex)
                {
                    _status.validateResult = ex.Number.ToString();
                    _status.validateMessage = ex.Message;
                }
                finally
                {
                    dt.Dispose();
                    da.Dispose();
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _status;
        }

        public async Task<TitleValidationStatus> getUserTitle(User model)
        {
            TitleValidationStatus _status = new TitleValidationStatus();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetUserTitle";
                cmd.Parameters.AddWithValue("@userName", model.userName);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@message",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(prm1);
                cmd.Parameters.Add(prm2);

                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                    _status.validateResult = (string)prm1.Value;
                    _status.validateMessage = (string)prm2.Value;
                }
                catch (SqlException ex)
                {
                    _status.validateResult = ex.Number.ToString();
                    _status.validateMessage = ex.Message;
                }
                finally
                {
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _status;
        }

        public async Task<UserInformation> getUserDetails(User model)
        {
            UserInformation _userInfo = new UserInformation();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetUserDetails";
                cmd.Parameters.AddWithValue("@userName", model.userName);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };
                //SqlParameter prm2 = new SqlParameter
                //{
                //    ParameterName = "@message",
                //    SqlDbType = SqlDbType.NVarChar,
                //    Size = 50,
                //    Direction = ParameterDirection.Output
                //};

                cmd.Parameters.Add(prm1);
                //cmd.Parameters.Add(prm2);
                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                try
                {
                    con.Open();
                    da.Fill(dt);
                    _userInfo.status = (string)prm1.Value;
                    if (dt.Rows.Count > 0)
                    {
                        User user = new User();
                        DataRow dr = dt.Rows[0];
                        user.userName = (string)dr[nameof(user.userName)];
                        user.userFullName = (string)dr[nameof(user.userFullName)];
                        user.userTitleCode = (string)dr[nameof(user.userTitleCode)];
                        user.userDeptCode = (string)dr[nameof(user.userDeptCode)];
                        user.userEnabled = (bool)dr[nameof(user.userEnabled)];
                        user.userFailedLoginCount = (int)dr[nameof(user.userFailedLoginCount)];
                        user.titleDesc = (string)dr[nameof(user.titleDesc)];
                        user.deptDesc = (string)dr[nameof(user.deptDesc)];
                        user.userEmail = (string)(dr[nameof(user.userEmail)].ToString() ?? String.Empty);
                        _userInfo.user = user;
                    }
                }
                catch (SqlException ex)
                {
                    _userInfo.status = ex.Number.ToString();
                    _userInfo.message = ex.Message;
                }
                finally
                {
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _userInfo;
        }

        public async Task<PasswordChangeStatus> changeUserPassword(User model)
        {
            PasswordChangeStatus _status = new PasswordChangeStatus();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "ChangeUserPassword";
                cmd.Parameters.AddWithValue("@userName", model.userName);
                cmd.Parameters.AddWithValue("@userPass", model.userPassOld);
                cmd.Parameters.AddWithValue("@userPassNew", model.userPassNew);
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

                DataTable dt = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmd);

                try
                {
                    con.Open();
                    da.Fill(dt);
                    _status.validateResult = (string)prm1.Value;
                    //if (dt.Rows.Count > 0)
                    //{
                    //    User user = new User();
                    //    DataRow dr = dt.Rows[0];
                    //    user.userName = (string)dr[nameof(user.userName)];
                    //    user.userFullName = (string)dr[nameof(user.userFullName)];
                    //    user.userTitleCode = (string)dr[nameof(user.userTitleCode)];
                    //    user.userDeptCode = (string)dr[nameof(user.userDeptCode)];
                    //    user.userEnabled = (bool)dr[nameof(user.userEnabled)];
                    //    user.userFailedLoginCount = (int)dr[nameof(user.userFailedLoginCount)];
                    //    user.titleDesc = (string)dr[nameof(user.titleDesc)];
                    //    user.deptDesc = (string)dr[nameof(user.deptDesc)];
                    //    _userInfo.user = user;
                    //}
                }
                catch (SqlException ex)
                {
                    _status.validateResult = ex.Number.ToString();
                }
                finally
                {
                    if (con.State == System.Data.ConnectionState.Open) con.Close();
                    cmd.Dispose();
                }
            }
            return _status;
        }

        public async Task<TitleAndDept> getTitleAndDeptCode()
        {
            TitleAndDept _obj = new TitleAndDept()
            {
                titleCodeList = new List<string> { },
                deptCodeList = new List<string> { }
            };

            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetTitleAndDeptList";

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                DataTable dt0 = new DataTable();
                DataTable dt1 = new DataTable();
                try
                {
                    con.Open();
                    da.Fill(ds);
                    dt0 = ds.Tables[0];
                    dt1 = ds.Tables[1];
                    if (dt0.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt0.Rows)
                        {
                            _obj.deptCodeList.Add(dr[0].ToString());
                        }
                    }

                    if (dt1.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt1.Rows)
                        {
                            _obj.titleCodeList.Add(dr[0].ToString());
                        }
                    }
                }
                catch (SqlException ex)
                {
                    _obj.deptCodeList.Clear();
                    _obj.titleCodeList.Clear();
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

        public async Task<UserInformation> addNewUser(User model)
        {
            UserInformation _obj = new UserInformation();


            using (SqlConnection con = SqlCon())
            {
                DataTable dt = userInfo();
                DataRow dr = dt.NewRow();
                dr["userName"] = model.userName;
                dr["userFullName"] = model.userFullName;
                dr["userPass"] = model.userPass;
                dr["userTitleCode"] = model.userTitleCode;
                dr["userDeptCode"] = model.userDeptCode;
                dr["userEmail"] = model.userEmail;
                dt.Rows.Add(dr);
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "AddNewUser";
                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@user",
                    SqlDbType = SqlDbType.Structured,
                    Direction = ParameterDirection.Input,
                    Value = dt
                };

                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@status",
                    SqlDbType = SqlDbType.NVarChar,
                    Size = 50,
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(prm1);
                cmd.Parameters.Add(prm2);

                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                    _obj.status = (string)prm2.Value;
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

        public async Task<UserCollection> listAllUser()
        {
            UserCollection _obj = new UserCollection()
            {
                users = new List<User>()
            };

            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetUserNoFilter";

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                DataTable dt0 = new DataTable();
                try
                {
                    con.Open();
                    da.Fill(ds);
                    dt0 = ds.Tables[0];
                    if (dt0.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt0.Rows)
                        {
                            User user = new User();
                            user.userName = (string)dr[nameof(user.userName)];
                            user.userFullName = (string)dr[nameof(user.userFullName)];
                            user.userTitleCode = (string)dr[nameof(user.userTitleCode)];
                            user.userDeptCode = (string)dr[nameof(user.userDeptCode)];
                            user.userEnabled = (bool)dr[nameof(user.userEnabled)];
                            user.userFailedLoginCount = (int)dr[nameof(user.userFailedLoginCount)];
                            user.titleDesc = (string)dr[nameof(user.titleDesc)];
                            user.deptDesc = (string)dr[nameof(user.deptDesc)];
                            user.userEmail = (string)(dr[nameof(user.userEmail)].ToString() ?? String.Empty);
                            _obj.users.Add(user);
                        }
                    }
                }
                catch (SqlException ex)
                {
                    throw (ex);
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

        public async Task<UserCollection> listAllUserWithPaging(long pageSize, long requestPage, UserSearchCondition filters)
        {
            long _pageSize = pageSize;
            long _requestPage = requestPage;
            UserCollection _obj = new UserCollection()
            {
                users = new List<User>()
            };

            string _condition = Utility.CompleteConditionString(filters);
            string condition = String.IsNullOrEmpty(_condition) ? "1 = 1" : "(" + _condition + ")";
            Debug.WriteLine(condition);
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetUserWithPaging";
                cmd.Parameters.AddWithValue("@pageSize", _pageSize);
                cmd.Parameters.AddWithValue("@requestPage", _requestPage);
                cmd.Parameters.AddWithValue("@condition", condition);

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


                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                DataTable dt0 = new DataTable();
                try
                {
                    con.Open();
                    da.Fill(ds);
                    if(ds.Tables.Count > 0) dt0 = ds.Tables[0];
                    if (dt0.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt0.Rows)
                        {
                            User user = new User();
                            user.userName = (string)dr[nameof(user.userName)];
                            user.userFullName = (string)dr[nameof(user.userFullName)];
                            user.userTitleCode = (string)dr[nameof(user.userTitleCode)];
                            user.userDeptCode = (string)dr[nameof(user.userDeptCode)];
                            user.userEnabled = (bool)dr[nameof(user.userEnabled)];
                            user.userFailedLoginCount = (int)dr[nameof(user.userFailedLoginCount)];
                            user.titleDesc = (string)dr[nameof(user.titleDesc)];
                            user.deptDesc = (string)dr[nameof(user.deptDesc)];
                            user.userEmail = (string)(dr[nameof(user.userEmail)].ToString() ?? String.Empty);
                            _obj.users.Add(user);
                        }
                    }
                    
                    _obj.collectionSize = (Int64)prm1.Value;
                    _obj.pageSize = _pageSize;
                    _obj.activePage = (Int64)prm2.Value;
                    _obj.status = "000";
                }
                catch (SqlException ex)
                {
                    throw (ex);
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
    }
}