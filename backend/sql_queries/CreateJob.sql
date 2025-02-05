USE db_akakce;
GO


EXEC sp_add_job 
    @job_name = 'activity_log_clear',
    @enabled = 1,
    @description = 'Günlük olarak eski activity_logs kayýtlarýný temizler.',
    @start_step_id = 1,
    @category_name = 'Database Maintenance',
    @owner_login_name = 'sa';
GO


EXEC sp_add_jobstep 
    @job_name = 'activity_log_clear',
    @step_name = 'activity_clear',
    @subsystem = 'TSQL',
    @command = N'
        DELETE FROM [db_akakce].[User].[activity_logs]
        WHERE [log_date] < CAST(GETDATE() AS DATE);
    ',
    @on_success_action = 1, 
    @on_fail_action = 2;    
GO

EXEC sp_add_jobschedule 
    @job_name = 'activity_log_clear',
    @name = 'clear_schedule',
    @freq_type = 4, 
    @freq_interval = 1, 
    @active_start_time = 24000; 
GO


EXEC sp_add_jobserver 
    @job_name = 'activity_log_clear',
    @server_name = @@SERVERNAME;
GO
