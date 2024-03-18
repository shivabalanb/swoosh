"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import Swoosh from "../components/Swoosh";
import { readSwooshContract } from "../util";
import { useAddress, useContract } from "@thirdweb-dev/react";
import PageWrapper from "../components/PageWrapper";

interface RequestOutHeaderGroupProp {
  userBalance: number;
  owned: number;
}

function formatNumber(num: number): string {
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

    const formattedNumber = (num / divisor).toFixed(2) + unit;
    return formattedNumber;
  }
}

const RequestOutHeaderGroup = (props: RequestOutHeaderGroupProp) => {
  return (
    <div className="sticky bg-red-300 border-b-2  top-28 z-10   flex w-full rounded-lg bg-gray">
      <div className="w-full p-3 px-4">
        <p>Owed</p>
        <p className="py-4 text-5xl font-semibold">
          ${formatNumber(Number(props.owned) / Math.pow(10, 18))}
        </p>
      </div>
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

const RequestOutGroup = () => {
  const user_address = useAddress();
  const [resultOut, setResultOut] = useState<Request[]>([]);

  let result = readSwooshContract(
    "getRequestsOut",
    [user_address],
    setResultOut
  );
  let dataResult = [];
  for (let i = 0; i < resultOut.length; i++) {
    dataResult.push({
      title: resultOut[i].message,
      percent:
        resultOut[i].paid.length /
        (resultOut[i].debtors.length + resultOut[i].paid.length),
      href: "/requests_out/" + i,
    });
  }
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      {dataResult.map((request) => (
        <Swoosh
          img=""
          onClick={() => console.log("PAY MONEY")}
          percent={request.percent * 100}
          title={request.title}
          href={request.href}
        />
      ))}
    </div>
  );
};

const RequestsOutPage = () => {
  const [deposit, setDeposit] = useState();
  const user_address = useAddress();
  const [resultOut, setResultOut] = useState<Request[]>([]);
  const [userBalance, setUserBalance] = useState<number>();
  const [owned, setOwned] = useState<Number>();

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
  let result = readSwooshContract(
    "getRequestsOut",
    [user_address],
    setResultOut
  );
  let sum = 0;
  for (let i = 0; i < resultOut.length; i++) {
    sum += Number(resultOut[i].amount) * resultOut[i].debtors.length;
  }
  return (
    <div>
      <RequestOutHeaderGroup userBalance={userBalance as number} owned={sum} />

      <RequestOutGroup />
    </div>
  );
};

export default PageWrapper(RequestsOutPage, "SWOOSH OUT");
