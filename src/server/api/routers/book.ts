import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";

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
      base64Cover: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const coverUUID = crypto.randomUUID();

    const coversDir = path.join(process.cwd(), "public/covers");

    // Extract MIME type from the Base64 string
    const matches = input.base64Cover.match(/^data:(image\/\w+);base64,/);

    if (!matches) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid image data",
      });
    }

    console.log("matches", matches);

    const mimeType = matches[1];
    const base64Data = input.base64Cover.replace(
      /^data:image\/\w+;base64,/,
      "",
    );

    if (mimeType?.split("/").length !== 2) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid image data",
      });
    }

    // Determine file extension based on MIME type
    const extension = mimeType.split("/")[1];

    if (!extension) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid image data",
      });
    }

    const filePath = path.join(coversDir, `cover-${coverUUID}.${extension}`);

    // Validate image types (png, jpeg, gif, etc.)
    const validImageTypes = ["png", "jpeg", "jpg"];
    if (!validImageTypes.includes(extension)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unsupported image format",
      });
    }

    if (!fs.existsSync(coversDir)) {
      fs.mkdirSync(coversDir);
    }

    // Save the file with the correct extension
    fs.writeFileSync(filePath, base64Data, "base64");

    const book = await db.book.create({
      data: {
        title: input.title,
        author: input.author,
        description: input.description,
        image: `/covers/cover-${coverUUID}.${extension}`,
        b64Image: input.base64Cover,
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
        bookId: book.id,
      },
    });

    return book;
  });

const deleteFromUserBooks = protectedProcedure
  .input(
    z.object({
      userBookId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    await db.userBook.delete({
      where: {
        id: input.userBookId,
        userId: ctx.session?.user.id,
      },
    });

    return true;
  });

export const bookRouter = createTRPCRouter({
  getUserBooks,
  getBookById,
  updateProgress,
  getUserBook,
  addBook,
  deleteFromUserBooks,
});
