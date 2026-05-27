import { Request, Response, NextFunction } from 'express';
export declare const getAllDesignations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDesignationById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createDesignation: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDesignation: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDesignation: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=designationController.d.ts.map