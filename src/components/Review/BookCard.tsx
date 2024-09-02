import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Star } from "lucide-react";
import { type Book } from "@prisma/client";
import Image from "next/image";
import StarRating from "./StarRating";

type props = {
  book: Book;
  stars: number;
};


export default function BookCard({ book, stars }: props) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const publicationDateString =
    book.publicationDate instanceof Date
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        book.publicationDate.toDateString()
      : "Unknown";
  return (
    <Card className="mx-auto max-w-4xl">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="w-full md:w-1/3">
            <Image
              src={book.b64Image ?? ""}
              alt="Book cover"
              width={300}
              height={400}
              className="rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="w-full md:w-2/3">
            <CardHeader className="p-0">
              <CardTitle className="mb-2 text-3xl font-bold">
                {book.title}
              </CardTitle>
            </CardHeader>
            <div className="mb-4 flex items-center">
              <div className="mr-2 flex">
                <StarRating rating={stars} />
              </div>
              <span className="text-sm text-gray-300">{stars.toFixed(1)} out of 5</span>
            </div>
            <p className="mb-4 text-gray-300">{book.author}</p>
            <p className="mb-6 text-gray-200">{book.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Publisher:</span>{" "}
                {book.publisher ?? "Unknown"}
              </p>
              <p className="text-sm text-gray-300">
                <span className="font-semibold">Publication Date:</span>{" "}
                {publicationDateString}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
