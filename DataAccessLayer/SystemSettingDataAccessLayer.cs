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
    public class SystemSettingDataAccessLayer: DataAccessLayerBase
    {
        public SystemSettingDataAccessLayer(string _connString)
        {
            _connectionString = _connString;
        }
        public async Task<Holidays> AddNewHoliday(Holiday model)
        {
            Holidays _obj = new Holidays();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "AddNewHoliday";
                cmd.Parameters.AddWithValue("@date", model.holidayDate);
                cmd.Parameters.AddWithValue("@description", model.description ?? string.Empty);

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
                    _obj.status = prm1.Value.ToString();
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
    }
}
