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
namespace AngularNETcore.DataAccessLayer
{

    public class DataAccessLayerBase
    {
        //protected static string ConnectionString = Startup.ConnectionString;
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
    }
}
