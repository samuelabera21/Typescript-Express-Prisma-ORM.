import rateLimit from "express-rate-limit";

const baseRateLimitOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

export const registerLimiter = rateLimit({
  ...baseRateLimitOptions,
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: { message: "Too many register attempts. Try again in 15 minutes." },
});

export const loginLimiter = rateLimit({
  ...baseRateLimitOptions,
  windowMs: 15 * 60 * 1000,
  max: 12,
  message: { message: "Too many login attempts. Try again in 15 minutes." },
});

export const refreshLimiter = rateLimit({
  ...baseRateLimitOptions,
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: { message: "Too many refresh requests. Slow down and retry shortly." },
});

export const logoutLimiter = rateLimit({
  ...baseRateLimitOptions,
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: { message: "Too many logout requests. Slow down and retry shortly." },
});

export const resendVerificationLimiter = rateLimit({
  ...baseRateLimitOptions,
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many verification email requests. Try again later." },
});
