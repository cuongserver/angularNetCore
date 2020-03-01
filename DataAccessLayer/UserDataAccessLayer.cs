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
        public LoginValidationStatus loginStatus( User model)
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

    }
}
