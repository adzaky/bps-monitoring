import React from "react";
import { Loader } from "lucide-react";

function LoadingScreen({ size = 64 }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <Loader size={size} className="animate-spin text-blue-900" />
    </div>
  );
}

export { LoadingScreen };
