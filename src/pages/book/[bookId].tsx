import Head from "next/head";
import SiteTitle from "~/components/common/SiteTitle";
import Nav from "~/components/common/Nav";

import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";

export default function BookPage() {
  const { bookId } = useRouter().query;

  const myUser = api.user.getUser.useQuery();
  const thisBook = api.book.getBookById.useQuery({ id: bookId as string });

  return (
    <>
      <Head>
        <title>Cool book library | About</title>
        <meta name="description" content="Cool book library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="h-36"></div>

        {thisBook.isLoading && <h1 className="text-4xl">Loading...</h1>}

        {thisBook.error && <div>Error: {thisBook.error.message}</div>}

        {thisBook.data && (
          <div className="flex gap-4">
            <div className="w-32">
              <Image
                src={thisBook.data.image}
                alt="book cover"
                width={1000}
                height={1000}
              />
            </div>
            <div className="flex flex-col">
              <h2>{thisBook.data.title}</h2>
              <p>{thisBook.data.author}</p>
              <p>{thisBook.data.description}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
