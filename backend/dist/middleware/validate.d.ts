import { Request, Response, NextFunction } from 'express';
export declare const validate: (schema: Record<string, (val: any) => string | null>) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const required: (val: any) => string | null;
export declare const isEmail: (val: any) => string | null;
export declare const isPhone: (val: any) => string | null;
export declare const isDate: (val: any) => string | null;
//# sourceMappingURL=validate.d.ts.map