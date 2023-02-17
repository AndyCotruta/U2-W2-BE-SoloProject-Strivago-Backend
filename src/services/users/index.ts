import express from "express";
import createHttpError from "http-errors";
import { createAccessToken } from "../../lib/tools";
import UserModel from "../../models/users";
import AccommodationModel from "../../models/accommodations";
import { JWTAuthMiddleware } from "../../lib/jwtAuth";
import { Request } from "express";
import { TokenPayload } from "../../lib/tools";

interface UserRequest extends Request {
  user?: {
    _id: string;
    role: "guest" | "host";
  };
}

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      const newUser = new UserModel(req.body);
      const { _id, role } = await newUser.save();
      const payload = { _id, role };
      const accessToken = await createAccessToken(payload);
      res.send(accessToken);
    } else {
      next(createHttpError(404, "An user with that email already exists"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, role: user.role };
      const accessToken = await createAccessToken(payload);
      res.send(accessToken);
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get(
  "/me",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const user = await UserModel.findById(req.user!._id);
      if (user) {
        res.send(user);
      } else {
        next(
          createHttpError(404, `User with ID ${req.user!._id} was not found`)
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.get(
  "/me/accommodations",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const user = await UserModel.findById(req.user!._id);
      if (user!.role === "host") {
        const myAccommodations = await AccommodationModel.find({
          host: user!._id,
        });
        if (myAccommodations) {
          res.send(myAccommodations);
        } else {
          next(
            createHttpError(
              404,
              `No accommodations found for user ${req.user!._id}`
            )
          );
        }
      } else {
        next(
          createHttpError(
            403,
            `You are not a host and cannot access this endpoint.`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} does not exist`)
      );
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
    if (deletedUser) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `User ${req.params.userId} was not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default usersRouter;
