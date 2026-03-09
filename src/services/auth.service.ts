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
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser?.email_verified) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = createVerificationToken();
  const verificationExpires = createVerificationExpiry();

  await prisma.pending_users.upsert({
    where: { email },
    update: {
      password_hash: hashedPassword,
      name,
      role: "user",
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    },
    create: {
      email,
      password_hash: hashedPassword,
      name,
      role: "user",
      verification_token: verificationToken,
      verification_expires: verificationExpires,
    },
  });

  return {
    verificationToken,
    verificationUrl: buildVerificationUrl(verificationToken, email),
  };
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
  const pending = await prisma.pending_users.findUnique({
    where: { email },
  });

  if (pending) {
    if (pending.verification_token !== token) {
      throw new Error("Invalid verification link");
    }

    if (pending.verification_expires.getTime() < Date.now()) {
      throw new Error("Verification link expired");
    }

    await prisma.$transaction(async (tx) => {
      const existingUser = await tx.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        await tx.users.update({
          where: { email },
          data: {
            password_hash: pending.password_hash,
            name: pending.name,
            role: pending.role,
            email_verified: true,
            verification_token: null,
            verification_expires: null,
          },
        });
      } else {
        await tx.users.create({
          data: {
            email,
            password_hash: pending.password_hash,
            name: pending.name,
            role: pending.role,
            email_verified: true,
            verification_token: null,
            verification_expires: null,
          },
        });
      }

      await tx.pending_users.delete({
        where: { email },
      });
    });

    return {
      message: "Email verified successfully",
    };
  }

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
  const pending = await prisma.pending_users.findUnique({
    where: { email },
  });

  if (pending) {
    const verificationToken = createVerificationToken();
    const verificationExpires = createVerificationExpiry();

    await prisma.pending_users.update({
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
  }

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("No pending registration found for this email");
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