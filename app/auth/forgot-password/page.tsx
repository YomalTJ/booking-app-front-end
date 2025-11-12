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
import OtpInput from "@/components/auth/OtpInput";
import { authService } from "@/services/auth-service";

// Step 1: Email validation schema
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Step 2: OTP validation schema
const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Step 3: Password reset schema
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must include uppercase, lowercase, number, and special character (@$!%*?&)"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type EmailFormInputs = z.infer<typeof emailSchema>;
type OtpFormInputs = z.infer<typeof otpSchema>;
type ResetPasswordInputs = z.infer<typeof resetPasswordSchema>;

type ForgotPasswordStep = "email" | "otp" | "reset";

const ForgotPassword = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // Step 1: Email form
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailFormInputs>({
    resolver: zodResolver(emailSchema),
  });

  // Step 2: OTP form
  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
    setValue: setOtpValue,
  } = useForm<OtpFormInputs>({
    resolver: zodResolver(otpSchema),
  });

  // Step 3: Reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Step 1: Request OTP
  const onEmailSubmit: SubmitHandler<EmailFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await authService.requestPasswordReset(data.email);
      setEmail(data.email);
      setCurrentStep("otp");
    } catch (error) {
      console.error("Error requesting OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const onOtpSubmit: SubmitHandler<OtpFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await authService.verifyOtp(email, data.otp);
      setOtp(data.otp);
      setCurrentStep("reset");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const onResetSubmit: SubmitHandler<ResetPasswordInputs> = async (data) => {
    setIsLoading(true);
    try {
      console.log("Resetting password with:", {
        email,
        otp,
        newPassword: data.newPassword,
      });
      await authService.resetPasswordWithOtp(email, otp, data.newPassword);
      router.push("/auth/login");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp);
    setOtpValue("otp", newOtp);
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-6">
      <div className="flex items-center space-x-4">
        {["email", "otp", "reset"].map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === step
                  ? "bg-orange-600 text-white"
                  : currentStep > step
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-12 h-1 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderStepLabels = () => (
    <div className="flex justify-between text-xs text-gray-600 mb-8 px-4 gap-8">
      <span
        className={
          currentStep === "email" ? "font-semibold text-orange-600" : ""
        }
      >
        Enter Email
      </span>
      <span
        className={currentStep === "otp" ? "font-semibold text-orange-600" : ""}
      >
        Verify OTP
      </span>
      <span
        className={
          currentStep === "reset" ? "font-semibold text-orange-600" : ""
        }
      >
        New Password
      </span>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <AuthLayout>
        {/* Left side - Form */}
        <FormContainer title="Forgot password" isMobileMargin={true}>
          {renderStepIndicator()}
          {renderStepLabels()}

          {/* Step 1: Email Input */}
          {currentStep === "email" && (
            <form
              onSubmit={handleSubmitEmail(onEmailSubmit)}
              className="w-full max-w-md space-y-6"
            >
              <div className="text-center text-gray-600 mb-4">
                <p>Enter your email address to receive a verification code</p>
              </div>

              <FormInput
                id="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email address"
                register={registerEmail("email")}
                error={emailErrors.email?.message}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  fullWidth
                  className="cursor-pointer"
                >
                  {isLoading ? "Sending OTP..." : "Get OTP"}
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === "otp" && (
            <form
              onSubmit={handleSubmitOtp(onOtpSubmit)}
              className="w-full max-w-md space-y-6"
            >
              <div className="text-center text-gray-600 mb-4">
                <p>
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
                <p className="text-sm mt-2">
                  Enter the code below to verify your email
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <OtpInput onOtpChange={handleOtpChange} />
                  <input type="hidden" {...registerOtp("otp")} value={otp} />
                  {otpErrors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {otpErrors.otp.message}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                    onClick={() => authService.requestPasswordReset(email)}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  fullWidth
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {currentStep === "reset" && (
            <form
              onSubmit={handleSubmitReset(onResetSubmit)}
              className="w-full max-w-md space-y-4"
            >
              <div className="text-center text-gray-600 mb-4">
                <p>Create your new password</p>
              </div>

              <FormInput
                id="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter your new password"
                register={registerReset("newPassword")}
                error={resetErrors.newPassword?.message}
              />

              <FormInput
                id="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your new password"
                register={registerReset("confirmPassword")}
                error={resetErrors.confirmPassword?.message}
              />

              <div className="flex justify-center">
                <Button type="submit" disabled={isLoading} fullWidth>
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </form>
          )}

          {/* Back to Login */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <Link href="/auth/login">
              <span className="text-sm text-orange-600 hover:text-orange-700 font-semibold cursor-pointer">
                ← Back to Login
              </span>
            </Link>
          </div>
        </FormContainer>

        {/* Right side - Blue section */}
        <BlueContainer
          title="Or, return to"
          buttonText="Log In"
          buttonLink="/auth/login"
          imageSrc="/Auth/register.svg"
          className="hidden md:flex"
        />
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;
