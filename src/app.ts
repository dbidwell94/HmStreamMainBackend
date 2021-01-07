import Koa, { Context } from "koa";
import HttpStatus from "http-status-codes";
import dotenv from "dotenv";
import koaBody from 'koa-body';
import * as routes from "./router";

dotenv.config();

const app = new Koa();
app.use(koaBody({multipart: true}));

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

app.use(async (ctx: Context, next: () => Promise<any>) => {
  ctx.set("Content-Type", "application/json");
  await next();
});

app.use(routes.userRoute.default.routes());
app.use(routes.userRoute.default.allowedMethods);

app.on("error", console.error);

export default app;
