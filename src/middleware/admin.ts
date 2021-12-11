import { Request, Response, NextFunction } from 'express';

const admin= true;
export const checkAdmin = (req: Request, res: Response, next: NextFunction) => {
    let path = req.baseUrl + req.path;
    let method = req.method;
  
    if (admin) {
      next();
    } else {
      res.status(401).json({
        error: -1,
        descripción: `ruta '${path}' método '${method}' no autorizada`,
      });
  }
};