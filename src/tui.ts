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

export const clear = `${ESC}3J${ESC}2J${ESC}H`;
export const hideCursor = `${ESC}?25l`;
export const showCursor = `${ESC}?25h`;
export const enterAlternateBuffer = `${ESC}?1049h`;
export const ExitAlternateBuffer = `${ESC}?1049l`;

export const colorMap: Record<string, number> = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,

  blackBright: 90,
  gray: 90, // Alias of `blackBright`
  grey: 90, // Alias of `blackBright`
  redBright: 91,
  greenBright: 92,
  yellowBright: 93,
  blueBright: 94,
  magentaBright: 95,
  cyanBright: 96,
  whiteBright: 97,
  bgBlack: 40,
  bgRed: 41,
  bgGreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
  bgBlackBright: 100,
  bgGray: 100, // Alias of `bgBlackBright`
  bgGrey: 100, // Alias of `bgBlackBright`
  bgRedBright: 101,
  bgGreenBright: 102,
  bgYellowBright: 103,
  bgBlueBright: 104,
  bgMagentaBright: 105,
  bgCyanBright: 106,
  bgWhiteBright: 107,
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

export function clipVisible(text: string, max: number): string {
  if (max <= 0) return "";

  let out = "";
  let visible = 0;
  let i = 0;
  let clipped = false;

  while (i < text.length && visible < max) {
    const ch = text[i];

    if (ch === "\x1b") {
      const end = text.indexOf("m", i);
      if (end === -1) break;
      out += text.slice(i, end + 1);
      i = end + 1;
      continue;
    }

    out += ch;
    visible++;
    i++;
  }

  if (i < text.length) {
    // We exited early → force reset
    out += "\x1b[0m";
  }

  return out;
}

