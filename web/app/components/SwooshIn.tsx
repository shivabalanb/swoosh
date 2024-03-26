import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Input,
  useToast,
  Card,
  InputGroup,
  CardBody,
  Divider,
  InputRightAddon,
  IconButton,
  Button,
} from "@chakra-ui/react";
import {
  useContract,
  useContractWrite,
  useAddress,
  shortenAddress,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useState, ChangeEvent } from "react";
// pay
export const SwooshIn = () => {
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);

  let {
    mutateAsync: payMutateAsync,
    isLoading: payIsLoading,
    error: payError,
  } = useContractWrite(contract, "pay");
  // console.log(payMutateAsync, payIsLoading, payError);

  const toast = useToast();
  const user_address = useAddress();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [member, setMember] = useState(
    "0x31d5a8709bE7f3cE42efc21A72718acf1D57a890"
  );
  const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setAmount(event.target.value);
    }
  };

  function handleMemberAdd() {
    let address = memberInput.trim();
    if (
      address.length !== 42 ||
      !address.startsWith("0x") ||
      address === user_address
    ) {
      toast({
        title: "Member Not Added",
        status: "error",
        position: "bottom",
      });
      return; // INVALID MEMBER ADD
    } else {
      setMember(address);
      setMemberInput("");
      toast({
        title: "Member Added!",
        status: "success",
        position: "bottom",
      });
    }
  }

  function handleMemberRemove(member: string) {
    setMember("");
  }

  async function submitPay() {
    if (!Number.isNaN(parseFloat(amount))) {
      await payMutateAsync({
        args: [
          member,
          ethers.utils.formatEther(ethers.utils.parseEther(amount)),
          title,
          "",
        ],
      })
        .then(() => {
          toast({
            title: "Swoosh Pay Success!",
            status: "success",
            position: "bottom",
          });
        })
        .catch((error) => {
          console.log(error);

          toast({
            title: "Swoosh Pay Unsuccessful",
            status: "error",
            position: "bottom",
          });
        });
    }
  }

  return (
    <div className=" p-8 rounded-lg bg-sky-100 flex w-full flex-col">
      <div className="flex flex-col gap-2">
        <p>Title</p>
        <Input
          size="lg"
          bg="white"
          title="Message:"
          placeholder="Groceries"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <p>Member</p>
        <Card className="p-4  ">
          <InputGroup justifyContent="center" alignItems="center" gap={2}>
            <Input
              bg="white"
              width="auto"
              placeholder="Add Member"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
            />
            <IconButton
              size="lg"
              onClick={() => handleMemberAdd()}
              rounded={100}
              colorScheme="sdarkblue"
              icon={<AddIcon />}
              aria-label="Add Member"
            />
          </InputGroup>

          <CardBody
            className="
            overflow-y-auto max-h-64"
          >
            <div>
              <div className="flex justify-between items-center p-2">
                <p className="hidden md:block">{member}</p>
                <p className="md:hidden">{shortenAddress(member)}</p>
                <IconButton
                  aria-label="Remove Member"
                  _hover={{ bg: "red.500", color: "white" }}
                  onClick={() => handleMemberRemove(member)}
                  icon={<CloseIcon />}
                />
              </div>
              <Divider orientation="horizontal" />
            </div>
          </CardBody>
        </Card>

        <div className="flex justify-between items-end gap-4 flex-wrap">
          <div>
            <p>Amount</p>
            <InputGroup>
              <Input
                bg="white"
                width="auto"
                title="Total Cost ($):"
                placeholder="10.99"
                value={amount}
                onChange={handleAmountChange}
              />
              <InputRightAddon bg="black" color="white">
                TEST
              </InputRightAddon>
            </InputGroup>
          </div>
          <Button
            isDisabled={payIsLoading}
            size="lg"
            colorScheme="sblue"
            className="flex-grow"
            onClick={submitPay}
          >
            {payIsLoading ? "Please Wait ..." : "SWOOSH"}
          </Button>
        </div>
      </div>
    </div>
  );
};
