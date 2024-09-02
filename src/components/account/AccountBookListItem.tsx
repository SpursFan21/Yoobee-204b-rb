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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dialogBookTitle, setDialogBookTitle] = useState(userBook.book.title);
  const [dialogBookAuthor, setDialogBookAuthor] = useState(
    userBook.book.author,
  );
  const [dialogBookProgress, setDialogBookProgress] = useState(
    userBook.progress,
  );
  const [dialogBookCover, setDialogBookCover] = useState(
    userBook.book.b64Image,
  );
  const [dialogBookDescription, setDialogBookDescription] = useState(
    userBook.book.description,
  );

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
          toast.success("Progress edited successfully", toastOptions);
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
  };

  const openDialog = () => {
    setDialogBookTitle(userBook.book.title);
    setDialogBookAuthor(userBook.book.author);
    setDialogBookProgress(userBook.progress);
    setDialogBookCover(userBook.book.b64Image);
    setDialogBookDescription(userBook.book.description);

    setEditDialogOpen(true);
  };

  const dialogBookSubmit = async () => {
    return;
  };

  return (
    <>
      <TableRow key={userBook.book.id}>
        <TableCell className="w-24 min-w-24 md:w-32">
          <Link href={`/book/${userBook.book.id}`}>
            <Image
              src={userBook.book.b64Image ?? ""}
              alt="book cover"
              width={100}
              height={100}
            />
          </Link>
        </TableCell>
        <TableCell className="font-semibold">{userBook.book.title}</TableCell>
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
                  <Link href={`/book/${userBook.book.id}`}>View Book</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openDialog}>Edit</DropdownMenuItem>
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
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setDeleteDialogOpen(true)}
                >
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
            <DialogDescription>
              Make changes to this book here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Title
              </Label>
              <Input
                id="name"
                value={dialogBookTitle}
                onChange={(e) => setDialogBookTitle(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="author" className="text-right">
                Author
              </Label>
              <Input
                id="author"
                value={dialogBookAuthor}
                onChange={(e) => setDialogBookAuthor(e.target.value)}
                className="col-span-3"
              />

              <Label htmlFor="progress" className="text-right">
                Progress
              </Label>
              <Select
                value={dialogBookProgress}
                onValueChange={setDialogBookProgress}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not started">Not started</SelectItem>
                  <SelectItem value="25%">25%</SelectItem>
                  <SelectItem value="50%">50%</SelectItem>
                  <SelectItem value="75%">75%</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={dialogBookDescription}
                onChange={(e) => setDialogBookDescription(e.target.value)}
                className="col-span-3"
              />

              {dialogBookCover && (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Preview</Label>
                  <div className="relative flex h-full w-full justify-center">
                    <Image
                      src={dialogBookCover}
                      alt="Book cover placeholder"
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={dialogBookSubmit}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
