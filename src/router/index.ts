import Router, { RouterContext } from "koa-router";
import UserRouter from "./userRoute";
import AddressRouter from "./ipAddressRoute";
import httpStatus from "http-status-codes";
import cors from "@koa/cors";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.get("/", async (ctx: RouterContext) => {
  ctx.body = { status: "online" };
  ctx.status = httpStatus.OK;
});

apiRouter.use("/users", UserRouter.routes());
apiRouter.use(UserRouter.allowedMethods());
apiRouter.use("/addresses", AddressRouter.routes());
apiRouter.use(AddressRouter.allowedMethods());

export default {
  routes: apiRouter.routes(),
  methods: apiRouter.allowedMethods(),
};
