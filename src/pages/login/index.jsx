import React from "react";
import { Navigate, useLoaderData } from "react-router";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  const { isAuthenticated } = useLoaderData();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4 py-48">
      <LoginForm />
    </div>
  );
}
