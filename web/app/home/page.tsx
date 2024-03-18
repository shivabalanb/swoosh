"use client"; // This is a client component 👈🏽
import React, { useEffect, useState } from "react";

import HomeHeader from "../components/HomeHeader";
import HomeGroup from "../components/HomeGroup";
import { readSwooshContract } from "../util";
import { useAddress } from "@thirdweb-dev/react";
import PageWrapper from "../components/PageWrapper";

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

  const [resultOut, setResultOut] = useState<Request[]>([]);
  const [resultIn, setResultIn] = useState<Request[]>([]);
  const [resultInLength, setResultInLength] = useState<number>();
  useEffect(() => {
    let sum = 0;
    resultIn.map((res) => {
      if (res.debtors.includes(user_address as string)) {
        sum++;
      }
    });
    setResultInLength(sum);
  }, [resultIn]);
  let result = readSwooshContract(
    "getRequestsOut",
    [user_address],
    setResultOut
  );
  result = readSwooshContract("getRequestsIn", [user_address], setResultIn);

  if (result.isLoading) return <p>Loading ...</p>;
  if (result.error) return <p>Error: {result.error.message}</p>;

  return (
    <div>
      <HomeHeader />
      <HomeGroup
        inNumber={resultInLength as number}
        outNumber={resultOut.length}
      />
    </div>
  );
}

export default PageWrapper(HomePage, "SWOOSH");
