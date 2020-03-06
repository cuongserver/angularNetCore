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