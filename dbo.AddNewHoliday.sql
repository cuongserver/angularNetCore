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