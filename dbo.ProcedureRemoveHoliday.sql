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
