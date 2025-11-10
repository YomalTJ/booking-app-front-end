"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster } from "react-hot-toast";

import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import BlueContainer from "@/components/auth/BlueContainer";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/auth/Button";
import { authService } from "@/services/auth-service";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.name,
          companyName: response.companyName,
          email: response.email,
        })
      );

      // Force page refresh to update navbar
      router.push("/");
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AuthLayout>
        {/* Left side - Blue Container with Orange gradient */}
        <BlueContainer
          title="Don't have an account?"
          subtitle="Sign up now to unlock your dashboard, manage your workspace, and stay connected effortlessly."
          buttonText="SIGN UP"
          buttonLink="/auth/signup"
          imageSrc="/Auth/log.svg" // Keeping for backward compatibility
          icon="users" // or "rocket" for login
        />

        {/* Right side - Form */}
        <FormContainer title="Log in to your account">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-5"
          >
            <FormInput
              id="email"
              type="email"
              label="Email Address"
              placeholder="Enter your email address"
              register={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              register={register("password")}
              error={errors.password?.message}
            />

            {/* <div className="flex justify-end">
              <Link href="/auth/forgot-password">
                <p className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
                  Forgot your password?
                </p>
              </Link>
            </div> */}

            <div className="flex justify-center pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
              Don't have an account?{" "}
              <Link href="/auth/signup">
                <span className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer">
                  Sign up here
                </span>
              </Link>
            </p>
          </form>
        </FormContainer>
      </AuthLayout>
    </>
  );
};

export default Login;
