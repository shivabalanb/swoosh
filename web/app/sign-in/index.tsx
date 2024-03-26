import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";

export default function SignInPage() {
  const BASE_ALLOWANCE = BigNumber.from("10000000000000000000000");
  const router = useRouter();
  const address = useAddress();
  const { contract } = useContract(process.env.NEXT_PUBLIC_ERC20_ADDRESS);

  const {
    data,
    isLoading: allowance_isLoading,
    error: allowance_error,
  } = useContractRead(contract, "allowance", [
    address,
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  ]);

  let [userAllowance, setUserAllowance] = useState<BigNumber | undefined>(
    undefined
  );

  const {
    mutateAsync,
    isLoading: approve_isLoading,
    error: approve_error,
  } = useContractWrite(contract, "approve");

  useEffect(() => {
    if (data != undefined) {
      setUserAllowance(data);
      if (data.eq(BASE_ALLOWANCE)) {
        router.push("/home");
      }
    }
  }, [address, data]);

  const handleApprove = () => {
    mutateAsync({
      args: [
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        BASE_ALLOWANCE.toString(),
      ],
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center ">
      <h1 className=" mb-32 text-6xl tracking-widest text-blue-700 ">SWOOSH</h1>
      <div className="w-64 flex flex-col justify-center gap-2 ">
        <ConnectWallet
          modalSize="wide"
          hideSwitchToPersonalWallet={true}
          hideSendButton={true}
          hideReceiveButton={true}
        />
        {address != undefined && (
          <button
            className=" p-4  bg-blue-100 rounded-lg"
            onClick={handleApprove}
          >
            {approve_isLoading || userAllowance?.eq(BASE_ALLOWANCE)
              ? "Loading..."
              : "Approve USDC"}
          </button>
        )}
      </div>
    </div>
  );
}
