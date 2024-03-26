import React, { ChangeEvent, useEffect, useState } from "react";
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

const ProfileBalanceCard = () => {
  const user_address = useAddress();
  const deposit = useDisclosure();
  const withdraw = useDisclosure();
  const toast = useToast();
  let { contract: ERC20 } = useContract(process.env.NEXT_PUBLIC_ERC20_ADDRESS);
  let { contract: SMART_CONTRACT } = useContract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  );

  let {
    data: balanceData,
    isLoading: balanceIsLoading,
    error: balanceError,
  } = useContractRead(SMART_CONTRACT, "getBalance", [user_address]);

  let {
    mutateAsync: mintAsync,
    isLoading: mintIsLoading,
    error: mintError,
  } = useContractWrite(ERC20, "mint");

  async function handleMint() {
    await mintAsync({
      args: [user_address, BigNumber.from("1000000000000000000000")],
    })
      .then(() => {
        toast({
          title: "Mint Successful!",
          status: "success",
          position: "bottom",
        });
      })
      .catch((error) => {
        console.log(error);

        toast({
          title: "Mint Unsuccessful.",
          status: "error",
          position: "bottom",
        });
      });
  }

  return (
    <div className="py-4">
      <div className="  flex flex-col  flex-wrap p-8  rounded-lg bg-sky-100">
        <div className="flex-2 flex justify-end">
          <div>
            <Button
              style={{
                padding: "6px 12px ",
                backgroundColor: "black",
                borderRadius: ".5rem",
              }}
              disabled={mintIsLoading}
              onClick={handleMint}
            >
              {mintIsLoading ? "Minting..." : "1K TEST Faucet"}
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center  sm:min-w-64 ">
          <div className="py-10">
            <p className="text-lg">Swoosh Balance</p>
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
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  const {
    mutateAsync: depositMutateAsync,
    isLoading: depositIsLoading,
    error: depositError,
  } = useContractWrite(contract, "deposit");

  const [amount, setAmount] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setAmount(event.target.value);
    }
  };

  async function submitDeposit() {
    if (!Number.isNaN(parseFloat(amount))) {
      await depositMutateAsync({
        args: [ ethers.utils.parseEther(amount)],
      })
        .then(() => {
          setAmount("");
          onClose();
          toast({
            title: "Deposit Successful!",
            status: "success",
            position: "bottom",
          });
        })
        .catch((error) => {
          console.log(error);
          
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
              value={amount}
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
  const toast = useToast();
  const user_address = useAddress();
  let { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  const {
    mutateAsync: withdrawMutateAsync,
    isLoading: withdrawIsLoading,
    error: withdrawError,
  } = useContractWrite(contract, "withdraw");

  const [amount, setAmount] = useState("");
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setAmount(event.target.value);
    }
  };

  async function submitWithdraw() {
    if (!Number.isNaN(parseFloat(amount))) {
      await withdrawMutateAsync({
        args: [ethers.utils.parseEther(amount)],
      })
        .then(() => {
          setAmount("");
          onClose();
          toast({
            title: "Withdraw Successful!",
            status: "success",
            position: "bottom",
          });
        })
        .catch((error) => {
          toast({
            title: "Withdraw Unsuccessful.",
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
        <ModalHeader>Enter Amount to Withdraw</ModalHeader>
        <ModalBody>
          <InputGroup size="lg">
            <Input
              value={amount}
              onChange={handleAmountChange}
              focusBorderColor="blue.100"
              className="text-right"
              placeholder="10.00"
            />
            <InputRightAddon>TEST</InputRightAddon>
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            disabled={withdrawIsLoading}
            style={{ padding: "12px", borderRadius: ".5rem" }}
            onClick={submitWithdraw}
          >
            {withdrawIsLoading ? "Please Wait ..." : "Withdraw"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
