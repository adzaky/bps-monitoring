import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowCard } from "@/components/WorkflowCard";
import { WORKFLOWS } from "@/constants/workflow";

export default function EkstraksiData() {
  return (
    <div className="mx-auto w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Menu Ekstraksi Data</h1>
        <p className="text-muted-foreground">Kelola dan pantau otomasi ekstraksi data</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {WORKFLOWS.map((workflow) => (
          <WorkflowCard
            key={workflow.id}
            workflowId={workflow.id}
            workflowName={workflow.name}
            workflowDescription={workflow.description}
            icon={workflow.icon}
            color={workflow.color}
          />
        ))}
      </div>

      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Panduan Cepat</CardTitle>
          <CardDescription>Cara menggunakan otomasi ekstraksi data ini</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-primary font-medium">1.</span>
            <span>Klik "Jalankan Workflow" pada kartu mana pun untuk memicu workflow tersebut</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-medium">2.</span>
            <span>Pantau pembaruan status dan progress secara real-time</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary font-medium">3.</span>
            <span>Ekspor data rekapitulasi ke spreadsheet</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
