import { Transform } from 'class-transformer';

export function TransformArray() {
  return Transform(({ value }) => {
    if (value === undefined || value === null) {
      return undefined;
    }
    return Array.isArray(value) ? value : [value];
  });
}
