import chalk from "chalk";

export type GetChalkReturn = {
  hex: (_: string) => (message?: string) => string | undefined;
  bgHex: (_: string) => {
    whiteBright: (message?: string) => string | undefined;
  };
  whiteBright: (message?: string) => string | undefined;
  bold: {
    hex: (_: string) => (message?: string) => string | undefined;
    bgHex: (_: string) => {
      whiteBright: (message?: string) => string | undefined;
    };
    whiteBright: (message?: string) => string | undefined;
  };
};

const chalkDefault: GetChalkReturn = {
  hex: (_: string) => (message?: string) => message,
  bgHex: (_: string) => ({
    whiteBright: (message?: string) => message
  }),
  whiteBright: (message?: string) => message,
  bold: {
    hex: (_: string) => (message?: string) => message,
    bgHex: (_: string) => ({
      whiteBright: (message?: string) => message
    }),
    whiteBright: (message?: string) => message
  }
};

/**
 * Get the chalk instance
 *
 * @remarks
 * Annoying polyfill to temporarily fix the issue with the `chalk` import
 *
 * @returns The chalk instance
 */
export const getChalk = (): GetChalkReturn => {
  let _chalk = chalk as GetChalkReturn;
  if (
    !_chalk?.hex ||
    !_chalk?.bold?.hex ||
    !_chalk?.bgHex ||
    !_chalk?.whiteBright
  ) {
    _chalk = chalkDefault;
  }

  return _chalk;
};
