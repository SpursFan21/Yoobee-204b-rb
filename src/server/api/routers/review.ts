// src/server/api/routers/review.ts
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { db } from "~/server/db";

// Define the schema using zod
const reviewSchema = z.object({
  rating: z.number().min(1).max(100),
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

// Create the reviewRouter
export const reviewRouter = createTRPCRouter({
  create: createReview,
});
