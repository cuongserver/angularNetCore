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
    public class LeaveManagementController: ControllerBase
    {
        private readonly string ConnectionString;
        private readonly string SecurityKey;
        private readonly long DefautltPageSize;
        private readonly long DefaultRequestPage;
        private IJwtService jwtService;
        private LeaveManagementDataAccessLayer dal;
        public LeaveManagementController(IConfiguration _config, IJwtService _jwtService)
        {
            ConnectionString = _config.GetSection("ConnectionStrings").GetSection(Connection.ConnectionName).Value;
            DefautltPageSize = Convert.ToInt64(_config.GetSection("DbPaging").GetSection("DefaultPageSize").Value);
            DefaultRequestPage = Convert.ToInt64(_config.GetSection("DbPaging").GetSection("DefaultRequestPage").Value);
            SecurityKey = _config.GetSection("SecuritySettings").GetSection("Secret").Value;
            jwtService = _jwtService;
            dal = new LeaveManagementDataAccessLayer(ConnectionString);
        }
        [HttpPost("leavelimitsummary")]
        [Authorize(Roles = "0000")]

        public async Task<IActionResult> LeaveLimitSummary([FromBody]SearchCondition filters)
        {
            long _pageSize = filters.pageSize <= 0 ? DefautltPageSize : filters.pageSize;
            long _requestPage = filters.requestPage <= 0 ? DefaultRequestPage : filters.requestPage;
            var _obj = await dal.GetLeaveLimitSummary(_pageSize, _requestPage, filters, "no");
            string[] OkStatusList = { "000", "-001" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("adjustlimit")]
        [Authorize(Roles = "0000")]
        
        public async Task<IActionResult> AdjustLimit([FromBody]LeaveBalance model)
        {
            //long _pageSize = filters.pageSize <= 0 ? DefautltPageSize : filters.pageSize;
            //long _requestPage = filters.requestPage <= 0 ? DefaultRequestPage : filters.requestPage;
            //var _obj = await dal.GetLeaveLimitSummary(_pageSize, _requestPage, filters, "no");
            var _obj = await dal.AdjustLeaveLimit(model);
            //Debug.WriteLine(model.user.userName);
            //_obj.status = "000";
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("leavelimitsummarydownload")]
        [Authorize(Roles = "0000")]

        public async Task<IActionResult> LeaveLimitSummaryDownLoad([FromBody]SearchCondition filters)
        {
            long _pageSize = filters.pageSize <= 0 ? DefautltPageSize : filters.pageSize;
            long _requestPage = filters.requestPage <= 0 ? DefaultRequestPage : filters.requestPage;
            var _obj = await dal.GetLeaveLimitSummary(_pageSize, _requestPage, filters, "yes");
            string[] OkStatusList = { "000", "-001" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("userleaveapplication")]
        [Authorize(Roles = "0002, 0003")]
        public async Task<IActionResult> UserLeaveApplication([FromBody]User model)
        {

            string _userName = model.userName;
            var _obj = await dal.GetLeaveApplication(_userName);
            string[] OkStatusList = { "000", "-001" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("submitleaveapplication")]
        [Authorize(Roles = "0002, 0003")]
        public async Task<IActionResult> SubmitLeaveApplication([FromBody]LeaveApplication model)
        {


            //var _obj = await dal.GetLeaveApplication(_userName);
            var _obj = await dal.SubmitLeaveApplication(model);
            string[] OkStatusList = { "000", "002" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpGet("pendingleaveapplication")]
        [Authorize(Roles = "0001, 0002")]
        public async Task<IActionResult> PendingLeaveApplication()
        {

            var claims = HttpContext.User.Claims;
            string userName = claims.Single(x => x.Type == ClaimTypes.Name).Value;
            //var _obj = await dal.GetLeaveApplication(_userName);
            var _obj = await dal.PendingLeaveApplication(userName);
            string[] OkStatusList = { "000", "005" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("leaveapprovalconfirm")]
        [Authorize(Roles = "0001, 0002")]
        public async Task<IActionResult> LeaveApprovalConfirm(LeaveApplication model)
        {

            LeaveApplication _model = model;
            var claims = HttpContext.User.Claims;
            _model.approverUserName = claims.Single(x => x.Type == ClaimTypes.Name).Value;

            var _obj = await dal.ApproveLeaveApplication(_model);
            string[] OkStatusList = { "000", "002" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpGet("leavebalance")]
        [Authorize(Roles = "0001, 0002, 0003")]
        public async Task<IActionResult> LeaveBalance(string reportYear)
        {

            var claims = HttpContext.User.Claims;
            string _userName = claims.Single(x => x.Type == ClaimTypes.Name).Value;
            LeaveBalance model = new LeaveBalance
            {
                user = new User
                {
                    userName = _userName
                },
                reportYear = reportYear
            };

            var _obj = await dal.ShowLeaveBalance(model);
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("getsingleapplicationlist")]
        //[AllowAnonymous]
        [Authorize(Roles = "0001, 0002, 0003")]
        public async Task<IActionResult> GetSingleApplicationList([FromBody]SearchCondition filters)
        {
            var claims = HttpContext.User.Claims;
            string _applicantUserName = claims.Single(x => x.Type == ClaimTypes.Name).Value;
            //string _applicantUserName = "user01";
            long _pageSize = filters.pageSize <= 0 ? DefautltPageSize : filters.pageSize;
            long _requestPage = filters.requestPage <= 0 ? DefaultRequestPage : filters.requestPage;
            var _obj = await dal.GetSingleLeaveAppplication(_applicantUserName, _pageSize, _requestPage, filters, "no");
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("singleapplicationlistdownload")]
        //[AllowAnonymous]
        [Authorize(Roles = "0001, 0002, 0003")]
        public async Task<IActionResult> SingleApplicationListDownload([FromBody]SearchCondition filters)
        {
            var claims = HttpContext.User.Claims;
            string _applicantUserName = claims.Single(x => x.Type == ClaimTypes.Name).Value;
            //string _applicantUserName = "user01";
            long _pageSize = 1;
            long _requestPage = 1;
            var _obj = await dal.GetSingleLeaveAppplication(_applicantUserName, _pageSize, _requestPage, filters, "yes");
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("getfullleaveapplicationlist")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> GetFullLeaveApplicationlist([FromBody]SearchCondition filters)
        {
            long _pageSize = filters.pageSize <= 0 ? DefautltPageSize : filters.pageSize;
            long _requestPage = filters.requestPage <= 0 ? DefaultRequestPage : filters.requestPage;
            var _obj = await dal.GetFullLeaveAppplication(_pageSize, _requestPage, filters, "no");
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("fullleaveapplicationlistdownload")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> FullLeaveApplicationListDownload([FromBody]SearchCondition filters)
        {
            long _pageSize = filters.pageSize <= 0 ? DefautltPageSize : filters.pageSize;
            long _requestPage = filters.requestPage <= 0 ? DefaultRequestPage : filters.requestPage;
            var _obj = await dal.GetFullLeaveAppplication(_pageSize, _requestPage, filters, "yes");
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("disableleaveapplication")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> DisableLeaveApplication([FromBody]LeaveApplication model)
        {
            var _obj = await dal.DisableLeaveApplication(model);
            string[] OkStatusList = { "000", "002" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpGet("getdatafordirectleavededuction")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> GetDataForDirectLeaveDeduction()
        {
            var _obj = await dal.PrepareDataForDirectLeaveDeduction();
            string[] OkStatusList = { "000" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }

        [HttpPost("directleavededuction")]
        [Authorize(Roles = "0000")]
        public async Task<IActionResult> DirectLeaveDeduction(LeaveApplication model)
        {
            var _obj = await dal.DirectLeaveDeduction(model);
            string[] OkStatusList = { "000", "001", "002" };
            if (!OkStatusList.Contains(_obj.status)) return BadRequest(_obj);
            return Ok(_obj);
        }
    }
}
