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



export const updateUserProfile = async (
  userId: number,
  name?: string,
  email?: string
) => {

  if (!name && !email) {
    throw new Error("No fields provided for update");
  }

  if (email) {

    const existingUser = await prisma.users.findUnique({
      where: { email }
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error("Email already in use");
    }

  }

  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      name,
      email
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      created_at: true
    }
  });

  return user;
};


export const deleteUserByAdmin = async (userId: number) => {

  const user = await prisma.users.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.users.delete({
    where: { id: userId }
  });

  return {
    message: "User deleted successfully"
  };

};