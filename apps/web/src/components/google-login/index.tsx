"use client";

import { Button, Card, Spinner } from "@repo/ui/heroui";
import { useState } from "react";
import { authClient } from "#lib/auth-client";

export function GoogleLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-[420px] p-2 shadow-2xl border border-default-100 bg-background/80 backdrop-blur-xl">
        <div className="flex flex-col gap-2 items-center pb-8 pt-10 px-6">
          <div className="h-16 w-16 rounded-2xl bg-linear-to-tr from-primary/20 to-secondary/20 flex items-center justify-center mb-4 shadow-inner">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Lock Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back
          </h1>
          <p className="text-medium text-default-500 text-center max-w-[280px]">
            Sign in to access your workspace and manage your workflow.
          </p>
        </div>

        <div className="flex flex-col gap-6 px-6 pb-8">
          <Button
            onPress={handleGoogleSignIn}
            isPending={isLoading}
            className="w-full font-semibold h-14 text-medium relative overflow-hidden group bg-default-50 hover:bg-default-100 border border-default-200 transition-all duration-300 shadow-sm"
            variant="ghost"
          >
            {({ isPending }) => (
              <>
                {isPending ? (
                  <Spinner color="current" size="sm" />
                ) : (
                  <svg
                    className="w-6 h-6 mr-3"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                <span className={isPending ? "ml-2" : "text-default-700"}>
                  {isPending ? "Connecting..." : "Continue with Google"}
                </span>
              </>
            )}
          </Button>

          <div className="flex flex-col gap-4">
            <div className="relative flex items-center justify-center">
              <span className="w-full border-t border-default-200/60 absolute" />
              <div className="relative bg-background px-3 text-tiny font-medium text-default-400 uppercase tracking-widest">
                Trusted & Secure
              </div>
            </div>

            <p className="text-tiny text-default-400 text-center px-4 leading-relaxed">
              By clicking continue, you agree to our{" "}
              <a
                href="#terms-of-service"
                className="underline hover:text-default-600 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#privacy-policy"
                className="underline hover:text-default-600 transition-colors"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
