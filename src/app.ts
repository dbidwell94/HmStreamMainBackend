import Koa, { Context } from "koa";
import HttpStatus from "http-status-codes";
import dotenv from "dotenv";
import koaBody from "koa-body";
import apiRouter from './router';

dotenv.config();

const app = new Koa();
app.use(koaBody());

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

app.use(apiRouter.routes);
app.use(apiRouter.methods);4

app.on("error", console.error);

export default app;
