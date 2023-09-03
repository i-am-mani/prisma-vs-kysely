"use server";
import { kysely } from "@/kyesely/client";
import { prisma } from "@/prisma/client";
import { faker } from "@faker-js/faker";
import { benchmark } from "./utils";

export async function createUser() {
  "use server";
  const prismaQuery = await benchmark(
    prisma.user.createMany({
      data: {
        email: faker.internet.email(),
        password: faker.string.uuid(),
        username: faker.person.firstName(),
      },
    })
  );

  const kyselyQuery = await benchmark(
    kysely
      .insertInto("User")
      .values({
        email: faker.internet.email(),
        password: faker.string.uuid(),
        username: faker.person.firstName(),
      })
      .executeTakeFirst()
  );

  return {
    prisma: prismaQuery,
    kysely: kyselyQuery,
  };
}

export async function createManyUsers(numberOfUser: number) {
  "use server";
  const prismaQuery = await benchmark(
    prisma.user.createMany({
      data: Array(numberOfUser)
        .fill(0)
        .map(() => ({
          email: faker.internet.email(),
          password: faker.string.uuid(),
          username: faker.person.firstName(),
        })),
    })
  );

  const kyselyQuery = await benchmark(
    kysely
      .insertInto("User")
      .values(
        Array(numberOfUser)
          .fill(0)
          .map(() => ({
            email: faker.internet.email(),
            password: faker.string.uuid(),
            username: faker.person.firstName(),
          }))
      )
      .executeTakeFirst()
  );

  return {
    prisma: prismaQuery,
    kysely: kyselyQuery,
  };
}

export async function readAllUsers() {
  "use server";
  const prismaQuery = await benchmark(prisma.user.findMany());

  const kyselyQuery = await benchmark(
    kysely.selectFrom("User").selectAll().execute()
  );

  return {
    prisma: prismaQuery,
    kysely: kyselyQuery,
  };
}
