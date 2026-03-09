
import { CookieOptions, RequestHandler } from "express";
import { registerUser } from "../services/auth.service";
import { deleteUnverifiedUserById } from "../services/auth.service";
import { loginUser } from "../services/auth.service";

import { refreshAccessToken } from "../services/auth.service";
import { resendVerification } from "../services/auth.service";
import { verifyEmailToken } from "../services/auth.service";
import { sendVerificationEmail } from "../services/email.service";

const showDebugVerificationLinks =
  process.env.DEBUG_EMAIL_LINKS === "true";

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

  try {
    const result = await registerUser(email, password, name);

    try {
      await sendVerificationEmail(email, result.verificationUrl);
    } catch (emailError) {
      if (!showDebugVerificationLinks) {
        await deleteUnverifiedUserById(result.user.id);
        throw new Error(
          `Could not send verification email. Please check RESEND settings and try again. ${
            emailError instanceof Error ? emailError.message : ""
          }`.trim()
        );
      }

      return res.status(202).json({
        message:
          "Email provider blocked delivery in sandbox mode. Use the debug verification link below.",
        user: result.user,
        verificationUrl: result.verificationUrl,
        verificationToken: result.verificationToken,
      });
    }

    const responseBody: {
      message: string;
      user: typeof result.user;
      verificationUrl?: string;
      verificationToken?: string;
    } = {
      message: "Registration successful. Verification email sent.",
      user: result.user,
    };

    if (showDebugVerificationLinks) {
      responseBody.verificationUrl = result.verificationUrl;
      responseBody.verificationToken = result.verificationToken;
    }

    return res.status(201).json({
      ...responseBody,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    return res.status(400).json({
      message,
    });
  }
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

export const verifyEmail: RequestHandler = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({
        message: "Email and token are required",
      });
    }

    const result = await verifyEmailToken(email, token);

    return res.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Email verification failed";

    return res.status(400).json({
      message,
    });
  }
};

export const resendVerificationEmail: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result = await resendVerification(email);

    try {
      await sendVerificationEmail(email, result.verificationUrl);
    } catch (emailError) {
      if (!showDebugVerificationLinks) {
        throw emailError;
      }

      return res.status(202).json({
        message:
          "Email provider blocked delivery in sandbox mode. Use the debug verification link below.",
        verificationUrl: result.verificationUrl,
        verificationToken: result.verificationToken,
      });
    }

    const responseBody: {
      message: string;
      verificationUrl?: string;
      verificationToken?: string;
    } = {
      message: "Verification email sent",
    };

    if (showDebugVerificationLinks) {
      responseBody.verificationUrl = result.verificationUrl;
      responseBody.verificationToken = result.verificationToken;
    }

    return res.json(responseBody);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unable to resend verification email";

    return res.status(400).json({
      message,
    });
  }
};