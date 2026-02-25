export function solveLagrangePoints(mu: number, R: number) {
  const x1 = -mu;
  const x2 = 1 - mu;

  // Force function along the x-axis (normalized, R=1)
  // F(x) = x - (1-mu)*sign(x-x1)/|x-x1|^2 - mu*sign(x-x2)/|x-x2|^2 = 0
  const force = (x: number) => {
    const d1 = x - x1;
    const d2 = x - x2;
    return x - ((1 - mu) * Math.sign(d1)) / (d1 * d1) - (mu * Math.sign(d2)) / (d2 * d2);
  };

  // Binary search for roots
  const findRoot = (min: number, max: number, isAscending: boolean) => {
    let low = min;
    let high = max;
    for (let i = 0; i < 60; i++) {
      const mid = (low + high) / 2;
      const fMid = force(mid);
      if (Math.abs(fMid) < 1e-10) return mid;
      
      if (isAscending) {
        if (fMid > 0) high = mid;
        else low = mid;
      } else {
        if (fMid < 0) high = mid;
        else low = mid;
      }
    }
    return (low + high) / 2;
  };

  // L1 is between x1 and x2. As x goes from x1 to x2, force goes from -inf to +inf (Ascending)
  const l1 = findRoot(x1 + 0.0001, x2 - 0.0001, true);

  // L2 is > x2. As x goes from x2+ to inf, force goes from -inf to +inf (Ascending)
  const l2 = findRoot(x2 + 0.0001, x2 + 3.0, true);

  // L3 is < x1. As x goes from -inf to x1-, force goes from -inf to +inf (Ascending)
  const l3 = findRoot(x1 - 3.0, x1 - 0.0001, true);

  // L4 and L5 form equilateral triangles with the two masses
  const y45 = Math.sqrt(3) / 2;
  const x45 = 0.5 - mu; // halfway between x1 and x2 is (-mu + 1 - mu)/2 = 0.5 - mu

  return {
    L1: [l1 * R, 0, 0],
    L2: [l2 * R, 0, 0],
    L3: [l3 * R, 0, 0],
    L4: [x45 * R, 0, y45 * R],
    L5: [x45 * R, 0, -y45 * R],
    M1: [x1 * R, 0, 0],
    M2: [x2 * R, 0, 0],
  };
}
