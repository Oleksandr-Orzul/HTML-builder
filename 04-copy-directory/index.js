const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;

fs.stat(path.join(__dirname, `files-copy`), function (err) {
  if (!err) {
    fs.rm(path.join(__dirname, `files-copy`), { recursive: true }, (err) => {
      fsPromises.mkdir(path.join(__dirname, `files-copy`), true);
      fs.readdir(path.join(__dirname, "files"), (err, files) => {
        if (err) console.log(err);
        else {
          files.forEach((file) => {
            fs.copyFile(
              path.join(__dirname, `files\\${file}`),
              path.join(__dirname, `files-copy\\${file}`),
              (err) => {
                if (err) {
                  console.log("Error Found:", err);
                }
              }
            );
          });
        }
      });
    });
  } else if (err.code === "ENOENT") {
    fsPromises.mkdir(path.join(__dirname, `files-copy`), true);
    fs.readdir(path.join(__dirname, "files"), (err, files) => {
      if (err) console.log(err);
      else {
        files.forEach((file) => {
          fs.copyFile(
            path.join(__dirname, `files\\${file}`),
            path.join(__dirname, `files-copy\\${file}`),
            (err) => {
              if (err) {
                console.log("Error Found:", err);
              }
            }
          );
        });
      }
    });
  }
});
