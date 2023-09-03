import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ],
});

prisma.$on("query", (e) => {
  console.log({
    from: "prisma",
    query: e.query,
    duration: `${e.duration}ms`,
  });
});
