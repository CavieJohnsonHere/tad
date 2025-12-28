import { log } from "./log";
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

/**
 * Marks the current frame as dirty.
 *
 * Call this whenever application state changes in a way that affects rendering.
 * The next tick will re-render the UI.
 */
export const invalidate = () => (dirty = true);

const handleKey = (key: string) => {
  switch (key) {
    case "\u0003": // Ctrl+C
      process.exit();

    case "\x1b[A": // Arrow Up
      selectedItem[0] = Math.max(0, selectedItem[0] - 1);
      invalidate();
      break;

    case "\x1b[B": // Arrow Down
      selectedItem[0]++;
      invalidate();
      break;

    case "\x1b[C": // Arrow Right
      selectedItem[1]++;
      invalidate();
      break;

    case "\x1b[D": // Arrow Left
      selectedItem[1] = Math.max(0, selectedItem[1] - 1);
      invalidate();
      break;

    case "\r": // Enter
      log(Object.entries(pressHandlers));
      pressHandlers[`${selectedItem[0]}-${selectedItem[1]}`]?.();
      invalidate();
      break;
  }
};
let selectedItem: [number, number] = [0, 0];

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

      hideCursor(); // Hide the terminal cursor
      clear(); // Clear the screen (duh)
      enterAlternateBuffer(); // Isolate output from normal terminal history

      const width = process.stdout.columns || 80;

      process.on("exit", () => {
        // Restore terminal state on exit
        ExitAlternateBuffer();
        process.stdin.setRawMode(false);
        showCursor();
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
        clear();
        process.stdout.write("\n");
        // Write frame
        for (const [index, line] of Object.entries(lines)) {
          process.stdout.write(`\x1b[${parseInt(index) + 1};1H`);
          process.stdout.write("\x1b[2K");
          process.stdout.write(line);
        }
      };

      setInterval(tick, FRAME_MS);
    },
  };

  return api;
};
