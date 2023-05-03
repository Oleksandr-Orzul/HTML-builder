const fs = require("fs");
const path = require("path");
fs.readdir(path.join(__dirname, "secret-folder"), (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
      fs.stat(
        path.join(__dirname, `secret-folder\\${file}`),
        (error, stats) => {
          if (error) {
            console.log(error);
          } else if (stats.isFile()) {
            console.log(
              `${file.split(".")[0]} - ${file.split(".")[1]} - ${
                stats.size / 1000
              }kb`
            );
          }
        }
      );
    });
  }
});
