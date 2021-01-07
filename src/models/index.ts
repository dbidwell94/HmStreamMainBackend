import IpAddress from "./ipAddress";
import User from "./user";
import { Context } from "koa";

class ExtractionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function extractObjectFromBody<T>(
  ctx: Context,
  parseClass: new () => T,
  classEnum: Object
): T {
  const { body } = ctx.request;
  const toReturn = new parseClass();

  if (!body) {
    throw new ExtractionError("Request body is empty");
  }
  
  Object.keys(classEnum).forEach(key => {
    if(!(key in body)) {
      throw new ExtractionError(`${key} is not in request body`);
    }
    toReturn[key] = body[key];
  })

  return toReturn;
}

export default [IpAddress, User];
