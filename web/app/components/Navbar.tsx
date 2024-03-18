import { ConnectWallet } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";
import { IoHome, IoPersonCircleSharp, IoAddCircle } from "react-icons/io5";

export function MobileNavBar() {
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-20  ">
      <div className=" m-auto py-2 flex gap-12 w-full items-center justify-center  border-t-2 bg-white  border-slate-200  text-blue-900">
        <button className="hover:scale-105 duration-200">
          <Link href="/home">
            <IoHome fontSize={42} />
          </Link>
        </button>
        <button className="hover:scale-105 duration-200">
          <Link href="/add">
            <IoAddCircle className="text-blue-700" fontSize={60} />
          </Link>
        </button>
        <button className="hover:scale-105 duration-200">
          <Link href="/profile">
            <IoPersonCircleSharp fontSize={42} />
          </Link>
        </button>
      </div>
    </div>
  );
}

export function NavBar() {
  return (
    <div className="h-16 hidden md:flex z-20  gap-8   items-center justify-center text-blue-900">
      <button className="hover:scale-105 duration-200">
        <Link href="/home">
          <IoHome fontSize={32} />
        </Link>
      </button>
      <button className="hover:scale-105 duration-200">
        <Link href="/profile">
          <IoPersonCircleSharp fontSize={32} />
        </Link>
      </button>
      <button className="hover:scale-105 duration-200">
        <Link href="/add">
          <IoAddCircle className="text-blue-700" fontSize={50} />
        </Link>
      </button>
      <ConnectWallet theme={"light"} />
    </div>
  );
}
