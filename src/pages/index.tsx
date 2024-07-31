import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Nav from "~/components/common/Nav";
import SiteTitle from "~/components/common/SiteTitle";

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
        {/* <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"> */}

        <Nav user={myUser.data} />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <SiteTitle />
          </h1>
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            test
          </h1>
        </div>
      </main>
    </>
  );
}
