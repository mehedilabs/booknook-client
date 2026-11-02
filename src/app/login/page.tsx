"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowRight, BookOpen, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/shared/Navbar";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackURL = searchParams.get("callbackURL");
  const redirectTo =
    callbackURL?.startsWith("/") && !callbackURL.startsWith("//")
      ? callbackURL
      : "/";

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

      sessionStorage.setItem("booknook-login-success", "true");

      window.location.assign(redirectTo);
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
        callbackURL: redirectTo,
      });
    } catch {
      toast.error("Google login failed. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  const inputClass =
    "h-10 rounded-md border-[#C9D3C3] bg-white px-3 text-sm font-medium text-[#17302A] placeholder:font-normal placeholder:text-[#8A9A8F] focus-visible:border-[#17302A] focus-visible:ring-2 focus-visible:ring-[#D9A441]/40";

  const labelClass = "text-sm font-semibold text-[#17302A]";

  return (
    <>
      <Navbar />

      <main className="flex min-h-screen items-center justify-center bg-[#EEF1EA] px-4 py-6">
        <div className="w-full max-w-sm overflow-hidden rounded-md border border-[#D3DACD] bg-white">
          <div className="h-1 bg-[#D9A441]" />

          <div className="p-5 sm:p-6">
            <Link href="/" className="mb-4 inline-flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-sm bg-[#17302A]">
                <BookOpen className="size-4 text-[#D9A441]" />
              </span>
              <span className="font-serif text-lg font-bold text-[#17302A]">
                BookNook
              </span>
            </Link>

            <div className="mb-4">
              <h1 className="font-serif text-xl font-bold tracking-tight text-[#17302A] sm:text-2xl">
                Sign in to your account
              </h1>

              <p className="mt-1 text-sm text-[#5B6B61]">
                Continue your reading journey with BookNook.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className={labelClass}>
                  Email Address
                </Label>

                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                  disabled={isLoading || isGoogleLoading}
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className={labelClass}>
                  Password
                </Label>

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
                    className={`${inputClass} pr-10`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9A8F] transition-colors hover:text-[#17302A]"
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
                  className="border-[#C9D3C3] data-[state=checked]:border-[#17302A] data-[state=checked]:bg-[#17302A] data-[state=checked]:text-[#D9A441]"
                />

                <Label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm font-normal text-[#5B6B61]"
                >
                  Remember me
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="h-10 w-full rounded-md bg-[#17302A] text-sm font-semibold text-[#F3EFE3] transition-colors hover:bg-[#D9A441] hover:text-[#17302A]"
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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#DDE4D8]" />
              </div>

              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-[#5B6B61]">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="h-10 w-full rounded-md border-[#C9D3C3] bg-white text-sm font-semibold text-[#17302A] transition-colors hover:bg-[#E4EBDF]"
            >
              {isGoogleLoading ? (
                "Connecting to Google..."
              ) : (
                <>
                  <svg
                    viewBox="0 0 48 48"
                    className="mr-2 size-4"
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

            <p className="mt-4 text-center text-sm text-[#5B6B61]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#17302A] underline-offset-4 hover:text-[#4F7A63] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
