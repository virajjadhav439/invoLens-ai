import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const sessionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const existingSession = req.cookies?.involens_session;

  if (!existingSession) {
    const sessionId = crypto.randomUUID();

    res.cookie("involens_session", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
      signed: true
    });
  }

  next();
};