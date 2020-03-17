CREATE PROCEDURE [dbo].[GetTitleAndDeptList]

AS
select * from deptInfo
select * from titleInfo where titleCode <> '0000'

