const WebSocket = require("ws");
const ACCNodeWrapper = require("acc-node-wrapper");
const wrapper = new ACCNodeWrapper();
const utilFunctions = require("./utils/functions");

const { getCarDetails, getTrackGripStatus, getWheelAngularSpeedDiff } =
  utilFunctions;

/* Web Sockets */
const startWSSServer = () => {
  const wss = new WebSocket.Server({ port: 8080 }, () =>
    console.log("Telemetry server started at port: 8080")
  );

  wss.on("connection", (ws) => {
    ws.on("open", () => {
      // console.log("websocket open");
    });

    ws.on("message", (data) => {
      console.log("UI connected and ready to receive");
      setInterval(() => {
        const { m_physics_result, m_graphics_result, m_static_result } =
          wrapper.getAllSharedMemory();
        const result = {
          isEngineRunning: m_physics_result.rpms > 1000,
          accG: m_physics_result.accG.map(
            (val) => Math.floor((val + Number.EPSILON) * 100) / 100
          ),
        };
        ws.send(JSON.stringify(result));
      }, 1000 / 20);
    });

    ws.on("close", () => {
      // console.log("websocket disconnected");
      ws.close();
      wrapper.clearAllSharedMemory();
    });

    ws.on("error", () => {
      // console.error("websocket error");
      ws.close();
      wrapper.clearAllSharedMemory();
    });
  });
};

if (process.env.DEBUG_MODE == 1) {
  console.log("debug mode", process.env.DEBUG_MODE);
  setInterval(() => {
    const { m_physics_result } =
      wrapper.getAllSharedMemory();
    console.log("accG", m_physics_result.accG.map(
      (val) => Math.floor((val + Number.EPSILON) * 100) / 100
    ));
  }, 1000 / 2);
} else {
  startWSSServer();
}

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) {
    wrapper.clearAllSharedMemory();
    console.log("Telemetry server stopped");
  }
  if (options.exit) process.exit();
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
