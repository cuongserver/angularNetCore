using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using AngularNETcore.Models;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Diagnostics;
namespace AngularNETcore.DataAccessLayer
{
    public class UserDataAccessLayer: DataAccessLayerBase
    {

        public UserDataAccessLayer(string _connString)
        {
            _connectionString = _connString;
        }
        public async Task<LoginValidationStatus> loginStatus( User model)
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
                    ParameterName = "@status", SqlDbType = SqlDbType.NVarChar, Size = 50, Direction = ParameterDirection.Output
                };
                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@message", SqlDbType = SqlDbType.NVarChar, Size = 50,Direction = ParameterDirection.Output
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

        public TitleValidationStatus getUserTitle ( User model)
        {
            TitleValidationStatus _status = new TitleValidationStatus();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetUserTitle";
                cmd.Parameters.AddWithValue("@userName", model.userName);

                SqlParameter prm1 = new SqlParameter
                {
                    ParameterName = "@status", SqlDbType = SqlDbType.NVarChar, Size = 50, Direction = ParameterDirection.Output
                };
                SqlParameter prm2 = new SqlParameter
                {
                    ParameterName = "@message", SqlDbType = SqlDbType.NVarChar, Size = 50, Direction = ParameterDirection.Output
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
    }
}
