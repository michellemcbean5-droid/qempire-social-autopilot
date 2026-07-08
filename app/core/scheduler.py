"""
Q-Empire Social Autopilot - Scheduler Engine
Manages recurring autopilot posting jobs using APScheduler.
Runs content generation and platform distribution on configured schedules.
"""

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime, timedelta
from loguru import logger
import asyncio

from app.core.config import settings


class AutopilotScheduler:
    """
    The Autopilot Scheduler manages all recurring posting jobs.
    It triggers AI content generation and distributes posts to all
    connected platforms on the configured schedule.
    """

    def __init__(self):
        self.scheduler = AsyncIOScheduler(timezone="UTC")
        self._is_running = False
        self._jobs = {}

    def start(self):
        """Start the scheduler."""
        if not self._is_running:
            self.scheduler.start()
            self._is_running = True
            logger.info("🚀 Autopilot Scheduler started")

    def stop(self):
        """Stop the scheduler."""
        if self._is_running:
            self.scheduler.shutdown(wait=False)
            self._is_running = False
            logger.info("⏹️ Autopilot Scheduler stopped")

    @property
    def is_running(self) -> bool:
        return self._is_running

    def add_autopilot_job(
        self,
        user_id: int,
        frequency: str = "daily",
        time_utc: str = "09:00",
        cron_expression: str = None,
        callback=None,
    ):
        """
        Add an autopilot posting job for a user.

        Args:
            user_id: The user's database ID
            frequency: 'hourly', 'daily', 'twice_daily', 'weekly', or 'custom'
            time_utc: Time in HH:MM format (for daily/weekly)
            cron_expression: Custom cron expression (for custom frequency)
            callback: Async function to call when job triggers
        """
        job_id = f"autopilot_{user_id}"

        # Remove existing job if any
        if job_id in self._jobs:
            self.remove_job(user_id)

        # Parse time
        hour, minute = map(int, time_utc.split(":"))

        # Create trigger based on frequency
        if frequency == "hourly":
            trigger = IntervalTrigger(hours=1)
        elif frequency == "daily":
            trigger = CronTrigger(hour=hour, minute=minute)
        elif frequency == "twice_daily":
            trigger = CronTrigger(hour=f"{hour},{(hour + 12) % 24}", minute=minute)
        elif frequency == "weekly":
            trigger = CronTrigger(day_of_week="mon", hour=hour, minute=minute)
        elif frequency == "custom" and cron_expression:
            parts = cron_expression.split()
            trigger = CronTrigger(
                minute=parts[0] if len(parts) > 0 else "*",
                hour=parts[1] if len(parts) > 1 else "*",
                day=parts[2] if len(parts) > 2 else "*",
                month=parts[3] if len(parts) > 3 else "*",
                day_of_week=parts[4] if len(parts) > 4 else "*",
            )
        else:
            trigger = CronTrigger(hour=hour, minute=minute)

        # Add the job
        job = self.scheduler.add_job(
            callback,
            trigger=trigger,
            id=job_id,
            name=f"Autopilot posting for user {user_id}",
            kwargs={"user_id": user_id},
            replace_existing=True,
            misfire_grace_time=300,  # 5 min grace period
        )

        self._jobs[job_id] = job
        logger.info(
            f"📅 Added autopilot job for user {user_id}: "
            f"frequency={frequency}, time={time_utc}"
        )
        return job

    def remove_job(self, user_id: int):
        """Remove a user's autopilot job."""
        job_id = f"autopilot_{user_id}"
        if job_id in self._jobs:
            self.scheduler.remove_job(job_id)
            del self._jobs[job_id]
            logger.info(f"🗑️ Removed autopilot job for user {user_id}")

    def pause_job(self, user_id: int):
        """Pause a user's autopilot job."""
        job_id = f"autopilot_{user_id}"
        if job_id in self._jobs:
            self.scheduler.pause_job(job_id)
            logger.info(f"⏸️ Paused autopilot job for user {user_id}")

    def resume_job(self, user_id: int):
        """Resume a user's autopilot job."""
        job_id = f"autopilot_{user_id}"
        if job_id in self._jobs:
            self.scheduler.resume_job(job_id)
            logger.info(f"▶️ Resumed autopilot job for user {user_id}")

    def get_next_run(self, user_id: int) -> datetime:
        """Get the next scheduled run time for a user."""
        job_id = f"autopilot_{user_id}"
        if job_id in self._jobs:
            job = self.scheduler.get_job(job_id)
            if job:
                return job.next_run_time
        return None

    def get_all_jobs(self) -> list:
        """Get all scheduled jobs."""
        return [
            {
                "id": job.id,
                "name": job.name,
                "next_run": str(job.next_run_time),
                "trigger": str(job.trigger),
            }
            for job in self.scheduler.get_jobs()
        ]


# Global scheduler instance
autopilot_scheduler = AutopilotScheduler()
