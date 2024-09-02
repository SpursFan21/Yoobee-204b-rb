import { z } from "zod";
import { db } from "~/server/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

import sharp from "sharp";

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

const getBookById = publicProcedure
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


const addBook = protectedProcedure
  .input(
    z.object({
      title: z.string(),
      author: z.string(),
      description: z.string(),
      base64Cover: z.string(),
      publisher: z.string(),
      publicationDate: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
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

    // Validate image types (png, jpeg, gif, etc.)
    const validImageTypes = ["png", "jpeg", "jpg"];
    if (!validImageTypes.includes(extension)) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Unsupported image format",
      });
    }

    // make sure the image is not too large
    const maxFileSize = 1024 * 1024 * 8; // 8MB
    const fileSize = input.base64Cover.length - matches[0].length;
    if (fileSize > maxFileSize) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Image is too large. Max size is 8MB",
      });
    }

    // Create a buffer from the Base64 string
    const buffer = Buffer.from(
      input.base64Cover.replace(/^data:image\/\w+;base64,/, ""),
      "base64",
    );

    // Resize the image to 300x300 but keep the aspect ratio and convert to webp
    const resizedImage = await sharp(buffer)
      .resize({ width: 300, height: 400, fit: "contain" })
      .webp()
      .toBuffer();

    const webImage = `data:image/webp;base64,${resizedImage.toString("base64")}`;

    const book = await db.book.create({
      data: {
        title: input.title,
        author: input.author,
        description: input.description,
        publisher: input.publisher,
        publicationDate: new Date(input.publicationDate),
        b64Image: webImage,
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
  addBook,
  deleteFromUserBooks,
});
