CREATE TYPE [dbo].[user] AS TABLE(
    [userName]             NVARCHAR (50) NOT NULL,
    [userPass]             NVARCHAR (64) NULL,
    [userFullname]         NVARCHAR (50) NULL,
    [userDeptCode]         NVARCHAR (50) NULL,
    [userTitleCode]        NVARCHAR (50) NULL,
    [userEmail]            NVARCHAR (50) NULL 
)