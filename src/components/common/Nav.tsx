import Link from "next/link";
import type { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { IconBook } from "@tabler/icons-react";
import SiteTitle from "./SiteTitle";
import { LayoutGroup, motion, type Transition } from "framer-motion";
import { useRouter } from "next/router";
import UserMenu from "./UserMenu";

type NavProps = {
  user?: inferRouterOutputs<AppRouter>["user"]["getUser"];
};

type NavLinkProps = {
  href: string;
  text: string;
  active?: boolean;
};

const links: NavLinkProps[] = [
  { href: "/", text: "Home" },
  { href: "/about", text: "About" },
];

const animationOptions: Transition = {
  type: "spring",
  damping: 50,
  stiffness: 200,
  // bounce: 10,
  velocity: 10,
};

export default function Nav({ user }: NavProps) {
  const router = useRouter();
  const path = router.pathname;
  let accountPage = false;

  links.forEach((link) => {
    link.active = link.href === path;
  });

  // check if the path is not in the links
  accountPage = path === "/account";

  return (
    <>
      <div className="absolute z-20 flex w-full justify-center">
        <nav className="relative mt-8 flex h-20 w-11/12 items-center justify-between rounded-lg border-2 border-zinc-800 bg-zinc-900 px-8 backdrop-blur-lg lg:px-20 xl:w-8/12">
          <Link
            href={"/"}
            className="relative flex items-center gap-2 text-xl font-bold text-white"
          >
            <IconBook height={36} width={36} />
            <div className="hidden text-2xl lg:block">
              <SiteTitle />
            </div>
          </Link>

          <div className="absolute left-1/2 flex -translate-x-1/2 gap-4">
            <LayoutGroup>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative font-medium transition-colors duration-300 ${link.active ? "text-white/80" : "text-white/50"} hover:text-white`}
                >
                  {link.text}
                  {link.active && (
                    <motion.div
                      className={`absolute mt-1 h-1 w-full rounded-full bg-white/80 group-hover:bg-white`}
                      layoutId="nav-active-bar"
                      transition={animationOptions}
                    ></motion.div>
                  )}
                </Link>
              ))}
            </LayoutGroup>
          </div>

          <div className="flex">
            <UserMenu user={user} />
            {accountPage && (
              <motion.div
                className={`absolute mt-14 h-1 w-12 rounded-full bg-white/80`}
                layoutId="nav-active-bar"
                transition={animationOptions}
              ></motion.div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
