import { type Color, type RenderContext, colorize } from "./tui";

/**
 * Creates a text node.
 *
 * @param content - a function that returns some text that will rendered with the correct styles
 * @returns A Node-like API with layout configuration methods
 */
export const text = (content: () => string | string[]) => {
  let _color: Color | undefined;
  let _bold = false;

  const api = {
    /**
     * Sets the color of the text.
     *
     * @param c - The color name
     * @returns The API for chaining
     */
    color(c: Color) {
      _color = c;
      return api;
    },
    /**
     * Bolds the text.
     *
     * @returns The API for chaining
     */
    bold() {
      _bold = true;
      return api;
    },

    /**
     * Render, for internal use
     * (~~DO NOT USE YOURSELF~~ it just returns what is gonna be rendered without putting it on screen so you can use it if you really want to)
     */
    _render(_: RenderContext) {
      const body = content();
      if (typeof body === "string") return [colorize(body, _color, _bold)];
      return body.map((line) => colorize(line, _color, _bold));
    },
  };

  return api;
};
