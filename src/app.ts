import {
  clear,
  colorize,
  enterAlternateBuffer,
  ExitAlternateBuffer,
  hideCursor,
  showCursor,
  type Node,
} from "./tui";

let dirty = true;

const pressHandlers: Record<string, () => void> = {};
export const _addPressHandler = (
  selection: [number, number],
  fn: () => void
) => {
  pressHandlers[`${selection[0]}-${selection[1]}`] = fn;
};

const selectHandlers: Record<string, () => void> = {};
export const _addSelectHandler = (
  selection: [number, number],
  fn: () => void
) => {
  selectHandlers[`${selection[0]}-${selection[1]}`] = fn;
};

/**
 * Marks the current frame as dirty.
 *
 * Call this whenever application state changes in a way that affects rendering.
 * The next tick will re-render the UI.
 */
export const invalidate = () => {
  const selectionHandler =
    selectHandlers[`${selectedItem[0]}-${selectedItem[1]}`];
  selectionHandler ? selectionHandler() : null;
  dirty = true;
};

export const modifySelectionIndex = (newIndex: [number, number]) => {
  selectedItem = newIndex;
};

export let movementLocked: [boolean, [number, number]?] = [false, undefined];
let onMovementUnlocks: (() => void)[] = [];
let onLockedMovements: ((dir: "u" | "d" | "l" | "r") => void)[] = [];
export const lockMovement = () => {
  movementLocked = [true, selectedItem];
  onMovementUnlocks = [];
  onLockedMovements = [];
};
export const onMovementUnlock = (fn: () => void) => {
  onMovementUnlocks.push(fn);
};
export const onLockedMovement = (fn: (dir: "u" | "d" | "l" | "r") => void) => {
  onLockedMovements.push(fn);
};

const handleKey = (key: string) => {
  switch (key) {
    case "\u0003": // Ctrl+C
      process.exit();

    case "\x1b[A": // Arrow Up
      if (movementLocked[0]) onLockedMovements.forEach((fn) => fn("u"));
      else selectedItem[0] = Math.max(minY, selectedItem[0] - 1);
      invalidate();
      break;

    case "\x1b[B": // Arrow Down
      if (movementLocked[0]) onLockedMovements.forEach((fn) => fn("d"));
      else selectedItem[0] = Math.min(maxY, selectedItem[0] + 1);
      invalidate();
      break;

    case "\x1b[C": // Arrow Right
      if (movementLocked[0]) onLockedMovements.forEach((fn) => fn("r"));
      else
        selectedItem[1] = Math.min(
          maxSelection ? maxSelection[selectedItem[0]] ?? maxX : maxX,
          selectedItem[1] + 1
        );
      invalidate();
      break;

    case "\x1b[D": // Arrow Left
      if (movementLocked[0]) onLockedMovements.forEach((fn) => fn("l"));
      else selectedItem[1] = Math.max(minX, selectedItem[1] - 1);
      invalidate();
      break;

    case "\r": // Enter
      pressHandlers[`${selectedItem[0]}-${selectedItem[1]}`]?.();
      invalidate();
      break;

    case "\x1b": // Escape
      movementLocked = [false, undefined];
      onMovementUnlocks.forEach((fn) => fn());
      invalidate();
      break;
  }
};
let selectedItem: [number, number] = [0, 0];
let maxSelection: number[] | undefined;
let maxY: number = Infinity;
let minY: number = Infinity;
let minX: number = Infinity;
let maxX: number = Infinity;

/**
 * Creates a terminal application instance.
 *
 * The returned API allows configuring a root node, setting a title,
 * and starting the render/input loop.
 *
 * @returns Application configuration and control API
 */
export const app = () => {
  let _root: Node | null = null;
  let _title = "";

  const api = {
    /**
     * Sets the application title.
     *
     * @param t - Title text
     * @returns The application API for chaining
     */
    title(t: string) {
      _title = t;
      return api;
    },

    /**
     * Sets the bound of the selection matrix.
     *
     * @param maximums - An array where the value is the maximum X and the index is the Y for the maximum to be applied to
     * @param maxY - The maximum Y value
     * @returns The application API for chaining
     */
    bound(
      maximums: number[] | undefined,
      maxYValue: number,
      minYValue: number,
      maxXValue: number = Infinity,
      minXValue: number = Infinity
    ) {
      maxSelection = maximums;
      maxY = maxYValue;
      maxX = maxXValue;
      minY = minYValue;
      minX = minXValue;
      return api;
    },

    /**
     * Sets the root UI node.
     *
     * The root node is responsible for rendering the entire UI tree.
     *
     * @param node - Root Node instance
     * @returns The application API for chaining
     */
    root(node: Node) {
      _root = node;
      return api;
    },

    /**
     * Starts the application.
     *
     * Does a ton of shit that you do NOT want to write. (trust me)
     *
     * Throws if no root node has been provided.
     */
    run() {
      process.stdin
        .setRawMode(true) // Enable raw mode for direct key handling
        .resume() // Prevent process exit when stdin closes
        .setEncoding("utf8"); // Required for raw mode key decoding

      if (!_root) throw new Error("No root node");

      process.stdout.write(hideCursor); // Hide the terminal cursor
      process.stdout.write(clear); // Clear the screen (duh)
      process.stdout.write(enterAlternateBuffer); // Isolate output from normal terminal history

      const width = process.stdout.columns || 80;

      process.on("exit", () => {
        // Restore terminal state on exit
        process.stdout.write(ExitAlternateBuffer);
        process.stdin.setRawMode(false);
        process.stdout.write(showCursor);
      });

      process.stdin.on("data", (key: string) => {
        handleKey(key);
      });

      const FRAME_MS = 16; // ~60fps

      const tick = () => {
        if (!dirty) return;
        dirty = false;
        const lines: string[] = []; // Content that is put onto the screen at the end
        if (_title) {
          lines.push(colorize(_title + Date.now(), "yellow", true), ""); // Show title at the top left
        }
        lines.push(..._root!._render({ width }, width, selectedItem)); // Render the root node
        // Prepare to write the frame
        let output = "";
        output += clear;
        output += "\n";
        // Write frame
        for (const [index, line] of Object.entries(lines)) {
          output += `\x1b[${parseInt(index) + 1};1H`;
          output += "\x1b[2K";
          output += line;
        }

        process.stdout.write(output);
      };

      setInterval(tick, FRAME_MS);
    },
  };

  return api;
};
