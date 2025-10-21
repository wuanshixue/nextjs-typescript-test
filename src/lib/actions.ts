"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "./client";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const switchFollow = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not authenticated!");
    }

    try {
        const existingFollow = await prisma.follower.findFirst({
            where: {
                followerId: currentUserId,
                followingId: userId,
            },
        });

        if (existingFollow) {
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id,
                },
            });
        } else {
            const existingFollowRequest = await prisma.followRequest.findFirst({
                where: {
                    senderId: currentUserId,
                    receiverId: userId,
                },
            });

            if (existingFollowRequest) {
                await prisma.followRequest.delete({
                    where: {
                        id: existingFollowRequest.id,
                    },
                });
            } else {
                await prisma.followRequest.create({
                    data: {
                        senderId: currentUserId,
                        receiverId: userId,
                    },
                });
            }
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const switchBlock = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not Authenticated!!");
    }

    try {
        const existingBlock = await prisma.block.findFirst({
            where: {
                blockerId: currentUserId,
                blockedId: userId,
            },
        });

        if (existingBlock) {
            await prisma.block.delete({
                where: {
                    id: existingBlock.id,
                },
            });
        } else {
            await prisma.block.create({
                data: {
                    blockerId: currentUserId,
                    blockedId: userId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const acceptFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not Authenticated!!");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (existingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowRequest.id,
                },
            });

            await prisma.follower.create({
                data: {
                    followerId: userId,
                    followingId: currentUserId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const declineFollowRequest = async (userId: string) => {
    const { userId: currentUserId } = auth();

    if (!currentUserId) {
        throw new Error("User is not Authenticated!!");
    }

    try {
        const existingFollowRequest = await prisma.followRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: currentUserId,
            },
        });

        if (existingFollowRequest) {
            await prisma.followRequest.delete({
                where: {
                    id: existingFollowRequest.id,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const updateProfile = async (formData:FormData,cover:string)=>{
    const fields = Object.fromEntries(formData);

    const filteredFields = Object.fromEntries(
        Object.entries(fields).filter(([_, value]) => value !== "")
    )

    const Profile = z.object({
        cover: z.string().optional(),
        name: z.string().max(60).optional(),
        surname: z.string().max(60).optional(),
        description: z.string().max(255).optional(),
        city: z.string().max(60).optional(),
        school: z.string().max(60).optional(),
        work: z.string().max(60).optional(),
        website: z.string().max(60).optional(),
    });

    const validatedFields = Profile.safeParse({ cover, ...filteredFields });

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return ;
    }

    const { userId } = auth();

    if (!userId) {
        return ;
    }

    try {
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: validatedFields.data,
        });
        return ;
    } catch (err) {
        console.log(err);
        return ;
    }
};

export const switchLike = async (postId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const existingLike = await prisma.like.findFirst({
            where: {
                postId,
                userId,
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
        } else {
            await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
        }
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong");
    }
};

export const addComment = async (postId: number, desc: string) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const createdComment = await prisma.comment.create({
            data: {
                desc,
                userId,
                postId,
            },
            include: {
                user: true,
            },
        });

        return createdComment;
    } catch (err) {
        console.log(err);
        throw new Error("Something went wrong!");
    }
};

export const deleteComment = async (commentId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        // 只允许作者本人删除
        await prisma.comment.deleteMany({
            where: {
                id: commentId,
                userId,
            },
        });

        revalidatePath("/"); // 或者你也可以写 revalidatePath(`/post/${postId}`) 视项目情况
    } catch (err) {
        console.log("deleteComment error:", err);
        throw new Error("Failed to delete comment!");
    }
};


export const addPost = async (formData: FormData, img: string) => {
    const desc = formData.get("desc") as string;

    const Desc = z.string().min(1).max(255);

    const validatedDesc = Desc.safeParse(desc);

    if (!validatedDesc.success) {
        //TODO
        console.log("description is not valid");
        return;
    }
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.post.create({
            data: {
                desc: validatedDesc.data,
                userId,
                img,
            },
        });

        revalidatePath("/");
    } catch (err) {
        console.log(err);
    }
};

export const addStory = async (img: string) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        const existingStory = await prisma.story.findFirst({
            where: {
                userId,
            },
        });

        if (existingStory) {
            await prisma.story.delete({
                where: {
                    id: existingStory.id,
                },
            });
        }
        const createdStory = await prisma.story.create({
            data: {
                userId,
                img,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
            include: {
                user: true,
            },
        });

        return createdStory;
    } catch (err) {
        console.log(err);
    }
};

export const deletePost = async (postId: number) => {
    const { userId } = auth();

    if (!userId) throw new Error("User is not authenticated!");

    try {
        await prisma.post.delete({
            where: {
                id: postId,
                    userId,
            },
        });
        revalidatePath("/")
    } catch (err) {
        console.log(err);
    }
};

export const getUser = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const getConversation = async (receiverId: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  try {
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: currentUserId, participant2Id: receiverId },
          { participant1Id: receiverId, participant2Id: currentUserId },
        ],
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participant1Id: currentUserId,
          participant2Id: receiverId,
        },
        include: {
          messages: true,
        },
      });
    }

    return conversation;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const sendMessage = async (receiverId: string, text: string) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  if (!text.trim()) {
    throw new Error("Message cannot be empty!");
  }

  try {
    const conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participant1Id: currentUserId, participant2Id: receiverId },
          { participant1Id: receiverId, participant2Id: currentUserId },
        ],
      },
    });

    if (!conversation) {
      // If no conversation exists, we can't send a message to it.
      // Depending on the desired UX, you might want to create one here first.
      // For now, we'll throw an error.
      throw new Error("Conversation not found!");
    }

    const newMessage = await prisma.message.create({
      data: {
        text,
        senderId: currentUserId,
        conversationId: conversation.id,
      },
    });

    return newMessage;
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong!");
  }
};

export const getNotifications = async (currentUserId: string | null) => {
  if (!currentUserId) {
    return [];
  }

  try {
    const notifications = await prisma.message.findMany({
      where: {
        isRead: false,
        conversation: {
          OR: [
            { participant1Id: currentUserId },
            { participant2Id: currentUserId },
          ],
        },
        senderId: {
          not: currentUserId,
        },
      },
      include: {
        sender: true,
        conversation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notifications;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const readConversation = async (conversationId: number) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    throw new Error("User is not authenticated!");
  }

  try {
    await prisma.message.updateMany({
      where: {
        conversationId: conversationId,
        senderId: {
          not: currentUserId,
        },
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong!");
  }
};
