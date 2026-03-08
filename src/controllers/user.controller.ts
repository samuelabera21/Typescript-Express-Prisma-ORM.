import { Request, Response } from "express";
import { getUserProfile } from "../services/user.service";
import { deleteUserProfile } from "../services/user.service";
import { updateUserProfile } from "../services/user.service";
import { deleteUserByAdmin } from "../services/user.service";
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


export const updateProfile = async (req: Request, res: Response) => {
  try {

    const userId = (req as any).user.userId;

    const { name, email } = req.body;

    const user = await updateUserProfile(userId, name, email);

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error: any) {

    res.status(400).json({
      message: error.message
    });

  }
};



export const deleteUser = async (req: Request, res: Response) => {
  try {

    const userId = Number(req.params.id);

    const result = await deleteUserByAdmin(userId);

    res.json(result);

  } catch (error: any) {

    res.status(404).json({
      message: error.message
    });

  }
};