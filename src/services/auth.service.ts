import prisma from "../config/prisma";
import bcrypt from "bcrypt";

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
    //if not exist then i need to hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
//create user to database
        const user = await prisma.users.create({
        data: {
            email: email,
            password_hash: hashedPassword,
            name: name,
        },
        });
  
  return user;
};