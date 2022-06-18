import React, { useState, useEffect, useRef } from "react";
// how to import the remote module in a React component?

import GforceChart from "./components/GforceChart";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";

let ipcRenderer;
if ("require" in window) {
  const electron = window.require("electron");
  ipcRenderer = electron.ipcRenderer;
} else {
  ipcRenderer = null;
}

const maxItems = 300;

const loadDefaultValues = () => {
  const defaultArray = [...new Array(maxItems)].map((element, index) => {
    return {
      accG: [0, 0, 0],
    };
  });
  return defaultArray;
};

function App() {
  const [data, setData] = useState(false);
  const [connStatus, setConnStatus] = useState(false);
  const [recentData, setRecentData] = useState(false);
  const [accStatus, setAccStatus] = useState("offline");
  const webSocket = useRef(null);

  useEffect(() => {
    console.log('accStatus', accStatus)
    if (ipcRenderer) {
      ipcRenderer.send(`acc_${accStatus}`);
    }
  }, [accStatus]);

  useEffect(() => {
    setData(loadDefaultValues());

    webSocket.current = new WebSocket("ws://127.0.0.1:8080");

    webSocket.current.onopen = () => {
      setConnStatus("online");
      webSocket.current.send(JSON.stringify({ msg: "ready_to_receive" }));
    };

    webSocket.current.onclose = () => {
      setData(loadDefaultValues());
      setConnStatus("offline");
    };

    webSocket.current.onmessage = (message) => {
      const telemetryData = JSON.parse(message.data);
      if (telemetryData.isEngineRunning) {
        setAccStatus("online");
        setRecentData(telemetryData);
        setData((oldArray) => {
          let clonedArr = [...oldArray];
          if (clonedArr.length > maxItems) {
            clonedArr.shift();
          } else {
            clonedArr = clonedArr;
          }
          return [...clonedArr, telemetryData];
        });
      } else {
        setAccStatus("offline");
        setData(loadDefaultValues());
      }
    };

    return () => webSocket.current.close();
  }, []);

  const getRecentData = (data, key, defaultVal = 0) => {
    let output;
    if (data && data.length > 0) {
      output = data[data.length - 1][key];
    } else {
      output = defaultVal;
    }
    return output;
  };

  return (
    <div>
      <GforceChart accG={getRecentData(data, "accG")} />
    </div>
  );
}

export default App;
