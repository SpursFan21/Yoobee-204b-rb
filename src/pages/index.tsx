import { IconBook } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import Nav from "~/components/common/Nav";
import SiteTitle from "~/components/common/SiteTitle";
import Grid from "~/components/Home/Grid";

import { api } from "~/utils/api";

export default function Home() {
  const myUser = api.user.getUser.useQuery();

  const router = useRouter();
  const path = router.pathname;

  return (
    <>
      <Head>
        <title>Cool book library</title>
        <meta name="description" content="Cool book library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} active={path} />

        <div className="relative flex h-screen w-screen overflow-hidden">
          <Grid />

          <div className="z-10 flex w-full justify-around">
            <div className="flex flex-col items-center justify-center text-left">
              <div>
                <h1 className="text-7xl font-semibold text-white">
                  Better book <br />
                  Management
                </h1>

                <h3 className="pt-6 text-2xl text-zinc-300">
                  Book thing is the easiest <br /> way to manage a library
                </h3>

                <button className="mt-8 rounded-lg bg-white px-6 py-2 text-black">
                  Try it now!
                </button>
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <IconBook
                stroke={2}
                className="text-white"
                width={400}
                height={400}
              />
            </div>
            {/*  */}
          </div>
        </div>
      </main>
    </>
  );
}
