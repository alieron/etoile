export type StarRecord = {
  id: string;
  name: string;
  rank: number;
  ra: number;
  dec: number;
  dist: number;
  otype: string | null;
  spect: string | null;
  cat: number;
};

export type StarCategory = {
  id: number;
  name: string;
  rgb: [number, number, number];
  color: [number, number, number];
  radius: number;
  point: number;
  halo: number;
  glow: number;
};
