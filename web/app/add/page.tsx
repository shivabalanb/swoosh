"use client";
import React, { useState } from "react";

import PageWrapper from "../components/PageWrapper";
import { Stack, Button } from "@chakra-ui/react";
import { ArrowForwardIcon, EmailIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";
import { SwooshOut } from "../components/SwooshOut";
import { SwooshIn } from "../components/SwooshIn";

let axios = require("axios");

enum SWOOSH_TYPE {
  IN,
  OUT,
}

const AddPage = () => {
  const [swooshType, setSwooshType] = useState<SWOOSH_TYPE>(SWOOSH_TYPE.IN);

  return (
    <>
      <div className=" h-fit flex flex-col items-center justify-center py-4">
        <div className="border-2 rounded-lg">
          <Stack direction="row">
            <Button
              size="lg"
              leftIcon={<EmailIcon />}
              colorScheme="sblue"
              onClick={() => setSwooshType(SWOOSH_TYPE.OUT)}
              variant={swooshType == SWOOSH_TYPE.OUT ? "solid" : "filled"}
            >
              Swoosh Request
            </Button>
            <Button
              size="lg"
              rightIcon={<ArrowForwardIcon />}
              colorScheme="sblue"
              onClick={() => setSwooshType(SWOOSH_TYPE.IN)}
              variant={swooshType == SWOOSH_TYPE.IN ? "solid" : "filled"}
            >
              Swoosh Pay
            </Button>
          </Stack>
        </div>

        {swooshType == SWOOSH_TYPE.OUT ? <SwooshOut /> : <SwooshIn />}
      </div>
    </>
  );
};

export default PageWrapper(AddPage, "SWOOSH");

function shortenAddress(address: string, startLength = 6, endLength = 4) {
  if (!address || typeof address !== "string") return "";
  return address.slice(0, startLength) + "..." + address.slice(-endLength);
}


