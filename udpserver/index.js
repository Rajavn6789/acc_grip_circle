const ACCNodeWrapper = require("acc-node-wrapper");
const wrapper = new ACCNodeWrapper();

/**
 * @name initBroadcastSDK
 * @comment This is the init function for the ACC Node Wrapper. This inits the Broadcast SDK.
 * @param SERVER_DISPLAYNAME
 * @param SERVER_IP
 * @param SERVER_PORT
 * @param SERVER_PASS
 * @param SERVER_COMMANDPASS
 * @param UPDATE_INTERVAL
 * @param Logging
 */
wrapper.initBroadcastSDK("Max", "127.0.0.1", 9000, "asd", "asd", 250, true);

wrapper.on("REALTIME_CAR_UPDATE", (result) => {
  console.log(result);
});
