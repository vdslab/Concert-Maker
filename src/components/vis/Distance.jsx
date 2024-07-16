const Distance = (lat1, lng1, lat2, lng2) => {
  if (lat1 === null || lng1 === null || lat2 === null || lng2 === null)
    return Infinity;

  const R = Math.PI / 180;
  lat1 *= R;
  lng1 *= R;
  lat2 *= R;
  lng2 *= R;
  return (
    Math.acos(
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) +
        Math.sin(lat1) * Math.sin(lat2)
    ) / Math.PI
  );
};

export default Distance;
