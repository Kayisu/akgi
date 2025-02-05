
-- pw update
CREATE TRIGGER trg_LogPasswordUpdate
ON [User].[users]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    
    IF UPDATE([password])
    BEGIN
        INSERT INTO [User].[activity_logs] ([user_id], [activity], [log_date])
        SELECT
            INSERTED.user_id,
            'Þifre güncelleme iþlemi.',
            GETDATE()
        FROM INSERTED;
    END
END;

-- email update
CREATE TRIGGER trg_LogEmailUpdate
ON [User].[users]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;

 
    IF UPDATE([email])
    BEGIN
        INSERT INTO [User].[activity_logs] ([user_id], [activity], [log_date])
        SELECT
            INSERTED.user_id,
            'Email güncelleme iþlemi.',
            GETDATE()
        FROM INSERTED;
    END
END;

CREATE PROCEDURE LogLoginActivity
    @UserID INT,
    @Activity NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [User].[activity_logs] (user_id, activity, log_date)
    VALUES (@UserID, @Activity, GETDATE());
END;