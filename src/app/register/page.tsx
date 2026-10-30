"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  LibraryBig,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
      toast.error(
        "Password must contain uppercase, lowercase and at least 6 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Registration failed. Please try again.",
        );
        return;
      }

      toast.success("Your BookNook account has been created!");

      router.push("/");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF9FC] px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-[#EAE7F2] bg-white shadow-[0_20px_70px_rgba(49,43,91,0.08)] lg:grid-cols-2">
        {/* Left side - Welcome section */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#29264F] p-12 text-white lg:flex">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#A99AE8]/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#D9C9F5]/15 blur-3xl" />

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-white/15">
              <BookOpen className="size-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">BookNook</span>
          </Link>

          <div className="relative z-10 my-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-[#E5DDFB]">
              <Sparkles className="size-4" />A little space for big stories
            </div>

            <h1 className="max-w-md text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
              Every great story begins with a new chapter.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-[#D6D1E9]">
              Discover wonderful books, explore new ideas and make reading a
              part of your everyday life.
            </p>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#29264F] bg-[#DCCDF7] text-sm font-semibold text-[#29264F]">
                  B
                </div>
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#29264F] bg-[#F2D9D0] text-sm font-semibold text-[#29264F]">
                  N
                </div>
                <div className="flex size-10 items-center justify-center rounded-full border-2 border-[#29264F] bg-[#D5E6DE] text-sm font-semibold text-[#29264F]">
                  K
                </div>
              </div>
              <p className="text-sm text-[#D6D1E9]">
                Your next favorite book is waiting.
              </p>
            </div>
          </div>

          <p className="relative z-10 text-sm text-[#BDB6D8]">
            © 2026 BookNook. Made for book lovers.
          </p>
        </section>

        {/* Right side - Registration form */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-9 inline-flex items-center gap-2 text-xl font-bold text-[#29264F] lg:hidden"
            >
              <BookOpen className="size-6" />
              BookNook
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#F0ECFA] text-[#62549A]">
                <LibraryBig className="size-6" />
              </div>

              <p className="mb-2 text-sm font-semibold tracking-wide text-[#7667AA]">
                START YOUR READING JOURNEY
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-[#29264F]">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#77758A]">
                Join BookNook and discover a world of stories.
              </p>
            </div>

            <Card className="border-0 bg-transparent p-0 shadow-none">
              <CardHeader className="sr-only">
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  Register for your BookNook account.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#393650]">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl border-[#E7E3F0] bg-[#FCFBFE] px-4 focus-visible:border-[#8876C5] focus-visible:ring-[#8876C5]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#393650]">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className="h-12 rounded-xl border-[#E7E3F0] bg-[#FCFBFE] px-4 focus-visible:border-[#8876C5] focus-visible:ring-[#8876C5]/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#393650]">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        className="h-12 rounded-xl border-[#E7E3F0] bg-[#FCFBFE] px-4 pr-12 focus-visible:border-[#8876C5] focus-visible:ring-[#8876C5]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-[#858198] transition hover:text-[#62549A]"
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-[#858198]">
                      At least 6 characters, including uppercase and lowercase
                      letters.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#393650]">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Enter your password again"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        disabled={isLoading}
                        className="h-12 rounded-xl border-[#E7E3F0] bg-[#FCFBFE] px-4 pr-12 focus-visible:border-[#8876C5] focus-visible:ring-[#8876C5]/20"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-[#858198] transition hover:text-[#62549A]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl bg-[#62549A] text-base font-semibold text-white shadow-md shadow-[#62549A]/15 transition hover:bg-[#514481]"
                  >
                    {isLoading ? (
                      "Creating account..."
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="mt-7 text-center text-sm text-[#77758A]">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[#62549A] transition hover:text-[#43366F] hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
