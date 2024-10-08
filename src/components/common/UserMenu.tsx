import { signIn, signOut } from "next-auth/react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";

import type { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";
import { IconLogout, IconUser } from "@tabler/icons-react";

type UserMenuProps = {
  user?: inferRouterOutputs<AppRouter>["user"]["getUser"];
};

export default function UserMenu({ user }: UserMenuProps) {
  return (
    <>
      {user && (
        <Menu as="div" className="relative inline-block">
          <MenuButton>
            <div className="h-12 w-12 overflow-hidden rounded-full transition-all active:scale-90">
              {user.user?.image && (
                <Image
                  src={user.user?.image}
                  alt="user avatar"
                  width={100}
                  height={100}
                />
              )}
            </div>
          </MenuButton>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 flex w-56 origin-top-right flex-col gap-2 divide-gray-100 rounded-md bg-zinc-800 p-2 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <MenuItem>
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold text-white">
                    {user.user?.name}
                  </h2>
                </div>
              </MenuItem>

              {user.user && (
                <>
                  <MenuItem>
                    <Link
                      className="flex w-full items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-left font-semibold text-white no-underline transition hover:bg-white/20"
                      href={"/account"}
                    >
                      Account
                      <IconUser />
                    </Link>
                  </MenuItem>
                </>
              )}

              <MenuItem>
                <button
                  className="flex w-full items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-left font-semibold text-red-500 no-underline transition hover:bg-white/20"
                  onClick={() => void signOut()}
                >
                  Sign out
                  <IconLogout />
                </button>
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      )}

      {!user && (
        <button
          className="h-12 rounded-lg bg-blue-700 px-6 font-semibold text-white no-underline transition hover:bg-blue-800"
          onClick={() => void signIn()}
        >
          Sign in
        </button>
      )}
    </>
  );
}
