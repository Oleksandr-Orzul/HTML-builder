const fs = require("fs");
const path = require("path");

fs.writeFile(path.join(__dirname, "project-dist\\bundle.css"), "", (err) => {
  if (err) throw err;
});

fs.readdir(path.join(__dirname, "styles"), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      if (file.split(".")[1] === "css") {
        let stream = new fs.ReadStream(path.join(__dirname, `styles\\${file}`));

        stream.on("readable", function () {
          let data = stream.read();
          if (data !== null) {
            let data1 = data.toString();
            fs.appendFile(
              path.join(__dirname, "project-dist\\bundle.css"),
              data1,
              (err) => {
                if (err) throw err;
              }
            );
          }
        });
      }
    });
  }
});
