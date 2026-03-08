import { Request, Response } from "express";
import { getUserProfile } from "../services/user.service";
import { deleteUserProfile } from "../services/user.service";

export const getProfile = async (req: Request, res: Response) => {
  try {

    const userId = (req as any).user.userId;

    const user = await getUserProfile(userId);

    res.json({
      message: "User profile fetched",
      user
    });

  } catch (error: any) {

    res.status(404).json({
      message: error.message
    });

  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const result = await deleteUserProfile(userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};