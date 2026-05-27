import { Request, Response, NextFunction } from 'express';
export declare const getAllDepartments: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDepartmentById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createDepartment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDepartment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDepartment: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=departmentController.d.ts.map