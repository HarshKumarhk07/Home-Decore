/**
 * Recursively strips HTML and script tags from input values to prevent
 * Cross-Site Scripting (XSS) and script execution in text inputs.
 */
export function sanitizeInput<T>(val: T): T {
  if (typeof val === "string") {
    // Strip HTML and script tags completely
    return val.replace(/<[^>]*>/g, "").trim() as unknown as T;
  }
  if (Array.isArray(val)) {
    return val.map((item) => sanitizeInput(item)) as unknown as T;
  }
  if (val !== null && typeof val === "object") {
    const sanitizedObj: any = {};
    for (const key in val) {
      if (Object.prototype.hasOwnProperty.call(val, key)) {
        sanitizedObj[key] = sanitizeInput((val as any)[key]);
      }
    }
    return sanitizedObj as T;
  }
  return val;
}
