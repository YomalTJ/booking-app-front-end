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

// Login form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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
      await authService.login({
        email: data.email,
        password: data.password,
      });
      router.push("/calendar-view");
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
        {/* Left side - Login form */}
        <FormContainer title="Welcome back" isMobileMargin={true}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4"
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link href="/auth/forgot-password">
                <span className="text-sm text-orange-600 hover:text-orange-700 font-semibold cursor-pointer">
                  Forgot Password?
                </span>
              </Link>
            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={isLoading} fullWidth className="cursor-pointer">
                {isLoading ? "Signing In..." : "SIGN IN"}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-600 pt-4">
              Don't have an account?{" "}
              <Link href="/auth/signup">
                <span className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer">
                  Sign up here
                </span>
              </Link>
            </p>

            {/* Beta Version 1.0.0 */}
            <div className="text-center pt-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Beta Version 1.0.0
              </span>
            </div>
          </form>
        </FormContainer>

        {/* Right side - Blue Container with Orange gradient */}
        <BlueContainer
          title="New to Coworking Cube?"
          subtitle="Sign up now to start booking meeting rooms and manage your company's bookings with ease."
          buttonText="SIGN UP"
          buttonLink="/auth/register"
          imageSrc="/Auth/login.svg"
          icon="users"
          className="hidden md:flex"
        />
      </AuthLayout>
    </>
  );
};

export default Login;
