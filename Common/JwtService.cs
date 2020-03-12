using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using AngularNETcore.Models;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using System.Diagnostics;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using AngularNETcore.DataAccessLayer;
using AngularNETcore.Controllers;

namespace AngularNETcore.Common
{
    public interface IJwtService
    {
        void GetSecret();
        string createToken_NameAndRole(User _model);
    }

    public class JwtService: IJwtService
    {
        private string SecurityKey;
        private string JwtIssuer;
        private string JwtAudience;
        public IConfiguration Configuration { get; }
        public JwtService(IConfiguration _config)
        {
            Configuration = _config;
            GetSecret();
        }
        public void GetSecret()
        {
            SecurityKey = Configuration.GetSection("SecuritySettings").GetSection("Secret").Value;
            JwtIssuer = Configuration.GetSection("JwtIssuerOptions").GetSection("Issuer").Value;
            JwtAudience = Configuration.GetSection("JwtIssuerOptions").GetSection("Audience").Value;
        }
        public string createToken_NameAndRole(User _model)
        {
            User model = _model;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecurityKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Issuer = JwtIssuer,
                Audience = JwtAudience,
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, model.userName),
                    new Claim(ClaimTypes.GivenName, model.userFullName),
                    new Claim(ClaimTypes.Role, model.userTitleCode)
                }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                                            SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    //middle ware phải khai báo method Invoke, constructor có RequestDelegate


    public static class StartupExtension
    {
        //public static IApplicationBuilder UseJwtValidationAtDatabase(this IApplicationBuilder app)
        //{
        //    return app.UseMiddleware<JwtMidddleware>();
        //}

        public static void UseJwtValidationAtDatabase(this IApplicationBuilder app, IConfiguration config)
        {
            app.Use(async delegate(HttpContext context, Func<Task> next)
            {
                if (context.Request.Headers.ContainsKey("Authorization"))
                {
                    var claims = context.User.Claims;
                    string name = claims.Single(x => x.Type == ClaimTypes.Name).Value;
                    string role = claims.Single(x => x.Type == ClaimTypes.Role).Value;
                    string ConnectionString = config.GetSection("ConnectionStrings").GetSection(Connection.ConnectionName).Value;
                    UserDataAccessLayer dal = new UserDataAccessLayer(ConnectionString);
                    User _model = new User { userName = name };
                    TitleValidationStatus _titleValidate = dal.getUserTitle(_model);
                    if(role != _titleValidate.validateMessage)
                    {
                        context.Response.ContentType = "text/plain";
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        await context.Response.WriteAsync("Role not matched");
                        return;
                    }

                }
                await next.Invoke();
            });
        }

        public static void ConfigureJwtValidationProcess(this IServiceCollection _services, IConfiguration _config)
        {
            var key = Encoding.ASCII.GetBytes(_config.GetSection("SecuritySettings").GetSection("Secret").Value);
            _services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidIssuer = _config.GetSection("JwtIssuerOptions").GetSection("Issuer").Value,
                    ValidAudience = _config.GetSection("JwtIssuerOptions").GetSection("Audience").Value,
                    ClockSkew = TimeSpan.Zero
                };
            });
        }

    }

    //public class JwtMidddleware
    //{
    //    private readonly RequestDelegate _next;
    //    public JwtMidddleware(RequestDelegate next)
    //    {
    //        _next = next;
    //    }
    //    public async Task Invoke(HttpContext context)
    //    {
    //        if (context.Request.Headers.ContainsKey("Authorization"))
    //        {
    //            var claims = context.User.Claims;
    //            string role = claims.Single(x => x.Type == ClaimTypes.Role).Value;
    //            Debug.WriteLine(role);
    //        }
    //        await _next.Invoke(context);
    //    }
    //}
}
