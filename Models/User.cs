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
        public string userPass { get; set; }
        public string userFullNamexx {get; set;}
    }

    public class LoginValidationStatus
    {
        public string validateResult { get; set; }
        public string validateMessage { get; set; }
    }
}
