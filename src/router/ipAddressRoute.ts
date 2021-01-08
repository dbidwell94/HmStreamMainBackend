import Router from "koa-router";
import { CONNECTION } from "../index";
import { RouterContext } from "koa-router";
import IpAddress from "../models/ipAddress";
import { IpAddressServices } from "../services/ipAddressServices";
import httpStatus from "http-status-codes";
import jwt from "koa-jwt";
import { SECRET } from "../utils";
import jwtDecode from "jsonwebtoken";
import { extractObjectFromBody } from "../models";
import { ChangeStream } from "typeorm";

const router = new Router();

type IpAddressContext = {
  ipAddressServices: IpAddressServices;
  user: { id: number; username: string; email: string; iat: number };
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

router.use(jwt({ secret: SECRET }));

router.get("/address", async (ctx: RouterContext<IpAddressContext>) => {
  const address = await ctx.state.ipAddressServices.getAddressByUserId(
    ctx.state.user.id
  );
  ctx.body = address;
  ctx.status = httpStatus.OK;
});

router.post("/address", async (ctx: RouterContext<IpAddressContext>) => {
  enum ipAddressMin {
    address = "string",
  }
  const address = extractObjectFromBody(ctx, IpAddress, ipAddressMin);

  await ctx.state.ipAddressServices.createIpAddressListingForUser({
    address: address.address,
    userId: ctx.state.user.id,
  });
  ctx.status = httpStatus.CREATED;
});

export default router;
