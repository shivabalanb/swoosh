"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { readSwooshContract } from "../util";
import {
  shortenAddress,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import PageWrapper from "../components/PageWrapper";
import { BigNumber, ethers } from "ethers";
import { Card, CardBody, CardHeader, Heading, useToast } from "@chakra-ui/react";

export interface Request {
  title: string;
  amount: BigNumber;
  creditor: string;
  debtors: string[];
  paid: string[];
  // result: number;
  id: number;
}

export interface RawRequest {
  id: string;
  creditor: string;
  debtors: string[];
  paid: any[];
  declined: any[];
  amount: BigNumber;
  message: string;
  imageURI: string;
  timestamp: string;
  fulfilled: boolean;
  cancelled: boolean;
}

const Header = (props: { owe: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full rounded-lg bg-sky-100 p-4 mb-12">
      <p>You Owe</p>
      <p className="py-4 text-4xl font-semibold">{props.owe} TEST</p>
    </div>
  );
};

const Requests = (props: { data: Request[] }) => {
  const toast = useToast()
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  let {
    mutateAsync: acceptMutateAsync,
    isLoading: acceptIsLoading,
    error: acceptError,
  } = useContractWrite(contract, "accept");
  console.log("REQUEST", props.data);

  function submitPay(p:Request){
    acceptMutateAsync({ args: [p.id] }).then(() => {
      toast({
        title: "Pay Successful!",
        status: "success",
        position: "bottom",
      });
    })
    .catch((error) => {
      console.log(error);

      toast({
        title: "Pay Unsuccessful.",
        status: "error",
        position: "bottom",
      });
    });
  }

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {props.data.map((p) => (
        <Card size={"lg"} style={{ minWidth: "18rem" }} className="p-4">
          <CardHeader>
            <Heading>{p.title}</Heading>
            <p className=" text-xl">
              {ethers.utils.formatEther(p.amount.toString())} TEST
            </p>
            <p>{shortenAddress(p.creditor)}</p>
          </CardHeader>
          <CardBody>
            <Button onClick={()=>submitPay(p)}>
              Pay
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

const RequestsIn = () => {
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const user_address = useAddress();

  let {
    data: inData,
    isLoading: inIsLoading,
    error: inError,
  } = useContractRead(contract, "getRequestsIn", [user_address]);

  const [oweSum, setOweSum] = useState("");
  const [data, setData] = useState<Request[]>([]);

  useEffect(() => {
    if (inData) {
      let sum = BigNumber.from("0");
      let temp: Request[] = [];

      inData.map((p: RawRequest) => {
        if (p.debtors.includes(user_address as string) && p.paid.length == 0) {
          sum = sum.add( p.amount.div(p.debtors.length));
          temp.push({
            title: p.message,
            amount: p.amount.div(p.debtors.length),
            debtors: p.debtors,
            creditor: p.creditor,
            paid: p.paid,
            id: parseInt(p.id),
          });
        }
      });
      setData([...temp]);
      setOweSum(ethers.utils.formatEther(sum));
    }
  }, [inData]);

  return (
    <div>
      <Header owe={oweSum} />
      <Requests data={data} />
    </div>
  );
};

export default PageWrapper(RequestsIn, "SWOOSH PAY");
