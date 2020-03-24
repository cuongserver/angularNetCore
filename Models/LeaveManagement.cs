using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngularNETcore.Models
{
    public class LeaveBalance
    {
        public User user { get; set; }
        public List<LeaveType> leaveTypes { get; set; }
    }

    public class LeaveType
    {
        public string leaveCode { get; set; }
        public Nullable<int> limit { get; set; }
        public Nullable<int> balance { get; set; }
    }

    public class LeaveBalanceSummary
    {
        public List<LeaveBalance> summary { get; set; }
        public List<string> leaveCodes { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }
}
