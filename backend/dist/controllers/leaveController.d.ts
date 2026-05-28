import { Request, Response, NextFunction } from 'express';
export declare const getLeaveRequests: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createLeaveRequest: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const approveLeave: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rejectLeave: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=leaveController.d.ts.map