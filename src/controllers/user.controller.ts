import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getProfile = async (req: Request, res: Response) => {
  try {

    const userId = (req as any).user.userId;

    const user = await prisma.users.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        role: true,
        created_at : true
      }
    });

    res.json({
      message: "User profile fetched from database",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};