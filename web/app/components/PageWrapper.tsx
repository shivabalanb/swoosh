import { usePathname } from "next/navigation";
import { MobileNavBar, NavBar } from "./Navbar";

export default function PageWrapper(
  Component: React.ComponentType,
  title: string
) {
  return () => {
    return (
      <div>
        <Header title={title} />
        <div className="px-4 md:pt-28 pb-20 ">
          <Component />
        </div>
        <MobileNavBar />
      </div>
    );
  };
}

function Header({ title }: { title: string }) {
  return (
    <div className=" w-full md:fixed md:top-0 p-4 max-w-3xl flex justify-between items-center rounded-lg border-2 ">
      <p className="text-4xl tracking-widest">{title}</p>
      <NavBar />
    </div>
  );
}
