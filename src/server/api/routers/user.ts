import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const getUser = protectedProcedure.query(async ({ ctx }) => {
  const user = await db.user.findUnique({
    where: {
      id: ctx.session?.user.id,
    },
  });

  return {
    user,
  };
});

const updateUser = protectedProcedure
  .input(
    z.object({
      name: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const user = await db.user.update({
      where: {
        id: ctx.session?.user.id,
      },
      data: {
        name: input.name,
      },
    });

    return {
      user,
    };
  });

const getUserReviews = protectedProcedure.query(async ({ ctx }) => {
  const reviews = await db.review.findMany({
    where: {
      userId: ctx.session?.user.id,
    },
    include: {
      book: true,
    },
  });

  return reviews;
});

export const userRouter = createTRPCRouter({
  getUser,
  updateUser,
  getUserReviews,
});
