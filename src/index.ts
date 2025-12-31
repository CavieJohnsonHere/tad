import { app, modifySelectionIndex } from "./app";
import { border } from "./border";
import { button } from "./button";
import { dynamic } from "./dynamic";
import { hstack } from "./hstack";
import { text } from "./text";
import type { Node } from "./tui";
import { vstack } from "./vstack";

let route: keyof typeof docs = "home";
const routes: (keyof typeof docs)[] = ["home", "introduction", "app()"];

function standardDocModel(content: Node): Node {
  return hstack()
    .add(
      border()
        .child(
          vstack().setChildren(
            routes.map((r, index) =>
              button(r)
                .select([index, 1])
                .on("press", () => {
                  route = "introduction";
                })
            )
          )
        )
        .width("50-char")
    )
    .add(content);
}

const docs: Record<string, Node> = {
  home: vstack()
    .center()
    .vgap(2)
    .add(
      text(() => [
        " __          __  _                             _          _______        _ ",
        " \\ \\        / / | |                           | |        |__   __|      | |",
        "  \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___   | |_ ___      | | __ _  __| |",
        "   \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\  | __/ _ \\     | |/ _` |/ _` |",
        "    \\  /\\  /  __/ | (_| (_) | | | | | |  __/  | || (_) |    | | (_| | (_| |",
        "     \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|   \\__\\___/     |_|\\__,_|\\__,_|",
        "",
        "",
      ])
    )
    .add(
      text(() => [
        "This is an example tad application.",
        "You can see the source code for this application in the ./index file",
      ])
    )
    .add(
      button("Explore the docs")
        .select([0, 0])
        .on("press", () => {
          route = "introduction";
          application.bound(undefined, routes.length - 1, -2, 1, 1);
          modifySelectionIndex([0, 1]);
        })
    ),

  introduction: standardDocModel(vstack().add(text(() => "Introduction"))),
  "app()": standardDocModel(vstack().add(text(() => "app() docs"))),
};

const application = app().root(
  dynamic(() => {
    return docs[route]!;
  })
).bound(undefined, 0, 0, 0, 0);

application.run();
