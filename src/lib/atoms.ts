import { atom } from "jotai";

export type Location = {
  location: string;
  data: {
    long: number;
    lat: number;
    name: string;
  };
  forcast: {
    currentTemp: number;
    currentStatus: string;
    isDay: string;
    localtime: string;
  };
};

export const locationAtom = atom<Location | null>(null);
