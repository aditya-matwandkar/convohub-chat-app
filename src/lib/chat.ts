import { db } from "./db";

export const getOrCreateChat = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let chat =
    (await findChat(memberOneId, memberTwoId)) ||
    (await findChat(memberTwoId, memberOneId));

  if (!chat) {
    chat = await createNewChat(memberOneId, memberTwoId);
  }

  return chat;
};

//Find if chat between two members already exists.
const findChat = async (memberOneId: string, memberTwoId: string) => {
  try {
    const chat = await db.chat.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return chat;
  } catch (error) {
    return null;
  }
};

const createNewChat = async (memberOneId: string, memberTwoId: string) => {
  try {
    const newChat = await db.chat.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return newChat;
  } catch (error) {
    return null;
  }
};
