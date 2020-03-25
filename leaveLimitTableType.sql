USE [LMS]
GO

/****** Object:  UserDefinedTableType [dbo].[userTableType]    Script Date: 3/25/2020 3:49:57 PM ******/
CREATE TYPE [dbo].[leaveLimitTableType] AS TABLE(
	[userName]  NVARCHAR (50) NULL,
    [leaveCode] NVARCHAR (50) NULL,
    [limit]     INT           NULL
)
GO


