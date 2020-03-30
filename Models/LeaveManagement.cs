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
        public string reportYear { get; set; }
        public string status { get; set; }
        public string message { get; set; }
    }

    public class LeaveType
    {
        public string leaveCode { get; set; }
        public Nullable<int> limit { get; set; }
        public Nullable<int> used { get; set; }
        public Nullable<int> pending { get; set; }
        public Nullable<int> balance { get; set; }
    }

    
    public class LeaveBalanceSummary
    {
        public List<LeaveBalance> summary { get; set; }
        public List<string> leaveCodes { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public long pageSize { get; set; }
        public long collectionSize { get; set; }
        public long activePage { get; set; }
    }

    public class LeaveApplication
    {
        public string trackingRef { get; set; }
        public string createdAt { get; set; }
        public string applicantUserName { get; set; }
        public string applicantDeptCode { get; set; }
        public string applicantTitleCode { get; set; }
        public string fromTime { get; set; }
        public string toTime { get; set; }
        public int timeConsumed { get; set; }
        public string applicantDescription { get; set; }
        public string leaveCode { get; set; }
        public bool isValid { get; set; }
        public string progress { get; set; }
        public string approverUserName { get; set; }
        public string approverCommand { get; set; }
        public string approverDescription { get; set; }
        public bool createdByAdmin { get; set; }
        public bool finalStatus { get; set; }

        public string applicantUserFullName { get; set; }
        public string approverUserFullName { get; set; }
    }

    public class LeaveApplicationResponse
    {
        public LeaveApplication application { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public List<string> leaveCodes { get; set; }
        public List<SysParam> sysParams { get; set; }
        public List<Holiday> holidays { get; set; }
    }
    public class LeaveApplications
    {
        public List<LeaveApplication> apps { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public long pageSize { get; set; }
        public long collectionSize { get; set; }
        public long activePage { get; set; }

    }

    public class SysParam
    {
        public string paramKey { get; set; }
        public string paramValue { get; set; }
    }

    public class DataForDirectLeaveDeduction: LeaveApplicationResponse
    {
        public List<User> users { get; set; }
    }

}
