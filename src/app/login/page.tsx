"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (result.error) {
        toast.error(
          result.error.message ||
            "Login failed. Please check your credentials.",
        );
        return;
      }

      toast.success("Welcome back to BookNook!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch {
      toast.error("Google login failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FC] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[#EAE7F2] bg-white p-6 shadow-sm sm:p-9">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-lg font-bold text-[#29264F]"
        >
          <BookOpen className="size-6 text-[#62549A]" />
          BookNook
        </Link>

        <div className="mb-7">
          <p className="mb-2 text-sm font-medium text-[#7667AA]">
            WELCOME BACK
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-[#29264F] sm:text-3xl">
            Sign in to your account
          </h1>

          <p className="mt-2 text-sm text-[#77758A]">
            Continue your reading journey with BookNook.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={isLoading || isGoogleLoading}
              className="h-11 rounded-lg border-[#E7E3F0] bg-white px-3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
                disabled={isLoading || isGoogleLoading}
                className="h-11 rounded-lg border-[#E7E3F0] bg-white px-3 pr-11"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#858198] hover:text-[#62549A]"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              disabled={isLoading || isGoogleLoading}
              className="border-[#CFC7E2] data-[state=checked]:border-[#62549A] data-[state=checked]:bg-[#62549A]"
            />

            <Label
              htmlFor="rememberMe"
              className="cursor-pointer text-sm font-normal text-[#77758A]"
            >
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="h-11 w-full rounded-lg bg-[#62549A] font-semibold text-white hover:bg-[#514481]"
          >
            {isLoading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#EAE7F2]" />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-[#9290A2]">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className="h-11 w-full rounded-lg border-[#E7E3F0] bg-white font-medium text-[#393650] hover:bg-[#F8F6FC]"
        >
          {isGoogleLoading ? (
            "Connecting to Google..."
          ) : (
            <>
              <svg
                viewBox="0 0 48 48"
                className="mr-2 size-5"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.06 13.22l7.98 6.19C11.93 13.72 17.45 9.5 24 9.5Z"
                  transform="translate(0 5)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.93 46.98 31.88 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.03 28.59A14.4 14.4 0 0 1 9.25 24c0-1.59.27-3.13.78-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 2.58 10.78l7.45-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.45-4.89 2.3-8.18 2.3-6.55 0-12.08-4.22-14.06-9.97l-7.98 6.19C6.41 42.62 14.62 48 24 48Z"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-[#77758A]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#62549A] hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
