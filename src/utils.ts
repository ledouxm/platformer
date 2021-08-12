import { getRandomFloatIn } from "@pastable/core";
import { Color } from "three";

export const randomHexColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
};

const min = -0.05;
const max = 0.1;

export const getSaturedColor = (hexColor: string) => {
    const color = Number("0x" + hexColor.slice(1));

    const random = Math.random() * (max - min) + min;

    return new Color(color).offsetHSL(0, 0, random);
};
