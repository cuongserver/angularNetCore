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
