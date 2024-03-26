import { Container } from "@chakra-ui/react";
import { MobileNavBar, NavBar } from "./Navbar";
import { useConnectionStatus } from "@thirdweb-dev/react";

export default function PageWrapper(
  Component: React.ComponentType<{ params?: { request_id: string } }>,
  title: string
) {
  return () => {
    const connectionStatus = useConnectionStatus();

    return (
      <div className="flex flex-col justify-center">
        <Header title={title} />
        <div className="px-4 md:pt-28 pt-20 pb-20 md:pb-10 ">
          {connectionStatus === "connected" ? (
            <Component />
          ) : (
            <p>Please Connect Your Wallet</p>
          )}
        </div>
        <MobileNavBar />
      </div>
    );
  };
}

function Header({ title }: { title: string }) {
  return (
    <div className="z-50 max-w-3xl w-full fixed top-0 bg-white p-4  flex justify-between items-center rounded-lg border-2 ">
      <p className="text-4xl tracking-widest">{title}</p>
      <NavBar />
    </div>
  );
}
