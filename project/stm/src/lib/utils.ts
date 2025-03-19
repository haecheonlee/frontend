import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import L from "leaflet";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const createIcon = (iconPath: string, retinaIconPath: string) =>
    new L.Icon({
        iconUrl: iconPath,
        iconRetinaUrl: retinaIconPath,
        shadowUrl: "/assets/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

export const defaultIcon = createIcon(
    "/assets/marker-icon.png",
    "/assets/marker-icon-2x.png"
);

export const redIcon = createIcon(
    "/assets/marker-icon-red.png",
    "/assets/marker-icon-2x-red.png"
);
