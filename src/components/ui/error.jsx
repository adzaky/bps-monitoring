import { AlertTriangle, RefreshCw, Wifi, Database, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const errorConfig = {
  network: {
    icon: Wifi,
    title: "Kesalahan Koneksi",
    description: "Tidak dapat memuat data tabel. Silakan periksa koneksi internet Anda.",
  },
  database: {
    icon: Database,
    title: "Kesalahan Database",
    description: "Ada masalah saat mengakses database. Silakan coba lagi.",
  },
  timeout: {
    icon: Clock,
    title: "Waktu Permintaan Habis",
    description: "Permintaan memakan waktu terlalu lama untuk diselesaikan. Silakan coba lagi.",
  },
  generic: {
    icon: AlertTriangle,
    title: "Kesalahan Memuat Data",
    description: "Ada yang salah saat memuat data tabel.",
  },
};

const sizeConfig = {
  sm: {
    container: "p-4",
    icon: "h-8 w-8",
    title: "text-sm font-medium",
    description: "text-xs",
    button: "h-8 px-3 text-xs",
  },
  md: {
    container: "p-6",
    icon: "h-12 w-12",
    title: "text-base font-semibold",
    description: "text-sm",
    button: "h-9 px-4 text-sm",
  },
  lg: {
    container: "p-8",
    icon: "h-16 w-16",
    title: "text-lg font-semibold",
    description: "text-base",
    button: "h-10 px-6",
  },
};

const Error = ({ error, type = "generic", title, description, onRetry, showRetry = true, className, size = "md" }) => {
  const config = errorConfig[type];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  // Extract error message if error is provided
  const errorMessage = error ? (typeof error === "string" ? error : error.message) : null;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <Card className={cn("border-destructive/20 bg-destructive/5", className)}>
      <CardContent className={cn("flex flex-col items-center justify-center text-center", sizeStyles.container)}>
        <div
          className={cn(
            "bg-destructive/10 mb-4 rounded-full p-3",
            size === "sm" ? "p-2" : size === "lg" ? "p-4" : "p-3"
          )}
        >
          <Icon className={cn("text-destructive", sizeStyles.icon)} />
        </div>

        <h3 className={cn("text-foreground mb-2", sizeStyles.title)}>{displayTitle}</h3>

        <p className={cn("text-muted-foreground mb-4 max-w-sm text-balance", sizeStyles.description)}>
          {displayDescription}
        </p>

        {errorMessage && (
          <details className="mb-4 w-full max-w-md">
            <summary
              className={cn("text-muted-foreground hover:text-foreground cursor-pointer", sizeStyles.description)}
            >
              Show error details
            </summary>
            <pre
              className={cn(
                "bg-muted text-muted-foreground mt-2 overflow-auto rounded-md p-2 text-left font-mono",
                size === "sm" ? "text-xs" : "text-xs"
              )}
            >
              {errorMessage}
            </pre>
          </details>
        )}

        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className={cn("gap-2", sizeStyles.button)}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export { Error };
