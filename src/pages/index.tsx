import Head from "next/head";
import { useRouter } from "next/router";
import Nav from "~/components/common/Nav";
import SiteTitle from "~/components/common/SiteTitle";

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

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-[5rem]">
            <SiteTitle />
          </h1>
        </div>
      </main>
    </>
  );
}
