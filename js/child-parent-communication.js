const cluster = require("cluster");
const os = require("os");

const numCpus = os.cpus().length;
const target = 1_000_000_000;
const chunkSize = Math.floor(target / numCpus);
if (cluster.isPrimary) {
  console.log("Calculation time");
  let startTime = Date.now();
  let totalSum = 0;
  let completedWorkers = 0;
  for (let i = 0; i < numCpus; i++) {
    const worker = cluster.fork();
    const start = i * chunkSize;
    const end = i === numCpus - 1 ? target : (i + 1) * chunkSize;
    console.log(
      `Worker ${worker.process.pid} started with range ${start} to ${end}`
    );
    worker.send({ start, end });
    worker.on("message", (msg) => {
      totalSum += msg.sum;
      completedWorkers++;

      if (completedWorkers === numCpus) {
        console.log(`Total sum: ${totalSum}`);
        let endTime = Date.now();
        console.log(`Time taken: ${endTime - startTime} ms`);
        process.exit(0);
      }
    });
  }
} else {
  process.on("message", (msg) => {
    console.log(msg);
    let { start, end } = msg;
    let sum = 0;
    for (let i = start; i < end; i++) {
      sum += i;
    }
    process.send({ sum: sum });
  });
}
