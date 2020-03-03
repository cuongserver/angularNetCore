using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AngularNETcore.DataAccessLayer;
using AngularNETcore.Models;
using System.Net.Http;
using AngularNETcore;
using System.Diagnostics;
using Microsoft.Extensions.Configuration;
namespace AngularNETcore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string ConnectionString;

        public UserController(IConfiguration _config)
        {
            ConnectionString = _config.GetSection("ConnectionStrings").GetSection("Db2").Value;
        }

        [HttpPost]
        public LoginValidationStatus Login([FromBody] User model)
        {
            UserDataAccessLayer dal = new UserDataAccessLayer(ConnectionString);
            LoginValidationStatus _status = dal.loginStatus(model);
            return _status;
        }

    }
}
