import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const getUserBooks = protectedProcedure.query(async ({ ctx }) => {
  const books = await db.userBook.findMany({
    where: {
      userId: ctx.session?.user.id,
    },
    include: {
      book: true,
    },
  });

  return books;
});

const getBookById = protectedProcedure
  .input(
    z.object({
      id: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const book = await db.book.findUnique({
      where: {
        id: input.id,
      },
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return book;
  });

export const bookRouter = createTRPCRouter({
  getUserBooks,
  getBookById,
});
