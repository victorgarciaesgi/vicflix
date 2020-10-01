export function timeout(duration: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

export const randomProperty = (obj: Record<any, any>) => {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
};

export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * max + min);
}

export function hexToRgb(hex: string) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function hexToRgba(hex: string, transparency: number): string | undefined {
  const colors = hexToRgb(hex);
  if (colors) {
    const { r, g, b } = colors;
    return `rgba(${r},${g}, ${b}, ${transparency})`;
  }
}
