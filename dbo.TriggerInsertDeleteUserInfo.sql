CREATE TRIGGER [userInfoInsertDeleteTrigger]
	ON [dbo].[userInfo]
AFTER UPDATE, INSERT, DELETE 
AS
BEGIN
SET NOCOUNT ON;
DECLARE @Activity  NVARCHAR (50)
IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
BEGIN
    SET @Activity = 'UPDATE'
END

-- insert
IF EXISTS (SELECT * FROM inserted) AND NOT EXISTS(SELECT * FROM deleted)
BEGIN
    SET @Activity = 'INSERT'
END

-- delete
IF EXISTS (SELECT * FROM deleted) AND NOT EXISTS(SELECT * FROM inserted)
BEGIN
    SET @Activity = 'DELETE'
END

IF @Activity = 'INSERT'
	insert into leaveLimit select t1.userName, t2.leaveCode, t2.defaultLimit as limit from inserted t1, leaveTypeInfo t2

IF @Activity = 'DELETE'
	delete t1 from leaveLimit t1 inner join deleted t2 on t1.userName = t2.userName

END