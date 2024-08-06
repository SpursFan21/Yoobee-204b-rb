import UserMenu from "./UserMenu";
import Link from "next/link";

import type { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { IconBook } from "@tabler/icons-react";
import SiteTitle from "./SiteTitle";
import { LayoutGroup, motion } from "framer-motion";

type NavProps = {
  user?: inferRouterOutputs<AppRouter>["user"]["getUser"];
  active?: string;
};

type NavLinkProps = {
  href: string;
  text: string;
  active?: boolean;
};

const links: NavLinkProps[] = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
  { href: "/features", text: "Features" },
];

export default function Nav({ user, active }: NavProps) {
  links.forEach((link) => {
    link.active = link.href === active;
  });

  return (
    <>
      <div className="flex w-full justify-center absolute z-20">
        <nav className="fixed mt-8 flex h-20 w-11/12 items-center justify-between rounded-lg border-2 border-zinc-800 bg-zinc-900 px-8 backdrop-blur-lg lg:px-20 xl:w-8/12">
          <Link
            href={"/"}
            className="flex items-center gap-2 text-xl font-bold text-white"
          >
            <IconBook height={36} width={36} />
            <div className="hidden lg:block text-2xl">
              <SiteTitle />
            </div>
          </Link>


          <div className="flex gap-4">
            <LayoutGroup>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative transition-colors duration-300 ${link.active ? "text-white/80" : "text-white/50"} hover:text-white`}
              >
                {link.text}
                {link.active && (
                  <motion.div
                    className={`absolute mt-1 h-1 w-full rounded-full ${link.active ? "bg-white/80" : "bg-white/50"} group-hover:bg-white`}
                    layoutId="nav-active"
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                    }}
                  ></motion.div>
                )}
              </Link>
            ))}
            </LayoutGroup>
          </div>

          <div className="flex">
            <UserMenu user={user} />
          </div>
        </nav>
      </div>
    </>
  );
}
