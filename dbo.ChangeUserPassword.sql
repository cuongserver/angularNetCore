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