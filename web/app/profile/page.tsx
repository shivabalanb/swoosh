"use client";

import ProfileBalanceCard from "../components/ProfileBalanceCard";
import React from "react";
import profile_icon from "../assets/logo.svg";
import Image from "next/image";
import {
  ConnectWallet,
  toWei,
  useAddress,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import PageWrapper from "../components/PageWrapper";

const ProfilePage = () => {
  return (
    <div className="flex flex-col">
      <ProfileBalanceCard />
    </div>
  );
};

export default PageWrapper(ProfilePage, "PROFILE");
