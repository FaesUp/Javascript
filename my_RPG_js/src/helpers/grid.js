export const gridCells = (n) => {
  return n * 16;
};

export const isSpaceFree = (walls, x, y) => {
  //Conver to string format or easy lookup
  const str = `${x},${y}`;
  //Check if walls has an entry at this spot
  const isWallPresent = walls.has(str);
  return !isWallPresent;
};
