/****** Object:  Database [LMS]    Script Date: 3/3/2020 1:15:00 PM ******/
CREATE DATABASE [LMS]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'LMS', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.DEVSQLSERVER\MSSQL\DATA\LMS.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'LMS_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL12.DEVSQLSERVER\MSSQL\DATA\LMS_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [LMS] SET COMPATIBILITY_LEVEL = 120
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
ALTER DATABASE [LMS] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
ALTER DATABASE [LMS] SET DELAYED_DURABILITY = DISABLED 
GO
/****** Object:  UserDefinedFunction [dbo].[hashPW]    Script Date: 3/3/2020 1:15:00 PM ******/
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
/****** Object:  Table [dbo].[deptInfo]    Script Date: 3/3/2020 1:15:00 PM ******/
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
/****** Object:  Table [dbo].[userInfo]    Script Date: 3/3/2020 1:15:00 PM ******/
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
	[userEnabled] [bit] NULL DEFAULT ((1)),
	[userFailedLoginCount] [int] NULL DEFAULT ((0)),
PRIMARY KEY CLUSTERED 
(
	[userName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
INSERT [dbo].[deptInfo] ([deptCode], [deptDesc]) VALUES (N'0000', N'IT')
INSERT [dbo].[userInfo] ([userName], [userPass], [userFullname], [userDeptCode], [userTitleCode], [userEnabled], [userFailedLoginCount]) VALUES (N'sysadmin', N'0x37DC1A3C0534909B99BD5591CC4EB677C7B50924FC85BAF33487D119F4403E', N'System Admin', N'0000', N'0000', 1, 0)
ALTER TABLE [dbo].[userInfo]  WITH CHECK ADD  CONSTRAINT [FK_userInfo_deptInfo] FOREIGN KEY([userDeptCode])
REFERENCES [dbo].[deptInfo] ([deptCode])
GO
ALTER TABLE [dbo].[userInfo] CHECK CONSTRAINT [FK_userInfo_deptInfo]
GO
/****** Object:  StoredProcedure [dbo].[ValidateLogin]    Script Date: 3/3/2020 1:15:00 PM ******/
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
ALTER DATABASE [LMS] SET  READ_WRITE 
GO
