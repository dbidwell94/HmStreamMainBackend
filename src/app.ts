import Koa, { Context } from "koa";
import HttpStatus from "http-status-codes";
import dotenv from "dotenv";
dotenv.config();

const app = new Koa();

app.use(async (ctx: Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    ctx.status =
      error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    error.status = ctx.status;
    ctx.body = { error };
    ctx.app.emit("error", error, ctx);
  }
});

app.on("error", console.error);

export default app;
