import { z } from "zod";
import { db } from "~/server/db";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";


export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.user.findUnique({
      where: {
        id: ctx.session?.user.id,
      },
    });

    return {
      user,
    };
  }),

  updateUser: protectedProcedure.input(z.object({
    name: z.string(),
  })).mutation(async ({ input, ctx }) => {


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
  }
  )
});