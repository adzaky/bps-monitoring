import { useState, useEffect, useCallback } from "react";
import { githubService } from "@/services/github";

export function useWorkflow(workflowId) {
  const [runId, setRunId] = useState(null);
  const [workflowRun, setWorkflowRun] = useState(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLatestRun = useCallback(async () => {
    try {
      setIsLoading(true);
      const latestRun = await githubService.getLatestWorkflowRun(workflowId);
      if (latestRun) {
        setWorkflowRun(latestRun);
        setRunId(latestRun.id);
      }
      return latestRun;
    } catch (err) {
      console.error("Error fetching latest run:", err);
      setError("Gagal mengambil data workflow terbaru");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [workflowId]);

  const triggerWorkflow = useCallback(async () => {
    setIsTriggering(true);
    setError(null);
    setProgress(0);

    try {
      await githubService.triggerWorkflow(workflowId);
      setProgress(25);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setProgress(50);

      const latestRun = await fetchLatestRun();
      if (latestRun) {
        setProgress(100);
        setIsPolling(true);
      }
    } catch (err) {
      console.error("Error triggering workflow:", err);
      setError("Gagal menjalankan workflow. Silakan periksa konfigurasi Anda.");
    } finally {
      setIsTriggering(false);
    }
  }, [workflowId, fetchLatestRun]);

  useEffect(() => {
    fetchLatestRun();
  }, [fetchLatestRun]);

  useEffect(() => {
    if (!runId || !isPolling) return;

    const interval = setInterval(async () => {
      try {
        const run = await githubService.getWorkflowRun(runId);
        setWorkflowRun(run);

        if (run.status === "completed") {
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Error fetching workflow status:", err);
        setError("Gagal mengambil status workflow");
        setIsPolling(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [runId, isPolling]);

  return {
    workflowRun,
    isTriggering,
    isPolling,
    error,
    progress,
    isLoading,
    triggerWorkflow,
  };
}
