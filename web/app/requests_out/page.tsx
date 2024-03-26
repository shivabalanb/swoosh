"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { readSwooshContract } from "../util";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import PageWrapper from "../components/PageWrapper";
import { BigNumber, ethers } from "ethers";
import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import { Request, RawRequest } from "../requests_in/page";

const Header = (props: { owed: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full rounded-lg bg-sky-100 p-4 mb-12">
      <p>Others Owe You</p>
      <p className="py-4 text-4xl font-semibold">{props.owed} TEST</p>
    </div>
  );
};

const Requests = (props: { data: Request[] }) => {
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  let {
    mutateAsync: acceptMutateAsync,
    isLoading: acceptIsLoading,
    error: acceptError,
  } = useContractWrite(contract, "accept");
  console.log("REQUEST", props.data);

  return (
    <div className="flex gap-4 flex-wrap justify-center">
      {props.data.map((p) => (
        <Card size={"lg"} style={{ minWidth: "18rem" }} className="p-4">
          <CardHeader>
            <Heading>{p.title}</Heading>
            <p className=" text-xl">
              {ethers.utils.formatEther(p.amount.toString())} TEST
            </p>
          </CardHeader>
          <CardBody>
            <Button href={`/requests_out/${p.id}`}>View</Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

const RequestsOut = () => {
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const user_address = useAddress();

  let {
    data: outData,
    isLoading: outIsLoading,
    error: outError,
  } = useContractRead(contract, "getRequestsOut", [user_address]);

  const [owedSum, setOwedSum] = useState("");
  const [data, setData] = useState<Request[]>([]);

  useEffect(() => {
    if (outData) {
      let sum = BigNumber.from("0");
      let temp: Request[] = [];

      outData.map((p: RawRequest) => {
        if (
          p.creditor == (user_address as string) &&
          p.paid.length != p.debtors.length
        ) {
          sum = sum.add(p.amount);
          temp.push({
            title: p.message,
            amount: p.amount,
            debtors: p.debtors,
            creditor: p.creditor,
            paid: p.paid,
            id: parseInt(p.id),
          });
        }
      });
      setData([...temp]);
      setOwedSum(ethers.utils.formatEther(sum));
    }
  }, [outData]);

  return (
    <div>
      <Header owed={owedSum} />
      <Requests data={data} />
    </div>
  );
};

export default PageWrapper(RequestsOut, "SWOOSH PAY");
