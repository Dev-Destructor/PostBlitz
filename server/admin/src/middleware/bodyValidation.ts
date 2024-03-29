import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Validation Middleware
 * @description This middleware is used to validate the req.body, req.query, req.params using Zod.
 * @constructor
 * @param {AnyZodObject} schema - Zod Schema
 */

export const validation =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error({
          message: error.issues.map((e) => e.message)
        });
        return res.status(400).json(error.issues.map((e) => e.message));
      } else {
        throw error;
      }
    }
  };
