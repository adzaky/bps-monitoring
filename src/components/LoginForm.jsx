import React from "react";
import supabase from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";

export default function LoginForm({ className }) {
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const user = data.user;
      if (user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed Login", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex min-w-2xl flex-col gap-6", className)}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Selamat Datang Kembali</CardTitle>
          <CardDescription>Masuk dengan akun anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="admin@bps.go.id" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input id="password" type="password" name="password" required />
              </div>
              <Button type="submit">{!isLoading ? "Masuk" : "Loading..."}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
