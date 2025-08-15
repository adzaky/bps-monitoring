import LoginForm from "@/components/LoginForm";
import React from "react";

export default function Login() {
  return (
    <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4">
      <LoginForm />
    </main>
  );
}
