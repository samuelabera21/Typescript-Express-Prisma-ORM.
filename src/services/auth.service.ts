import prisma from "../config/prisma";
import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";


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
        throw new Error("User already exists");
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

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      role: user.role
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id
    },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};


export const refreshAccessToken = async (token: string) => {

  const decoded = jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET!
  ) as any;

  const newAccessToken = jwt.sign(
    {
      userId: decoded.userId
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return {
    accessToken: newAccessToken
  };
};