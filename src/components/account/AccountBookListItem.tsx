import { type Book } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

type AccountBookListProps = {
  book: Book;
};

const renew = (event: React.MouseEvent) => {
  event.preventDefault();
  console.log("renew");
};

const returnBook = (event: React.MouseEvent) => {
  event.preventDefault();
  console.log("return");
};

export default function AccountBookListItem({ book }: AccountBookListProps) {
  return (
    <Link
      href={`/book/${book.id}`}
      className="flex w-full gap-4 rounded-lg bg-black bg-opacity-30 p-2 transition-colors hover:bg-opacity-50"
    >
      <div className="w-12 shrink-0 md:w-24">
        <Image src={book.image} alt="book cover" width={1000} height={1000} />
      </div>

      <div className="flex flex-col">
        <div className="flex gap-4">
          <div className="flex flex-col md:flex-row md:gap-2">
            <h2 className="self-end text-lg md:text-2xl">{book.title}</h2>
            <p className="text-xs md:text-sm text-gray-400 md:self-end">{book.author}</p>
          </div>

          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size={"sm"} onClick={renew}>
              Renew
            </Button>
            <Button variant="destructive" size={"sm"} onClick={returnBook}>
              Return
            </Button>
          </div>
        </div>

        {/* <div className=""> */}
        {/* <p className="line-clamp-2 text-xs">
            {book.description}
          </p> */}
        {/* </div> */}
      </div>
    </Link>
  );
}
