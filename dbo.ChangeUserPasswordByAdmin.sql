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