import { ObjectLiteral } from '@models';

export function timeout(duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function isObject<T extends ObjectLiteral>(obj?: T): obj is T {
  return typeof obj === 'object' && obj != null && !Array.isArray(obj) && !(obj instanceof File);
}

export const randomProperty = (obj: Record<any, any>) => {
  var keys = Object.keys(obj);
  return obj[keys[randomNumber(0, keys.length + 1)]];
};

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max + min);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let regexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (regexResult) {
    const [r, g, b] = regexResult;
    if (r && g && b) {
      return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16),
      };
    }
  }
  return null;
}

export function hexToRgba(hex: string, transparency: number): string | undefined {
  const colors = hexToRgb(hex);
  if (colors) {
    const { r, g, b } = colors;
    return `rgba(${r},${g}, ${b}, ${transparency})`;
  }
}
