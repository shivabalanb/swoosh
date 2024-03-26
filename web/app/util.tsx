"use client"; // This is a client component 👈🏽
import React, { useEffect, useState } from "react";
import HomeGroup from "./components/HomeGroup";
import { useContract, useContractRead } from "@thirdweb-dev/react";

// USDC address : 0x42f243d53e2368A8e6d3C8E1eA97dBC7889377f1
// swosh contract : 0x39A23022abF01500ae70B0c1774D41525A266c0C


export function readSwooshContract(
  functionName: string,
  args: any[],
  setResult: any
): readSwooshContractReturn {
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  const { data, isLoading, error } = useContractRead(
    contract,
    functionName,
    args
  );

  useEffect(() => {
    if (data != null) {
      const typedData = data; // Cast the data to the correct typ
      setResult(typedData);
    }
  }, [data]);
  let result = {
    data: data,
    isLoading: isLoading,
    error: error,
  };
  return result;
}

export function readSwooshContractAndOnlyGetResult(
  functionName: string,
  args: any[]
) {
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const { data, isLoading, error } = useContractRead(
    contract,
    functionName,
    args
  );
  return data;
}

export interface readSwooshContractReturn {
  data: any;
  isLoading: boolean;
  error: any;
}
