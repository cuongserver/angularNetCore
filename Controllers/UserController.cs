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
using AngularNETcore.Common;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.IO;
using System.Threading;

namespace AngularNETcore.Controllers
{
    [Authorize]
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string ConnectionString;
        private readonly string SecurityKey;
        private readonly long DefautltPageSize;
        private readonly long DefaultRequestPage;
        private IJwtService jwtService;
        private UserDataAccessLayer dal;
        public UserController(IConfiguration _config, IJwtService _jwtService)
        {
            ConnectionString = _config.GetSection("ConnectionStrings").GetSection(Connection.ConnectionName).Value;
            DefautltPageSize = Convert.ToInt64(_config.GetSection("DbPaging").GetSection("DefaultPageSize").Value);
            DefaultRequestPage = Convert.ToInt64(_config.GetSection("DbPaging").GetSection("DefaultRequestPage").Value);
            SecurityKey = _config.GetSection("SecuritySettings").GetSection("Secret").Value;
            jwtService = _jwtService;
            dal = new UserDataAccessLayer(ConnectionString);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User model)
        {
            LoginValidationStatus _status = await dal.loginStatus(model);
            if (_status.validateResult == "000")
            {
                _status.securityToken = jwtService.createToken_NameAndRole(_status.user);
            }

            return Ok(_status);
        }

        [HttpPut("changepassword")] 
        [Authorize(Roles = "0000, 0001, 0002, 0003")]
        public async Task<IActionResult> ChangePassword([FromBody] User model)
        {
            if((model.userPassNew != model.userPassConfirm))
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            PasswordChangeStatus _status = await dal.changeUserPassword(model);
            return Ok(_status);
        }

        [HttpGet("userinformation"), Authorize(Roles="0000, 0001, 0002, 0003")]
        public async Task<IActionResult> UserInformation([FromQuery] string userName)
        {
            User model = new User { userName = userName };
            UserInformation _userInfo = await dal.getUserDetails(model);
            return Ok(_userInfo);

        }

        [HttpPost("addnewuser")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> AddNewUser([FromBody] User model)
        {
            if ((model.userPass != model.userPassConfirm))
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            UserInformation _obj = await dal.addNewUser(model);
            string[] OkStatusList = { "000", "2627" };
            if (OkStatusList.Contains(_obj.status))
            {
                return Ok(_obj);
            }
            else
            {
                return NotFound(_obj);
            }
        }

        [HttpPost("edituserinfo")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> EditUserInfo([FromBody] User model)
        {

            UserInformation _obj = await dal.EditUserInfo(model);
            string[] OkStatusList = { "000", "002" };
            if (OkStatusList.Contains(_obj.status))
            {
                return Ok(_obj);
            }
            else
            {
                return NotFound(_obj);
            }
        }

        [HttpPost("resetpassword")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> ResetPassword([FromBody] User model)
        {
            if ((model.userPass != model.userPassConfirm))
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
            UserInformation _obj = await dal.ResetUserPassword(model);
            string[] OkStatusList = { "000", "002" };
            if (OkStatusList.Contains(_obj.status))
            {
                return Ok(_obj);
            }
            else
            {
                return NotFound(_obj);
            }
        }





        [HttpGet("titleanddeptlist")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> TitleAndDeptList()
        {
            TitleAndDept _obj= await dal.getTitleAndDeptCode();
            return Ok(_obj);
        }


        [HttpPost("listalluser")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> ListAllUser([FromBody]UserSearchCondition conditionSet)
        {            
            long _pageSize = conditionSet.pageSize <= 0 ? DefautltPageSize : conditionSet.pageSize;
            long _requestPage = conditionSet.requestPage <= 0 ? DefaultRequestPage : conditionSet.requestPage;
            UserCollection _obj = await dal.listAllUserWithPaging(_pageSize, _requestPage, conditionSet);
            if(_obj.status != "000")
            {
                return NotFound(_obj);
            }
            return Ok(_obj);
        }

        [HttpPost("downloaduserlist")]
        [AllowAnonymous]
        public async Task DownloadUserList([FromForm] string jwt)
        {
            Debug.WriteLine(GetClaim(jwt, "exp"));


            int bytesToRead = 4*1024;
            int bps = 1024 * 1024 * 50;
            var currentDirectory = System.IO.Directory.GetCurrentDirectory();
            currentDirectory = currentDirectory + @"\mock";
            var file = Path.Combine(currentDirectory, "mock.zip");
            FileStream fs = new FileStream(file, FileMode.Open, FileAccess.Read);
            Response.Headers.Add("Content-Disposition", "attachment; filename=mock.zip");
            Response.Headers.Add("Content-Length", fs.Length.ToString());
            Response.ContentType = "application/octet-stream";
            byte[] buffer;
            long remainingContent = fs.Length;
            int length;
            int transferredBytes = 0;
            DateTime start = DateTime.Now;
            do
            {
                if (transferredBytes == 0) start = DateTime.Now;
                buffer = new Byte[bytesToRead];
                length = fs.Read(buffer, 0, bytesToRead);
                transferredBytes += length;
                remainingContent -= length;
                await Response.Body.WriteAsync(buffer, 0, length);
                await Response.Body.FlushAsync();
                if (transferredBytes >= bps)
                {
                    Thread.Sleep(Math.Max(start.AddMilliseconds(1000).Millisecond - DateTime.Now.Millisecond, 0));
                    transferredBytes = 0;
                }
            } while (remainingContent > 0);
            fs.Close();
        }

        private string GetClaim(string token, string claimType)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.ReadToken(token) as JwtSecurityToken;

            foreach(var claim in securityToken.Claims)
            {
                Debug.WriteLine(claim.Type + ": " + claim.Value.ToString());
            }
            var stringClaimValue = securityToken.Claims.First(claim => claim.Type == claimType).Value;
            return stringClaimValue;
        }
    }

    public static class Connection
    {
        //public static string ConnectionName = "Db2";
        public static string ConnectionName = "Db1";
    }

    public static class AuthourizationLevel
    {
        public static string Admin = "0000";
        public static string User = "0003";
    }

}
    

