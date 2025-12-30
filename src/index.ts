import { app } from "./app";
import { border } from "./border";
import { button } from "./button";
import { hstack } from "./hstack";
import { text } from "./text";
import { vstack } from "./vstack";

let input1: string = "";
let operator: string = "";
let input2: string = "";
let res: string = "";

let stage = 0; // 0 = input1, 1 = input2

const appendDigit = (d: number) => {
  if (stage === 0) {
    input1 += String(d);
  } else {
    input2 += String(d);
  }
  res = input1 + operator + input2;
};

const setOperator = (op: string) => {
  if (input1 === "") return;
  operator = op;
  stage = 1;
  res = input1 + operator;
};

const evaluate = () => {
  if (!input1 || !operator || !input2) return;

  const a = Number(input1);
  const b = Number(input2);

  switch (operator) {
    case "+":
      res = String(a + b);
      break;
    case "-":
      res = String(a - b);
      break;
  }

  input1 = res;
  input2 = "";
  operator = "";
  stage = 0;
};

app()
  .title("Demo")
  .root(
    vstack()
      .center()
      .add(
        border()
          .hgap(2)
          .child(text(() => res))
          .width(`20-char`)
      )
      .add(
        hstack()
          .center()
          .add(
            button("7")
              .select([0, 0])
              .on("press", () => appendDigit(7))
          )
          .add(
            button("8")
              .select([0, 1])
              .on("press", () => appendDigit(8))
          )
          .add(
            button("9")
              .select([0, 2])
              .on("press", () => appendDigit(9))
          )
          .add(
            button("+")
              .select([0, 3])
              .on("press", () => setOperator("+"))
          )
      )
      .add(
        hstack()
          .center()
          .add(
            button("4")
              .select([1, 0])
              .on("press", () => appendDigit(4))
          )
          .add(
            button("5")
              .select([1, 1])
              .on("press", () => appendDigit(5))
          )
          .add(
            button("6")
              .select([1, 2])
              .on("press", () => appendDigit(6))
          )
          .add(
            button("-")
              .select([1, 3])
              .on("press", () => setOperator("-"))
          )
      )
      .add(
        hstack()
          .center()
          .add(
            button("1")
              .select([2, 0])
              .on("press", () => appendDigit(1))
          )
          .add(
            button("2")
              .select([2, 1])
              .on("press", () => appendDigit(2))
          )
          .add(
            button("3")
              .select([2, 2])
              .on("press", () => appendDigit(3))
          )
          .add(button("=").select([2, 3]).on("press", evaluate))
      )
  )
  .run();
