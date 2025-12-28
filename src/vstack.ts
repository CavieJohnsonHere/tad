import { colorize, visibleLength, type Node, type RenderContext } from "./tui";

/**
 * Creates a vertical stack layout node.
 *
 * A vstack renders its children top-to-bottom, optionally applying
 * vertical and horizontal gaps, centering, and background coloring.
 *
 * @returns A Node-like API with layout configuration methods
 */

export const vstack = () => {
  let children: Node[] = [];
  let _hgap = 0;
  let _vgap = 0;
  let _center = false;
  let _bg: string | undefined;

  const api = {
    /**
     * Adds a child node to the vertical stack.
     *
     * @param child - The node to append
     * @returns The API for chaining
     */
    add(child: Node) {
      children.push(child);
      return api;
    },

    /**
     * Sets both horizontal and vertical gaps to the same value.
     *
     * @param n - Gap size in characters
     * @returns The API for chaining
     */
    gap(n: number) {
      _hgap = n;
      _vgap = n;
      return api;
    },

    /**
     * Sets the vertical gap between stacked children.
     *
     * @param n - Vertical gap size in lines
     * @returns The API for chaining
     */
    vgap(n: number) {
      _vgap = n;
      return api;
    },

    /**
     * Sets the horizontal gap applied to each line of child content.
     *
     * @param n - Horizontal gap size in characters
     * @returns The API for chaining
     */
    hgap(n: number) {
      _hgap = n;
      return api;
    },

    /**
     * Enables horizontal centering for all child content.
     *
     * @returns The API for chaining
     */
    center() {
      _center = true;
      return api;
    },

    /**
     * Sets the background color used for padding and gaps.
     *
     * @param color - Color name understood by colorize()
     * @returns The API for chaining
     */
    bg(color: string) {
      _bg = color;
      return api;
    },

    /**
     * Render, for internal use
     * (~~DO NOT USE YOURSELF~~ it just returns what is gonna be rendered without putting it on screen so you can use it if you really want to)
     */
    _render(
      ctx: RenderContext,
      allowedWidth: number,
      selectedItem: [number, number]
    ) {
      // Stuff that gets returned to be rendered
      const lines: string[] = [];

      for (const child of children) {
        // Renders the children
        const rendered = child._render(
          ctx,
          allowedWidth - _hgap * 2,
          selectedItem
        );

        // GAPS (top)
        for (let i = 0; i < _vgap; i++)
          lines.push(colorize(" ", _bg).repeat(allowedWidth));

        // Content
        for (const line of rendered) {
          if (_center) {
            const pad = Math.max(
              0,
              Math.floor((allowedWidth - visibleLength(line)) / 2)
            );
            lines.push(
              colorize(" ", _bg).repeat(pad + _hgap) + // GAPS (left)
                line +
                colorize(" ", _bg).repeat(allowedWidth - pad - _hgap) // GAPS (right)
            );
          } else {
            // no horizontal gap :[
            // TODO: add horizontal gaps
            // This just puts the raw content for now
            lines.push(line);
          }
        }

        // GAPS (bottom)
        for (let i = 0; i < _vgap; i++)
          lines.push(colorize(" ", _bg).repeat(allowedWidth));
      }

      return lines;
    },
  };

  return api;
};
