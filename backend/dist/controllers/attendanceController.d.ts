import { Request, Response, NextFunction } from 'express';
export declare const getAttendance: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAttendanceByStaff: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const checkIn: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const checkOut: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const markAttendance: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getTodayAttendance: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=attendanceController.d.ts.map