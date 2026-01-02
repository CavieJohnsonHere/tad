import {
  _addPressHandler,
  lockMovement,
  movementLocked,
  onLockedMovement,
  onMovementUnlock,
} from "./app";
import { log } from "./log";
import {
  clipVisible,
  colorize,
  type Node,
  type RenderContext,
  visibleLength,
} from "./tui";

let scrollTop: Record<string, number> = {};
let childHeight: Record<string, number> = {};

/**
 * Creates a scrollable container node.
 *
 * A scroll container renders its child content within a fixed height,
 * showing a scrollbar when the content exceeds the available space.
 *
 * @param height - The height of the scroll container in lines
 * @param child - The child node to render within the scroll container
 * @param id - An ID to differentiate different scrollbars when navigating back and forth
 * @returns A Node-like API with scroll functionality
 */
export const scroll = (height: number, child: Node, id: string) => {
  let _selectionIndices: [number, number][] = [];
  childHeight[id] = height;

  scrollTop[id] = 0;

  const api = {
    /**
     * Sets the coordinates of this scroll container in a selection grid.
     * The user can navigate this invisible grid by using arrow keys.
     *
     * @param selectionIndex - The tuple that represents the scroll container's coordinates
     * @returns The API for chaining
     */
    select(selectionIndex: [number, number]) {
      _selectionIndices.push(selectionIndex);
      _addPressHandler(selectionIndex, () => {
        lockMovement();
        onLockedMovement((dir) => {
          if (dir === "u") scrollTop[id] = Math.max(scrollTop[id]! - 1, 0);
          else if (dir === "d")
            scrollTop[id] = Math.min(
              scrollTop[id]! + 1,
              childHeight[id] ?? height + height
            );
        });
      });
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
    ): string[] {
      const isLocked =
        movementLocked[0] &&
        _selectionIndices.find((selectionIndex) =>
          Bun.deepEquals(selectionIndex, selectedItem)
        );

      const childContent = child
        ._render(ctx, allowedWidth, selectedItem)
        .map((line) => clipVisible(line, allowedWidth - 1));

      // We don't want to render the scrollbar if not necessary
      if (childContent.length < height) return childContent;

      const contentToRender = childContent.slice(
        scrollTop[id]!,
        height + scrollTop[id]!
      );

      const viewedRatio = scrollTop[id]! / childContent.length;

      return contentToRender.map(
        (line, index) =>
          line +
          " ".repeat(allowedWidth - visibleLength(line) - 1) +
          colorize(
            Math.floor(viewedRatio * height * 2) === index ? "▮" : "│",
            isLocked ? "green" : "gray"
          )
      );
    },
  };

  return api;
};
