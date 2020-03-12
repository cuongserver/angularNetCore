﻿using System;
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
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AngularNETcore.Common;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
namespace AngularNETcore.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string ConnectionString;
        private readonly string SecurityKey;
        private IJwtService jwtService;
        public UserController(IConfiguration _config, IJwtService _jwtService)
        {
            ConnectionString = _config.GetSection("ConnectionStrings").GetSection(Connection.ConnectionName).Value;
            SecurityKey = _config.GetSection("SecuritySettings").GetSection("Secret").Value;
            jwtService = _jwtService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User model)
        {
            UserDataAccessLayer dal = new UserDataAccessLayer(ConnectionString);
            LoginValidationStatus _status = await dal.loginStatus(model);
            if (_status.validateResult == "000")
            {
                _status.securityToken = jwtService.createToken_NameAndRole(_status.user);
            }

            return Ok(_status);
        }

        [HttpGet("userinformation"), Authorize(Roles="0000")]
        public async Task<IActionResult> UserInformation([FromQuery] string userName)
        {
            User model = new User();
            model.userName = userName;
            UserDataAccessLayer dal = new UserDataAccessLayer(ConnectionString);
            UserInformation _userInfo = await dal.getUserDetails(model);
            return Ok(_userInfo);

        }

    }
    public static class Connection
    {
        public static string ConnectionName = "Db2";
        //public static string ConnectionName = "Db1";
    }

    public static class AuthourizationLevel
    {
        public static string Admin = "0000";
        public static string User = "0003";
    }
}
