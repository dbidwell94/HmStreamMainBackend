import Router from "koa-router";
import { CONNECTION } from "../index";
import { RouterContext } from "koa-router";
import IpAddress from "../models/ipAddress";
import { IpAddressServices } from "../services/ipAddressServices";
import httpStatus from "http-status-codes";

const router = new Router();

type IpAddressContext = {
  ipAddressServices: IpAddressServices;
};

class IpAddressRouterError extends Error {
  status?: number;
  ipAddress?: IpAddress;
  constructor(options: {
    message: string;
    status: number;
    ipAddress?: IpAddress;
  }) {
    const { message, status, ipAddress } = options;
    super(message);
    this.status = status;
    this.ipAddress = ipAddress;
  }
}

// Inject IpAddress Service into the context
router.use(
  async (ctx: RouterContext<IpAddressContext>, next: () => Promise<void>) => {
    ctx.state.ipAddressServices = new IpAddressServices(
      CONNECTION.getRepository(IpAddress)
    );
    await next();
  }
);

// userRotuer error handling
router.use(
  async (ctx: RouterContext<IpAddressContext>, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err) {
      ctx.body = { error: err.message };
      ctx.status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
    }
  }
);

router.get("/", async (ctx: RouterContext<IpAddressContext>) => {
  const addresses = await ctx.state.ipAddressServices.getAllAddresses();
  ctx.body = addresses;
  ctx.status = httpStatus.OK;
});

router.get(
  "/address/byuser/:userId",
  async (ctx: RouterContext<IpAddressContext>) => {
    if (typeof ctx.params.userId !== "number") {
      try {
        ctx.params.userId = Number.parseInt(ctx.params.userId);
      } catch (err) {
        throw new IpAddressRouterError({
          message: "userId must be a number",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const { userId } = ctx.params;

    const address = await ctx.state.ipAddressServices.getAddressByUserId(
      userId
    );
    ctx.body = address;
    ctx.status = httpStatus.OK;
  }
);

export default router;
