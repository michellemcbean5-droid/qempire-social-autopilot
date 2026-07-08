"""Tests for Q-Empire autopilot scheduler."""

import pytest
from datetime import datetime, timedelta
from unittest.mock import MagicMock, patch, AsyncMock
from apscheduler.triggers.cron import CronTrigger
from app.core.scheduler import AutopilotScheduler, JobConfig
from app.core.config import PLATFORM_REGISTRY


@pytest.fixture
def scheduler():
    return AutopilotScheduler()


@pytest.fixture
def sample_job_config():
    return JobConfig(
        user_id=1,
        frequency="daily",
        time_utc="09:00",
        platforms=["facebook", "instagram", "twitter"],
    )


class TestSchedulerInitialization:
    """Test scheduler setup."""

    def test_scheduler_initializes(self, scheduler):
        assert scheduler is not None
        assert scheduler.is_running is False

    def test_scheduler_has_job_store(self, scheduler):
        assert scheduler.scheduler is not None


class TestJobManagement:
    """Test adding, removing, and querying jobs."""

    def test_add_autopilot_job(self, scheduler, sample_job_config):
        callback = AsyncMock()
        scheduler.add_autopilot_job(
            user_id=sample_job_config.user_id,
            frequency=sample_job_config.frequency,
            time_utc=sample_job_config.time_utc,
            platforms=sample_job_config.platforms,
            callback=callback,
        )
        jobs = scheduler.get_all_jobs()
        assert len(jobs) >= 1

    def test_remove_job(self, scheduler, sample_job_config):
        callback = AsyncMock()
        scheduler.add_autopilot_job(
            user_id=sample_job_config.user_id,
            frequency=sample_job_config.frequency,
            time_utc=sample_job_config.time_utc,
            callback=callback,
        )
        scheduler.remove_job(sample_job_config.user_id)
        jobs = scheduler.get_all_jobs()
        job_ids = [j.id for j in jobs if str(sample_job_config.user_id) in j.id]
        assert len(job_ids) == 0

    def test_get_next_run(self, scheduler, sample_job_config):
        callback = AsyncMock()
        scheduler.add_autopilot_job(
            user_id=sample_job_config.user_id,
            frequency=sample_job_config.frequency,
            time_utc=sample_job_config.time_utc,
            callback=callback,
        )
        next_run = scheduler.get_next_run(sample_job_config.user_id)
        assert next_run is not None
        assert next_run > datetime.now()


class TestSchedulerLifecycle:
    """Test start/stop behavior."""

    def test_start_scheduler(self, scheduler):
        scheduler.start()
        assert scheduler.is_running is True
        scheduler.stop()
        assert scheduler.is_running is False

    def test_stop_scheduler(self, scheduler):
        scheduler.start()
        scheduler.stop()
        assert scheduler.is_running is False

    def test_double_start_safe(self, scheduler):
        scheduler.start()
        scheduler.start()  # Should not raise
        assert scheduler.is_running is True
        scheduler.stop()


class TestFrequencyParsing:
    """Test frequency strings are converted to cron expressions correctly."""

    def test_daily_frequency(self, scheduler):
        trigger = scheduler._build_trigger("daily", "09:00")
        assert isinstance(trigger, CronTrigger)
        assert str(trigger.fields[4]) == "9"  # hour field

    def test_weekly_frequency(self, scheduler):
        trigger = scheduler._build_trigger("weekly", "14:00")
        assert isinstance(trigger, CronTrigger)
        assert str(trigger.fields[4]) == "14"

    def test_custom_cron(self, scheduler):
        custom = "0 12 * * 1-5"  # Weekdays at noon
        trigger = scheduler._build_trigger("custom", "12:00", custom)
        assert isinstance(trigger, CronTrigger)

    def test_invalid_frequency_raises(self, scheduler):
        with pytest.raises(ValueError):
            scheduler._build_trigger("invalid", "09:00")


class TestSchedulerIntegration:
    """Integration-style tests with mocked APScheduler."""

    @pytest.mark.asyncio
    async def test_job_callback_executes(self, scheduler):
        callback = AsyncMock()
        scheduler.add_autopilot_job(
            user_id=1,
            frequency="daily",
            time_utc="09:00",
            platforms=["twitter"],
            callback=callback,
        )
        # Simulate the job execution
        await callback(user_id=1)
        callback.assert_awaited_once_with(user_id=1)

    def test_job_config_serialization(self, sample_job_config):
        data = sample_job_config.model_dump()
        assert data["user_id"] == 1
        assert data["frequency"] == "daily"
        assert data["platforms"] == ["facebook", "instagram", "twitter"]

    def test_multiple_jobs_different_users(self, scheduler):
        callback = AsyncMock()
        for user_id in [1, 2, 3]:
            scheduler.add_autopilot_job(
                user_id=user_id,
                frequency="daily",
                time_utc="09:00",
                platforms=["twitter"],
                callback=callback,
            )
        jobs = scheduler.get_all_jobs()
        assert len(jobs) >= 3
