import prisma from "../config/prisma";


export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {

    //here i need to check email is already exist or not
        const existingUser = await prisma.users.findUnique({
        where: { email },
        });

        if (existingUser) {
        return "User already exists";
        }


  
  return "Register logic coming soon";
};