import { log } from "./log";
import { colorize, visibleLength, type Node, type RenderContext } from "./tui";

/**
 * Creates a bordered box.
 *
 * @returns A Node-like API with layout configuration methods
 */

export const border = () => {
  let child: Node | undefined;
  let _hgap = 0;
  let _vgap = 0;
  let _center = false;
  let _bg: string | undefined;
  let mode: any; // TODO: add modes when implemnting renderer
  let _width: [number, "char" | "%"] = [100, "%"];

  const api = {
    /**
     * Sets the child node to render inside of the box
     *
     * @param childNode - The child
     * @returns The API for chaining
     */
    child(childNode: Node) {
      child = childNode;
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
     * Sets the vertical on the top and bottom.
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
     * @param color - Color name
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
      const lines: string[] = [];

      let newAllowedWidth: number = allowedWidth;
      if (_width[1] == "%") {
        newAllowedWidth = Math.floor((allowedWidth * _width[0]) / 100);
      } else if (_width[1] === "char") {
        newAllowedWidth = Math.min(allowedWidth, _width[0]);
      }
      
      log(_width[1])

      // Border takes 2 columns
      const innerWidth = Math.max(0, newAllowedWidth - 2);

      // Render child (if any)
      const childLines = child
        ? child._render(ctx, Math.max(0, innerWidth - _hgap * 2), selectedItem)
        : [];

      const emptyInnerLine = colorize(" ", _bg).repeat(innerWidth);

      // ┌────────┐
      lines.push("┌" + "─".repeat(innerWidth) + "┐");

      // Top vertical gap
      for (let i = 0; i < _vgap; i++) {
        lines.push("│" + emptyInnerLine + "│");
      }

      // Content
      for (const line of childLines) {
        let content = line;
        const len = visibleLength(content);

        if (_center) {
          const pad = Math.max(
            0,
            Math.floor((innerWidth - _hgap * 2 - len) / 2)
          );

          content =
            colorize(" ", _bg).repeat(pad + _hgap) +
            content +
            colorize(" ", _bg).repeat(innerWidth - pad - _hgap - len);
        } else {
          content =
            colorize(" ", _bg).repeat(_hgap) +
            content +
            colorize(" ", _bg).repeat(innerWidth - _hgap - len);
        }

        lines.push("│" + content + "│");
      }

      // Bottom vertical gap
      for (let i = 0; i < _vgap; i++) {
        lines.push("│" + emptyInnerLine + "│");
      }

      // └────────┘
      lines.push("└" + "─".repeat(innerWidth) + "┘");

      return lines;
    },
  };

  return api;
};
