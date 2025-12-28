export type RenderContext = {
  width: number;
};

export type Node = {
  _render(
    ctx: RenderContext,
    allowedWidth: number,
    selectedItem: [number, number]
  ): string[];
};

export const ESC = "\x1b[";

export const clear = () => process.stdout.write(`${ESC}3J${ESC}2J${ESC}H`);
export const hideCursor = () => process.stdout.write(`${ESC}?25l`);
export const showCursor = () => process.stdout.write(`${ESC}?25h`);
export const enterAlternateBuffer = () => process.stdout.write(`${ESC}?1049h`);
export const ExitAlternateBuffer = () => process.stdout.write(`${ESC}?1049l`);

export const colorMap: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  bgWhite: 47,
  bgBlue: 44,
};

export type Color = keyof typeof colorMap;

export const colorize = (text: string, color?: Color, bold?: boolean) => {
  const codes = [];
  if (bold) codes.push("1");
  if (color && colorMap[color]) codes.push(colorMap[color].toString());
  return `${ESC}${codes.join(";")}m${text}${ESC}0m`;
};

export const visibleLength = (s: string) => {
  const ansiRegex = /\u001b[[0-9;]*m/g;

  return s.replace(ansiRegex, "").length;
};
