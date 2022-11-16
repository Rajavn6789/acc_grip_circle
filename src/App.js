import React from "react";
import RacingLineChart from "./components/RacingLineChart";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./App.css";

function App() {
  return (
    <div>
      <RacingLineChart
        id="trackreportdetail"
        width={1280 - 48}
        height={1024 - 48}
      />
    </div>
  );
}

export default App;
