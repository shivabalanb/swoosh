import React, { ChangeEvent, useEffect, useState } from "react";
import { readSwooshContract } from "../util";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "./Button";
import {
  useAddress,
  useContract,
  useContractWrite,
  toWei,
  useContractRead,
} from "@thirdweb-dev/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  InputGroup,
  InputRightAddon,
  useToast,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";

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

    const formattedNumber = (num / divisor).toFixed(1) + unit;
    return formattedNumber;
  }
}

const ProfileBalanceCard = () => {
  const user_address = useAddress();
  const deposit = useDisclosure();
  const withdraw = useDisclosure();
  let { contract: ERC20 } = useContract(process.env.NEXT_PUBLIC_ERC20_ADDRESS);
  let { contract: SMART_CONTRACT } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );

  let {
    data: balanceData,
    isLoading: balanceIsLoading,
    error: balanceError,
  } = useContractRead(ERC20, "balanceOf", [user_address]);

  // let result = readSwooshContract('getBalance', [user_address], setUserBalance);

  // useEffect(() => {
  //   if (user_address !== undefined) {
  //     contract
  //       ?.call("getBalance", [user_address])
  //       .then((data) => {
  //         // Assuming data can be directly set as a number, but you might need to parse or transform it
  //         const balance = Number(data); // Convert data to a number, if necessary

  //         setUserBalance(balance);
  //       })
  //       .catch((error) => console.error("Failed to fetch balance:", error));
  //   }
  // }, [user_address]);

  // const {
  //   mutateAsync: withdrawMutateAsync,
  //   isLoading: withdrawIsLoading,
  //   error: withdrawError,
  // } = useContractWrite(SMART_CONTRACT, "withdraw");

  // useEffect(() => {
  //   if (!withdrawIsLoading) {
  //     const modal = document.getElementById(
  //       "withdraw_modal"
  //     ) as HTMLDialogElement | null;
  //     if (modal) {
  //       modal.close();
  //     }
  //   }
  // }, [withdrawIsLoading]);

  // async function submitWithdraw() {
  //   if (withdrawValue.trim() == "") {
  //     setShowErrorToast(true);
  //     setTimeout(() => {
  //       setShowErrorToast(false);
  //     }, 3000);
  //     return;
  //   }
  //   const value = parseFloat(withdrawValue);
  //   setShowSuccessToast(true);
  //   setTimeout(() => {
  //     setShowSuccessToast(false);
  //   }, 3000);
  //   await withdrawMutateAsync({ args: [toWei(value)] });
  //   setWithdrawValue("");
  //   window.location.reload();
  // }

  return (
    <div className="py-4">
      <div className=" h-72 flex flex-col md:flex flex-wrap p-4 px-8 rounded-lg bg-sky-100">
        <div className="flex-1 flex flex-col justify-center  sm:min-w-64 ">
          <p className="text-lg">Balance</p>
          <p className="py-2 text-5xl font-semibold">
            {balanceData != undefined
              ? ethers.utils.formatEther(balanceData)
              : "--"}
            {"  TEST"}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 justify-center items-center ">
          <Button
            style={{ padding: "12px", borderRadius: ".5rem" }}
            onClick={deposit.onOpen}
          >
            <FaArrowUp />
            <p>Deposit</p>
          </Button>
          <Button
            style={{ padding: "12px", borderRadius: ".5rem" }}
            onClick={withdraw.onOpen}
          >
            <p>Withdraw</p> <FaArrowDown />
          </Button>
        </div>
      </div>
      <DepositModal onClose={deposit.onClose} isOpen={deposit.isOpen} />
      <WithdrawModal onClose={withdraw.onClose} isOpen={withdraw.isOpen} />
    </div>
  );
};

export default ProfileBalanceCard;

function DepositModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const user_address = useAddress();
  let { contract } = useContract(process.env.NEXT_PUBLIC_ERC20_ADDRESS);

  const {
    mutateAsync: depositMutateAsync,
    isLoading: depositIsLoading,
    error: depositError,
  } = useContractWrite(contract, "mint");

  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setValue(event.target.value);
    }
  };

  async function submitDeposit() {
    if (!Number.isNaN(parseFloat(value))) {
      await depositMutateAsync({
        args: [user_address, toWei(parseFloat(value))],
      })
        .then(() => {
          setValue("");
          onClose();
          toast({
            title: "Deposit Successful!",
            status: "success",
            position: "bottom",
          });
        })
        .catch((error) => {
          toast({
            title: "Deposit Unsuccessful.",
            status: "error",
            position: "bottom",
          });
        });
    }
  }

  return (
    <Modal
      motionPreset="slideInBottom"
      isCentered
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Enter Amount to Deposit</ModalHeader>
        <ModalBody>
          <InputGroup size="lg">
            <Input
              value={value}
              onChange={handleChange}
              focusBorderColor="blue.100"
              className="text-right"
              placeholder="10.00"
            />
            <InputRightAddon>TEST</InputRightAddon>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={depositIsLoading}
            style={{ padding: "12px", borderRadius: ".5rem" }}
            onClick={submitDeposit}
          >
            {depositIsLoading ? "Please Wait ..." : "Deposit"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function WithdrawModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [value, setValue] = React.useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setValue(event.target.value);
    }
  };

  return (
    <Modal
      motionPreset="slideInBottom"
      isCentered
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Enter Amount to Withdraw</ModalHeader>
        <ModalBody>
          <InputGroup size="lg">
            <Input
              value={value}
              onChange={handleChange}
              focusBorderColor="blue.100"
              className="text-right"
              placeholder="10.00"
            />
            <InputRightAddon>TEST</InputRightAddon>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            style={{ padding: "12px", borderRadius: ".5rem" }}
            onClick={onClose}
          >
            Withdraw
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
