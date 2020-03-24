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

        //public async Task<Holidays> ListAllHoliday(long pageSize, long requestPage, SearchCondition filters, string getAllOrNot)
        public async Task<Holidays> ListAllHoliday(long pageSize, long requestPage, string getAllOrNot)
        {
            long _pageSize = pageSize;
            long _requestPage = requestPage;
            string _getAllOrNot = getAllOrNot;
            Holidays _obj = new Holidays()
            {
                holidays = new List<Holiday>()
            };

            //string _condition = Utility.CompleteConditionString(filters);
            //string condition = String.IsNullOrEmpty(_condition) ? "1 = 1" : "(" + _condition + ")";
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "GetHolidayWithPaging";
                cmd.Parameters.AddWithValue("@pageSize", _pageSize);
                cmd.Parameters.AddWithValue("@requestPage", _requestPage);
                cmd.Parameters.AddWithValue("@condition", "xxx");
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


                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataSet ds = new DataSet();
                DataTable dt0 = new DataTable();
                try
                {
                    con.Open();
                    da.Fill(ds);
                    if (ds.Tables.Count > 0) dt0 = ds.Tables[0];
                    if (dt0.Rows.Count > 0)
                    {
                        foreach (DataRow dr in dt0.Rows)
                        {
                            Holiday holiday = new Holiday();
                            holiday.holidayDate = (string)dr[nameof(holiday.holidayDate)];
                            holiday.description = (string)dr[nameof(holiday.description)];
                            holiday.isEnabled = (bool)dr[nameof(holiday.isEnabled)];
                            _obj.holidays.Add(holiday);
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

        public async Task<Holidays> RemoveHoliday(Holiday model)
        {
            Holidays _obj = new Holidays();
            using (SqlConnection con = SqlCon())
            {
                SqlCommand cmd = SqlCmd(con);
                cmd.CommandText = "RemoveHoliday";
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
