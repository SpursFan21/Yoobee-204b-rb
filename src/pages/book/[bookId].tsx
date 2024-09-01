import Head from "next/head";
import Nav from "~/components/common/Nav";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Image from "next/image";

export default function BookPage() {
  const { bookId } = useRouter().query;

  const myUser = api.user.getUser.useQuery();
  const thisBook = api.book.getBookById.useQuery({ id: bookId as string });
  const userBook = api.book.getUserBook.useQuery({
    bookId: bookId as string,
    userId: myUser.data?.user?.id ?? "",
  });

  // Fetch review data
  const userReview = api.book.getUserReview.useQuery({
    bookId: bookId as string,
    userId: myUser.data?.user?.id ?? "",
  });

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

        {!userBook.isLoading && !userBook.data && <div>You don&apos;t have this</div>}

        {thisBook.data && userBook.data && (
          <div>
            <h1>You have this</h1>
            <span>{userBook.data.progress}</span>
          </div>
        )}

        {thisBook.data && (
          <div className="flex gap-4">
            <div className="w-32">
              <Image
                src={thisBook.data.b64Image ?? ""}
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

        {/* Review Section */}
        {userReview.isLoading && <p className="text-white">Loading review...</p>}
        {userReview.error && <div>Error: {userReview.error.message}</div>}
        {userReview.data && (
          <div className="mt-8 w-96">
            <h3 className="text-xl font-bold text-white">Your Review:</h3>
            <p className="text-white">Rating: {userReview.data.rating}</p>
            <p className="text-white">Comment: {userReview.data.comment}</p>
          </div>
        )}
      </main>
    </>
  );
}
