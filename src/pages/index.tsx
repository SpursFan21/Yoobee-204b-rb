import { IconBook } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import Head from "next/head";
import router from "next/router";
import Footer from "~/components/common/Footer";
import Nav from "~/components/common/Nav";
import { Button } from "~/components/ui/button";

import { api } from "~/utils/api";

export default function Home() {
  const myUser = api.user.getUser.useQuery();

  return (
    <>
      <Head>
        <title>Cool book library</title>
        <meta name="description" content="Cool book library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="grid-bg flex h-screen w-screen">
          <div className="absolute h-screen w-screen bg-gradient-to-b from-transparent from-80% to-black"></div>

          <div className="z-10 flex w-full justify-around">
            <div className="flex flex-col items-center justify-center text-left">
              <div>
                <h1 className="text-5xl font-semibold text-white lg:text-7xl">
                  Better book <br />
                  Management
                </h1>

                <h3 className="pt-6 text-xl text-zinc-300 md:text-2xl">
                  Book thing is the easiest <br /> way to manage a library
                </h3>

                <Button
                  onClick={async () => {
                    if (myUser.data) {
                      await router.push("/account");
                    } else {
                      await signIn(undefined, { callbackUrl: "/account" });
                    }
                  }}
                  size={"lg"}
                  className="mt-8 text-lg"
                >
                  Try it now!
                </Button>
                {/* 
                <button className="mt-8 rounded-lg bg-white px-6 py-2 text-black">
                  Try it now!
                </button> */}
              </div>
            </div>

            <div className="hidden items-center justify-center md:flex">
              <IconBook
                stroke={2}
                className="aspect-square h-[24rem] text-white lg:h-[30rem]"
                width={"100%"}
                height={"100%"}
              />
            </div>
            {/*  */}
          </div>
        </div>

        <div className="h-48 w-full bg-black"></div>
      </main>
      <Footer />
    </>
  );
}
