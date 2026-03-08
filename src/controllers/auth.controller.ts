import { RequestHandler } from "express";
import { registerUser } from "../services/auth.service";

export const register: RequestHandler = async (req, res) => {
  const result = await registerUser();

  res.send(result);
};

export const login: RequestHandler = (req, res) => {
  res.send("Login endpoint working");
};