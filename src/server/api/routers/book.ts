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

  books.sort((a, b) => {
    return a.book.title.localeCompare(b.book.title);
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

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    return book;
  });

const updateProgress = protectedProcedure
  .input(
    z.object({
      id: z.string(),
      progress: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const book = await db.userBook.update({
      where: {
        id: input.id,
        userId: ctx.session?.user.id,
      },
      data: {
        progress: input.progress,
      },
    });

    return book;
  });

const getUserBook = protectedProcedure
  .input(
    z.object({
      bookId: z.string(),
      userId: z.string(),
    }),
  )
  .query(async ({ input }) => {
    const book = await db.userBook.findFirst({
      where: {
        userId: input.userId,
        bookId: input.bookId,
      },
    });

    return book;
  });

const addBook = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      author: z.string(),
      description: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const book = await db.book.create({
      data: {
        title: input.title,
        author: input.author,
        description: input.description,
        image: "",
        createdBy: {
          connect: {
            id: ctx.session?.user.id,
          },
        },
      },
    });

    await db.userBook.create({
      data: {
        userId: ctx.session?.user.id,
        bookId: book.id
      },
    });

    return book;
  });

export const bookRouter = createTRPCRouter({
  getUserBooks,
  getBookById,
  updateProgress,
  getUserBook,
  addBook,
});
