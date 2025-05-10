import express from "express";

const app = express();
console.log(`Worker ${process.pid} started`);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/pid", (req, res) => {
  res.send(`Worker PID: ${process.pid}`);
});
app.get("/api/:n", (req, res) => {
  let n = parseInt(req.params.n);
  let count = 0;
  if (n > 500000000000) n = 500000000000;
  for (let i = 0; i < n; i++) {
    count++;
  }
  res.send(`Counted to ${count}`);
});
export default app;
