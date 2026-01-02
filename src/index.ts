import { animate } from "./animate";
import { app, modifySelectionIndex } from "./app";
import { border } from "./border";
import { button } from "./button";
import { dynamic } from "./dynamic";
import { hstack } from "./hstack";
import { scroll } from "./scroll";
import { text } from "./text";
import { colorize, type Node } from "./tui";
import { vstack } from "./vstack";

let route: keyof typeof docs = "home";
const routes: (keyof typeof docs)[] = ["home", "introduction", "app()"];

function standardDocModel(thisRoute: string, content: Node): Node {
  const scrollableContent = scroll(process.stdout.rows, content, "doc");

  for (let i = 0; i < routes.length; i++) {
    scrollableContent.select([i, 2]);
  }

  return hstack()
    .add(
      border()
        .child(
          vstack().setChildren(
            routes.map((r, index) =>
              button(r === thisRoute ? colorize(r, "red", true) : r)
                .select([index, 1])
                .on("press", () => {
                  if (r === "home") {
                    application.bound(undefined, 0, 0, 0, 0);
                    modifySelectionIndex([0, 0]);
                  }
                  route = r;
                })
            )
          )
        )
        .width("50-char")
    )
    .add(
      border()
        .width(`${process.stdout.columns - 50}-char`)
        .child(scrollableContent)
    );
}

const welcomeSign = [
  [
    " __          __  _                             _          _______        _ _ ",
    " \\ \\        / / | |                           | |        |__   __|      | | |",
    "  \\ \\  /\\  / /__| | ___ ___  _ __ ___   ___   | |_ ___      | | __ _  __| | |",
    "   \\ \\/  \\/ / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\  | __/ _ \\     | |/ _` |/ _` | |",
    "    \\  /\\  /  __/ | (_| (_) | | | | | |  __/  | || (_) |    | | (_| | (_| |_|",
    "     \\/  \\/ \\___|_|\\___\\___/|_| |_| |_|\\___|   \\__\\___/     |_|\\__,_|\\__,_(_)",
    "                                                                             ",
    "                                                                             ",
  ],
  [
    " __          __  _                             _          _______        _ _ ",
    " / /        \\ \\ | |                           | |        |__   __|      | | |",
    "  / /  \\/  \\ \\__| | ___ ___  _ __ ___   ___   | |_ ___      | | __ _  __| | |",
    "   / /\\  /\\ \\ _ / |\\ __\\ _ /| '_ ` _ / \\ _ /  | __\\ _ /     | |\\ _` |\\ _` | |",
    "    /  \\/  \\  __\\ | (_| (_) | | | | | |  __\\  | || (_) |    | | (_| | (_| |_|",
    "     /\\  /\\ /___|_|/___/___\\|_| |_| |_|/___|   /__/___\\     |_|/__,_|/__,_(_)",
    "                                                                             ",
    "                                                                             ",
  ],
  [
    " __          __  _                             _          _______        _ _ ",
    " ! !        / / | |                           | |        |__   __|      | | |",
    "  ! !  /!  / /__| | ___ ___  _ __ ___   ___   | |_ ___      | | __ _  __| | |",
    "   ! !/  !/ / _ ! |/ __/ _ !| '_ ` _ ! / _ !  | __/ _ !     | |/ _` |/ _` | |",
    "    !  /!  /  __/ | (_| (_) | | | | | |  __/  | || (_) |    | | (_| | (_| |_|",
    "     !/  !/ !___|_|!___!___/|_| |_| |_|!___|   !__!___/     |_|!__,_|!__,_(_)",
    "                                                                             ",
    "                                                                             ",
  ],
];

const docs = {
  home: vstack()
    .center()
    .vgap(2)
    .add(animate(() => welcomeSign).delay(500))
    .add(
      text(() => [
        "This is an example tad application.",
        "",
        "You can see the source code for this application in",
        "the ./src/index.ts file in your tad framework folder.",
      ])
    )
    .add(
      button("Explore the docs")
        .select([0, 0])
        .on("press", () => {
          route = "introduction";
          application.bound(undefined, routes.length - 1, -2, 2, 1);
          modifySelectionIndex([0, 1]);
        })
    ),

  introduction: standardDocModel(
    "introduction",
    vstack()
      .add(text(() => "Introduction").bold())
      .add({ _render: () => ["", ""] })
      .add(text(() => "What is tad?").bold())
      .add({ _render: () => [""] })
      .add(text(() => "Lorem. Ipsum?"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
      .add(text(() => "Tad is a framework that renders text!"))
  ),
  "app()": standardDocModel("app()", vstack().add(text(() => "app() docs"))),
};

const application = app()
  .root(
    dynamic(() => {
      return docs[route]!;
    })
  )
  .bound(undefined, 0, 0, 0, 0);

application.run();
