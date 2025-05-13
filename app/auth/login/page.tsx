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
          email: response.email,
        })
      );

      router.push("/");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AuthLayout>
        {/* Left side */}
        <BlueContainer
          title="Don't have an account?"
          subtitle="Sign up now to unlock your dashboard, manage your workspace, and stay connected effortlessly."
          buttonText="SIGN Up"
          buttonLink="/auth/signup"
          imageSrc="/Auth/log.svg"
        />

        {/* Right side */}
        <FormContainer title="Log in to your account">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4"
          >
            <FormInput
              id="email"
              type="email"
              label="Email"
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

            <div className="flex justify-end">
              <Link href="/auth/forgot-password">
                <p className="text-sm text-[#5995fd] hover:underline">
                  Forgot your password?
                </p>
              </Link>
            </div>

            <div className="flex justify-center">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </div>
          </form>
        </FormContainer>
      </AuthLayout>
    </>
  );
};

export default Login;
