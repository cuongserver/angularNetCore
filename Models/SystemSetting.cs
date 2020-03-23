using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularNETcore.Models
{
    public class Holiday
    {
        public string holidayDate { get; set; }
        public string description { get; set; }
        public bool isEnabled { get; set; }
    }
    public class Holidays
    {
        public List<Holiday> holidays { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }
}
