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
    public class SystemSettingController : ControllerBase
    {
        private readonly string ConnectionString;
        private readonly string SecurityKey;
        private readonly long DefautltPageSize;
        private readonly long DefaultRequestPage;
        private IJwtService jwtService;
        private SystemSettingDataAccessLayer dal;
        public SystemSettingController(IConfiguration _config, IJwtService _jwtService)
        {
            ConnectionString = _config.GetSection("ConnectionStrings").GetSection(Connection.ConnectionName).Value;
            DefautltPageSize = Convert.ToInt64(_config.GetSection("DbPaging").GetSection("DefaultPageSize").Value);
            DefaultRequestPage = Convert.ToInt64(_config.GetSection("DbPaging").GetSection("DefaultRequestPage").Value);
            SecurityKey = _config.GetSection("SecuritySettings").GetSection("Secret").Value;
            jwtService = _jwtService;
            dal = new SystemSettingDataAccessLayer(ConnectionString);
        }

        [HttpPost("addnewholiday")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> AddNewHoliday([FromBody] Holiday model)
        {
            Holidays _obj = await dal.AddNewHoliday(model);
            string[] OkStatusList = { "000", "004" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpGet("listallholiday")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> ListAllHoliday()
        {
            //Holidays _obj = await dal.AddNewHoliday(model);

            long _pageSize = 100;
            long _requestPage = 1;
            var _obj = await dal.ListAllHoliday(_pageSize, _requestPage, "yes");
            string[] OkStatusList = { "000", "004" };

            //var _obj = new
            //{
            //    status = "000",
            //    message = "",
            //    holidays = new[]
            //    {
            //        new {holidayDate = "2020-01-01", description = "tet duong lich"},
            //        new {holidayDate = "2020-01-22", description = "tet am lich"},
            //        new {holidayDate = "2020-01-23", description = "tet am lich"},
            //        new {holidayDate = "2020-01-24", description = "tet am lich"},
            //        new {holidayDate = "2020-01-25", description = "tet am lich"},
            //        new {holidayDate = "2020-01-26", description = "tet am lich"},
            //        new {holidayDate = "2020-01-27", description = "tet am lich"},
            //        new {holidayDate = "2020-01-28", description = "tet am lich"},
            //        new {holidayDate = "2020-01-29", description = "tet am lich"}
            //    }.ToList()
            //};

            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("removeholiday")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> RemoveHoliday([FromBody] Holiday model)
        {
            Holidays _obj = await dal.RemoveHoliday(model);
            string[] OkStatusList = { "000", "002" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }
    }
}