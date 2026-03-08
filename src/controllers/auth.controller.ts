// import { Request, Response } from "express";
import { RequestHandler } from "express";

// export const register = (req: Request, res: Response) => {
//   res.send("Register endpoint working");
// };
export const register: RequestHandler = (req, res) => {
  res.send("Register endpoint working");
};



// export const login = (req: Request, res: Response) => {
//   res.send("Login endpoint working");
// };

export const login: RequestHandler = (req, res) => {
  res.send("Login endpoint working");
};