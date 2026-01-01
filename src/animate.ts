import { invalidate } from "./app";
import { type Color, type RenderContext, colorize } from "./tui";

/**
 * Creates a text node.
 *
 * @param content - a function that returns an array where each item is a frame
 * @returns A Node-like API with layout configuration methods
 */
export const animate = (content: () => string[][]) => {
  let _delay = 200;
  let stage = 0;

  const api = {
    /**
     * sets the delay between one frame and another.
     *
     * @param delay - the delay
     * @returns The API for chaining
     */
    delay(delay: number) {
      _delay = delay;
      return api;
    },

    /**
     * Render, for internal use
     * (~~DO NOT USE YOURSELF~~ it just returns what is gonna be rendered without putting it on screen so you can use it if you really want to)
     */
    _render(_: RenderContext) {
      const body = content();

      setTimeout(() => {
        stage = stage + 1 === body.length ? 0 : stage + 1;
        invalidate();
      }, _delay);

      return body[stage]!;
    },
  };

  return api;
};
