import Router, { RouterContext } from "koa-router";
import UserRouter from "./userRoute";
import AddressRouter from "./ipAddressRoute";
import httpStatus from "http-status-codes";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.get("/", async (ctx: RouterContext) => {
  ctx.body = { status: "online" };
  ctx.status = httpStatus.OK;
});

apiRouter.use("/users", UserRouter.routes());
apiRouter.use("/addresses", AddressRouter.routes());

export default {
  routes: apiRouter.routes(),
  methods: apiRouter.allowedMethods,
};
