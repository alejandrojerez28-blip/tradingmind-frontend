"use client";

import { useEffect } from "react";
import { useHealth, useSchedulerStatus } from "@/hooks/useData";
import { useSystemStore } from "@/lib/store";

export function SystemSync() {
  const health = useHealth();
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
    setSchedulerRunning(Boolean(scheduler.data?.running));
  }, [scheduler.data?.running, setSchedulerRunning]);

  return null;
}
