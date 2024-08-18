import { type Book } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";

type AccountBookListProps = {
  book: Book;
};

export default function AccountBookList({ book }: AccountBookListProps) {
  return (
    <div className="flex w-full gap-4 rounded-lg p-2 transition-colors bg-black bg-opacity-0 hover:bg-opacity-30">
      <div className="w-24 shrink-0">
        <Image src={book.image} alt="book cover" width={1000} height={1000} />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-4">
          <h2 className="self-end text-2xl">{book.title}</h2>
          <p className="self-end text-sm text-gray-400">{book.author}</p>

          <div className="ml-auto flex gap-2">
            <Button variant="secondary"  size={"sm"}>
              Renew
            </Button>
            <Button variant="destructive" size={"sm"}>
              Return
            </Button>
          </div>
        </div>

        <div className="">
          <p className="line-clamp-2">
            {book.description} dasdasd as as as das dasd as das da
          </p>
        </div>
      </div>
    </div>
  );
}
