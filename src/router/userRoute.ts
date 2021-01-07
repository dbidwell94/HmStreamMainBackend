import Router, { RouterContext } from "koa-router";
import { userServices } from "../services";
import HttpStatus from "http-status-codes";
import User, { userColumnsRequest } from "../models/user";
import { extractObjectFromBody } from "../models";
import { CONNECTION } from "../index";

interface UserContext {
  userService: userServices.UserServices;
}

class UserRouterError extends Error {
  status?: number;
  constructor(options: { message: string; status?: number }) {
    const { message, status } = options;
    super(message);
    this.status = status;
  }
}

const router = new Router();

router.use(
  async (ctx: RouterContext<UserContext>, next: () => Promise<any>) => {
    ctx.state.userService = new userServices.UserServices(
      CONNECTION.getRepository(User)
    );
    await next();
  }
);

// userRotuer error handling
router.use(
  async (ctx: RouterContext<UserContext>, next: () => Promise<any>) => {
    try {
      await next();
    } catch (err) {
      ctx.body = { error: err.message };
      ctx.status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
);

// Get all users
router.get("/", async (ctx: RouterContext<UserContext>) => {
  const users = await ctx.state.userService.getAllUsers();
  ctx.status = HttpStatus.OK;
  ctx.body = users;
});

// Get user by id
router.get("/user/:userId", async (ctx: RouterContext<UserContext>) => {
  if (typeof ctx.params.userId !== "number") {
    try {
      ctx.params.userId = Number.parseInt(ctx.params.userId);
    } catch (err) {
      throw new UserRouterError({
        message: "userId must be a number",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
  const { userId } = ctx.params;
  const user = await ctx.state.userService.getUserById(userId);
  ctx.status = HttpStatus.OK;
  ctx.body = user;
});

router.post("/", async (ctx: RouterContext<UserContext>) => {
  const userMin = extractObjectFromBody(ctx, User, userColumnsRequest);
  await ctx.state.userService.createNewUser(userMin);
  ctx.status = HttpStatus.ACCEPTED;
});

router.del("/user/:userId", async (ctx: RouterContext<UserContext>) => {
  if (typeof ctx.params.userId !== "number") {
    try {
      ctx.params.userId = Number.parseInt(ctx.params.userId);
    } catch (err) {
      throw new UserRouterError({
        message: "userId must be a valid number",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
  const { userId } = ctx.params;

  ctx.state.userService.deleteUserById(userId);
  ctx.status = HttpStatus.OK;
});

router.put("/user/:userId", async (ctx: RouterContext<UserContext>) => {
  if (typeof ctx.params.userId !== "number") {
    try {
      ctx.params.userId = Number.parseInt(ctx.params.userId);
    } catch (err) {
      throw new UserRouterError({
        message: "userId must be a valid number",
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }
  const { userId } = ctx.params;
  throw new UserRouterError({
    message: "This feature is not yet implemented",
    status: HttpStatus.NOT_IMPLEMENTED,
  });
});

export default router;
