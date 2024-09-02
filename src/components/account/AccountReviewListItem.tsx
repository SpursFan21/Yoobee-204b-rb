import { Review, type Book, type UserBook } from "@prisma/client";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useState } from "react";

import StarRating from "../Review/StarRating";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "react-toastify";
import toastOptions from "~/utils/toastOptions";

type AccountReviewListProps = {
  review: Review & { book: Book };
};

export default function AccountReviewListItem({
  review,
}: AccountReviewListProps) {
  const myBooks = api.book.getUserBooks.useQuery();
  const myUserReviews = api.user.getUserReviews.useQuery();
  const deleteReviewMutation = api.review.deleteReview.useMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const deleteBook = async () => {
    deleteReviewMutation.mutate(
      { id: review.id },
      {
        onSuccess: () => {
          myBooks.refetch().then().catch(console.error);
          setDeleteDialogOpen(false);
          toast.success("Review deleted successfully", toastOptions);

          // Refetch the user's reviews
          myUserReviews.refetch().then().catch(console.error);
        },
        onError: (error) => {
          console.error("Error deleting review:", error);
          toast.error("Error deleting review", toastOptions);
        },
      },
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const publicationDateString =
    review.book.publicationDate instanceof Date
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        review.book.publicationDate.toDateString()
      : "Unknown";

  return (
    <>
      <TableRow key={review.id}>
        <TableCell className="w-24 min-w-24 md:w-32">
          <Link href={`/book/${review.book.id}`}>
            <Image
              src={review.book.b64Image ?? ""}
              alt="book cover"
              width={100}
              height={100}
            />
          </Link>
        </TableCell>
        <TableCell className="font-semibold">{review.book.title}</TableCell>
        <TableCell>
          <StarRating rating={review.rating} />
        </TableCell>
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
                  <Link href={`/book/${review.book.id}`}>View Book</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReviewDialogOpen(true)}>
                  View Review
                </DropdownMenuItem>
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

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-32 md:w-1/3 mx-auto">
                  <Image
                    src={review.book.b64Image ?? ""}
                    alt="Book cover"
                    width={300}
                    height={400}
                    className="rounded-lg object-cover shadow-md"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <div className="mb-2 text-3xl font-bold text-white">
                    {review.book.title}
                  </div>

                  <div className="mb-2 flex items-center justify-center md:justify-start">
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mb-4 text-gray-400">{review.book.author}</p>
                  <p className="font-semibold text-gray-200">Comment:</p>
                  <p className="mb-6 text-gray-100">
                    {review.comment}
                  </p>
     
                </div>
                <div className="w-full md:w-2/3">
                <Button variant={"destructive"} onClick={() => {
                  setReviewDialogOpen(false);
                  setDeleteDialogOpen(true);
                }}>
                  Delete Review
                </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
