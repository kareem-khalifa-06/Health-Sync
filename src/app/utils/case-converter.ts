// src/app/utils/case-converter.ts

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function toCamelCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key) => {
      result[snakeToCamel(key)] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

/** Recursively converts all keys from camelCase → snake_case */
export function toSnakeCase<T>(obj: any): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T;
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key) => {
      result[camelToSnake(key)] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
}