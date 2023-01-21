const express = require("express");
const { exec, execSync } = require("child_process");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

app.get("/ls", (req, res) => {
  exec("ls -la ~/yamcs-instance", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ error });
    }
    res.send({ output: stdout });
  });
});

app.get("/test", (req, res) => {
  exec("code . ~/yamcs-instance", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send({ error });
    }
    res.send({ output: stdout });
  });
});

const homeDirectory = execSync("echo ~").toString().trim();
const projectPath = path.join(homeDirectory, "yamcs-instance");

process.chdir(projectPath);
exec("mvn yamcs:run", (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
