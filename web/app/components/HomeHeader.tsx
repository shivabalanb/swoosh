import React from "react";
import { useAddress } from "@thirdweb-dev/react";

const HomeHeader = () => {
  const user_address = useAddress();
  let truncated = user_address?.slice(0, 4) + "..." + user_address?.slice(-3);
  return (
    <div className="flex flex-col items-center justify-center py-12 text-5xl">
      <p>Hello,</p>
      <b>{user_address != undefined ? truncated : "--"}!</b>
    </div>
  );
};

export default HomeHeader;
