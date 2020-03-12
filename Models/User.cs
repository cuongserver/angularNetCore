using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
namespace AngularNETcore.Models
{
    public class User
    {
        public string userName { get; set; }
        public string userFullName { get; set; }
        public string userPass { get; set; }
        public string userDeptCode { get; set; }
        public string userTitleCode { get; set; }
        public bool userEnabled { get; set; }
        public int userFailedLoginCount { get; set; }
        public string titleDesc { get; set; }
        public string deptDesc { get; set; }
    }

    public class LoginValidationStatus
    {
        public User user { get; set; }
        public string securityToken { get; set; }
        public string validateResult { get; set; }
        public string validateMessage { get; set; }
    }

    public class UserInformation
    {
        public User user { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }

    public class TitleValidationStatus
    {
        public string validateResult { get; set; }
        public string validateMessage { get; set; }
    }

    public static class UserTitle
    {
        public static string Admin = "0000";
    }
}
