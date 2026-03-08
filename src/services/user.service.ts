import prisma from "../config/prisma";

export const getUserProfile = async (userId: number) => {

  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const deleteUserProfile = async (userId: number) => {

  await prisma.users.delete({
    where: {
      id: userId
    }
  });

  return {
    message: "User deleted successfully"
  };

};