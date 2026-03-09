import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;

function createVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createVerificationExpiry() {
  return new Date(Date.now() + VERIFICATION_EXPIRY_MS);
}

export function buildVerificationUrl(token: string, email: string) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const encodedEmail = encodeURIComponent(email);
  return `${frontendUrl}/verify-email?token=${token}&email=${encodedEmail}`;
}


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
    const verificationToken = createVerificationToken();
    const verificationExpires = createVerificationExpiry();
    
//create user to database
        const user = await prisma.users.create({
        data: {
            email: email,
            password_hash: hashedPassword,
            name: name,
            email_verified: false,
            verification_token: verificationToken,
            verification_expires: verificationExpires,
        },
        });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      email_verified: user.email_verified,
    },
    verificationToken,
    verificationUrl: buildVerificationUrl(verificationToken, user.email),
  };
};

export const deleteUnverifiedUserById = async (userId: number) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email_verified: true,
    },
  });

  if (!user || user.email_verified) {
    return;
  }

  await prisma.users.delete({
    where: { id: userId },
  });
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

  if (!user.email_verified) {
    throw new Error("Please verify your email before logging in");
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

export const verifyEmailToken = async (
  email: string,
  token: string
) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email_verified) {
    return {
      message: "Email already verified",
    };
  }

  if (!user.verification_token || user.verification_token !== token) {
    throw new Error("Invalid verification link");
  }

  if (
    !user.verification_expires ||
    user.verification_expires.getTime() < Date.now()
  ) {
    throw new Error("Verification link expired");
  }

  await prisma.users.update({
    where: { email },
    data: {
      email_verified: true,
      verification_token: null,
      verification_expires: null,
    },
  });

  return {
    message: "Email verified successfully",
  };
};

export const resendVerification = async (email: string) => {
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.email_verified) {
    throw new Error("Email is already verified");
  }

  const verificationToken = createVerificationToken();
  const verificationExpires = createVerificationExpiry();

  await prisma.users.update({
    where: { email },
    data: {
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    },
  });

  return {
    message: "Verification email sent",
    verificationToken,
    verificationUrl: buildVerificationUrl(verificationToken, email),
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