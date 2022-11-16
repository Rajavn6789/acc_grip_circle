import React, { useMemo, useLayoutEffect } from "react";
import { getTurns, getSectors } from "../../utils/constants";
import misano from "../../assets/track/misano.png";
import misano_skewed from "../../assets/track/misano_skewed.png";

import * as d3 from "d3";

const RacingLineChart = ({
  id,
  data,
  height = 400,
  width = 400,
  trackName,
}) => {
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  const xAccessor = (d) => d.carCoordinates[2];
  const yAccessor = (d) => d.carCoordinates[0];

  const boundedWidth = useMemo(() => {
    return width - margin.left - margin.right;
  }, [width]);

  const boundedHeight = useMemo(() => {
    return height - margin.top - margin.bottom;
  }, [height]);

  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, yAccessor))
      .range([boundedHeight, 0]);
  }, [data, boundedHeight]);

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain(d3.extent(data, xAccessor))
      .range([0, boundedWidth]);
  }, [data, boundedWidth]);

  let zoom = d3.zoom().scaleExtent([1, 3]);

  const turnsArr = getTurns(trackName);
  const sectorsArr = getSectors(trackName);

  // TODO: Instead of exact distance check for a range
  const formattedTurnData = data
    .filter((d) => turnsArr.includes(d.distance))
    .map((d) => {
      const tIndex = turnsArr.indexOf(d.distance) + 1;
      return {
        carCoordinates: d.carCoordinates,
        label: `T${tIndex}`,
        distance: d.distance,
      };
    });

  console.log("sectorsArr", sectorsArr);
  console.log("formattedTurnData", formattedTurnData);

  useLayoutEffect(() => {
    zoom
      .on("start", handleZoomBegin)
      .on("zoom", handleZoom)
      .on("end", handleZoomFinish);
    const svg = d3.select(`#${id}_track_car_details`);
    const svgGroup1 = d3.select(`#${id}_tcar_group1`);
    const svgGroup2 = d3.select(`#${id}_tcar_group2`);
    const svgGroup3 = d3.select(`#${id}_turn_markers`);
    function handleZoomBegin(e) {
      svg.style("cursor", "grabbing");
    }
    function handleZoom(e) {
      svg.style("cursor", "grabbing");
      svgGroup1.attr("transform", e.transform);
      svgGroup2.attr("transform", e.transform);
      svgGroup3.attr("transform", e.transform);
    }
    function handleZoomFinish(e) {
      svg.style("cursor", "grab");
    }
    function initZoom() {
      svg.call(zoom);
    }
    initZoom();

    svg
      .transition()
      .duration(1500)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(boundedWidth / 2, boundedHeight / 2)
          .scale(1.5)
          .translate(-920, -750)
      );
  }, [boundedHeight, boundedWidth]);

  const drawPath1 = () => {
    const lineGenerator = d3
      .line()
      .x((d) => {
        return xScale(xAccessor(d));
      })
      .y((d) => yScale(yAccessor(d)));

    const linePath = lineGenerator(data.slice(50, 1200));

    return (
      <path
        id="track_data1"
        d={linePath}
        fill="none"
        stroke="red"
        strokeWidth={2}
      />
    );
  };

  return (
    <>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio={"xMinYMin"}
        id={`${id}_track_car_details`}
        width={width}
        height={height}
        fill="black"
        style={{ cursor: "grab" }}
      >
        <g
          id={`${id}_tcar_group1`}
          width={boundedWidth}
          height={boundedHeight}
          stroke="white"
          strokeWidth={1}
        >
          {drawPath1()}
        </g>
      </svg>
    </>
  );
};

export default RacingLineChart;
