CREATE TABLE [dbo].[leaveTypeInfo]
(
	[leaveCode] NVARCHAR(50) NOT NULL PRIMARY KEY, 
    [leaveDesc] NVARCHAR(50) NULL, 
    [defaultLimit] INT NULL
)
