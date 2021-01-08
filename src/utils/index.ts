import { ExtendableContext, Middleware } from "koa";
import { RouterContext, IMiddleware } from "koa-router";
import httpStatus from "http-status-codes";
import jwt from "koa-jwt";

class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const SECRET = process.env.SECRET || "secret";
