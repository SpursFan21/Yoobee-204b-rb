import Head from "next/head";
import Nav from "~/components/common/Nav";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import BookCard from "~/components/Review/BookCard";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import UserReview from "~/components/Review/UserReview";
import { useEffect, useState } from "react";

export default function BookPage() {
  const { bookId } = useRouter().query;

  const myUser = api.user.getUser.useQuery();
  const thisBook = api.book.getBookById.useQuery({ id: bookId as string });

  const [averageRating, setAverageRating] = useState<number>(0);

  // Fetch review data
  const reviews = api.review.getReviewsForBook.useQuery({
    bookId: bookId as string,
  });

  // Calculate average rating
  useEffect(() => {
    if (reviews.data) {
      const totalRating = reviews.data.reduce((acc, review) => {
        return acc + review.rating;
      }, 0);

      setAverageRating(totalRating / reviews.data.length);
    }
  }, [reviews.data]);

  const pageTitle = thisBook.data?.title ?? "Book";

  return (
    <>
      <Head>
        <title>Book Thing | {pageTitle}</title>
        <meta name="description" content="Cool book library" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="h-36"></div>

        {thisBook.isLoading && <h1 className="text-4xl">Loading...</h1>}

        <div className="p-4">
          {thisBook.data && (
            <BookCard book={thisBook.data} stars={averageRating} />
          )}
        </div>

        <div className="mt-8 flex w-full flex-col gap-4 p-4 md:w-[40rem]">
          <h3 className="text-4xl font-bold text-white">Reviews</h3>
          <h4 className="text-lg text-zinc-300">
            {reviews.data?.length ?? 0} reviews, {averageRating.toFixed(1)}{" "}
            average rating
          </h4>
          <Button asChild>
            <Link href={`/review?bookId=${bookId as string}`} className="w-min">
              Write a review
            </Link>
          </Button>

          {reviews.isLoading && <p className="text-white">Loading review...</p>}

          {reviews.data && reviews.data.length == 0 && (
            <p className="text-white">No reviews yet</p>
          )}

          {reviews.data?.map((review) => (
            <UserReview
              key={review.id}
              name={review.user.name ?? "Unknown"}
              photoUrl={review.user.image ?? ""}
              rating={review.rating}
              comment={review.comment}
            />
          ))}

          {/*  */}
        </div>
      </main>
    </>
  );
}
