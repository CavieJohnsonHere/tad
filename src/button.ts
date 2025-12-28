import { _addPressHandler } from "./app";
import { log } from "./log";
import { colorize, type RenderContext } from "./tui";

/**
 * Creates a button node.
 *
 * A button with a state for selection and a helper for handling presses.
 *
 * @returns A Node-like API with layout configuration methods
 */
export const button = (label: string) => {
  let _onPress: (() => void) | undefined;
  let _onSelect: (() => string[]) | undefined;
  let _selectionIndex: [number, number] | undefined;

  const api = {
    /**
     * Sets the helper function that is called when the user does something to the button.
     *
     * @param action - The action
     * @param fn - The helper function
     * @returns The API for chaining
     */
    on<T extends "press" | "select">(
      action: T,
      fn: () => T extends "press" ? void : string[]
    ) {
      if (action === "press") {
        _onPress = fn;
        if (!_selectionIndex)
          throw new Error("A selectionIndex is needed to handle presses");
        _addPressHandler(_selectionIndex, fn);
        log(typeof _onPress);
      } else if (action === "select") {
        // typescript is kinda dumb
        //@ts-expect-error
        _onSelect = fn;
      }
      return api;
    },

    /**
     * Sets the coordinates of this button in a selection grid.
     * The user can navigate this invisible grid by using arrow keys.
     *
     * @param selectionIndex - The tuple that represents the button's coordinates
     * @returns The API for chaining
     */
    select(selectionIndex: [number, number]) {
      _selectionIndex = selectionIndex;

      return api;
    },

    /**
     * Render, for internal use
     * (~~DO NOT USE YOURSELF~~ it just returns what is gonna be rendered without putting it on screen so you can use it if you really want to)
     */
    _render(
      _: RenderContext,
      allowedWidth: number,
      selectedItem: [number, number]
    ) {
      if (
        selectedItem[0] === _selectionIndex?.[0] &&
        selectedItem[1] === _selectionIndex?.[1]
      )
        return this._select();
      return [`[ ${label} ]`];
    },

    _select() {
      if (_onSelect) return _onSelect();
      return [`[ ${colorize(label, "bgWhite", true)} ]`];
    },
    _press() {
      _onPress?.();
    },
  };

  return api;
};
