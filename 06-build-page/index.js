const fs = require("fs");
const path = require("path");
const fsPromises = fs.promises;
let stream = new fs.ReadStream(path.join(__dirname, "template.html"));

fs.stat(path.join(__dirname, `project-dist`), function (err) {
  if (!err) {
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
// stream.on("readable", function () {
//   let data = stream.read();
//   if (data !== null) {
//     let data1 = data.toString();
//     let arr = data1.split("");
//     b = "";
//     let comp = {};
//     for (let i = 0; i < arr.length; i++) {
//       if (arr[i] === "{") {
//         i++;
//         i++;
//         let a = "";
//         while (arr[i] !== "}") {
//           a += arr[i];
//           i++;
//         }
//         comp[b.length] = a;

//         i++;
//       } else if (arr[i] !== "{") {
//         b += arr[i];
//       }
//     }

//     for (v in comp) {
//       fs.readFile(
//         path.join(__dirname, `components\\${comp[v]}.html`),
//         "utf8",
//         function (error, data) {
//           if (error) throw error;
//           console.log(data);
//           comp[v] = data;
//         }
//       );
//     }
//     fs.appendFile(
//       path.join(__dirname, `project-dist\\index.html`),
//       b,
//       (err) => {
//         if (err) throw err;
//       }
//     );
//   }
// });

const componentsDir = path.join(__dirname, "components");
const templatePath = path.join(__dirname, "template.html");
const outputPath = path.join(__dirname, "project-dist", "index.html");

fs.readFile(templatePath, "utf8", (err, templateContent) => {
  if (err) {
    console.error("Ошибка чтения шаблона:", err);
    return;
  }

  const replaceTags = (content) => {
    const tagRegex = /\{\{(\w+)\}\}/g;
    return content.replace(tagRegex, (match, tagName) => {
      const componentPath = path.join(componentsDir, `${tagName}.html`);
      if (!fs.existsSync(componentPath)) {
        console.error(`Компонент "${tagName}" не найден.`);
        return match;
      }
      const componentContent = fs.readFileSync(componentPath, "utf8");
      return componentContent;
    });
  };

  fs.writeFile(outputPath, replaceTags(templateContent), "utf8", (err) => {
    if (err) {
      return;
    }
  });
});
