
import { CookieOptions, RequestHandler } from "express";
import { registerUser } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

import { refreshAccessToken } from "../services/auth.service";

const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

const accessCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions: CookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register: RequestHandler = async (req, res) => {
  const { email, password, name } = req.body;

  const result = await registerUser(email, password, name);

  res.send(result);
};

export const login: RequestHandler = async (req, res) => {
  try {

    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.cookie("accessToken", result.accessToken, accessCookieOptions);
    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    return res.json({
      message: "Login successful",
      user: result.user
    });

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    return res.status(401).json({
      message
    });

  }
};


export const refreshToken: RequestHandler = async (req, res) => {

  try {

    const tokenFromCookie = req.cookies?.refreshToken as
      | string
      | undefined;

    if (!tokenFromCookie) {
      return res.status(401).json({
        message: "Refresh token missing"
      });
    }

    const token = await refreshAccessToken(tokenFromCookie);

    res.cookie("accessToken", token.accessToken, accessCookieOptions);

    return res.json({
      message: "Token refreshed"
    });

  } catch (error) {

    return res.status(401).json({
      message: "Invalid refresh token"
    });

  }

};

export const logout: RequestHandler = async (_req, res) => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);

  return res.json({
    message: "Logout successful"
  });
};