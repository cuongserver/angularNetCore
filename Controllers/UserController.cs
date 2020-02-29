using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AngularNETcore.Common;
using static AngularNETcore.DataAccessLayer.UserDataAccessLayer;
using AngularNETcore.Models;
using System.Net.Http;
using AngularNETcore;
using System.Diagnostics;
namespace AngularNETcore.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        [HttpPost]
        public LoginValidationStatus Login(User model)
        {
            LoginValidationStatus _status = loginStatus(model);
            return _status;
        }

    }
}
