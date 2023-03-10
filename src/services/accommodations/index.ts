import express, { request } from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../lib/jwtAuth";
import AccommodationModel from "../../models/accommodations";
import { UserRequest } from "../../lib/jwtAuth";

const accommodationsRouter = express.Router();

accommodationsRouter.post(
  "/",
  JWTAuthMiddleware,
  async (req: UserRequest, res, next) => {
    try {
      const role = req.user!.role;
      if (role === "host") {
        const newAccommodation = new AccommodationModel(req.body);
        const { _id } = await newAccommodation.save();
        res.send(`Accommodation with id ${_id} was created successfully`);
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
accommodationsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodations = await AccommodationModel.find().populate("host");
    res.send(accommodations);
  } catch (error) {
    console.log(error);
    next(error);
  }
});
accommodationsRouter.get(
  "/:accommodationId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
accommodationsRouter.put(
  "/:accommodationId",

  async (req, res, next) => {
    try {
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);
accommodationsRouter.delete("/:accommodationId", async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default accommodationsRouter;
