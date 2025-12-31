// An example app launcher for windows

import { app } from "../src/app";
import { border } from "../src/border";
import { button } from "../src/button";
import { hstack } from "../src/hstack";
import { text } from "../src/text";
import { vstack } from "../src/vstack";

import { readdir, stat } from "fs/promises";
import { join, extname } from "path";

export type StartMenuEntry = {
  name: string;
  path: string;
  type: "shortcut" | "executable";
};

/**
 * Recursively walks a directory and collects .lnk and .exe files
 */
async function walk(dir: string, results: StartMenuEntry[]): Promise<void> {
  let entries: string[];

  try {
    entries = await readdir(dir);
  } catch {
    return; // ignore unreadable directories
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry);

    let s;
    try {
      s = await stat(fullPath);
    } catch {
      continue;
    }

    if (s.isDirectory()) {
      await walk(fullPath, results);
      continue;
    }

    const ext = extname(entry).toLowerCase();

    if (ext === ".lnk") {
      results.push({
        name: entry.replace(/\.lnk$/i, ""),
        path: fullPath,
        type: "shortcut",
      });
    } else if (ext === ".exe") {
      results.push({
        name: entry.replace(/\.exe$/i, ""),
        path: fullPath,
        type: "executable",
      });
    }
  }
}

/**
 * Lists all Start Menu shortcuts and executables
 */
export async function listStartMenuEntries(): Promise<StartMenuEntry[]> {
  const results: StartMenuEntry[] = [];

  const appData = process.env.APPDATA;
  const programData = process.env.ProgramData;

  const roots = [
    appData && join(appData, "Microsoft", "Windows", "Start Menu", "Programs"),
    programData &&
      join(programData, "Microsoft", "Windows", "Start Menu", "Programs"),
  ].filter(Boolean) as string[];

  for (const root of roots) {
    await walk(root, results);
  }

  return results;
}

const apps = (await listStartMenuEntries()).map((v) => [v.name, v.path]);

let selection = 0;

app()
  .title("App launcher")
  .root(
    vstack()
      .add(
        hstack()
          .add(
            vstack()
              .width("50-%")
              .setChildren(
                apps.map((app, index) =>
                  button(app[0] ?? "tf")
                    .select([index, 0])
                    .on("select", () => {
                      selection = index;
                    })
                )
              )
              .center()
          )
          .add(
            border()
              .center()
              .width("50-%")
              .child(vstack().add(text(() => apps[selection]![1] ?? "")))
          )
      )
      .add(
        vstack()
          .bg("bgBlue")
          .add(text(() => "wow"))
      )
  )
  .bound(undefined, apps.length - 1, 0)
  .run();
