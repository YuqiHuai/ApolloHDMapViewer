
export type StopSignDrawingType = {
    id: string;
    x: number;
    y: number;
    stopLine: number[];
    shouldDraw: boolean;
}

export type SignalDrawingType = {
    id: string;
    x: number;
    y: number;
    points: number[];
    stopLine: number[];
    mappingLine: number[];

    shouldDraw: boolean;
    shoudDrawStopLine: boolean;
    shouldDrawMappingLine: boolean;
}

export type LaneDrawingType = {
    id: string;
    x: number;
    y: number;
    boundary: number[][];
    central: number[][];

    shouldDraw: boolean;
    shouldDrawCentral: boolean;
}

export type DrawingType = {
    stopSign: StopSignDrawingType[];
    signal: SignalDrawingType[];
    lane: LaneDrawingType[];
}