import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Database, Play, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from "lucide-react";
import { useWorkflow } from "@/hooks/use-workflow";

export function WorkflowCard({ workflowId, workflowName, workflowDescription, color }) {
  const { workflowRun, isTriggering, isPolling, error, progress, isLoading, triggerWorkflow } = useWorkflow(workflowId);

  const formatDuration = (start, end) => {
    const duration = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    if (duration < 60) return `${duration} detik`;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes} menit ${seconds} detik`;
  };

  const getStatusIcon = (status, conclusion) => {
    if (status === "completed") {
      if (conclusion === "success") {
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      } else if (conclusion === "failure") {
        return <XCircle className="h-4 w-4 text-red-500" />;
      } else if (conclusion === "cancelled") {
        return <XCircle className="h-4 w-4 text-gray-500" />;
      }
    } else if (status === "in_progress") {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    } else if (status === "queued") {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const getStatusBadge = (status, conclusion) => {
    if (status === "completed") {
      if (conclusion === "success") {
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Berhasil</Badge>;
      } else if (conclusion === "failure") {
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gagal</Badge>;
      } else if (conclusion === "cancelled") {
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Dibatalkan</Badge>;
      }
    } else if (status === "in_progress") {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sedang berjalan</Badge>;
    } else if (status === "queued") {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>;
    }
    return <Badge variant="secondary">Belum ada proses</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className={`h-5 w-5 text-${color}-600`} />
            <CardTitle className="text-lg">{workflowName}</CardTitle>
          </div>
          {workflowRun && getStatusIcon(workflowRun.status, workflowRun.conclusion)}
        </div>
        <CardDescription>{workflowDescription}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && !workflowRun && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">Memuat data workflow...</span>
          </div>
        )}

        <Button
          onClick={triggerWorkflow}
          disabled={isTriggering || isPolling}
          className="w-full cursor-pointer"
          size="sm"
        >
          {isTriggering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menjalankan...
            </>
          ) : isPolling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sedang berjalan...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Jalankan Workflow
            </>
          )}
        </Button>

        {isTriggering && (
          <div className="space-y-2">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Mempersiapkan workflow...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="-mt-0.5" />
            <AlertTitle className="text-xs">{error}</AlertTitle>
          </Alert>
        )}

        {workflowRun && (
          <div className="space-y-3 border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              {getStatusBadge(workflowRun.status, workflowRun.conclusion)}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Run #:</span>
                <span className="font-mono">#{workflowRun.run_number}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Mulai:</span>
                <span>{new Date(workflowRun.created_at).toLocaleString()}</span>
              </div>

              {workflowRun.status === "completed" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durasi:</span>
                  <span>{formatDuration(workflowRun.created_at, workflowRun.updated_at)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {workflowRun?.status === "in_progress" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              <span className="text-sm font-medium text-blue-900">Workflow sedang berjalan...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
