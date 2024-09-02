import Head from "next/head";
import { useEffect, useState } from "react";
import Nav from "~/components/common/Nav";
import Footer from "~/components/common/Footer";
import { api } from "~/utils/api";
import { toast } from "react-toastify";
import toastOptions from "~/utils/toastOptions";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/lib/utils";
import { IconCheck, IconSelector } from "@tabler/icons-react";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Star } from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function ReviewPage() {
  const { bookId } = useRouter().query;

  // Fetch user data and books
  const myUser = api.user.getUser.useQuery();
  const userBooks = api.book.getUserBooks.useQuery();

  const [selectedBook, setSelectedBook] = useState<string>("");
  const [bookSelectOpen, setBookSelectOpen] = useState(false);

  // State management
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(0);
  const [comment, setComment] = useState<string>("");

  const handleClearRating = () => {
    setRating(0);
    setHover(0);
  };

  // tRPC mutation for creating a review
  const reviewMutation = api.review.create.useMutation({
    onSuccess: () => {
      setRating(0);
      setComment("");
      setSelectedBook("");

      toast.success("Review submitted successfully", toastOptions);

      // Refetch the user's books
      userBooks.refetch().then().catch(console.error);
    },
    onError: (error) => {
      console.error("Error submitting review:", error);
    },
  });

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedBook) {
      toast.error("Please select a book", toastOptions);
      return;
    }

    reviewMutation.mutate({
      rating,
      comment,
      bookId: selectedBook,
    });
  };

  useEffect(() => {
    if (bookId) {
      setSelectedBook(bookId as string);
    }
  }, [bookId]);

  return (
    <>
      <Head>
        <title>Create a Review</title>
        <meta name="description" content="Submit a review for a book" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center bg-zinc-950">
        <Nav user={myUser.data} />

        <div className="h-36"></div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[5rem] my-8">
          Create a Review
        </h1>

        <Popover open={bookSelectOpen} onOpenChange={setBookSelectOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={bookSelectOpen}
              className="mt-8 w-96 justify-between"
            >
              {/* Show the selected book title and author if a book is selected with the format (title) by (author) */}
              {selectedBook
                ? userBooks.data?.find((book) => book.book.id === selectedBook)
                    ?.book.title
                : "Select a book"}

              <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search Book..." />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {userBooks.data?.map((book) => (
                    <CommandItem
                      key={book.id}
                      value={book.book.id}
                      onSelect={(currentValue) => {
                        setSelectedBook(currentValue);
                        setBookSelectOpen(false);
                        setRating(0);
                        setComment("");
                      }}
                    >
                      <IconCheck
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBook === book.book.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {book.book.title} by {book.book.author}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* if book selected display name author and image */}

        {selectedBook && (
          <div className="mt-8 grid grid-cols-2 items-center gap-4">
            <Image
              src={
                userBooks.data?.find((book) => book.book.id === selectedBook)
                  ?.book.b64Image ?? ""
              }
              alt="Book cover"
              className="w-32 rounded-lg bg-black object-cover shadow-md"
              width={300}
              height={400}
            />
            <div>
              <h2 className="text-3xl font-bold text-white">
                {
                  userBooks.data?.find((book) => book.book.id === selectedBook)
                    ?.book.title
                }
              </h2>
              <p className="text-gray-300">
                by{" "}
                {
                  userBooks.data?.find((book) => book.book.id === selectedBook)
                    ?.book.author
                }
              </p>
            </div>
          </div>
        )}

        {/* Review form */}

        <div className="bg-card mx-auto w-96 max-w-md rounded-lg p-6 shadow-lg">
          <h2 className="text-foreground mb-4 text-2xl font-bold">
            Leave a Review
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="rating" className="text-foreground mb-2 block">
                Rating
              </Label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearRating}
                  className="mr-4"
                >
                  Clear
                </Button>
                {[...Array<number>(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <Star
                      key={index}
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        ratingValue <= (hover ?? rating ?? 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  );
                })}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
                Selected rating: {rating ?? 0} star
                {(rating ?? 0) !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="mb-4">
              <Label htmlFor="review" className="text-foreground mb-2 block">
                Your Review
              </Label>
              <Textarea
                id="review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
