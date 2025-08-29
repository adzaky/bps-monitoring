import LoginForm from "@/components/LoginForm";
import React from "react";
import { Navigate } from "react-router";
import { useAuthSession } from "@/hooks/use-queries";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function Login() {
  const { data: session, isLoading } = useAuthSession();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (session) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4 py-48">
      <LoginForm />
    </div>
  );
}
