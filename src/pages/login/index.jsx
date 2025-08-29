import React from "react";
import { Navigate } from "react-router";
import { useAuthSession } from "@/hooks/use-queries";
import { Loading } from "@/components/ui/loading";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  const { isAuthenticated, isPending } = useAuthSession();

  if (isPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4 py-48">
      <LoginForm />
    </div>
  );
}
