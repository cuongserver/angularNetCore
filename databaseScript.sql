Use LMSystem
GO
/****** Object:  UserDefinedTableType [dbo].[leaveLimitTableType]    Script Date: 3/30/2020 1:41:05 PM ******/
CREATE TYPE [dbo].[leaveLimitTableType] AS TABLE(
	[userName] [nvarchar](50) NULL,
	[leaveCode] [nvarchar](50) NULL,
	[limit] [int] NULL
)
GO
/****** Object:  UserDefinedTableType [dbo].[userTableType]    Script Date: 3/30/2020 1:41:05 PM ******/
CREATE TYPE [dbo].[userTableType] AS TABLE(
	[userName] [nvarchar](50) NOT NULL,
	[userPass] [nvarchar](64) NULL,
	[userFullname] [nvarchar](50) NULL,
	[userDeptCode] [nvarchar](50) NULL,
	[userTitleCode] [nvarchar](50) NULL,
	[userEmail] [nvarchar](50) NULL,
	[userEnabled] [bit] NULL,
	[userFailedLoginCount] [int] NULL
)
GO
/****** Object:  UserDefinedFunction [dbo].[CalculateWorkHour]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[CalculateWorkHour]
(
	@timeStart nvarchar(max),
	@timeEnd nvarchar(max)
)
RETURNS BIGINT
AS
BEGIN
--start
Declare @checkIn nvarchar(max), @checkOut nvarchar(max), @breakStart nvarchar(max), @breakEnd nvarchar(max);

SET @checkIn = (SELECT paramValue from SysParam WHERE paramKey = 'StartTime');
SET @checkOut = (SELECT paramValue from SysParam WHERE paramKey = 'EndTime');
SET @breakStart = (SELECT paramValue from SysParam WHERE paramKey = 'BreakStart');
SET @breakEnd = (SELECT paramValue from SysParam WHERE paramKey = 'BreakEnd');

declare @dateStartString nvarchar(max), @dateEndString nvarchar(max);
declare @clockStartString nvarchar(max), @clockEndString nvarchar(max);
SET @dateStartString = LEFT(@timeStart,10);
SET @dateEndString = LEFT(@timeEnd,10);
SET @clockStartString = RIGHT(@timeStart,5);
SET @clockEndString = RIGHT(@timeEnd,5);

declare @dateStart DATE, @dateEnd DATE;
select @dateStart = cast(@dateStartString as date), @dateEnd = cast(@dateEndString as date)

IF @dateStart > @dateEnd RETURN 0;



--
declare @checkInAbs BIGINT = cast(left(@checkIn,2) as int)*60 + cast(right(@checkIn,2) as int)
declare @breakStartAbs BIGINT = cast(left(@breakStart,2) as int)*60 + cast(right(@breakStart,2) as int)
declare @breakEndAbs BIGINT = cast(left(@breakEnd,2) as int)*60 + cast(right(@breakEnd,2) as int)
declare @checkOutAbs BIGINT = cast(left(@checkOut,2) as int)*60 + cast(right(@checkOut,2) as int)
declare @clockStartAbs BIGINT = cast(left(@clockStartString,2) as int)*60 + cast(right(@clockStartString,2) as int)
declare @clockEndAbs BIGINT = cast(left(@clockEndString,2) as int)*60 + cast(right(@clockEndString,2) as int)

declare @normalWorkingLength BIGINT = @checkOutAbs - @breakEndAbs + @breakStartAbs - @checkInAbs

IF @clockStartAbs > @checkOutAbs SET @clockStartAbs = @checkOutAbs;
IF @clockEndAbs > @checkOutAbs SET @clockEndAbs = @checkOutAbs;
IF @clockStartAbs < @checkInAbs SET @clockStartAbs = @checkInAbs;
IF @clockEndAbs < @checkInAbs SET @clockEndAbs = @checkInAbs;


IF @clockStartAbs > @breakStartAbs AND @clockStartAbs < @breakEndAbs SET @clockStartAbs = @breakEndAbs;
IF @clockEndAbs > @breakStartAbs AND @clockEndAbs < @breakEndAbs SET @clockEndAbs = @breakStartAbs;

if @dateStart = @dateEnd
	BEGIN
		IF EXISTS (SELECT * FROM SysParam t2 WHERE t2.paramValue = DATENAME(weekday,@dateStart)) RETURN 0;
		IF EXISTS (SELECT * FROM holiday t2 WHERE t2.holidayDate = CONVERT(nvarchar(20),@dateStart,23)) RETURN 0;
		IF @clockStartAbs >= @clockEndAbs RETURN 0
		IF @clockStartAbs <= @breakStartAbs AND @clockEndAbs <= @breakStartAbs RETURN ceiling(cast(@clockEndAbs - @clockStartAbs as decimal)/cast(60 as decimal));
		IF @clockStartAbs >= @breakEndAbs AND @clockEndAbs >= @breakEndAbs RETURN ceiling(cast(@clockEndAbs - @clockStartAbs as decimal)/cast(60 as decimal));
		IF @clockStartAbs <= @breakStartAbs AND @clockEndAbs >= @breakEndAbs 
			RETURN ceiling(cast(@clockEndAbs - @breakEndAbs + @breakStartAbs - @clockStartAbs as decimal)/cast(60 as decimal));
	END
--
declare @dateStartPlus1 DATE = dateadd(day,1,@dateStart), @dateEndMinus1 DATE = dateadd(day,-1,@dateEnd);
DECLARE @publicHoliday TABLE
(
  holiday nvarchar(20),
  wDay nvarchar(10)
);
INSERT INTO @publicHoliday (holiday, wDay) SELECT t1.holidayDate AS holiday, DATENAME(weekday,t1.holidayDate) AS wDay
	FROM holiday t1
	WHERE t1.holidayDate > @dateStartString AND t1.holidayDate < @dateEndString
	AND len(t1.holidayDate) = 10
	AND NOT EXISTS (SELECT * FROM SysParam t2 WHERE t2.paramValue = DATENAME(weekday,t1.holidayDate));

DECLARE @normalWorkingDay bigint = 0;
--
WHILE @dateStartPlus1 <= @dateEndMinus1
	BEGIN
		IF NOT EXISTS (SELECT * FROM SysParam t2 WHERE t2.paramValue = DATENAME(weekday,@dateStartPlus1))
			BEGIN
				IF NOT EXISTS (SELECT * FROM @publicHoliday t2 WHERE t2.holiday = CONVERT(nvarchar(20),@dateStartPlus1,23))
					BEGIN
						SET @normalWorkingDay = @normalWorkingDay + 1					
					END
			END
		SET @dateStartPlus1 = dateadd(day,1,@dateStartPlus1)
	END;
--

--end
DECLARE @startDayWorkingLength BIGINT, @endDayWorkingLength BIGINT

IF @clockStartAbs <= @breakStartAbs SET @startDayWorkingLength = @checkOutAbs - @breakEndAbs + @breakStartAbs - @clockStartAbs;
IF @clockStartAbs >= @breakEndAbs SET @startDayWorkingLength = @checkOutAbs - @clockStartAbs;
IF @clockEndAbs <= @breakStartAbs SET @endDayWorkingLength = @clockEndAbs - @checkInAbs;
IF @clockEndAbs >= @breakEndAbs SET @endDayWorkingLength = @clockEndAbs - @breakEndAbs + @breakStartAbs - @checkInAbs;


IF EXISTS (SELECT * FROM SysParam t2 WHERE t2.paramValue = DATENAME(weekday,@dateStart)) SET @startDayWorkingLength = 0;
IF EXISTS (SELECT * FROM holiday t2 WHERE t2.holidayDate = CONVERT(nvarchar(20),@dateStart,23)) SET @startDayWorkingLength = 0;
IF EXISTS (SELECT * FROM SysParam t2 WHERE t2.paramValue = DATENAME(weekday,@dateEnd)) SET @endDayWorkingLength = 0;
IF EXISTS (SELECT * FROM holiday t2 WHERE t2.holidayDate = CONVERT(nvarchar(20),@dateEnd,23)) SET @endDayWorkingLength = 0;


RETURN CEILING(CAST(@normalWorkingDay*@normalWorkingLength + @startDayWorkingLength + @endDayWorkingLength AS decimal)/CAST(60 AS decimal));

END
GO
/****** Object:  UserDefinedFunction [dbo].[GetMax]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[GetMax]
(
@a bigint
, @b bigint
)
returns bigint
as
begin
return (select case when @a > @b then @a else @b end)
end
GO
/****** Object:  UserDefinedFunction [dbo].[hashPW]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[hashPW]
(	
	-- Add the parameters for the function here
	-- 0x37DC1A3C0534909B99BD5591CC4EB677C7B50924FC85BAF33487D119F4403E sysadmin
	@RawPW nvarchar(50),
	@userName nvarchar(50)
)
RETURNS nvarchar(64)
AS
BEGIN
declare @firstpart nvarchar(64), @secondpart nvarchar(64)
set @firstpart = CONVERT(NVARCHAR(64),HashBytes('SHA2_256', @RawPW),1)
set @secondpart = CONVERT(NVARCHAR(64),HashBytes('SHA2_256', REVERSE(@userName) + @firstpart ),1)
	RETURN CONVERT(NVARCHAR(64),HashBytes('SHA2_256', @firstpart + 'LeaveMS' + @secondpart),1);
END;


GO
/****** Object:  UserDefinedFunction [dbo].[udfInitAppID]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[udfInitAppID]
(
)
RETURNS NVARCHAR(16)
AS
BEGIN
declare @lastSeq bigint;
declare @initYear int;
SET @initYEar = YEAR(GETDATE());
SET @lastSeq = (select count(*) from LeaveApplicationData t1 where year(CONVERT(DATETIME, t1.createdAt, 102)) = @initYear)+1;

RETURN 'LR'+ CONVERT(nvarchar,@initYear) + Right('0000000' + CONVERT(NVARCHAR, @lastSeq), 7);

END
GO
/****** Object:  UserDefinedFunction [dbo].[ValidateApp]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[ValidateApp]
(
	@trackingRef nvarchar(20)
)
RETURNS BIT
AS
BEGIN
DECLARE @reasonCode nvarchar(20), @correspondingColumn nvarchar(20);
DECLARE @userID nvarchar(max);
DECLARE @leaveQuota nvarchar(20);
DECLARE @appYear nvarchar(20);
DECLARE @quota bigint, @hourUsed1 bigint, @hourUsed2 bigint, @hourRequired bigint;

IF NOT EXISTS (SELECT * FROM LeaveApplicationData WHERE trackingRef = @trackingRef) GOTO return_0;

SELECT @userID = applicantUserName,
		@reasonCode = leaveCode,
		@appYear = LEFT(fromTime,4),
		@hourRequired = timeConsumed
	FROM LeaveApplicationData WHERE trackingRef = @trackingRef;

--SET @correspondingColumn = 'yearly' + @reasonCode;
SET @leaveQuota = (SELECT limit
	FROM leaveLimit t1
	WHERE t1.userName = @userID and t1.leaveCode = @reasonCode);

IF @leaveQuota IS NULL GOTO return_1;
SET @quota = CAST(@leaveQuota AS bigint);

SELECT @hourUsed1 = SUM(timeConsumed) FROM LeaveApplicationData
	WHERE applicantUserName = @userID
	AND leaveCode = @reasonCode
	AND progress = '0001'
	AND finalStatus = 1
	AND LEFT(fromTime,4) = @appYear
	AND trackingRef <> @trackingRef;

IF @hourUsed1 IS NULL SET @hourUsed1 = 0;
SELECT @hourUsed2 = SUM(timeConsumed) FROM LeaveApplicationData
	WHERE applicantUserName = @userID
	AND leaveCode = @reasonCode
	AND progress = '0002'
	AND approverCommand = '0000'
	AND finalStatus = 1
	AND LEFT(fromTime,4) = @appYear
	AND trackingRef <> @trackingRef;
IF @hourUsed2 IS NULL SET @hourUsed2 = 0;
IF @quota - @hourUsed1 - @hourUsed2 < @hourRequired GOTO return_0


return_1:
RETURN 1

return_0:
RETURN 0

END
GO
/****** Object:  Table [dbo].[deptInfo]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[deptInfo](
	[deptCode] [nvarchar](50) NOT NULL,
	[deptDesc] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[deptCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[holiday]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[holiday](
	[holidayDate] [nvarchar](10) NOT NULL,
	[description] [nvarchar](50) NULL,
	[isEnabled] [bit] NULL DEFAULT ((1)),
PRIMARY KEY CLUSTERED 
(
	[holidayDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[LeaveApplicationData]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LeaveApplicationData](
	[trackingRef] [nvarchar](50) NOT NULL,
	[createdAt] [nvarchar](50) NULL,
	[applicantUserName] [nvarchar](50) NULL,
	[applicantDeptCode] [nvarchar](50) NULL,
	[applicantTitleCode] [nvarchar](50) NULL,
	[fromTime] [nvarchar](50) NULL,
	[toTime] [nvarchar](50) NULL,
	[timeConsumed] [int] NULL,
	[applicantDescription] [nvarchar](50) NULL,
	[leaveCode] [nvarchar](50) NULL,
	[isValid] [bit] NULL DEFAULT ((0)),
	[progress] [nvarchar](50) NULL,
	[approverUserName] [nvarchar](50) NULL,
	[approverCommand] [nvarchar](50) NULL,
	[approverDescription] [nvarchar](50) NULL,
	[createdByAdmin] [bit] NULL DEFAULT ((0)),
	[finalStatus] [bit] NULL DEFAULT ((1)),
PRIMARY KEY CLUSTERED 
(
	[trackingRef] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[leaveLimit]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leaveLimit](
	[userName] [nvarchar](50) NULL,
	[leaveCode] [nvarchar](50) NULL,
	[limit] [int] NULL
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[leaveTypeInfo]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[leaveTypeInfo](
	[leaveCode] [nvarchar](50) NOT NULL,
	[leaveDesc] [nvarchar](50) NULL,
	[defaultLimit] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[leaveCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[SysParam]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SysParam](
	[paramKey] [nvarchar](50) NOT NULL,
	[paramValue] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[paramKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[titleInfo]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[titleInfo](
	[titleCode] [nvarchar](50) NOT NULL,
	[titleDesc] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[titleCode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[userInfo]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[userInfo](
	[userName] [nvarchar](50) NOT NULL,
	[userPass] [nvarchar](64) NULL,
	[userFullname] [nvarchar](50) NULL,
	[userDeptCode] [nvarchar](50) NULL,
	[userTitleCode] [nvarchar](50) NULL,
	[userEmail] [nvarchar](50) NULL,
	[userEnabled] [bit] NULL DEFAULT ((1)),
	[userFailedLoginCount] [int] NULL DEFAULT ((0)),
PRIMARY KEY CLUSTERED 
(
	[userName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  View [dbo].[LeaveSummaryView01]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[LeaveSummaryView01]
	AS 
SELECT        t1.userName, t1.leaveCode, t2.leaveDesc, SUM(isnull(t1.limit,0)) AS limit
FROM            leaveLimit t1 LEFT OUTER JOIN
                         leaveTypeInfo t2 ON t1.leaveCode = t2.leaveCode
GROUP BY t1.userName, t1.leaveCode, t2.leaveDesc

GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0000', N'IT')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0001', N'HR')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0002', N'Finance')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0003', N'SCM-Logistic-WH')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0004', N'Board of Director')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0005', N'Production Floor')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0006', N'Research and Development')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0007', N'Facility')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0008', N'Sale')
GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0009', N'Marketing')
GO
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-01', N'tết dương lịch', 1)
GO
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-22', N'tet am lich', 1)
GO
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-23', N'tet am lich', 1)
GO
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-24', N'tết âm lịch', 0)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000001', N'2020-03-27', N'user01', N'0001', N'0003', N'2020-03-18 09:36', N'2020-03-19 09:36', 8, N'nghi phep', N'0000', 1, N'0002', N'user02', N'0000', N'', 0, 0)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000002', N'2020-03-27', N'user01', N'0001', N'0003', N'2020-03-17 09:38', N'2020-03-26 09:38', 56, N'khong luong', N'0001', 1, N'0002', N'user02', N'0001', N'co cai cuc kit', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000003', N'2020-03-27', N'user01', N'0001', N'0003', N'2020-03-09 08:30', N'2020-03-09 17:30', 8, N'nghi cuoi', N'0002', 1, N'0002', N'user02', N'0000', N'uh dc', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000004', N'2020-03-27', N'user03', N'0001', N'0003', N'2020-03-10 13:30', N'2020-03-30 13:30', 112, N'di du lich', N'0007', 1, N'0002', N'user02', N'0001', N'no shit', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000005', N'2020-03-27', N'user03', N'0001', N'0003', NULL, NULL, NULL, NULL, NULL, 0, N'0000', NULL, NULL, NULL, 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000006', N'2020-03-27', N'user02', N'0001', N'0002', N'2020-03-10 15:43', N'2020-03-12 15:43', 16, N'xin nghi', N'0000', 1, N'0002', N'user31', N'0000', N'', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000007', N'2020-03-27', N'user01', N'0001', N'0003', N'2020-03-24 22:43', N'2020-04-09 08:30', 88, N'xin nghi', N'0000', 1, N'0002', N'user02', N'0001', N'no', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000008', N'2020-03-27', N'user02', N'0001', N'0002', N'2020-03-17 22:59', N'2020-03-25 22:59', 48, N'boss cho xin nghi cai', N'0000', 1, N'0002', N'user31', N'0001', N'', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000009', N'2020-03-27', N'user01', N'0001', N'0003', N'2020-03-09 22:51', N'2020-03-25 08:30', 88, N'shit', N'0000', 1, N'0002', N'user02', N'0000', N'ok', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000010', N'2020-03-27', N'user02', N'0001', N'0002', N'2020-03-11 23:24', N'2020-03-19 23:24', 48, N'12233', N'0001', 1, N'0001', NULL, NULL, NULL, 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000011', N'2020-03-28', N'user01', N'0001', N'0003', N'2020-03-10 22:41', N'2020-03-17 22:41', 40, N'xxxx', N'0001', 1, N'0002', N'user02', N'0001', N'đeck', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000012', N'2020-03-28', N'user01', N'0001', N'0003', N'2020-03-09 10:44', N'2020-03-16 10:44', 40, N'khong luong', N'0001', 1, N'0002', N'user02', N'0000', N'', 0, 0)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000013', N'2020-03-29', N'user01', N'0001', N'0003', N'2020-03-09 10:45', N'2020-03-10 10:45', 8, N'om', N'0004', 1, N'0002', N'user02', N'0000', N'', 0, 0)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000014', N'2020-03-29', N'user01', N'0001', N'0003', N'2020-03-15 10:45', N'2020-03-16 10:45', 3, N'om nang', N'0004', 1, N'0001', NULL, NULL, NULL, 0, 0)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000015', N'2020-03-29', N'user01', N'0001', N'0003', N'2020-03-23 23:23', N'2020-03-24 23:23', 8, N'xxxx', N'0005', 1, N'0002', N'user02', N'0000', N'ok', 0, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000016', N'2020-03-29', N'user01', N'0001', N'0003', N'2020-03-10 21:59', N'2020-03-11 21:59', 8, N'xxxxxxx', N'0001', 1, N'0002', N'sysadmin', N'0000', N'Created By Admin / Admin t?o', 1, 0)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000017', N'2020-03-29', N'user01', N'0001', N'0003', N'2020-03-10 22:06', N'2020-03-11 22:06', 8, N'cưới', N'0002', 1, N'0002', N'sysadmin', N'0000', N'Created By Admin / Admin t?o', 1, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000018', N'2020-03-29', N'user01', N'0001', N'0003', N'2020-03-30 23:20', N'2020-03-31 23:20', 8, N'test', N'0000', 1, N'0002', N'sysadmin', N'0000', N'Created By Admin / Admin t?o', 1, 1)
GO
INSERT [dbo].[LeaveApplicationData] ([trackingRef], [createdAt], [applicantUserName], [applicantDeptCode], [applicantTitleCode], [fromTime], [toTime], [timeConsumed], [applicantDescription], [leaveCode], [isValid], [progress], [approverUserName], [approverCommand], [approverDescription], [createdByAdmin], [finalStatus]) VALUES (N'LR20200000019', N'2020-03-29', N'user02', N'0001', N'0002', NULL, NULL, NULL, NULL, NULL, 0, N'0000', NULL, NULL, NULL, 0, 1)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user01', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user02', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user03', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user04', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user05', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user06', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user07', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user08', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user09', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user10', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user11', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user12', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user13', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user14', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user15', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user16', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user17', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user18', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user19', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user20', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user21', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user22', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user23', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user24', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user25', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user26', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user27', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user28', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user29', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user30', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0000', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0002', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0003', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0004', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0006', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user31', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user32', N'0007', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0000', 96)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0001', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0002', 32)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0003', 16)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0004', 240)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0005', NULL)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0006', 24)
GO
INSERT [dbo].[leaveLimit] ([userName], [leaveCode], [limit]) VALUES (N'user33', N'0007', NULL)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0000', N'Annual Leave - Phép năm', 96)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0001', N'Unpaid Leave - Không lương', NULL)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0002', N'(Self) Mariage - (Bản thân) Cưới', 32)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0003', N'(Family member) Marriage - (Người thân) Cưới', 16)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0004', N'Sick Leave - Nghỉ ốm', 240)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0005', N'Compensation Leave - Nghỉ bù', NULL)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0006', N'Bereavement - Tang chế', 24)
GO
INSERT [dbo].[leaveTypeInfo] ([leaveCode], [leaveDesc], [defaultLimit]) VALUES (N'0007', N'Special - Đặc biệt', NULL)
GO
INSERT [dbo].[SysParam] ([paramKey], [paramValue]) VALUES (N'BreakEnd', N'13:30')
GO
INSERT [dbo].[SysParam] ([paramKey], [paramValue]) VALUES (N'BreakStart', N'12:30')
GO
INSERT [dbo].[SysParam] ([paramKey], [paramValue]) VALUES (N'EndTime', N'17:30')
GO
INSERT [dbo].[SysParam] ([paramKey], [paramValue]) VALUES (N'StartTime', N'08:30')
GO
INSERT [dbo].[SysParam] ([paramKey], [paramValue]) VALUES (N'Weekend1', N'Saturday')
GO
INSERT [dbo].[SysParam] ([paramKey], [paramValue]) VALUES (N'Weekend2', N'Sunday')
GO
INSERT [dbo].[titleInfo] ([titleCode], [titleDesc]) VALUES (N'0000', N'Admin')
GO
INSERT [dbo].[titleInfo] ([titleCode], [titleDesc]) VALUES (N'0001', N'Director')
GO
INSERT [dbo].[titleInfo] ([titleCode], [titleDesc]) VALUES (N'0002', N'Manager')
GO
INSERT [dbo].[titleInfo] ([titleCode], [titleDesc]) VALUES (N'0003', N'User')
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'sysadmin', N'0x249E392B6C855451D1905CEEFF5DF16FE2BB87E889CDF106E6614468DA8858', N'System Admin', N'0000', N'0000', NULL, 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user01', N'0x4A596F2ACF2687155C74D719335244D7FE2CECA63DC64C21D77E71FFDB9F0F', N'Ronaldo', N'0001', N'0003', N'ronaldo@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user02', N'0x050FF5BBA3CBC87BC893F824BD29223D216A92CB09560CAAF41864187E8870', N'Messi', N'0001', N'0002', N'chokeslamextreme@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user03', N'0xC26817C95C0C379840B7C6C9E2370C681BAB52186981E99639F60F27E042A4', N'Mbappe', N'0001', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user04', N'0x0E859609D5014C5C2525E0802BA1CB537A9F3429EE08E064477A786C4FFA41', N'Griezmann', N'0001', N'0003', N'user03@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user05', N'0x4249CE107411F56A202040166634C54D7E6C95B42E58C3F2745597A8705466', N'Aguero', N'0003', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user06', N'0x2E7F07C8DC61B99184422F05E64B2C8D4A655019FCB70D198CD4E12B90D984', N'user06', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user07', N'0x9EF4F852F643FDC0C3ACA0BBF0B663884F17574B8CD0DB807359197F2D3386', N'Suarez', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user08', N'0x8439A0031EACB559294DEEED618A17D77D3A5A1840B49F0F55568397B2DEC0', N'Salah', N'0003', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user09', N'0x939029B4FCE18AAB1252F9CC2C82CE42E9BC2DBCE2CCA4DC4CC664B6B742F7', N'Mane', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user10', N'0x36DCD03D44FC5C433E4C730DB5BC2F29D4CF2C0532B77884992B329528869F', N'Ramos', N'0002', N'0002', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user11', N'0x3E64EB87BA20DDFBA5C2AFBDF10DAA99D5BE7B330D951BD42B9CF68F71F7A5', N'Linh', N'0003', N'0002', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user12', N'0x80A3B1683F2F42450BF5B5459DFB04168E72B0275075C97DBB970E71755290', N'Pele', N'0003', N'0002', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user13', N'0x8CFF66DDA5E439C4A01AEF3E940FCEA67C6D2A0E8428D2B561287D77E7BD44', N'Maradona', N'0001', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user14', N'0x5D0349A0E36F197C491245F8DF7A405D0E3D73CDAC9159FDFE5B3E1ACC690F', N'Ferrari', N'0001', N'0003', NULL, 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user15', N'0xBBF38D5120C5E4672D203FD08C8A00035F300E2D4BF7AC1484E26CE84CB3E8', N'Mercedes S500', N'0001', N'0003', N'user02@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user16', N'0x48EB9B7C75DD6C73C75319C57401B7BD7A05229810F549E0153D60152DD99A', N'Audi A8', N'0001', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user17', N'0x437894EC6920011AA2CC1F81B6053E55EA4D5FAE682D72F541B061A333E7FE', N'BMW X7', N'0001', N'0003', N'user03@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user18', N'0xFD9BFEEF33C445D47A575DC05F756B9F4648878738E17776DB9FE5FEB86347', N'BMW 320i', N'0001', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user19', N'0xE27413376E9D26A533BA3C1A38B8E7D6F1DC79B458F7AE6F87D327FF0784D8', N'Toyota Camry', N'0001', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user20', N'0x3A250BFE75F6138870A49CC877A11D6AC4AAE368F7395D2B232F12381E64ED', N'Honda CRV', N'0001', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user21', N'0x7BC51BD89845EA720FF0451BBAA4486F6DA7F33DC25D725A3275376862CDF2', N'Nissan Maxima', N'0002', N'0002', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user22', N'0x00C9AB42DE4567CA484D39A7B597128394933CA4C08A8BC7BAC776F1F71935', N'Nissan Nismo GTR', N'0002', N'0002', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user23', N'0x0F559D9B06E4C0CA3C9F696C2A8874BB0E790BB21C8C74CB273C8A6B5E486D', N'Maybach S650', N'0002', N'0002', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user24', N'0x6EEEDE93F1C1BB2B699766A5A1AC9540B623C7E0596000B3E028FC9305A12A', N'Roll Royce', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user25', N'0xA2E0B2FD802882DB5EE50EBA64B53437695157D87C914DA43BFA61979A0A32', N'Angular', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user26', N'0x42C222AA0880935C7FA4E104E58C08324C0B579FD14A5F8CFF50856F7EA00C', N'React JS', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user27', N'0x345A9C2E03E57C94B0DCD89F5C4DE1B77D9ED3674BF1F43BEDE2F5FAC8DA19', N'Vue JS', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user28', N'0xE02F0D1C3D37E8D3B8507FE3550B598DC2DCBCAE4CE780C0A8DF6268859844', N'ADO.NET', N'0002', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user29', N'0x0C68FA001DAD4A9FF4CD2F73BF9AAC0DA7F4452F206484FBD75311BC563090', N'Inglorious Basterds', N'0000', N'0003', N'host@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user30', N'0xA7D8C24DCD9977C3590C22BCDF0D42D1955BAA1535ABDB1674BC3E71DA9DD3', N'Roll Royce', N'0003', N'0002', N'xxx@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user31', N'0x6D619611633B183B8BBA6087F0DFA1ED0A9BB05D93894AF435868338907647', N'General Director', N'0004', N'0001', N'god@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user32', N'0xE492AA380BDF065FA6CF1EFFDEE8611CE91606C93D733FFA2D3590BE569C2A', N'Blazor', N'0006', N'0002', N'chokeslamextreme@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user33', N'0xB5E2F5142F611B727509F7C89C38EEE4CCC84DF1E2A668B5ECAC27111044B6', N'Google', N'0008', N'0002', N'chokeslamextreme@gmail.com', 1, 0)
GO
ALTER TABLE [dbo].[userInfo]  WITH CHECK ADD  CONSTRAINT [FK_userInfo_deptInfo] FOREIGN KEY([userDeptCode])
REFERENCES [dbo].[deptInfo] ([deptCode])
GO
ALTER TABLE [dbo].[userInfo] CHECK CONSTRAINT [FK_userInfo_deptInfo]
GO
ALTER TABLE [dbo].[userInfo]  WITH CHECK ADD  CONSTRAINT [FK_userInfo_titleInfo] FOREIGN KEY([userTitleCode])
REFERENCES [dbo].[titleInfo] ([titleCode])
GO
ALTER TABLE [dbo].[userInfo] CHECK CONSTRAINT [FK_userInfo_titleInfo]
GO
/****** Object:  StoredProcedure [dbo].[AddNewHoliday]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddNewHoliday]
	@date nvarchar(10),
	@description nvarchar(50),
	@status nvarchar (50) out

	-- 000: thành công
	-- 004: đã tồn tại bản ghi
AS
if exists (select * from holiday where holidayDate = @date and isEnabled = 1)
	begin
	set @status = '004'
	return
	end
if exists (select * from holiday where holidayDate = @date and isEnabled = 0)
	begin
	update t1 set t1.isEnabled = 1, t1.description = @description from holiday t1 where t1.holidayDate = @date
	set @status = '000'
	return
	end
insert into holiday(holidayDate, description, isEnabled) values (@date, @description, 1)
set @status = '000'

GO
/****** Object:  StoredProcedure [dbo].[AddNewUser]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AddNewUser]
	@user [dbo].[userTableType] readonly,
	@status nvarchar(50) out
AS
Begin
DECLARE @tempUser TABLE(
    userName nvarchar(50),
    userPass nvarchar(64),
	userFullname nvarchar(50),
	userDeptCode nvarchar(50),
	userTitleCode nvarchar(50),
	userEmail nvarchar(50),
	userEnabled          BIT           DEFAULT ((1)) NULL,
    userFailedLoginCount INT           DEFAULT ((0)) NULL
)

insert into @tempUser select * from @user
update t1 set t1.userPass = dbo.hashPW(t1.userPass, t1.userName) from @tempUser t1
insert into userInfo select * from @tempUser
set @status = '000'
end


GO
/****** Object:  StoredProcedure [dbo].[AdjustLeaveLimit]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AdjustLeaveLimit]
	@leaveTypes [dbo].[leaveLimitTableType] readonly,
	@userName nvarchar(50),
	@status nvarchar (50) out
AS
DECLARE @tempTable TABLE(
    userName nvarchar(50),
    leaveCode nvarchar(50),
	limit int
)

insert into @tempTable select * from @leaveTypes

update t1 set t1.limit = t2.limit from leaveLimit t1 
inner join @tempTable t2 on t1.userName = t2.userName and t1.leaveCode = t2.leaveCode
set @status = '000'
GO
/****** Object:  StoredProcedure [dbo].[ApproveLeaveApplication]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ApproveLeaveApplication]
	@approverUserName nvarchar(50),
	@trackingRef nvarchar(50),
	@approverDescription nvarchar(50),
	@approverCommand nvarchar(50),
	@status nvarchar(50) out

	--000 thành công
	--002 không có record như vậy
AS
set @status = '002'
IF NOT EXISTS (SELECT * FROM userInfo WHERE userName = @approverUserName) RETURN
DECLARE @userTitleCode nvarchar(50), @userDeptCode nvarchar(50)
SELECT @userTitleCode = userTitleCode, @userDeptCode = userDeptCode from userInfo WHERE userName = @approverUserName
IF @userTitleCode = '0003' RETURN
DECLARE @userTitleCode1 nvarchar(50), @userDeptCode1 nvarchar(50)

IF NOT EXISTS (SELECT * FROM LeaveApplicationData 
				WHERE trackingRef = @trackingRef
				AND progress = '0001'
				AND finalStatus = 1
				AND isValid = 1) RETURN
SELECT @userTitleCode1 = applicantTitleCode, @userDeptCode = applicantDeptCode from LeaveApplicationData WHERE trackingRef = @trackingRef

DECLARE @action nvarchar(20)

IF @userTitleCode = '0000'
	BEGIN
	UPDATE t1 SET t1.approverCommand = @approverCommand,
			t1.approverUserName = @approverUserName,
			t1.progress = '0002',
			t1.approverDescription = @approverDescription
			FROM LeaveApplicationData t1
			WHERE trackingRef = @trackingRef
	SET @status = '000'
	RETURN
	END

IF @userTitleCode = '0001'
	BEGIN
	IF @userTitleCode1 <> '0002'
		RETURN
		ELSE
			BEGIN
				UPDATE t1 SET t1.approverCommand = @approverCommand,
					t1.approverUserName = @approverUserName,
					t1.progress = '0002',
					t1.approverDescription = @approverDescription
					FROM LeaveApplicationData t1
					WHERE trackingRef = @trackingRef
				SET @status = '000'
				RETURN
			END
	END

IF @userTitleCode = '0002'
	BEGIN
		IF @userTitleCode1 <> '0003' OR @userDeptCode1 <> @userDeptCode RETURN
			ELSE
			BEGIN
				UPDATE t1 SET t1.approverCommand = @approverCommand,
					t1.approverUserName = @approverUserName,
					t1.progress = '0002',
					t1.approverDescription = @approverDescription
					FROM LeaveApplicationData t1
					WHERE trackingRef = @trackingRef
				SET @status = '000'
				RETURN
			END
	END
GO
/****** Object:  StoredProcedure [dbo].[ChangeUserPassword]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ChangeUserPassword]
	@userName nvarchar(50),
	@userPass nvarchar(50),
	@userPassNew nvarchar(50),

	@status nvarchar(50) out,
	@message nvarchar(50) out
	-- 000: thành công
	-- 001: sai mật khẩu
	-- 002: không tồn tại user hoặc bị vô hiệu


AS
set @message = ''
if not exists (select * from userInfo t1 where t1.userName = @userName and t1.userEnabled = 1)
	begin
		set @status = '002'
		return
	end

if not exists(select * from userInfo t1 where t1.userName = @userName and t1.userPass = dbo.hashPW(@userPass, @userName))
	begin
		set @status = '001'
		return
	end
update t1 set t1.userPass = dbo.hashPW(@userPassNew, @userName)
	from userInfo t1
	where t1.userName = @userName
set @status = '000'


GO
/****** Object:  StoredProcedure [dbo].[ChangeUserPasswordByAdmin]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ChangeUserPasswordByAdmin]
	@userName nvarchar(50),
	@userPass nvarchar(50),

	@status nvarchar(50) out,
	@message nvarchar(50) out
	-- 000: thành công
	-- 002: không tồn tại user hoặc bị vô hiệu


AS
set @message = ''
if not exists (select * from userInfo t1 where t1.userName = @userName)
	begin
		set @status = '002'
		return
	end

update t1 set t1.userPass = dbo.hashPW(@userPass, @userName)
	from userInfo t1
	where t1.userName = @userName
set @status = '000'

GO
/****** Object:  StoredProcedure [dbo].[DisableLeaveApplication]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[DisableLeaveApplication]
	@trackingRef nvarchar(50),
	@status nvarchar(50) out

	--000 thanh cong
	--002 khong ton tai
AS
set @status = '002'

if not exists (select * from LeaveApplicationData where finalStatus = 1 and trackingRef = @trackingRef) return

update t1 set t1.finalStatus = 0 from LeaveApplicationData t1 where  t1.trackingRef = @trackingRef
set @status = '000'
GO
/****** Object:  StoredProcedure [dbo].[EditUserInfo]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[EditUserInfo]
	@user [dbo].[userTableType] readonly,
	@status nvarchar(50) out
	-- 000: thành công
	-- 002: không tồn tại user
AS
Begin
DECLARE @tempUser TABLE(
    userName nvarchar(50),
    userPass nvarchar(64),
	userFullname nvarchar(50),
	userDeptCode nvarchar(50),
	userTitleCode nvarchar(50),
	userEmail nvarchar(50),
	userEnabled          BIT           DEFAULT ((1)) NULL,
    userFailedLoginCount INT           DEFAULT ((0)) NULL
)

insert into @tempUser select * from @user
declare @userName nvarchar(50) = (select userName from @tempUser)
if not exists (select * from userInfo as t1 where t1.userName = @userName)
	begin
		set @status = '002'
		return
	end

update	t1 set t1.userFullname = t2.userFullname, 
		t1.userDeptCode = t2.userDeptCode, 
		t1.userTitleCode = t2.userTitleCode, 
		t1.userEmail = t2.userEmail, 
		t1.userEnabled = t2.userEnabled, 
		t1.userFailedLoginCount = t2.userFailedLoginCount
from userInfo as t1
	inner join @tempUser as t2 on t1.userName = t2.userName

set @status = '000'
end

GO
/****** Object:  StoredProcedure [dbo].[GetDataForDirectLeaveDeduction]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetDataForDirectLeaveDeduction]

AS
select userName, userFullname, userDeptCode, userTitleCode from userInfo where userTitleCode <> '0000' and userEnabled = 1
select leaveCode from leaveTypeInfo
select holidayDate from holiday where isEnabled = 1
select * from SysParam
GO
/****** Object:  StoredProcedure [dbo].[GetFullApplicationList]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetFullApplicationList]
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS

declare @tempTable Table  (
    [trackingRef]          NVARCHAR (50) NOT NULL,
    [createdAt]            NVARCHAR (50) NULL,
    [applicantUserName]    NVARCHAR (50) NULL,
    [applicantDeptCode]    NVARCHAR (50) NULL,
    [applicantTitleCode]   NVARCHAR (50) NULL,
    [fromTime]             NVARCHAR (50) NULL,
    [toTime]               NVARCHAR (50) NULL,
    [timeConsumed]         INT           NULL,
    [applicantDescription] NVARCHAR (50) NULL,
    [leaveCode]            NVARCHAR (50) NULL,
    [isValid]              BIT           DEFAULT ((0)) NULL,
    [progress]             NVARCHAR (50) NULL,
    [approverUserName]     NVARCHAR (50) NULL,
    [approverCommand]      NVARCHAR (50) NULL,
    [approverDescription]  NVARCHAR (50) NULL,
    [createdByAdmin]       BIT           DEFAULT ((0)) NULL,
    [finalStatus]          BIT           DEFAULT ((1)) NULL,
	[applicantUserFullName]    NVARCHAR (50) NULL,
    [approverUserFullName]    NVARCHAR (50) NULL
);

declare @sql nvarchar(max) = 'select t1.*,
			t2.userFullname as applicantUserFullName, 
			t3.userFullname as approverUserFullName
			from LeaveApplicationData t1 			
			left join userInfo t2 on t2.userName = t1.applicantUserName
			left join userInfo t3 on t3.userName = t1.approverUserName


			where ' + @condition

insert into @tempTable exec(@sql)

set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return

If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
	begin
	select t1.* from @tempTable t1 
	order by t1.trackingRef
	return
	end

select t1.* from @tempTable t1 
	order by t1.trackingRef
	offset @skipRows rows
	fetch next @pageSize rows only;
GO
/****** Object:  StoredProcedure [dbo].[GetHolidayWithPaging]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetHolidayWithPaging]
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS

declare @tempTable Table  (
    [holidayDate]             NVARCHAR (50) NOT NULL,
    [description]             NVARCHAR (64) NULL,
    [isEnabled]         Bit NULL,
    PRIMARY KEY CLUSTERED ([holidayDate] ASC)
);

declare @sql nvarchar(max) = 'select * from holiday where [isEnabled] <> 0'

insert into @tempTable exec(@sql)

set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return

If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
	begin
	select t1.* from @tempTable t1 
	order by t1.holidayDate
	return
	end

select t1.* from @tempTable t1 
	order by t1.holidayDate
	offset @skipRows rows
	fetch next @pageSize rows only;

GO
/****** Object:  StoredProcedure [dbo].[GetPendingApplication]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetPendingApplication]
	@userName nvarchar(50),
	@status nvarchar(50) out
	-- 000: thành công
	-- 005: không có quyền

AS
declare @userTitleCode nvarchar(50), @userDeptCode nvarchar(50)

select @userDeptCode = t1.userDeptCode, @userTitleCode = t1.userTitleCode from userInfo t1
	where t1.userName = @userName
if @userTitleCode is null or @userDeptCode is null or @userTitleCode not in ('0001','0002')
	begin
		set @status = '005'
		return
	end
if @userTitleCode = '0002'
	begin
		select t1.*, t2.userFullname as applicantUserFullName  from LeaveApplicationData t1
			inner join userInfo t2 on t1.applicantUserName = t2.userName

		where t1.applicantTitleCode = '0003' 
			and t1.applicantDeptCode = @userDeptCode
			and t1.progress = '0001'
	end
if @userTitleCode = '0001'
	begin
		select t1.*, t2.userFullname as applicantUserFullName from LeaveApplicationData t1
			inner join userInfo t2 on t1.applicantUserName = t2.userName

		where t1.applicantTitleCode = '0002' 
			and t1.progress = '0001'
	end
set @status = '000'
GO
/****** Object:  StoredProcedure [dbo].[GetSingleApplicationList]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetSingleApplicationList]
	@applicantUserName nvarchar(50),
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS

declare @tempTable Table  (
    [trackingRef]          NVARCHAR (50) NOT NULL,
    [createdAt]            NVARCHAR (50) NULL,
    [applicantUserName]    NVARCHAR (50) NULL,
    [applicantDeptCode]    NVARCHAR (50) NULL,
    [applicantTitleCode]   NVARCHAR (50) NULL,
    [fromTime]             NVARCHAR (50) NULL,
    [toTime]               NVARCHAR (50) NULL,
    [timeConsumed]         INT           NULL,
    [applicantDescription] NVARCHAR (50) NULL,
    [leaveCode]            NVARCHAR (50) NULL,
    [isValid]              BIT           DEFAULT ((0)) NULL,
    [progress]             NVARCHAR (50) NULL,
    [approverUserName]     NVARCHAR (50) NULL,
    [approverCommand]      NVARCHAR (50) NULL,
    [approverDescription]  NVARCHAR (50) NULL,
    [createdByAdmin]       BIT           DEFAULT ((0)) NULL,
    [finalStatus]          BIT           DEFAULT ((1)) NULL,
	[applicantUserFullName]    NVARCHAR (50) NULL,
    [approverUserFullName]    NVARCHAR (50) NULL
);

declare @sql nvarchar(max) = 'select t1.*,
			t2.userFullname as applicantUserFullName, 
			t3.userFullname as approverUserFullName
			from LeaveApplicationData t1 			
			left join userInfo t2 on t2.userName = t1.applicantUserName
			left join userInfo t3 on t3.userName = t1.approverUserName


			where applicantUserName = ' 
			+ char(39) + @applicantUserName + char(39) + 
			' and ' + @condition

insert into @tempTable exec(@sql)

set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return

If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
	begin
	select t1.* from @tempTable t1 
	where t1.applicantUserName = @applicantUserName
	order by t1.trackingRef
	return
	end

select t1.* from @tempTable t1 
	where t1.applicantUserName = @applicantUserName
	order by t1.trackingRef
	offset @skipRows rows
	fetch next @pageSize rows only;
GO
/****** Object:  StoredProcedure [dbo].[GetTitleAndDeptList]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetTitleAndDeptList]

AS
select * from deptInfo
select * from titleInfo where titleCode <> '0000'


GO
/****** Object:  StoredProcedure [dbo].[GetUserDetails]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserDetails]
	@userName nvarchar(50),
	@status nvarchar(50) out
	-- 000: pass
	-- 002: không tồn tại user

AS
if not exists (select * from userInfo where userName = @userName)
	begin
		set @status = '002'
		return
	end
select t1.*, t2.titleDesc, t3.deptDesc from userInfo t1 
	join titleInfo t2 on t2.titleCode = t1.userTitleCode
	join deptInfo t3 on t3.deptCode = t1.userDeptCode
	where t1.userName = @userName

set @status = '000'


GO
/****** Object:  StoredProcedure [dbo].[GetUserNoFilter]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserNoFilter]

AS
select t1.*, t2.titleDesc, t3.deptDesc from userInfo t1 
	join titleInfo t2 on t2.titleCode = t1.userTitleCode
	join deptInfo t3 on t3.deptCode = t1.userDeptCode
	where t1.userTitleCode <> '0000'


GO
/****** Object:  StoredProcedure [dbo].[GetUserTitle]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserTitle]
	@userName nvarchar(50),
	@status nvarchar(50) out,
	@message nvarchar(50) out
	-- 000: đã tìm được user
	-- 002: không tồn tại user hoặc bị vô hiệu

AS
set @message = ''
if not exists (select * from userInfo t1 where t1.userName = @userName and t1.userEnabled = 1)
	begin
		set @status = '002'
	end
	else
	begin
		set @status = '000'
		set @message = (select t1.userTitleCode from userInfo t1 where t1.userName = @userName)
	end


GO
/****** Object:  StoredProcedure [dbo].[GetUserWithPaging]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetUserWithPaging]
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS

declare @tempTable Table  (
    [userName]             NVARCHAR (50) NOT NULL,
    [userPass]             NVARCHAR (64) NULL,
    [userFullname]         NVARCHAR (50) NULL,
    [userDeptCode]         NVARCHAR (50) NULL,
    [userTitleCode]        NVARCHAR (50) NULL,
    [userEmail]            NVARCHAR (50) NULL,
    [userEnabled]          BIT           DEFAULT ((1)) NULL,
    [userFailedLoginCount] INT           DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([userName] ASC)
);

declare @sql nvarchar(max) = 'select * from userInfo where userTitleCode <> ' + char(39) + '0000' + char(39) + ' and ' + @condition

insert into @tempTable exec(@sql)

set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return

If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
	begin
	select t1.*, t2.titleDesc, t3.deptDesc from @tempTable t1 
	join titleInfo t2 on t2.titleCode = t1.userTitleCode
	join deptInfo t3 on t3.deptCode = t1.userDeptCode
	where t1.userTitleCode <> '0000'
	order by t1.userName
	return
	end

select t1.*, t2.titleDesc, t3.deptDesc from @tempTable t1 
	join titleInfo t2 on t2.titleCode = t1.userTitleCode
	join deptInfo t3 on t3.deptCode = t1.userDeptCode
	where t1.userTitleCode <> '0000'
	order by t1.userName
	offset @skipRows rows
	fetch next @pageSize rows only;

GO
/****** Object:  StoredProcedure [dbo].[InitializeLeaveApplication]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[InitializeLeaveApplication]
	@applicantUserName nvarchar(50)
AS
set nocount on
declare @trackingRef nvarchar(50)
if not exists (select * from LeaveApplicationData t1 where t1.progress = '0000'
								and t1.applicantUserName = @applicantUserName)
begin
	set @trackingRef = dbo.udfInitAppID();
	insert into LeaveApplicationData(trackingRef, applicantUserName, createdAt, isValid, progress, finalStatus)
		values (@trackingRef, @applicantUserName, CONVERT(varchar(10), getdate(), 23), 0, '0000', 1);
	update t1 set t1.applicantDeptCode = t2.userDeptCode, t1.applicantTitleCode = t2.userTitleCode
	from LeaveApplicationData t1 inner join userInfo t2 on t1.applicantUserName = t2.userName
	where t1.trackingRef = @trackingRef;
end
select t1.*, t2.userFullname as applicantUserFullName from LeaveApplicationData t1 
	inner join userInfo t2 on t1.applicantUserName = t2.userName

	where t1.progress = '0000' and t1.applicantUserName = @applicantUserName;
select leaveCode from leaveTypeInfo
select holidayDate from holiday where isEnabled = 1
select * from SysParam
GO
/****** Object:  StoredProcedure [dbo].[LeaveDeductionByAdmin]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[LeaveDeductionByAdmin]
	@applicantUserName nvarchar(50),
	@leaveCode nvarchar(50),
	@applicantDescription nvarchar(50),
	@fromTime nvarchar(50),
	@toTime nvarchar(50),
	@status nvarchar(50) out,
	@message nvarchar(50) out
	--000: thanh cong
	--001: sai user
	--002: vuot gioi han nghi
AS
set nocount on;
set @message = ''
declare @timeConsumed int;
declare @isValid bit;
declare @trackingRef nvarchar(50)
if not exists (select * from userInfo 
				where userName = @applicantUserName)
		set @status = '001';

--if not exists (select * from leaveTypeInfo
--				where @leaveCode = @leaveCode)
--		set @status = '001';

set @trackingRef = dbo.udfInitAppID();

begin transaction
insert into LeaveApplicationData(trackingRef, applicantUserName, createdAt, isValid, progress, finalStatus, approverUserName, approverCommand)
		values (@trackingRef, @applicantUserName, convert(nvarchar(20),GETDATE(),23), 0, '0002', 1, 'sysadmin', '0000');
update t1 set t1.applicantDeptCode = t2.userDeptCode, t1.applicantTitleCode = t2.userTitleCode
	from LeaveApplicationData t1 inner join userInfo t2 on t1.applicantUserName = t2.userName
	where t1.trackingRef = @trackingRef;
update t1 set t1.fromTime = @fromTime, t1.toTime = @toTime, 
		t1.timeConsumed = dbo.CalculateWorkHour(@fromTime, @toTime),
		t1.applicantDescription = @applicantDescription,
		t1.leaveCode = @leaveCode
		from LeaveApplicationData t1
		where t1.trackingRef = @trackingRef;
set @isValid = dbo.ValidateApp(@trackingRef);
IF @isValid = 1
begin
	update t1 SET
		t1.isValid = 1, t1.createdByAdmin = 1, t1.approverDescription = 'Created By Admin / Admin tạo'
		from LeaveApplicationData t1
		where t1.trackingRef = @trackingRef;
	set @status = '000'
	set @message = @trackingRef
	commit transaction
end
else
begin
	rollback transaction;
	set @status = '002'
end
GO
/****** Object:  StoredProcedure [dbo].[LeaveLimitSummary]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[LeaveLimitSummary]
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS
declare @tempTable Table  (
    [userName]             NVARCHAR (50) NOT NULL,
    [userPass]             NVARCHAR (64) NULL,
    [userFullname]         NVARCHAR (50) NULL,
    [userDeptCode]         NVARCHAR (50) NULL,
    [userTitleCode]        NVARCHAR (50) NULL,
    [userEmail]            NVARCHAR (50) NULL,
    [userEnabled]          BIT           DEFAULT ((1)) NULL,
    [userFailedLoginCount] INT           DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([userName] ASC)
);
declare @sql nvarchar(max) = 'select * from userInfo where userTitleCode <> ' + char(39) + '0000' + char(39) + ' and ' + @condition
insert into @tempTable exec(@sql)
set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return
If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
begin
	SELECT leaveCode from leaveTypeInfo;
	SELECT * FROM @tempTable WHERE userTitleCode <> '0000';
	SELECT * FROM leaveLimit;
	return
end	
SELECT leaveCode from leaveTypeInfo;
SELECT t1.* FROM @tempTable t1 order by t1.userName offset 
	@skipRows rows 
	fetch next @pageSize rows only;
SELECT t1.* FROM leaveLimit t1 inner join @tempTable t2 on t1.userName = t2.userName;
GO
/****** Object:  StoredProcedure [dbo].[LeaveSummaryPivot]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[LeaveSummaryPivot]

AS
--DECLARE @Columns as NVARCHAR(MAX)
--SELECT @Columns = COALESCE(@Columns + ', ','') + QUOTENAME(leaveCode)
--FROM
--   (SELECT DISTINCT t1.leaveCode
--    FROM  leaveLimit t1
--   ) AS B
--   ORDER BY B.leaveCode
--DECLARE @SQL as NVARCHAR(MAX)
--SET @SQL = 'SELECT userName, ' + @Columns + '
--FROM
--(SELECT * FROM
-- leaveLimit
--) as PivotData
--PIVOT
--(
--   SUM(limit)
--   FOR leaveCode IN (' + @Columns + ')
--) AS PivotResult
--ORDER BY userName'
--EXEC(@SQL)
SELECT leaveCode from leaveTypeInfo;
SELECT * FROM userInfo WHERE userTitleCode <> '0000';
SELECT * FROM leaveLimit;

GO
/****** Object:  StoredProcedure [dbo].[RemoveHoliday]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[RemoveHoliday]
	@date nvarchar(10),
	@description nvarchar(50),
	@status nvarchar (50) out

	-- 000: thành công
	-- 002: không tồn tại record
AS
if not exists (select * from holiday where holidayDate = @date and isEnabled = 1)
	begin
	set @status = '002'
	return
	end

update t1 set t1.isEnabled = 0 from holiday t1 where t1.holidayDate = @date
set @status = '000'

GO
/****** Object:  StoredProcedure [dbo].[ShowLeaveBalance]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ShowLeaveBalance]
	@userName nvarchar(50),
	@reportYear nvarchar(10),
	@status nvarchar(50) out
AS
DECLARE @balanceSummary TABLE
(
	leaveCode nvarchar(50),
	limit nvarchar(50),
	used nvarchar(50),
	pending nvarchar(50),
	balance nvarchar(50)
)

INSERT INTO @balanceSummary (leaveCode, limit) SELECT leaveCode, cast(limit as nvarchar(50)) as limit FROM leaveLimit where userName = @userName;

UPDATE t1 SET t1.balance = 'x' FROM @balanceSummary t1 WHERE t1.limit is null

UPDATE t1 SET t1.used = cast(isnull(t2.total,0) as nvarchar(50))
FROM @balanceSummary t1
INNER JOIN 
(SELECT SUM(ISNULL(timeConsumed, 0)) AS total , leaveCode 
	FROM LeaveApplicationData 
	WHERE applicantUserName = @userName AND approverCommand = '0000' 
	AND progress = '0002' and finalStatus = 1
	AND LEFT(fromTime,4) = @reportYear
	GROUP BY leaveCode) t2
ON t1.leaveCode = t2.leaveCode

UPDATE t1 SET t1.used = '0'
FROM @balanceSummary t1
LEFT JOIN 
(SELECT SUM(ISNULL(timeConsumed, 0)) AS total , leaveCode 
	FROM LeaveApplicationData 
	WHERE applicantUserName = @userName AND approverCommand = '0000' 
	AND progress = '0002' and finalStatus = 1
	AND LEFT(fromTime,4) = @reportYear
	GROUP BY leaveCode) t2
ON t1.leaveCode = t2.leaveCode
WHERE t2.leaveCode IS NULL


UPDATE t1 SET t1.pending = cast(isnull(t2.total,0) as nvarchar(50))
FROM @balanceSummary t1
INNER JOIN 
(SELECT SUM(ISNULL(timeConsumed, 0)) AS total , leaveCode 
	FROM LeaveApplicationData 
	WHERE applicantUserName = @userName
	AND progress = '0001' and finalStatus = 1
	AND LEFT(fromTime,4) = @reportYear
	GROUP BY leaveCode) t2
ON t1.leaveCode = t2.leaveCode

UPDATE t1 SET t1.pending = '0'
FROM @balanceSummary t1
LEFT JOIN 
(SELECT SUM(ISNULL(timeConsumed, 0)) AS total , leaveCode 
	FROM LeaveApplicationData 
	WHERE applicantUserName = @userName
	AND progress = '0001' and finalStatus = 1
	AND LEFT(fromTime,4) = @reportYear
	GROUP BY leaveCode) t2
ON t1.leaveCode = t2.leaveCode
WHERE t2.leaveCode IS NULL

UPDATE t1 SET t1.balance = 
cast(dbo.GetMax((cast(t1.limit as bigint) - 
cast(t1.used as bigint) - 
cast(t1.pending as bigint)),0) as nvarchar(50))
FROM @balanceSummary t1
WHERE t1.balance is null
UPDATE t1 SET t1.balance = null FROM @balanceSummary t1 where t1.balance = 'x'
SELECT * FROM @balanceSummary

set @status = '000'
GO
/****** Object:  StoredProcedure [dbo].[SubmitLeaveApplication]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[SubmitLeaveApplication]
	@trackingRef nvarchar(50),
	@applicantUserName nvarchar(50),
	@leaveCode nvarchar(50),
	@applicantDescription nvarchar(50),
	@fromTime nvarchar(50),
	@toTime nvarchar(50),
	@status nvarchar(50) out

	-- 000: pass
	-- 002: vuot gioi han
	-- 001: không tồn tại trackingRef hoặc bị vô hiệu

AS
set nocount on;
declare @hourRequired int;
declare @validStatus bit;
if not exists (select * from LeaveApplicationData 
				where @trackingRef = @trackingRef and applicantUserName = @applicantUserName and progress = '0000' and finalStatus = 1)
				begin
				set @status = '001'  -- không tìm thấy yêu cầu nghỉ phép
				return
				end;
update t1 set t1.fromTime = @fromTime, t1.toTime = @toTime, 
		t1.timeConsumed = dbo.CalculateWorkHour(@fromTime, @toTime),
		t1.applicantDescription = @applicantDescription,
		t1.leaveCode = @leaveCode
		from LeaveApplicationData t1
		where t1.trackingRef = @trackingRef;
set @validStatus = dbo.ValidateApp(@trackingRef);
IF @validStatus = 1
begin
	update t1 SET t1.progress = '0001',
		t1.isValid = 1
		from LeaveApplicationData t1
		where t1.trackingRef = @trackingRef;
	set @status = '000';
end
else
	set @status = '002';
GO
/****** Object:  StoredProcedure [dbo].[ValidateLogin]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[ValidateLogin]
	@userName nvarchar(50),
	@userPass nvarchar(50),
	@status nvarchar(50) out,
	
	-- 000: pass
	-- 001: user bị khóa do vượt quá số lần đăng nhập sai
	-- 002: không tồn tại user hoặc bị vô hiệu
	-- 003: fail
	@message nvarchar(50) out
	-- số lần còn lại
AS
declare @failLoginCount int
set @message = ''
if not exists (select * from userInfo t1 where t1.userName = @userName and t1.userEnabled = 1)
	begin
		set @status = '002'
		return
	end
if not exists (select * from userInfo t1 where t1.userName = @userName and t1.userFailedLoginCount < 10)
	begin
		set @status = '001'
		return
	end
set @failLoginCount = (select t1.userFailedLoginCount from userInfo t1 where t1.userName = @userName)
if exists (select * from userInfo t1 where t1.userName = @userName and t1.userPass = dbo.hashPW(@userPass, @userName))
	begin
		update t1 set t1.userFailedLoginCount = 0 from userInfo t1 where t1.userName = @userName
		set @status = '000'
		select * from userInfo t1 where t1.userName = @userName
		return
	end
else
	begin
		set @failLoginCount = @failLoginCount + 1
		set @status = '003'
		set @message = CONVERT(nvarchar(50), 10 - @failLoginCount)
		update t1 set t1.userFailedLoginCount = @failLoginCount from userInfo t1 where t1.userName = @userName
	end


GO
/****** Object:  Trigger [dbo].[userInfoDeleteTrigger]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TRIGGER [dbo].[userInfoDeleteTrigger]
	ON [dbo].[userInfo]
AFTER DELETE
AS
BEGIN
	delete t1 from leaveLimit t1 inner join deleted t2 on t1.userName = t2.userName
END

GO
/****** Object:  Trigger [dbo].[userInfoInsertTrigger]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE TRIGGER [dbo].[userInfoInsertTrigger]
	ON [dbo].[userInfo]
FOR INSERT
AS
BEGIN
	insert into leaveLimit select t1.userName, t2.leaveCode, t2.defaultLimit as limit from inserted t1, leaveTypeInfo t2
END


GO
/****** Object:  Trigger [dbo].[userInfoUpdateTrigger]    Script Date: 3/30/2020 1:41:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TRIGGER [dbo].[userInfoUpdateTrigger]
	ON [dbo].[userInfo]
AFTER Update
AS
BEGIN

declare @userName nvarchar(50) = (select userName from inserted)
declare @oldDept nvarchar(50) = (select userDeptCode from deleted)
declare @newDept nvarchar(50) = (select userDeptCode from inserted)
declare @oldTitle nvarchar(50) = (select userTitleCode from deleted)
declare @newTitle nvarchar(50) = (select userTitleCode from inserted)
if @oldTitle <> @newTitle or @oldDept <> @newDept

update t1 set t1.finalStatus = 0, t1.progress = '0002' from LeaveApplicationData t1 where
t1.applicantUserName = @userName and t1.progress in ('0000','0001')

END
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[RestorePassword]
	@userName nvarchar(50),
	@status nvarchar(50) out,
	@message nvarchar(50) out,
	@message2 nvarchar(50) out
	--002 khong ton tai user
AS
BEGIN
set @status = '002'
if not exists (select * from userInfo where userName = @userName and userTitleCode <> '0000') return

declare @password nvarchar(50) = (select right(userPass,6) from userInfo where userName = @userName)

update t1 set t1.userPass = dbo.hashPW(@password, @userName) from userInfo t1 where t1.userName = @userName

set @message = @password;
set @message2 = (select userEmail from userInfo where userName = @userName);
set @status = '000'
END
GO