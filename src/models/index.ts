import IpAddress from "./ipAddress";
import User from "./user";
import { RouterContext } from "koa-router";
import httpStatus from "http-status-codes";

class ExtractionError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function extractObjectFromBody<T>(
  ctx: RouterContext,
  parseClass: new () => T,
  classEnum: Object
): T {
  const { body } = ctx.request;
  const toReturn = new parseClass();

  if (!body) {
    throw new ExtractionError("Request body is empty", httpStatus.NOT_FOUND);
  }

  Object.keys(classEnum).forEach((key) => {
    if (!(key in body)) {
      throw new ExtractionError(
        `${key} is not in request body`,
        httpStatus.NOT_FOUND
      );
    }
    toReturn[key] = body[key];
  });

  return toReturn;
}

export default [IpAddress, User];
