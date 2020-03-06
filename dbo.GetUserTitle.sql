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
