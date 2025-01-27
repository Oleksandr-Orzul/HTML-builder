const fs = require("fs");
const path = require("path");
const process = require("node:process");

const { stdin } = process;
fs.writeFile(path.join(__dirname, "text.txt"), "", (err) => {
  if (err) throw err;
  console.log("Write your text:");
});
stdin.on("data", (data) => {
  if (data.toString().slice(0, 4) == "exit") {
    console.log(`Good bye!`);
    process.exit();
  }
  fs.appendFile(path.join(__dirname, "text.txt"), data, (err) => {
    if (err) throw err;
  });
});

process.on("SIGINT", () => {
  console.log(`Good bye!`);

  process.exit(0);
});
