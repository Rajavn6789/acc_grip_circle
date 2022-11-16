import React, { memo } from "react";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { Axis } from "@visx/axis";
import { Text } from "@visx/text";
import { generateRangeArr } from "../../utils/functions";

const min = -2;
const max = 2;

const hTickValues = generateRangeArr(min, max, 2);
const vTickValues = generateRangeArr(min, max, 2);

const width = 200;
const height = 200;
const dataRadius = 8;

const circleRadius = width / 2;

const horizontalScale = scaleLinear({
  domain: [min, max],
  range: [-width / 2, width / 2],
});

const verticalScale = scaleLinear({
  domain: [min, max],
  range: [height / 2, -height / 2],
});

const GforceChart = ({ accG }) => {
  const lateralG = accG[0];
  const longiG = -accG[2];

  // let resultant = lateralG + longiG;
  // const magnitude = Math.sqrt(lateralG * lateralG + longiG * longiG);
  // resultant = Math.round(resultant * 10) / 10;
  // console.log(resultant);

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
      <svg width={width + 70} height={height + 70}>
        <circle
          fill={"transparent"}
          cx={width / 2 + 20}
          cy={height / 2 + 20}
          r={circleRadius}
          stroke={"white"}
          strokeOpacity={0.2}
          strokeWidth="3"
        />
        <circle
          fill={"transparent"}
          cx={width / 2 + 20}
          cy={height / 2 + 20}
          r={circleRadius * 0.33}
          stroke={"white"}
          strokeOpacity={0.2}
          strokeWidth="3"
        />
        <circle
          fill={"transparent"}
          cx={width / 2 + 20}
          cy={height / 2 + 20}
          r={circleRadius * 0.66}
          stroke={"white"}
          strokeOpacity={0.2}
          strokeWidth="3"
        />
        <Group top={height / 2 + 20} left={width / 2 + 20} fill="transparent">
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
            cx={horizontalScale(lateralG)}
            cy={verticalScale(longiG)}
            fill={"red"}
            r={dataRadius}
          />
          {/* 
          <Text dx={8} dy={4} x={width / 2} y={0} fill={"white"}>
            {lateralG}
          </Text>
          <Text dx={-4} dy={-8} x={0} y={-height / 2} fill={"white"}>
            {longiG}
          </Text> */}
        </Group>
      </svg>
    </div>
  );
};

export default memo(GforceChart);
