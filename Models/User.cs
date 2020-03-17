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
        public string userEmail { get; set; }

        //dung cho doi password
        public string userPassOld { get; set; }
        public string userPassNew { get; set; }
        public string userPassConfirm { get; set; }
    }

    public class TitleAndDept
    {
        public List<string> titleCodeList { get; set; }
        public List<string> deptCodeList { get; set; }
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

    public class UserCollection
    {
        public List<User> users { get; set; }
        public long pageSize { get; set; }
        public long collectionSize { get; set; }
        public long activePage { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }
    public class TitleValidationStatus
    {
        public string validateResult { get; set; }
        public string validateMessage { get; set; }
    }

    public class PasswordChangeStatus
    {
        public User user { get; set; }
        public string securityToken { get; set; }
        public string validateResult { get; set; }
        public string validateMessage { get; set; }
    }

}
