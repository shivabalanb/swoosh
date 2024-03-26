"use client";
import React, { useEffect, useState } from "react";
import icon from "../../assets/USDC.png";

import {
  shortenAddress,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import PageWrapper from "../../components/PageWrapper";
import { useParams } from "next/navigation";
import { BigNumber, ethers } from "ethers";
import { RawRequest, Request } from "../../requests_in/page";
import { Card, CardBody, Heading } from "@chakra-ui/react";
import { motion } from "framer-motion";
import TotalProgressBar from "../../components/TotalProgressBar";
import Image from "next/image";

function RequestPage_Out() {
  let params: { request_id: string } = useParams();
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const user_address = useAddress();

  let {
    data: outData,
    isLoading: outIsLoading,
    error: outError,
  } = useContractRead(contract, "getRequestsOut", [user_address]);

  const [owedSum, setOwedSum] = useState("");
  const [data, setData] = useState<Request>();

  useEffect(() => {
    if (outData) {
      let sum = BigNumber.from("0");
      let temp: Request;

      outData.map((p: RawRequest) => {
        if (
          p.creditor == (user_address as string) &&
          p.id == params.request_id &&
          p.paid.length != p.debtors.length
        ) {
          setOwedSum(ethers.utils.formatEther(p.amount));
          setData({
            title: p.message,
            amount: p.amount,
            debtors: p.debtors,
            creditor: p.creditor,
            paid: p.paid,
            id: parseInt(p.id),
          });
          return;
        }
      });
    }
  }, [outData]);

  if (!data) return <p>Please Wait...</p>;
  return (
    <div className="px-4">
      <Card>
        <CardBody>
          <div className="flex flex-col gap-4">
            <Heading>{data.title}</Heading>
            <div className="flex  items-center gap-4">
              <motion.div animate={{ scaleX: [0, 1, 0, 1] }}>
                <Image src={icon} alt="USDC icon" width={50} height={50} />
              </motion.div>
              <p className="text-4xl">
                ${ethers.utils.formatEther(data.amount)}
              </p>
            </div>
            <TotalProgressBar
              percent={(data.paid.length / data.debtors.length) * 100}
            />
          </div>
        </CardBody>
      </Card>
      <div>
        {data.debtors.map((p) => (
          <Card backgroundColor="ssky.500" variant="outline">
            <CardBody className="flex flex-wrap justify-between items-center">
              <p className="text-xl hidden md:block">{p}</p>
              <p className="text-xl md:hidden">{shortenAddress(p)}</p>{" "}
              <div className="flex flex-col gap-2">
                <p className="text-xl">
                  {ethers.utils
                    .formatEther(data.amount.div(data.debtors.length))
                    .toString()}{" "}
                  TEST
                </p>
                <p>Status: {data.paid.includes(p) ? "Paid" : "Pending"} </p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PageWrapper(RequestPage_Out, "SWOOSH");
