import Head from "next/head";
import { useState } from "react";
import Nav from "~/components/common/Nav";
import Footer from "~/components/common/Footer";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import toastOptions from "~/utils/toastOptions";
import { Button } from "~/components/ui/button";

export default function ReviewPage() {
  // Fetch user data and books
  const myUser = api.user.getUser.useQuery();
  const userBooks = api.book.getUserBooks.useQuery();

  // State management
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [selectedBook, setSelectedBook] = useState<string>("");

  // tRPC mutation for creating a review
  const reviewMutation = api.review.create.useMutation({
    onSuccess: () => {
      setMessage("Review submitted successfully!");
      setRating(0);
      setComment("");
      setSelectedBook("");

      toast.success("Account edited successfully", toastOptions);

      // Refetch the user's books
      userBooks.refetch().then().catch(console.error);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);

      setMessage("An error occurred. Please try again.");
    },
  });

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    reviewMutation.mutate({
      rating,
      comment,
      bookId: selectedBook,
    });
  };

  return (
    <>
      <Head>
        <title>Create a Review</title>
        <meta name="description" content="Submit a review for a book" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <Nav user={myUser.data} />

        <div className="h-36"></div>

        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create a Review
        </h1>

        {/* Dropdown for selecting a book */}
        <div className="mb-8 w-96">
          <label className="mb-2 block text-white">Select a Book:</label>
          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            className="w-full rounded bg-white p-2 text-black"
          >
            <option value="">Select a book</option>
            {userBooks.data?.map((userBook) => (
              <option key={userBook.book.id} value={userBook.book.id}>
                {userBook.book.title} by {userBook.book.author}
              </option>
            ))}
          </select>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="mt-8 w-96">
          <div className="mb-4">
            <label className="block text-white">Rating: (1-100)</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              min="1"
              max="100"
              className="w-full rounded p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-white">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded p-2"
            />
          </div>
          {/* <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Submit Review
          </button> */}
          <Button type="submit" className="mt-4">
            Submit Review
          </Button>
        </form>

        {message && <p className="mt-4 text-white">{message}</p>}
      </main>
      <Footer />
    </>
  );
}
