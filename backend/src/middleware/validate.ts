import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Record<string, (val: any) => string | null>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const [field, validator] of Object.entries(schema)) {
      const value = req.body[field];
      const error = validator(value);
      if (error) {
        errors.push(`${field}: ${error}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

export const required = (val: any): string | null => {
  if (val === undefined || val === null || val === '') {
    return 'This field is required';
  }
  return null;
};

export const isEmail = (val: any): string | null => {
  if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    return 'Invalid email format';
  }
  return null;
};

export const isPhone = (val: any): string | null => {
  if (val && !/^\+?[\d\s-]{7,15}$/.test(val)) {
    return 'Invalid phone number';
  }
  return null;
};

export const isDate = (val: any): string | null => {
  if (val && isNaN(Date.parse(val))) {
    return 'Invalid date format';
  }
  return null;
};

export const isNumber = (val: any): string | null => {
  if (val !== undefined && val !== null && val !== '' && isNaN(Number(val))) {
    return 'Must be a number';
  }
  return null;
};

export const isPositive = (val: any): string | null => {
  if (val !== undefined && val !== null && val !== '' && Number(val) <= 0) {
    return 'Must be a positive number';
  }
  return null;
};

export const isEnum = (validValues: string[]) => {
  return (val: any): string | null => {
    if (val && !validValues.includes(val)) {
      return `Must be one of: ${validValues.join(', ')}`;
    }
    return null;
  };
};
