CREATE PROCEDURE [dbo].[GetHolidayWithPaging]
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS

declare @tempTable Table  (
    [holidayDate]             NVARCHAR (50) NOT NULL,
    [description]             NVARCHAR (64) NULL,
    [isEnabled]         Bit NULL,
    PRIMARY KEY CLUSTERED ([holidayDate] ASC)
);

declare @sql nvarchar(max) = 'select * from holiday where [isEnabled] <> 0'

insert into @tempTable exec(@sql)

set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return

If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
	begin
	select t1.* from @tempTable t1 
	order by t1.holidayDate
	return
	end

select t1.* from @tempTable t1 
	order by t1.holidayDate
	offset @skipRows rows
	fetch next @pageSize rows only;
