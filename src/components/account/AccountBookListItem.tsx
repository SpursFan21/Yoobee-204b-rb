import { type Book, type UserBook } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { api } from "~/utils/api";

import { TableCell, TableRow } from "~/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import { useState } from "react";
import { toast } from "react-toastify";
import toastOptions from "~/utils/toastOptions";

type AccountBookListProps = {
  userBook: UserBook & { book: Book };
};

type BookProgress = "Not started" | "25%" | "50%" | "75%" | "Completed";

export default function AccountBookListItem({
  userBook,
}: AccountBookListProps) {
  const myBooks = api.book.getUserBooks.useQuery();
  const bookProgressMutation = api.book.updateProgress.useMutation();
  const deleteBookMutation = api.book.deleteFromUserBooks.useMutation();

  const [bookProgress, setBookProgress] = useState<BookProgress>(
    userBook.progress as BookProgress,
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);




  const changeProgress = async (value: string) => {
    const type = value as BookProgress;
    setBookProgress(type);
    console.log(type);

    bookProgressMutation.mutate(
      {
        id: userBook.id,
        progress: type,
      },
      {
        onSuccess: () => {
          toast.success("Account edited successfully", toastOptions);
          myBooks.refetch().then().catch(console.error);
        },
        onError: (error) => {
          toast.error(error.message, toastOptions);
          console.error(error);
        },
      },
    );
  };

  const deleteBook = async () => {
    deleteBookMutation.mutate(
      {
        userBookId: userBook.id,
      },
      {
        onSuccess: () => {
          toast.success("Book deleted successfully", toastOptions);
          myBooks.refetch().then().catch(console.error);
        },
        onError: (error) => {
          toast.error(error.message, toastOptions);
          console.error(error);
        },
      },
    );
  }


  return (
    <>
      <TableRow key={userBook.book.id}>
        <TableCell className="w-24 min-w-24 md:w-32">
          <Image
            src={userBook.book.b64Image?? ""}
            alt="book cover"
            width={100}
            height={100}
          />
        </TableCell>
        <TableCell>{userBook.book.title}</TableCell>
        <TableCell>{userBook.book.author}</TableCell>
        <TableCell>{userBook.progress}</TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/book/${userBook.book.id}`}>View</Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span>Progress</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuRadioGroup
                        value={bookProgress}
                        onValueChange={changeProgress}
                      >
                        <DropdownMenuRadioItem value="Not started">
                          Not started
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="25%">
                          25%
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="50%">
                          50%
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="75%">
                          75%
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Completed">
                          Completed
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteDialogOpen(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteBook}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
