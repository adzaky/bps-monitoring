import React from "react";
import { Loader } from "lucide-react";

function Loading({ size = 64 }) {
  return <Loader size={size} className="animate-spin text-blue-900" />;
}

export { Loading };
