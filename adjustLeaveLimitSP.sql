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