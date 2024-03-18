"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { readSwooshContract } from "../util";
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";

interface RequestInHeaderGroupProp {
  balance: number;
  owed: number;
}

interface RequestInData {
  title: string;
  amount: string;
  debtors: string[];
  paid: string[];
  // result: number;
  id: number;
}

export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toFixed(2);
  } else {
    let divisor = 1;
    let unit = "";

    if (num >= 1e9) {
      divisor = 1e9;
      unit = "b";
    } else if (num >= 1e6) {
      divisor = 1e6;
      unit = "m";
    } else if (num >= 1e3) {
      divisor = 1e3;
      unit = "k";
    }

    const formattedNumber = (num / divisor).toFixed(1) + unit;
    return formattedNumber;
  }
}

const openSwooshModal = () => {
  var swooshModal = document.getElementById(
    "swoosh_modal"
  ) as HTMLDialogElement;
  if (swooshModal) {
    swooshModal.showModal();
  }
};

const closeSwooshModal = () => {
  var swooshModal = document.getElementById(
    "swoosh_modal"
  ) as HTMLDialogElement;
  if (swooshModal) {
    swooshModal.close();
  }
};

const RequestInHeaderGroup = (props: RequestInHeaderGroupProp) => {
  return (
    <div className="flex w-full rounded-lg bg-gray">
      <div className="w-full p-3 px-4">
        <p>Owe</p>
        <p className="py-4 text-4xl font-semibold">
          ${formatNumber(Number(props.owed) / Math.pow(10, 18))}
        </p>
        <div className="flex justify-center">
          {/* <Button title="Swoosh!" href={'/'} variant="Custom" onClick={() => openSwooshModal()} /> */}
        </div>
      </div>
    </div>
  );
};

const RequestInGroup = () => {
  const user_address = useAddress();
  const [resultOut, setResultOut] = useState<Request[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  let { contract } = useContract(process.env.CONTRACT_ADDRESS);
  // let []
  readSwooshContract("getRequestsIn", [user_address], setResultOut);
  let data: RequestInData[] = [];
  resultOut.map((result) => {
    data.push({
      title: result.message,
      amount: result.amount,
      debtors: result.debtors,
      paid: result.paid,
      id: parseInt(result.id),
    });
  });

  const { mutateAsync, isLoading, error } = useContractWrite(
    contract,
    "acceptAll"
  );
  async function submit() {
    // e.preventDefault()
    // alert(1);
    mutateAsync({
      args: [],
    });
  }
  const { contract: acceptCon } = useContract(process.env.CONTRACT_ADDRESS);
  let {
    mutateAsync: acceptMutateAsync,
    isLoading: acceptIsLoading,
    error: acceptError,
  } = useContractWrite(contract, "accept");
  return (
    <div className=" mt-8d grid max-h-screen grid-cols-2 gap-4 overflow-y-auto">
      {resultOut.map((request, index) =>
        !request.paid.includes(user_address as string) ? (
          // <Swoosh
          //   key={index}
          //   onClick={() => {
          //     acceptMutateAsync({ args: [request.id] });
          //     setSelectedId(request.id);
          //   }}
          //   img=""
          //   title={request.message}
          //   href={''}
          //   variant="button"
          //   amount={
          //     acceptIsLoading && request.id == selectedId
          //       ? -1
          //       : Number((Number(request.amount) / Math.pow(10, 18)).toFixed(2))
          //   }
          //   percent={(request.paid.length / (request.debtors.length + request.paid.length)) * 100}
          // />
          <p>2</p>
        ) : null
      )}

      <dialog id="swoosh_modal" className="modal">
        <div className="h-1/8 font-Inter modal-box w-11/12 max-w-xl bg-blue-300 text-white md:h-1/5 ">
          <p className="font-Inter pb-4 text-center font-semibold text-white">
            Confirm to pay back all your Swooshes
          </p>
          <div>
            <div className="flex flex-row justify-evenly gap-4 pt-6">
              {/* <Button
                href={""}
                title="Cancel"
                variant={"Custom"}
                onClick={() => closeSwooshModal()}
              />
              <Button
                href={""}
                title="Confirm"
                variant={"Custom"}
                onClick={() => submit()}
              ></Button> */}
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

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

const Wrapper = () => {
  const user_address = useAddress();
  const [deposit, setDeposit] = useState("");
  const [resultOut, setResultOut] = useState<Request[]>([]);
  const [userBalance, setUserBalance] = useState<number>();
  let { contract } = useContract(process.env.CONTRACT_ADDRESS);
  useEffect(() => {
    if (user_address !== undefined) {
      contract?.call("getBalance", [user_address]).then((data) => {
        console.log(data);
        // Assuming data can be converted to a number directly. You might need additional parsing.
        const balance = Number(data);
        setUserBalance(balance);
      });
    }
  }, [user_address]);
  // setUserBalance(result.data);
  readSwooshContract("getRequestsIn", [user_address], setResultOut);
  let sum = 0;
  for (let i = 0; i < resultOut.length; i++) {
    if (resultOut[i].debtors.includes(user_address as string)) {
      sum += Number(resultOut[i].amount);
    }
  }

  return (
    <div className="rounded-sm flex h-screen flex-col overflow-y-hidden px-4 pb-24">
      <div className="sticky top-0 z-10 w-full bg-white pb-4">
        <RequestInHeaderGroup balance={userBalance as number} owed={sum} />
      </div>
      <div className="h-3/5 w-full overflow-y-scroll">
        <RequestInGroup />
      </div>
    </div>
  );
};

export default Wrapper;
