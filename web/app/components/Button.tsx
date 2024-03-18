import Link from "next/link";
import { CSSProperties } from "react";
import { IoArrowForward } from "react-icons/io5";

type Props = {
  children: React.ReactNode;
  title?: string;
  href?: string;
  args?: {};
  disabled?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
};

export function Button({ style, children, href, onClick, disabled }: Props) {
  if (href) {
    return (
      <Link
        style={style}
        href={href}
        className={`p-2 px-4 bg-blue-700 text-white flex justify-between items-center rounded-full w-full hover:scale-105 duration-200 no-underline`}
      >
        {children}
        <IoArrowForward />
      </Link>
    );
  }
  return (
    <button
      style={style}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 bg-blue-700 text-white flex justify-center gap-2 items-center rounded-full w-full hover:scale-105 duration-200`}
    >
      {children}
    </button>
  );
}
