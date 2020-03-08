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
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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

        public UserController(IConfiguration _config)
        {
            ConnectionString = _config.GetSection("ConnectionStrings").GetSection(Connection.ConnectionName).Value;
            SecurityKey = _config.GetSection("SecuritySettings").GetSection("Secret").Value;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] User model)
        {
            User user = new User();
            UserDataAccessLayer dal = new UserDataAccessLayer(ConnectionString);
            LoginValidationStatus _status = dal.loginStatus(model);
            if (_status.validateResult == "000")
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(SecurityKey);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(ClaimTypes.Name, _status.user.userName),
                        new Claim(ClaimTypes.GivenName, _status.user.userFullName),
                        new Claim(ClaimTypes.Role, _status.user.userTitleCode)
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), 
                                                SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                _status.securityToken = tokenHandler.WriteToken(token);
            }

            return Ok(_status);
        }

        //[HttpGet]
        ////[Authorize]
        //public void Login()
        //{

        //}

    }
    public static class Connection
    {
        //public static string ConnectionName = "Db2";
        public static string ConnectionName = "Db1";
    }
}
