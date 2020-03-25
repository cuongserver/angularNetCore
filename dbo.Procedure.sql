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