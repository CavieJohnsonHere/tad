import { colorize, visibleLength, type Node, type RenderContext } from "./tui";

/**
 * Creates a horizontal stack layout node.
 *
 * An hstack renders its children left-to-right, optionally applying
 * horizontal and vertical gaps, centering, and background coloring.
 *
 * @returns A Node-like API with layout configuration methods
 */
export const hstack = () => {
  let children: Node[] = [];
  let _hgap = 0;
  let _vgap = 0;
  let _center = false;
  let _bg: string | undefined;
  let _width: [number, "char" | "%"] = [100, "%"];

  const api = {
    /**
     * Adds a child node to the horizontal stack.
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
     * @param n - Gap size in characters / lines
     * @returns The API for chaining
     */
    gap(n: number) {
      _hgap = n;
      _vgap = n;
      return api;
    },

    /**
     * Sets the horizontal gap between stacked children.
     *
     * @param n - Horizontal gap size in characters
     * @returns The API for chaining
     */
    hgap(n: number) {
      _hgap = n;
      return api;
    },

    /**
     * Sets the vertical gap applied above and below the stack.
     *
     * @param n - Vertical gap size in lines
     * @returns The API for chaining
     */
    vgap(n: number) {
      _vgap = n;
      return api;
    },

    /**
     * Enables horizontal centering for the composed row output.
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
     * Sets the width.
     *
     * @param width
     * @returns The API for chaining
     */
    width(width: `${number}-${"char" | "%"}`) {
      const newWidth = width.split("-");
      _width = [
        parseInt(newWidth[0] ?? ""),
        (newWidth[1] as "char" | "%") ?? "char",
      ];
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
      let newAllowedWidth: number = allowedWidth;
      if (_width[1] == "%") {
        newAllowedWidth = Math.floor((allowedWidth * _width[0]) / 100);
      } else if (_width[1] === "char") {
        newAllowedWidth = Math.min(allowedWidth, _width[0]);
      }

      const renderedChildren: string[][] = [];
      let totalContentWidth = 0;
      let maxHeight = 0;

      // Render children with unconstrained height but bounded width
      for (const child of children) {
        const rendered = child._render(ctx, newAllowedWidth, selectedItem);
        renderedChildren.push(rendered);
        maxHeight = Math.max(maxHeight, rendered.length);
      }

      // Normalize heights (pad vertically with bg)
      for (let i = 0; i < renderedChildren.length; i++) {
        const child = renderedChildren[i];
        if (child === undefined) continue;

        const padLine = colorize(" ", _bg).repeat(
          Math.max(...child.map((l) => l.length), 0)
        );
        while (child.length < maxHeight) {
          child.push(padLine);
        }
      }

      // Compute total width
      totalContentWidth =
        renderedChildren.reduce(
          (sum, child) => sum + (child[0]?.length ?? 0),
          0
        ) +
        Math.max(0, renderedChildren.length - 1) * _hgap;

      const lines: string[] = [];

      // GAP (top)
      for (let i = 0; i < _vgap; i++) {
        lines.push(colorize(" ", _bg).repeat(newAllowedWidth));
      }

      // Compose lines (no idea what's happening here)
      // TODO: see and find out what's happening here
      for (let row = 0; row < maxHeight; row++) {
        let line = "";

        for (let i = 0; i < renderedChildren.length; i++) {
          if (i > 0) {
            line += colorize(" ", _bg).repeat(_hgap);
          }
          line += renderedChildren[i]![row] ?? "";
        }

        if (_center) {
          const pad = Math.max(
            0,
            Math.floor((newAllowedWidth - visibleLength(line)) / 2)
          );
          line =
            colorize(" ", _bg).repeat(pad) +
            line +
            colorize(" ", _bg).repeat(
              Math.max(0, newAllowedWidth - pad - visibleLength(line))
            );
        } else {
          line += colorize(" ", _bg).repeat(
            Math.max(0, newAllowedWidth - visibleLength(line))
          );
        }

        lines.push(line);
      }

      // GAP (bottom)
      for (let i = 0; i < _vgap; i++) {
        lines.push(colorize(" ", _bg).repeat(newAllowedWidth));
      }

      return lines;
    },
  };

  return api;
};
