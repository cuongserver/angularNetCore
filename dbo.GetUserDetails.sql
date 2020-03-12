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