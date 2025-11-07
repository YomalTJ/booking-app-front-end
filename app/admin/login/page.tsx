"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster } from "react-hot-toast";
import { Shield } from "lucide-react";

import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/auth/Button";
import { adminService } from "@/services/adminService";

const adminLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type AdminLoginInputs = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (adminService.isAuthenticated()) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginInputs>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit: SubmitHandler<AdminLoginInputs> = async (data) => {
    setIsLoading(true);
    try {
      await adminService.login({
        username: data.username,
        password: data.password,
      });

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <AuthLayout>
        {/* Left side - Admin branding */}
        <div
          className="w-full md:w-1/2 text-white flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

          <div className="max-w-md text-center relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="bg-white/10 p-6 rounded-full backdrop-blur-sm">
                <Shield className="w-20 h-20" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Admin Portal
            </h2>
            <p className="text-sm md:text-base text-blue-100">
              Secure access to manage bookings, rooms, and users. Monitor system
              activity and maintain platform operations.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
        <FormContainer title="Admin Login">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-md space-y-5"
          >
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-sm text-blue-700 font-medium">
                <Shield className="inline w-4 h-4 mr-2" />
                Authorized personnel only
              </p>
            </div>

            <FormInput
              id="username"
              type="text"
              label="Username"
              placeholder="Enter admin username"
              register={register("username")}
              error={errors.username?.message}
            />

            <FormInput
              id="password"
              type="password"
              label="Password"
              placeholder="Enter admin password"
              register={register("password")}
              error={errors.password?.message}
            />

            <div className="flex justify-center pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Access Dashboard"}
              </Button>
            </div>
          </form>
        </FormContainer>
      </AuthLayout>
    </>
  );
};

export default AdminLogin;
