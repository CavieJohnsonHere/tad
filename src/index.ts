import { app } from "./app";
import { border } from "./border";
import { button } from "./button";
import { hstack } from "./hstack";
import { text } from "./text";
import { vstack } from "./vstack";

const apps = [
  ["terminalx", "usr/bin/terminalx"],
  ["data-stealing browser", "usr/bin/browser"],
  ["scammy vpn client", "flatpak run free.money.app"],
  ["random ass gnome app", "gnome-ass"],
  ["vim vs code: coding platform", "code ."],
];

let selection = 0;

app()
  .title("App launcher")
  .root(
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
          .width("50-%")
          .child(
            vstack()
              .gap(2)
              .add(text(() => apps[selection]![1] ?? ""))
          )
      )
  )
  .bound(undefined, apps.length - 1, 0)
  .run();
