import { TYPE_MAPPING } from "@/features/practice/types";

export const readNumber = (key: string, fallback: number): number => {
  try {
    const value = localStorage.getItem(key);
    return value ? Number(value) : fallback;
  } catch {
    return fallback;
  }
};

export const convertTypeToJs = (type: string | undefined): string => {
  if (!type) return "any";
  return TYPE_MAPPING[type.toLowerCase()] || "any";
};

export const parseTestCaseInput = (input: any): any => {
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch {
      return input;
    }
  }
  return input;
};

export const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};
