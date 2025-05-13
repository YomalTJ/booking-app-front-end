import React from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import FormContainer from "@/components/auth/FormContainer";
import BlueContainer from "@/components/auth/BlueContainer";
import FormInput from "@/components/auth/FormInput";
import Button from "@/components/auth/Button";

const ForgotPassword = () => {
  return (
    <AuthLayout>
      {/* Left side - Form */}
      <FormContainer title="Forgot password">
        <form className="w-full max-w-md space-y-4">
          <FormInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email address"
          />

          <div className="flex justify-center">
            <Button className="md:w-64">Email password reset link</Button>
          </div>
        </form>
      </FormContainer>

      {/* Right side - Blue section */}
      <BlueContainer
        title="Or, return to"
        buttonText="Log In"
        buttonLink="/auth/login"
        imageSrc="/Auth/register.svg"
      />
    </AuthLayout>
  );
};

export default ForgotPassword;
