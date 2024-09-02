// src/server/api/routers/review.ts
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

// Define the schema using zod
const reviewSchema = z.object({
  rating: z.number().min(0).max(5),
  comment: z.string().min(1),
  bookId: z.string().cuid(),
});

const createReview = protectedProcedure
  .input(reviewSchema)
  .mutation(async ({ input, ctx }) => {
    const { rating, comment, bookId } = input;

    // Get the userId from the session
    const userId = ctx.session.user.id;
    if (!userId) {
      throw new Error("User not found");
    }

    const review = await db.review.create({
      data: {
        comment,
        rating,
        book: { connect: { id: bookId } },
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return review;
  });

  const getReviewsForBook = publicProcedure
  .input(z.object({ bookId: z.string().cuid() }))
  .query(async ({input}) => {
    const reviews = await db.review.findMany({
      where: {
        bookId: input.bookId,
      },
      include: {
        user: {select: {name: true, image: true}},
      },
    });

    return reviews;
  });

  const deleteReview = protectedProcedure
  .input(z.object({id: z.string().cuid()}))
  .mutation(async ({input, ctx}) => {
    const userId = ctx.session.user.id;
    if (!userId) {
      throw new Error("User not found");
    }

    const review = await db.review.findFirst({
      where: {
        id: input.id,
        userId,
      },
    });

    if (!review) {
      throw new Error("Review not found");
    }

    await db.review.delete({
      where: {
        id: input.id,
      },
    });

    return review;
  });


// Create the reviewRouter
export const reviewRouter = createTRPCRouter({
  create: createReview,
  getReviewsForBook,
  deleteReview,
});
