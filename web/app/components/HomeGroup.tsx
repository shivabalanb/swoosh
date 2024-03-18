import Link from "next/link";
import { Button } from "./Button";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

export interface RequestOut {
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

interface HomeGroupProp {
  inNumber: number;
  outNumber: number;
}

interface HomeCardProps {
  type: string;
  num: number;
  href: string;
}

const HomeCard = (props: HomeCardProps) => {
  return (
    <div className=" flex-grow  rounded-lg bg-sky-100 p-8 no-underline flex flex-col gap-8 ">
      <div className="flex justify-between items-end text-left gap-4 ">
        <div>
          <div className="w-full flex justify-start py-2">
            {props.type == "In" ? (
              <FaArrowDown size={30} />
            ) : (
              <FaArrowUp size={30} />
            )}
          </div>

          <p className="text-xl  font-bold">Swoosh {props.type}</p>
          <p className="text-sm ">
            {props.type == "In" ? "Incoming" : "Outgoing"} Requests
          </p>
        </div>
        <p className=" text-6xl font-semibold">{props.num}</p>
      </div>
      <Button href={props.href}>View All</Button>
    </div>
  );
};

const HomeGroup = (props: HomeGroupProp) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <HomeCard href="/requests_in" type="In" num={props.inNumber} />
      <HomeCard href="/requests_out" type="Out" num={props.outNumber} />
    </div>
  );
};

export default HomeGroup;
