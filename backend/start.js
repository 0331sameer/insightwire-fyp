const { spawn } = require("child_process");

console.log("Starting InsightWire Backend...");
console.log("Node version:", process.version);
console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);

// Start the main server
const server = spawn("node", ["server.js"], {
  stdio: "inherit",
  env: process.env,
});

server.on("error", (error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});
