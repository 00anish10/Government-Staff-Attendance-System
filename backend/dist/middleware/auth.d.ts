import { Request, Response, NextFunction } from 'express';
declare const JWT_SECRET: string;
export interface AuthPayload {
    id: number;
    username: string;
    role: string;
    staff_id: number | null;
}
export interface AuthRequest extends Request {
    user?: AuthPayload;
}
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export { JWT_SECRET };
//# sourceMappingURL=auth.d.ts.map