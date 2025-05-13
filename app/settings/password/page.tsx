"use client";

import React from "react";
import SettingsLayout from "@/components/settings/SettingsLayout";
import PasswordForm from "@/components/settings/PasswordForm";

const PasswordPage = () => {
  return (
    <SettingsLayout activeTab="password">
      <PasswordForm />
    </SettingsLayout>
  );
};

export default PasswordPage;