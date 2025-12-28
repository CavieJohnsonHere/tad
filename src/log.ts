import { writeFileSync } from "node:fs";

let logFileContent = "Started";

export function log(entry: any) {
  const date = new Date(Date.now());
  logFileContent += `\n${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${JSON.stringify(entry)}`;
  writeFileSync("./logs.txt", logFileContent);
}
