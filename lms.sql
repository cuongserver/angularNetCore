USE [LMS]
GO
/****** Object:  Trigger [userInfoInsertTrigger]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TRIGGER [dbo].[userInfoInsertTrigger]
GO
/****** Object:  Trigger [userInfoDeleteTrigger]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TRIGGER [dbo].[userInfoDeleteTrigger]
GO
ALTER TABLE [dbo].[userInfo] DROP CONSTRAINT [FK_userInfo_titleInfo]
GO
ALTER TABLE [dbo].[userInfo] DROP CONSTRAINT [FK_userInfo_deptInfo]
GO
ALTER TABLE [dbo].[userInfo] DROP CONSTRAINT [DF__userInfo__userFa__2A4B4B5E]
GO
ALTER TABLE [dbo].[userInfo] DROP CONSTRAINT [DF__userInfo__userEn__29572725]
GO
ALTER TABLE [dbo].[holiday] DROP CONSTRAINT [DF__holiday__isEnabl__4CA06362]
GO
/****** Object:  View [dbo].[LeaveSummaryView01]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP VIEW [dbo].[LeaveSummaryView01]
GO
/****** Object:  Table [dbo].[userInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TABLE [dbo].[userInfo]
GO
/****** Object:  Table [dbo].[titleInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TABLE [dbo].[titleInfo]
GO
/****** Object:  Table [dbo].[leaveTypeInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TABLE [dbo].[leaveTypeInfo]
GO
/****** Object:  Table [dbo].[leaveLimit]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TABLE [dbo].[leaveLimit]
GO
/****** Object:  Table [dbo].[holiday]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TABLE [dbo].[holiday]
GO
/****** Object:  Table [dbo].[deptInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TABLE [dbo].[deptInfo]
GO
/****** Object:  UserDefinedFunction [dbo].[hashPW]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP FUNCTION [dbo].[hashPW]
GO
/****** Object:  StoredProcedure [dbo].[ValidateLogin]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[ValidateLogin]
GO
/****** Object:  StoredProcedure [dbo].[RemoveHoliday]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[RemoveHoliday]
GO
/****** Object:  StoredProcedure [dbo].[LeaveSummaryPivot]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[LeaveSummaryPivot]
GO
/****** Object:  StoredProcedure [dbo].[LeaveLimitSummary]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[LeaveLimitSummary]
GO
/****** Object:  StoredProcedure [dbo].[GetUserWithPaging]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[GetUserWithPaging]
GO
/****** Object:  StoredProcedure [dbo].[GetUserTitle]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[GetUserTitle]
GO
/****** Object:  StoredProcedure [dbo].[GetUserNoFilter]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[GetUserNoFilter]
GO
/****** Object:  StoredProcedure [dbo].[GetUserDetails]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[GetUserDetails]
GO
/****** Object:  StoredProcedure [dbo].[GetTitleAndDeptList]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[GetTitleAndDeptList]
GO
/****** Object:  StoredProcedure [dbo].[GetHolidayWithPaging]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[GetHolidayWithPaging]
GO
/****** Object:  StoredProcedure [dbo].[EditUserInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[EditUserInfo]
GO
/****** Object:  StoredProcedure [dbo].[ChangeUserPasswordByAdmin]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[ChangeUserPasswordByAdmin]
GO
/****** Object:  StoredProcedure [dbo].[ChangeUserPassword]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[ChangeUserPassword]
GO
/****** Object:  StoredProcedure [dbo].[AddNewUser]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[AddNewUser]
GO
/****** Object:  StoredProcedure [dbo].[AddNewHoliday]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP PROCEDURE [dbo].[AddNewHoliday]
GO
/****** Object:  UserDefinedTableType [dbo].[userTableType]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP TYPE [dbo].[userTableType]
GO
USE [master]
GO
/****** Object:  Database [LMS]    Script Date: 3/24/2020 6:04:30 PM ******/
DROP DATABASE [LMS]
GO
/****** Object:  Database [LMS]    Script Date: 3/24/2020 6:04:30 PM ******/
CREATE DATABASE [LMS]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LMS2', FILENAME = N'C:\Users\cuongnd\LMS2.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'LMS2_log', FILENAME = N'C:\Users\cuongnd\LMS2_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [LMS].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [LMS] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [LMS] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [LMS] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [LMS] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [LMS] SET ARITHABORT OFF 
GO
ALTER DATABASE [LMS] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [LMS] SET AUTO_CREATE_STATISTICS ON 
GO
ALTER DATABASE [LMS] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [LMS] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [LMS] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [LMS] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [LMS] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [LMS] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [LMS] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [LMS] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [LMS] SET  DISABLE_BROKER 
GO
ALTER DATABASE [LMS] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [LMS] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [LMS] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [LMS] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [LMS] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [LMS] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [LMS] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [LMS] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [LMS] SET  MULTI_USER 
GO
ALTER DATABASE [LMS] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [LMS] SET DB_CHAINING OFF 
GO
ALTER DATABASE [LMS] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [LMS] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
USE [LMS]
GO
/****** Object:  UserDefinedTableType [dbo].[userTableType]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[AddNewHoliday]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[AddNewUser]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[ChangeUserPassword]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[ChangeUserPasswordByAdmin]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[EditUserInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[GetHolidayWithPaging]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[GetTitleAndDeptList]    Script Date: 3/24/2020 6:04:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[GetTitleAndDeptList]

AS
select * from deptInfo
select * from titleInfo where titleCode <> '0000'

GO
/****** Object:  StoredProcedure [dbo].[GetUserDetails]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[GetUserNoFilter]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[GetUserTitle]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[GetUserWithPaging]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[LeaveLimitSummary]    Script Date: 3/24/2020 6:04:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[LeaveLimitSummary]

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
/****** Object:  StoredProcedure [dbo].[LeaveSummaryPivot]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[RemoveHoliday]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  StoredProcedure [dbo].[ValidateLogin]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  UserDefinedFunction [dbo].[hashPW]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  Table [dbo].[deptInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  Table [dbo].[holiday]    Script Date: 3/24/2020 6:04:30 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[holiday](
	[holidayDate] [nvarchar](10) NOT NULL,
	[description] [nvarchar](50) NULL,
	[isEnabled] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[holidayDate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  Table [dbo].[leaveLimit]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  Table [dbo].[leaveTypeInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  Table [dbo].[titleInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  Table [dbo].[userInfo]    Script Date: 3/24/2020 6:04:30 PM ******/
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
	[userEnabled] [bit] NULL,
	[userFailedLoginCount] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[userName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
/****** Object:  View [dbo].[LeaveSummaryView01]    Script Date: 3/24/2020 6:04:30 PM ******/
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
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-01', N'tết dương lịch', 1)
GO
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-22', N'tet am lich', 1)
GO
INSERT [dbo].[holiday] ([holidayDate], [description], [isEnabled]) VALUES (N'2020-01-23', N'tet am lich', 1)
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
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user02', N'0x050FF5BBA3CBC87BC893F824BD29223D216A92CB09560CAAF41864187E8870', N'Messi', N'0001', N'0003', N'user02@gmail.com', 1, 0)
GO
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEmail], [userEnabled], [userFailedLoginCount]) VALUES (N'user03', N'0xC26817C95C0C379840B7C6C9E2370C681BAB52186981E99639F60F27E042A4', N'Mbappe', N'0000', N'0003', N'host@gmail.com', 1, 0)
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
ALTER TABLE [dbo].[holiday] ADD  DEFAULT ((1)) FOR [isEnabled]
GO
ALTER TABLE [dbo].[userInfo] ADD  DEFAULT ((1)) FOR [userEnabled]
GO
ALTER TABLE [dbo].[userInfo] ADD  DEFAULT ((0)) FOR [userFailedLoginCount]
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
/****** Object:  Trigger [dbo].[userInfoDeleteTrigger]    Script Date: 3/24/2020 6:04:30 PM ******/
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
/****** Object:  Trigger [dbo].[userInfoInsertTrigger]    Script Date: 3/24/2020 6:04:30 PM ******/
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
USE [master]
GO
ALTER DATABASE [LMS] SET  READ_WRITE 
GO
