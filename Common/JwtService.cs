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
        public IConfiguration Configuration { get; }
        public JwtService(IConfiguration _config)
        {
            Configuration = _config;
            GetSecret();
        }
        public void GetSecret()
        {
            SecurityKey = Configuration.GetSection("SecuritySettings").GetSection("Secret").Value;
        }
        public string createToken_NameAndRole(User _model)
        {
            User model = _model;
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(SecurityKey);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
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
}
