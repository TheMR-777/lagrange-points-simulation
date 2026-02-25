export interface LagrangePointData {
  id: string;
  name: string;
  shortDesc: string;
  stability: "Unstable" | "Stable";
  description: string;
  applications: string[];
}

export const lagrangeData: Record<string, LagrangePointData> = {
  L1: {
    id: "L1",
    name: "Lagrange Point 1",
    shortDesc: "Between the two large bodies",
    stability: "Unstable",
    description: "Located between the primary and secondary bodies. An object here feels the gravitational pull of both, but the secondary body cancels out some of the primary body's pull, allowing the object to orbit the primary body with the same orbital period as the secondary body.",
    applications: ["Solar observation (e.g., SOHO satellite)", "Early warning systems for solar storms"],
  },
  L2: {
    id: "L2",
    name: "Lagrange Point 2",
    shortDesc: "Behind the smaller body",
    stability: "Unstable",
    description: "Located exactly behind the secondary body, on the line connecting the two large masses. Here, the combined gravitational pull of both bodies provides exactly the required centripetal force to keep an object orbiting with the same period as the secondary body.",
    applications: ["Space telescopes (e.g., James Webb Space Telescope)", "Observing the wider universe without Earth's interference"],
  },
  L3: {
    id: "L3",
    name: "Lagrange Point 3",
    shortDesc: "Behind the larger body",
    stability: "Unstable",
    description: "Located directly behind the primary body, opposite the secondary body. It is slightly further from the primary body than the secondary body is. This point is heavily perturbed by other planets in real systems.",
    applications: ["Often featured in science fiction as a place for a 'Counter-Earth'", "Currently no significant practical applications due to instability and communication blockage by the Sun"],
  },
  L4: {
    id: "L4",
    name: "Lagrange Point 4",
    shortDesc: "Leading the smaller body",
    stability: "Stable",
    description: "Forms an equilateral triangle with the primary and secondary bodies, positioned 60° ahead of the secondary body in its orbit. If the mass ratio of the two bodies is > 24.96, objects here are dynamically stable due to the Coriolis force.",
    applications: ["Accumulation of 'Trojan' asteroids (e.g., Jupiter's Trojans)", "Potential locations for future space colonies or massive stations"],
  },
  L5: {
    id: "L5",
    name: "Lagrange Point 5",
    shortDesc: "Trailing the smaller body",
    stability: "Stable",
    description: "Similar to L4, it forms an equilateral triangle but is positioned 60° behind the secondary body in its orbit. It shares the same stable properties as L4.",
    applications: ["Accumulation of trailing 'Trojan' asteroids", "Often proposed alongside L4 for space settlements (e.g., O'Neill cylinders)"],
  },
};
