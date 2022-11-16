const trackTurnsData = {
  laguna_seca: {
    turns: [180, 480, 770, 1050, 1550, 1950, 2400, 2460, 2700, 2950, 3240],
    sectors: [900, 2250],
  },
  zolder: {
    turns: [280, 600, 830, 1150, 1730, 2050, 2300, 2540, 3000, 3150, 3600],
    sectors: [1450, 2800],
  },
  misano: {
    turns: [
      270, 330, 390, 640, 800, 950, 1300, 1690, 2130, 2210, 2744, 3019, 3176,
      3450, 3720, 3850,
    ],
    sectors: [925, 2600],
  },
};

export const getTurns = (track) => {
  let turns;
  if (!track) {
    turns = [];
  } else if (trackTurnsData[track.toLowerCase()]) {
    turns = trackTurnsData[track.toLowerCase()].turns;
  } else {
    turns = [];
  }
  return turns;
};

export const getSectors = (track) => {
  let sectors;
  if (!track) {
    sectors = [];
  } else if (trackTurnsData[track.toLowerCase()]) {
    sectors = trackTurnsData[track.toLowerCase()].sectors;
  } else {
    sectors = [];
  }
  return sectors;
};
