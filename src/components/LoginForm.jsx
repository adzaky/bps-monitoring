import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "@/lib/supabase";

export default function LoginForm() {
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
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex flex-col items-center justify-center gap-2">
        <img src="/logo-bps.png" alt="BPS Monitoring" width={72} height={72} />
        <span className="text-center text-xl leading-5 font-medium text-blue-700">
          <strong className="text-2xl text-blue-900">Monitoring</strong>
          <br />
          Badan Pusat Statistik
        </span>
      </div>
      <Card>
        <CardHeader className="pb-2 text-center">
          <CardTitle className="text-2xl font-bold text-blue-900">Selamat Datang Kembali</CardTitle>
          <CardDescription className="text-blue-600">Masuk dengan akun anda</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleLogin}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email" className="font-medium text-blue-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@bps.go.id"
                  required
                  className="border-blue-200 bg-blue-50/50 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password" className="font-medium text-blue-900">
                  Kata Sandi
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="border-blue-200 bg-blue-50/50 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
              <Button
                type="submit"
                className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/30"
              >
                {!isLoading ? "Masuk" : "Loading..."}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
