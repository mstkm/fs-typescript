
export const isNotNumber = (argument: unknown): boolean =>
  argument === '' || argument === null || argument === undefined ||
  !Number.isFinite(Number(argument));
