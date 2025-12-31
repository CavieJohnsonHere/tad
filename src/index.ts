import { app } from "./app";
import { border } from "./border";
import { button } from "./button";
import { hstack } from "./hstack";
import { text } from "./text";
import { vstack } from "./vstack";

const apps = [
  "terminalx",
  "data-stealing browser",
  "scammy vpn client",
  "random ass gnome app",
  "human vs ai: coding platform",
];

app()
  .title("App launcher")
  .root(
    hstack()
      .add(
        vstack()
          .width("50-%")
          .setChildren(apps.map((app) => button(app)))
          .center()
      )
      .add(
        border()
          .width("50-%")
          .child(vstack().gap(2).add(text(() => "hello")))
      )
  )
  .run();
