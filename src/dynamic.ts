import { type Color, type Node, type RenderContext, colorize } from "./tui";

/**
 * Creates a dynamic node.
 *
 * @param content - a function that returns some content that can be passed to the parent
 * @returns A Node-like API with layout configuration methods
 */
export const dynamic = (content: () => string[]) => {
  const api = {
    /**
     * Render, for internal use
     * (~~DO NOT USE YOURSELF~~ it just returns what is gonna be rendered without putting it on screen so you can use it if you really want to)
     */
    _render(_: RenderContext) {
      return content();
    },
  };

  return api;
};
