const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;
let stream = new fs.ReadStream(path.join(__dirname, "template.html"));

fs.stat(path.join(__dirname, `project-dist`), function (err) {
  if (!err) {
    fs.rm(path.join(__dirname, `project-dist`), { recursive: true }, (err) => {
      fsPromises.mkdir(path.join(__dirname, `project-dist`), true);
      fs.writeFile(
        path.join(__dirname, "project-dist\\index.html"),
        "",
        (err) => {
          if (err) throw err;
        }
      );
      fs.writeFile(
        path.join(__dirname, "project-dist\\style.css"),
        "",
        (err) => {
          if (err) throw err;
        }
      );

      fs.stat(path.join(__dirname, `project-dist\\assets`), function (err) {
        if (!err) {
        } else if (err.code === "ENOENT") {
          fsPromises.mkdir(path.join(__dirname, `project-dist\\assets`), true);
          fs.readdir(path.join(__dirname, "assets"), (err, files) => {
            if (err) console.log(err);
            else {
              files.forEach((file) => {
                fs.stat(
                  path.join(__dirname, `project-dist\\assets\\${file}`),
                  function (err) {
                    if (!err) {
                    } else if (err.code === "ENOENT") {
                      fsPromises.mkdir(
                        path.join(__dirname, `project-dist\\assets\\${file}`),
                        true
                      );
                    }
                  }
                );
                fs.readdir(
                  path.join(__dirname, `assets\\${file}`),

                  (err, filesT) => {
                    if (err) console.log(err);
                    else {
                      filesT.forEach((fileT) => {
                        fs.copyFile(
                          path.join(__dirname, `assets\\${file}\\${fileT}`),
                          path.join(
                            __dirname,
                            `project-dist\\assets\\${file}\\${fileT}`
                          ),
                          (err) => {
                            if (err) {
                              console.log("Error Found:", err);
                            }
                          }
                        );
                      });
                    }
                  }
                );
              });
            }
          });
        }
      });
    });
  } else if (err.code === "ENOENT") {
    fsPromises.mkdir(path.join(__dirname, `project-dist`), true);
    fs.writeFile(
      path.join(__dirname, "project-dist\\index.html"),
      "",
      (err) => {
        if (err) throw err;
      }
    );
    fs.writeFile(path.join(__dirname, "project-dist\\style.css"), "", (err) => {
      if (err) throw err;
    });

    fs.stat(path.join(__dirname, `project-dist\\assets`), function (err) {
      if (!err) {
      } else if (err.code === "ENOENT") {
        fsPromises.mkdir(path.join(__dirname, `project-dist\\assets`), true);
        fs.readdir(path.join(__dirname, "assets"), (err, files) => {
          if (err) console.log(err);
          else {
            files.forEach((file) => {
              fs.stat(
                path.join(__dirname, `project-dist\\assets\\${file}`),
                function (err) {
                  if (!err) {
                  } else if (err.code === "ENOENT") {
                    fsPromises.mkdir(
                      path.join(__dirname, `project-dist\\assets\\${file}`),
                      true
                    );
                  }
                }
              );
              fs.readdir(
                path.join(__dirname, `assets\\${file}`),

                (err, filesT) => {
                  if (err) console.log(err);
                  else {
                    filesT.forEach((fileT) => {
                      fs.copyFile(
                        path.join(__dirname, `assets\\${file}\\${fileT}`),
                        path.join(
                          __dirname,
                          `project-dist\\assets\\${file}\\${fileT}`
                        ),
                        (err) => {
                          if (err) {
                            console.log("Error Found:", err);
                          }
                        }
                      );
                    });
                  }
                }
              );
            });
          }
        });
      }
    });
  }
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
              path.join(__dirname, "project-dist\\style.css"),
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

async function replaceTags(content) {
  const tagRegex = /\{\{(\w+)\}\}/g;
  let replacedContent = content;

  for await (const match of content.matchAll(tagRegex)) {
    const tagName = match[1];
    const componentPath = path.join(
      path.join(__dirname, "components"),
      `${tagName}.html`
    );

    try {
      const componentContent = await fs.promises.readFile(
        componentPath,
        "utf8"
      );
      replacedContent = replacedContent.replace(match[0], componentContent);
    } catch (err) {}
  }

  return replacedContent;
}

async function main() {
  try {
    const templateContent = await fs.promises.readFile(
      path.join(__dirname, "template.html"),
      "utf8"
    );
    const replacedContent = await replaceTags(templateContent);
    await fs.promises.writeFile(
      path.join(__dirname, "project-dist", "index.html"),
      replacedContent,
      "utf8"
    );
  } catch (err) {}
}

main();
