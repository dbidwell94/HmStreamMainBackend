import Router from "koa-router";
import UserRouter from "./userRoute";
import AddressRouter from "./ipAddressRoute";

const apiRouter = new Router({ prefix: "/api" });

apiRouter.use("/users", UserRouter.routes());
apiRouter.use("/address", AddressRouter.routes());

export default {routes: apiRouter.routes(), methods: apiRouter.allowedMethods};
