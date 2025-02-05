SELECT 
    job.name AS JobName,
    job.job_id,
    job.enabled,
    activity.run_requested_date,
    activity.last_executed_step_id,
    activity.stop_execution_date,
    activity.job_history_id
FROM msdb.dbo.sysjobs AS job
LEFT JOIN msdb.dbo.sysjobs_view AS job_view ON job.job_id = job_view.job_id
LEFT JOIN msdb.dbo.sysjobactivity AS activity ON job.job_id = activity.job_id
WHERE activity.run_requested_date IS NOT NULL;
