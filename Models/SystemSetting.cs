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
        public long pageSize { get; set; }
        public long collectionSize { get; set; }
        public long activePage { get; set; }
    }

    public class Filter
    {
        public string phraseOperator { get; set; }
        public string field { get; set; }
        public string comparisonType { get; set; }
        public string filterValue { get; set; }
        public bool booleanField { get; set; }
        public bool numericField { get; set; }
        public bool dateField { get; set; }
    }

    public class SearchCondition
    {
        public long pageSize { get; set; }
        public long requestPage { get; set; }
        public List<Filter> filters { get; set; }
    }
}
