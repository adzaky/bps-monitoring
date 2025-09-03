import React from "react";
import { Loading } from "./loading";

function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Loading />
    </div>
  );
}

export { LoadingScreen };
