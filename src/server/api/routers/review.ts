// src/server/api/routers/review.ts
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import { db } from '~/server/db';

// Define the schema using zod
const reviewSchema = z.object({
  rating: z.number().min(1).max(100),
  comment: z.string().min(1),
  bookId: z.string().cuid(),
  userId: z.string().cuid().optional(),
});

// Create the reviewRouter
export const reviewRouter = createTRPCRouter({
  create: publicProcedure
    .input(reviewSchema)
    .mutation(async ({ input }) => {
      try {
        const { rating, comment, bookId, userId } = input;

        const reviewData: any = {
          rating,
          comment,
          book: { connect: { id: bookId } },
          ...(userId ? { user: { connect: { id: userId } } } : {}),
        };

        // Create review in the database
        const review = await db.review.create({
          data: reviewData,
          include: {
            user: { select: { name: true } },
          },
        });

        return review;
      } catch (error) {
        console.error("Error creating review:", error);
        throw new Error("Error creating review");
      }
    }),
});
