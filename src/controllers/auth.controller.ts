
import { RequestHandler } from "express";
import { registerUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

export const register: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;

  const result = await registerUser(email, password, name);

  res.send(result);
};

export const login: RequestHandler = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    return res.json({
      message: "Login successful",
      data: result
    });

  } catch (error: any) {

    return res.status(401).json({
      message: error.message
    });

  }
};