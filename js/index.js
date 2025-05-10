import cluster from "cluster";
import app from "./bin.js";
import os from "os";
const totalCpus = os.cpus().length;
const port = 3000;
if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCpus}`);
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log(`Starting a new worker`);
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}
