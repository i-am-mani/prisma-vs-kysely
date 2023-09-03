"use server";
import { kysely } from "@/kyesely/client";
import { prisma } from "@/prisma/client";
import { faker } from "@faker-js/faker";
import { benchmark } from "./utils";

export async function readPostsWithUID() {
  "use server";

  const userResponse = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: faker.string.uuid(),
      username: faker.person.firstName(),
    },
  });

  await prisma.post.createMany({
    data: Array(20)
      .fill(0)
      .map(() => ({
        content: faker.lorem.sentence(),
        userId: userResponse.id,
      })),
  });

  const prismaQuery = await benchmark(
    prisma.post.findMany({
      where: {
        userId: {
          equals: userResponse.id,
        },
      },
      select: {
        content: true,
      },
    })
  );

  const id = faker.number.int({ min: 500000, max: 1000000 });
  const kUser = await kysely
    .insertInto("User")
    .values({
      email: faker.internet.email(),
      password: faker.string.uuid(),
      username: faker.person.firstName(),
      id: id,
    })
    .execute();

  const kPost = await kysely
    .insertInto("Post")
    .values(
      Array(20)
        .fill(0)
        .map(() => ({
          content: faker.lorem.sentence(),
          userId: id,
        }))
    )
    .execute();

  console.log("kysely");

  const kyselyQuery = await benchmark(
    kysely
      .selectFrom("Post")
      .select("content")
      .where("userId", "=", id)
      .execute()
  );

  return {
    prisma: prismaQuery,
    kysely: kyselyQuery,
  };
}

async function prepare() {
  // Create UserA and UserB
  const userA = await prisma.user.create({
    data: {
      username: "UserA",
      email: "usera@example.com",
      password: "password",
    },
  });

  const userB = await prisma.user.create({
    data: {
      username: "UserB",
      email: "userb@example.com",
      password: "password",
    },
  });

  console.log({
    userA,
    userB,
  });

  // Create 100 more users with random details
  const users = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const username = faker.internet.userName();
      const email = faker.internet.email();
      return prisma.user.create({
        data: {
          username,
          email,
          password: "password",
        },
      });
    })
  );

  // Create random amount of posts on UserA and UserB
  const posts = await Promise.all(
    [userA, userB].map(async (user) => {
      const numPosts = Math.floor(Math.random() * 10) + 1;
      return Promise.all(
        Array.from({ length: numPosts }).map(async () => {
          const content = faker.lorem.sentence();
          return prisma.post.create({
            data: {
              content,
              author: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        })
      );
    })
  );

  console.log("Post created");

  // Each of the 100 user will follow UserA or UserB and leave a comment on other User's random Post
  await Promise.all(
    users.map(async (user) => {
      const followee = Math.random() < 0.5 ? "userA" : "userB";
      await prisma.follow.create({
        data: {
          follower: {
            connect: {
              id: user.id,
            },
          },
          following: {
            connect: {
              id: followee === "userA" ? userA.id : userB.id,
            },
          },
        },
      });

      const posts = await prisma.post.findMany({
        where: {
          author: {
            id: followee === "userA" ? userB.id : userA.id,
          },
        },
      });
      const post = posts[Math.floor(Math.random() * posts.length)];
      const content = faker.lorem.sentence();
      await prisma.comment.create({
        data: {
          content,
          author: {
            connect: {
              id: user.id,
            },
          },
          post: {
            connect: {
              id: post.id,
            },
          },
        },
      });
    })
  );

  console.log("prepare completed");

  return { userA, userB };
}

// return users that follow of user A  and who comment on user B's posts
export async function ComplexJoin() {
  // const { userA, userB } = await prepare();
  // console.log({ userA, userB });
  const userAID = 990288;
  const userBID = 990289;

  // const prismaQuery = await benchmark(
  //   prisma.user.findMany({
  //     where: {
  //       id: 2,
  //       comments: {
  //         every: {
  //           post: {
  //             author: {
  //               Following: {
  //                 some: {
  //                   id: 1,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   })
  // );

  const prismaQuery = await benchmark(
    prisma.follow.findMany({
      where: {
        followingId: userBID,
      },
      select: {
        followerId: true,
      },
    })
  );

  const usersThatFollowA = kysely
    .selectFrom("User")
    .select("User.id")
    .innerJoin("Follow", "User.id", "Follow.followerId")
    .where("Follow.followingId", "=", userBID)
    .execute();

  // const query = kysely
  //   .selectFrom("User")
  //   .selectAll()
  //   .distinct()
  //   .innerJoin("Follow as F1", "User.id", "F1.followerId")
  //   .innerJoin("Comment", "User.id", "Comment.userId")
  //   .innerJoin("Post", "Comment.postId", "Post.id")
  //   .innerJoin("Follow as F2", "Post.userId", "F2.followingId")
  //   .where("F2.followingId", "=", userAID)
  //   .where("Post.userId", "=", userBID)
  //   .execute();

  const kyselyQuery = await benchmark(usersThatFollowA);

  return {
    prisma: prismaQuery,
    kysely: kyselyQuery,
  };
}

// FROM users u
// JOIN follows f ON u.id = f.follower_id
// JOIN comments c ON c.user_id = u.id
// JOIN posts p ON p.id = c.post_id
// JOIN follows f2 ON f2.followee_id = p.user_id
// WHERE f.followee_id = 'A' AND f2.follower_id = 'B';
