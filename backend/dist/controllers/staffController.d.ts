import { Request, Response, NextFunction } from 'express';
export declare const getAllStaff: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getStaffById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createStaff: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateStaff: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteStaff: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=staffController.d.ts.map