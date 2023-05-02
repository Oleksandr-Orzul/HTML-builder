const fs = require("fs");
const path = require("path");
let stream = new fs.ReadStream(path.join(__dirname, "text.txt"));

stream.on("readable", function () {
  let data = stream.read();
  if (data !== null) {
    let data1 = data.toString();
    console.log(data1);
  }
});
