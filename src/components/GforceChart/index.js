import React, { memo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Axis } from "@visx/axis";
import { generateRangeArr } from "../../utils/functions";

const min = -2;
const max = 2;

const hTickValues = generateRangeArr(min, max, 1);
const vTickValues = generateRangeArr(min, max, 1);

const width = 400;
const height = 400;
const circleRadius = 10;

const horizontalScale = scaleLinear({
  domain: [min, max],
  range: [-width / 2, width / 2],
});

const verticalScale = scaleLinear({
  domain: [min, max],
  range: [height / 2, -height / 2],
});


const GforceChart = ({ accG }) => {
  const turningTraction = accG[0];
  const brakeacclTraction = -accG[2];
  const totalTraction = Math.sqrt(
    turningTraction * turningTraction + brakeacclTraction * brakeacclTraction
  );

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
      <svg width={width + 50} height={height + 50}>
        <circle
          fill={"transparent"}
          cx={width / 2 + 20}
          cy={height / 2 + 20}
          r={width / 2}
          stroke={totalTraction > max ? "red" : "white"}
          strokeOpacity={totalTraction > max ? 0.4 : 0.2}
          strokeWidth="3"
        />
        <Group top={height / 2 + 20} left={width / 2 + 20}>
          <Axis
            key={`axis-horizontal`}
            labelProps={{
              display: "none",
            }}
            top={0}
            left={0}
            scale={horizontalScale}
            stroke="#ffffff33"
            tickStroke="grey"
            tickTransform="translate(0, -4)"
            tickValues={hTickValues}
            tickComponent={() => null}
          />
          <Axis
            orientation="left"
            labelProps={{
              display: "none",
            }}
            key={`axis-vertical`}
            top={0}
            left={0}
            scale={verticalScale}
            stroke="#ffffff33"
            tickStroke="grey"
            tickTransform="translate(4, 0)"
            tickValues={vTickValues}
            tickComponent={() => null}
          />
          <circle
            key={`resultant_gforce`}
            cx={horizontalScale(turningTraction)}
            cy={verticalScale(brakeacclTraction)}
            fill={"#ffffff"}
            r={circleRadius}
          />
        </Group>
      </svg>
    </div>
  );
};

export default memo(GforceChart);
