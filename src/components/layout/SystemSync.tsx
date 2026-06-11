"use client";

import { useEffect } from "react";
import { useHealth, useReadiness, useSchedulerStatus } from "@/hooks/useData";
import { useSystemStore } from "@/lib/store";

export function SystemSync() {
  const health = useHealth();
  const readiness = useReadiness();
  const scheduler = useSchedulerStatus();
  const setBackendOnline = useSystemStore((s) => s.setBackendOnline);
  const setDbOnline = useSystemStore((s) => s.setDbOnline);
  const setSchedulerRunning = useSystemStore((s) => s.setSchedulerRunning);

  useEffect(() => {
    setBackendOnline(health.isSuccess);
    setDbOnline(Boolean(health.data?.db_online));
  }, [health.isSuccess, health.data?.db_online, setBackendOnline, setDbOnline]);

  useEffect(() => {
    if (health.isError) {
      setBackendOnline(false);
      setDbOnline(false);
    }
  }, [health.isError, setBackendOnline, setDbOnline]);

  useEffect(() => {
    if (scheduler.isSuccess) {
      setSchedulerRunning(Boolean(scheduler.data?.running));
      return;
    }
    if (readiness.isSuccess) {
      setSchedulerRunning(Boolean(readiness.data?.checks?.scheduler_ok));
    }
  }, [
    scheduler.isSuccess,
    scheduler.data?.running,
    readiness.isSuccess,
    readiness.data?.checks?.scheduler_ok,
    setSchedulerRunning,
  ]);

  return null;
}
