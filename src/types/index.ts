export type ObjectId = {
    id: string;
}

export type Point = {
    x: number;
    y: number;
    z?: number;
}

export type Boundary = {
    point: Point[];
}

export type LineSegment = {
    lineSegment: { point: Point[] }
    startPosition?: Point;
}

export type Segment = {
    segment: LineSegment[];
}

export type Header = {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export type Signal = {
    id: ObjectId;
    overlapId: ObjectId[];
    boundary: Boundary;
    stopLine: Segment[];

}

export type StopSign = {
    id: ObjectId;
    overlapId: ObjectId[];
    stopLine: Segment[];
}

export type Junction = {
    id: ObjectId;
    overlapId: ObjectId[];
    polygon: { point: Point[] }
}

export type LaneBoundary = {
    length: number;
    curve: Segment;
}

export type Lane = {
    id: ObjectId;
    overlapId: ObjectId[];
    speedLimit: number;
    length: number;
    successorId: ObjectId[];
    predecessorId: ObjectId[];
    leftBoundary: LaneBoundary;
    rightBoundary: LaneBoundary;
    centralCurve: Segment;
}


export type Map = {
    header: Header;
    signal: Signal[];
    stopSign: StopSign[];
    lane: Lane[];
    junction: Junction[];
}

export type Layer = {
    laneLine: boolean;
    laneId: boolean;
    laneCentralCurve: boolean;
    stopSign: boolean;
    signal: boolean;
    signalStopLine: boolean;
    signalMapping: boolean;
}