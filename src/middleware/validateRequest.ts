import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    const errors = result.error?.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    if (!result.success) {
      res.status(400).json({
        message: "Validation error",
        errors,
      });
      return;
    }
    next();
  };
