import Router from "koa-router";
import { Context } from "koa";
import { userServices } from "../services";
import HttpStatus from "http-status-codes";
import User, { userColumnsRequest } from "../models/user";
import koaBody from "koa-body";
import { extractObjectFromBody } from "../models";
import { CONNECTION } from "../index";

const router = new Router({ prefix: "/users" });

// Get all users
router.get("/", async (ctx: Context) => {
  const service = new userServices.UserServices(CONNECTION.getRepository(User));
  try {
    const users = await service.getAllUsers();
    ctx.status = HttpStatus.OK;
    ctx.body = users;
  } catch (err) {
    ctx.body = { error: err.message };
    ctx.status = HttpStatus.NOT_FOUND;
  }
});

// Get user by id
router.get("/:userId", async (ctx: Context) => {
  const service = new userServices.UserServices(CONNECTION.getRepository(User));
  try {
    const { userId } = ctx.params;
    if (Number.isNaN(userId)) {
      throw new userServices.UserError({ message: "userId must be a number" });
    }
    const user = await service.getUserById(userId);
    ctx.status = HttpStatus.OK;
    ctx.body = user;
  } catch (err) {
    console.error(err);
    ctx.body = { error: err.message };
    ctx.status = HttpStatus.NOT_FOUND;
  }
});

router.post("/", async (ctx: Context) => {
  const service = new userServices.UserServices(CONNECTION.getRepository(User));
  try {
    const userMin = extractObjectFromBody(ctx, User, userColumnsRequest);
    await service.createNewUser(userMin);
    ctx.status = HttpStatus.ACCEPTED;
  } catch (e) {
    ctx.status = HttpStatus.NOT_FOUND;
    ctx.body = { error: e.message };
  }
});

router.del("/:userId", async (ctx: Context) => {});

export default router;
