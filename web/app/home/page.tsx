"use client"; // This is a client component 👈🏽
import React, { useEffect, useState } from "react";

import HomeGroup from "../components/HomeGroup";
import { readSwooshContract } from "../util";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import PageWrapper from "../components/PageWrapper";
import { RawRequest } from "../requests_in/page";

interface Request {
  id: string;
  creditor: string;
  debtors: string[];
  paid: any[]; // Adjust the type according to what `paid` actually contains
  declined: any[]; // Same here, adjust the type as necessary
  amount: string;
  message: string;
  imageURI: string;
  timestamp: string;
  fulfilled: boolean;
  cancelled: boolean;
}

function HomePage() {
  const user_address = useAddress();
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [numInLen, setNumInLen] = useState(0);
  const [numOutLen, setNumOutLen] = useState(0);

  let {
    data: outData,
    isLoading: outIsLoading,
    error: outError,
  } = useContractRead(contract, "getRequestsOut", [user_address]);

  let {
    data: inData,
    isLoading: inIsLoading,
    error: inError,
  } = useContractRead(contract, "getRequestsIn", [user_address]);

  useEffect(() => {
    if (inData) {
      let a = 0;
      inData.map((p: RawRequest) => {
        if (p.debtors.includes(user_address as string) && p.paid.length == 0) {
          a += 1;
        }
      });
      setNumInLen(a);
    }
  }, [inData]);

  useEffect(() => {
    if (outData) {
      let a = 0;
      outData.map((p: RawRequest) => {
        if (p.creditor==(user_address as string) && p.paid.length == 0) {
          a += 1;
        }
      });
      setNumOutLen(a);
    }
  }, [outData]);

  console.log("OUT",outData);

  let truncated = user_address?.slice(0, 4) + "..." + user_address?.slice(-3);

  if (outIsLoading || inIsLoading) return <p>Please Wait...</p>;

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-12 text-5xl">
        <p>Hello,</p>
        <b>{user_address != undefined ? truncated : "--"}!</b>
      </div>
      <HomeGroup inNumber={numInLen} outNumber={numOutLen} />
    </div>
  );
}

export default PageWrapper(HomePage, "SWOOSH");
