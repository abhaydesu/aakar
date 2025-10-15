import Link from "next/link";
import React from "react";
import Image from "next/image";

const navItems = [
  {title:'डैshboard', href:'/dashboard'},
  {title:'कontact', href:'/contact'},
  {title:'अbout us', href:'/about-us'},
];

export const Navbar = () => {
  return (
    <nav className="bg-green-200 py-2">
      <div className="flex font-medium text-neutral-900 justify-between items-center px-8 mx-auto">
        <div className="text-6xl tracking-tight font-medium gajraj-one-regular flex flex-row items-center">
        
            <span>
                <Image src="/logo.jpg" width={50} height={50} alt="logo" />
            </span>
            <span className="pl-5" >
                <Link href="/">
            aakar
            </Link>
        </span>
        {/* <span className="text-4xl tracking-tight font-medium yatra-one-regular"> aakar</span> */}
        </div>
        <div className="flex flex-row gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xl relative py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-neutral-900 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};