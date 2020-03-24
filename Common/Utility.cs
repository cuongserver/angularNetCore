using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AngularNETcore.Models;
namespace AngularNETcore.Common
{
    public class Utility
    {
        static string ReplaceSensitiveString(string str)
        {
            string x = str;
            x = x.Replace(@"'", " ");
            x = x.Replace(@";", " ");
            x = x.Replace(@"--", " ");
            x = x.Replace(@"/*", " ");
            x = x.Replace(@"*/", " ");
            x = x.Replace(@"xp_", " ");
            return x;
        }
        static string GetConditionString(UserFilter condition)
        {
            List<string> cleanProp = new List<string>();
            cleanProp.Add(ReplaceSensitiveString(condition.phraseOperator));
            cleanProp.Add(ReplaceSensitiveString(condition.field));
            cleanProp.Add(ReplaceSensitiveString(condition.comparisonType));
            cleanProp.Add(ReplaceSensitiveString(condition.filterValue ?? string.Empty));
            StringBuilder str = new StringBuilder();

            str.Append(cleanProp[0]);
            str.Append(" ");

            str.Append(cleanProp[1]);
            str.Append(" ");

            switch (cleanProp[2])
            {
                case "equal":
                    str.Append("=");
                    str.Append(" ");
                    if (condition.booleanField) str.Append(cleanProp[3] == "true" ? "1" : "0");
                    if(!condition.booleanField) str.Append("'" + cleanProp[3] + "'");
                    break;
                case "notequal":
                    str.Append("<>");
                    str.Append(" ");
                    if (condition.booleanField) str.Append(cleanProp[3] == "true" ? "1" : "0");
                    if (!condition.booleanField) str.Append("'" + cleanProp[3] + "'");
                    break;
                case "contain":
                    str.Append("like");
                    str.Append(" ");
                    str.Append("'%" + cleanProp[3] + "%'");
                    break;
                case "notcontain":
                    str.Append("not like");
                    str.Append(" ");
                    str.Append("'%" + cleanProp[3] + "%'");
                    break;
                default:
                    throw new Exception();
            }
            return str.ToString();




        }

        public static string CompleteConditionString(UserSearchCondition conditions)
        {
            List<UserFilter> list = conditions.filters;
            if (list.Count == 0) return String.Empty;
            for(int i = list.Count - 1; i < -1; i-=1)
            {
                if (String.IsNullOrEmpty(list[i].field))
                {
                    list.RemoveAt(i);
                }
            }
            StringBuilder str = new StringBuilder();
            foreach(var x in list)
            {
                str.Append(" ");
                str.Append(GetConditionString(x));
            }
            string y = str.ToString().Trim();
            return y[3..].Trim();
        }

        static string GetConditionString(Filter condition)
        {
            List<string> cleanProp = new List<string>();
            cleanProp.Add(ReplaceSensitiveString(condition.phraseOperator));
            cleanProp.Add(ReplaceSensitiveString(condition.field));
            cleanProp.Add(ReplaceSensitiveString(condition.comparisonType));
            cleanProp.Add(ReplaceSensitiveString(condition.filterValue ?? string.Empty));
            StringBuilder str = new StringBuilder();

            str.Append(cleanProp[0]);
            str.Append(" ");

            str.Append(cleanProp[1]);
            str.Append(" ");

            switch (cleanProp[2])
            {
                case "equal":
                    str.Append("=");
                    str.Append(" ");
                    if (condition.booleanField) str.Append(cleanProp[3] == "true" ? "1" : "0");
                    if (!condition.booleanField) str.Append("'" + cleanProp[3] + "'");
                    break;
                case "notequal":
                    str.Append("<>");
                    str.Append(" ");
                    if (condition.booleanField) str.Append(cleanProp[3] == "true" ? "1" : "0");
                    if (!condition.booleanField) str.Append("'" + cleanProp[3] + "'");
                    break;
                case "contain":
                    str.Append("like");
                    str.Append(" ");
                    str.Append("'%" + cleanProp[3] + "%'");
                    break;
                case "notcontain":
                    str.Append("not like");
                    str.Append(" ");
                    str.Append("'%" + cleanProp[3] + "%'");
                    break;
                default:
                    throw new Exception();
            }
            return str.ToString();




        }

        public static string CompleteConditionString(SearchCondition conditions)
        {
            List<Filter> list = conditions.filters;
            if (list.Count == 0) return String.Empty;
            for (int i = list.Count - 1; i < -1; i -= 1)
            {
                if (String.IsNullOrEmpty(list[i].field))
                {
                    list.RemoveAt(i);
                }
            }
            StringBuilder str = new StringBuilder();
            foreach (var x in list)
            {
                str.Append(" ");
                str.Append(GetConditionString(x));
            }
            string y = str.ToString().Trim();
            return y[3..].Trim();
        }
    }
}
