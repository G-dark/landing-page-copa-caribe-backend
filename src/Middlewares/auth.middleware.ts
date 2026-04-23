import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../App/config.js";

export interface AuthRequest extends Request {
  user?: {
    username: string;
    email?: string;
    rol: "Admin" | "User";
    team:[string]
  };
}
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET as string) as {
      username: string;
      email?: string;
      rol: "Admin" | "User";
      team: [string];
    };
    if (decoded) {
    req.user = decoded;
    next();
  }

  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }


};
