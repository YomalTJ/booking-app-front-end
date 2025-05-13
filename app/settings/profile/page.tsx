"use client";

import React from "react";
import SettingsLayout from "@/components/settings/SettingsLayout";
import ProfileForm from "@/components/settings/ProfileForm";
import DeleteAccountSection from "@/components/settings/DeleteAccountSection";

const ProfilePage = () => {
  return (
    <SettingsLayout activeTab="profile">
      <ProfileForm />
      <DeleteAccountSection />
    </SettingsLayout>
  );
};

export default ProfilePage;
