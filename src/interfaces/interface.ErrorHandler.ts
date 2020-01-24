import { Response } from 'express';

export default interface ErrorHandler{
  (err: any, res: Response): Response;
} 