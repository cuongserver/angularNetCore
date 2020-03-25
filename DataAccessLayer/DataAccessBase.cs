using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using AngularNETcore.Models;
using Microsoft.Extensions.Configuration;
using System.Data;
using AngularNETcore;
using System.Diagnostics;
using System.IO;
namespace AngularNETcore.DataAccessLayer
{

    public class DataAccessLayerBase
    {
        protected string _connectionString;
        protected SqlConnection SqlCon()
        {
            return new SqlConnection(_connectionString);
        }
        protected SqlCommand SqlCmd(SqlConnection connnection)
        {
            return new SqlCommand
            {
                Connection = connnection,
                CommandType = CommandType.StoredProcedure
            };
        }
        protected DataTable userInfo()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("userName", typeof(string));
            dt.Columns.Add("userPass", typeof(string));
            dt.Columns.Add("userFullName", typeof(string));
            dt.Columns.Add("userDeptCode", typeof(string));
            dt.Columns.Add("userTitleCode", typeof(string));
            dt.Columns.Add("userEmail", typeof(string));
            dt.Columns.Add("userEnabled", typeof(bool));
            dt.Columns.Add("userFailedLoginCount", typeof(Int32));

            dt.Columns["userName"].SetOrdinal(0);
            dt.Columns["userPass"].SetOrdinal(1);
            dt.Columns["userFullName"].SetOrdinal(2);
            dt.Columns["userDeptCode"].SetOrdinal(3);
            dt.Columns["userTitleCode"].SetOrdinal(4);
            dt.Columns["userEmail"].SetOrdinal(5);
            dt.Columns["userEnabled"].SetOrdinal(6);
            dt.Columns["userFailedLoginCount"].SetOrdinal(7);

            dt.Columns["userEnabled"].DefaultValue = true;
            dt.Columns["userFailedLoginCount"].DefaultValue = 0;

            return dt;
        }

        protected DataTable leaveLimit()
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("userName", typeof(string));
            dt.Columns.Add("leaveCode", typeof(string));
            dt.Columns.Add("limit", typeof(int));

            dt.Columns["userName"].SetOrdinal(0);
            dt.Columns["leaveCode"].SetOrdinal(1);
            dt.Columns["limit"].SetOrdinal(2);
            dt.Columns["limit"].AllowDBNull = true;

            return dt;
        }


    }
}
