import { SelectOption } from '@constructors';

export function constantToSelect<T extends { [K in keyof T]: string }>(
  item: T
): SelectOption<keyof T>[] {
  return Object.entries(item).map(([key, value]) => ({
    value: (!isNaN(Number(key)) ? Number(key) : key) as keyof T,
    text: value as string,
  }));
}

export function pluralize(text: string, count: number, inclusive = false) {
  if (typeof count === 'number') {
    const prefix = inclusive ? `${count} ` : '';
    if (count !== 1) {
      return `${prefix}${text}s`;
    } else {
      return `${prefix}${text}`;
    }
  }
  console.warn(`Count is not a number, received: ${count}`);
}
