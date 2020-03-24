CREATE PROCEDURE [dbo].[LeaveLimitSummary]
	@pageSize bigint,
	@requestPage bigint,
	@getAll nvarchar(3),
	@condition nvarchar(max),
	@collectionSize bigint out,
	@activePage bigint out
AS
declare @tempTable Table  (
    [userName]             NVARCHAR (50) NOT NULL,
    [userPass]             NVARCHAR (64) NULL,
    [userFullname]         NVARCHAR (50) NULL,
    [userDeptCode]         NVARCHAR (50) NULL,
    [userTitleCode]        NVARCHAR (50) NULL,
    [userEmail]            NVARCHAR (50) NULL,
    [userEnabled]          BIT           DEFAULT ((1)) NULL,
    [userFailedLoginCount] INT           DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([userName] ASC)
);
declare @sql nvarchar(max) = 'select * from userInfo where userTitleCode <> ' + char(39) + '0000' + char(39) + ' and ' + @condition
insert into @tempTable exec(@sql)
set @collectionSize = (select count(*) from @tempTable t1)
set @activePage = @requestPage
if @collectionSize = 0 return
If @activePage*@pageSize > @collectionSize
	SET @activePage = CEILING(Convert(Decimal(10,0),@collectionSize)/Convert(Decimal(10,0),@pageSize));
declare @skipRows bigint = (@activePage - 1)*@pageSize;
if @getAll = 'yes'
begin
	SELECT leaveCode from leaveTypeInfo;
	SELECT * FROM userInfo WHERE userTitleCode <> '0000';
	SELECT * FROM leaveLimit;
end	
SELECT leaveCode from leaveTypeInfo;
SELECT t1.* FROM @tempTable t1 order by t1.userName offset 
	@skipRows rows 
	fetch next @pageSize rows only;
SELECT t1.* FROM leaveLimit t1 inner join @tempTable t2 on t1.userName = t2.userName;
