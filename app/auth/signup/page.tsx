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

// Registration form validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    companyName: z.string().min(1, "Company name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(/^0\d{9}$/, "Invalid phone number"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormInputs = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.register({
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
      });

      // Store token and user info
      localStorage.setItem("token", response.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.name,
          companyName: response.companyName,
          email: response.email,
        })
      );

      // Redirect to calendar view
      router.push("/");
    } catch (error) {
      // Error handling is done in authService
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AuthLayout>
        {/* Left side - Sign up form */}
        <FormContainer title="Create an account">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-4"
          >
            <FormInput
              id="name"
              type="text"
              label="Name"
              placeholder="Enter your full name"
              register={register("name")}
              error={errors.name?.message}
            />

            <FormInput
              id="companyName"
              type="text"
              label="Company Name"
              placeholder="Enter your company name"
              register={register("companyName")}
              error={errors.companyName?.message}
            />

            <FormInput
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email address"
              register={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              id="phoneNumber"
              type="tel"
              label="Phone Number"
              placeholder="Enter your phone number"
              register={register("phoneNumber")}
              error={errors.phoneNumber?.message}
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              register={register("password")}
              error={errors.password?.message}
            />

            <FormInput
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              register={register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <div className="flex justify-center">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </FormContainer>

        {/* Right side - Blue section with image */}
        <BlueContainer
          title="Already have an account ?"
          subtitle="Log in now to continue exploring your dashboard and manage your account with ease."
          buttonText="SIGN IN"
          buttonLink="/auth/login"
          imageSrc="/Auth/register.svg"
        />
      </AuthLayout>
    </>
  );
};

export default Register;
