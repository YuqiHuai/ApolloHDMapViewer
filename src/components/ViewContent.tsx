import { KonvaEventObject } from 'konva/lib/Node';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Layer, Rect, Line, Stage, Text as KonvaText, Group } from 'react-konva';
import { Map, Point } from '../types';
import { Button, Collapse, Drawer, Typography } from 'antd';
import { DrawingType, LaneDrawingType, SignalDrawingType, StopSignDrawingType } from '../types/drawing';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import SelectionComponent from './SelectionComponent';

const { Text } = Typography;
const { Panel } = Collapse;

type ViewContentProps = {
  map: Map;
  checkedList: CheckboxValueType[];
}

const to_points_array = (points: Point[]) => {
  const result = [];
  points.forEach(p => {
    result.push(p.x);
    result.push(p.y);
  })
  return result;
}

function extract_lane_lines(map: Map): LaneDrawingType[] {
  const result: LaneDrawingType[] = [];

  map.lane.forEach((value) => {
    const lines = [];
    const leftBoundarySegments = value.leftBoundary.curve.segment;
    const rightBoundarySegments = value.rightBoundary.curve.segment;
    leftBoundarySegments.forEach(v => {
      lines.push(to_points_array(v.lineSegment.point));
    })
    rightBoundarySegments.forEach(v => {
      lines.push(to_points_array(v.lineSegment.point));
    })

    const centralLines = [];
    value.centralCurve.segment.forEach(v => {
      centralLines.push(to_points_array(v.lineSegment.point))
    })

    result.push({
      id: value.id.id, x: centralLines[0][0], y: centralLines[0][1],
      boundary: lines,
      central: centralLines,
      shouldDraw: true, shouldDrawCentral: true
    })
  })

  return result;
}

function extract_stop_signs(map: Map): StopSignDrawingType[] {
  const result: StopSignDrawingType[] = [];
  map.stopSign.forEach((value) => {
    const points = to_points_array(value.stopLine[0].segment[0].lineSegment.point);
    result.push({
      id: value.id.id,
      x: points[points.length - 2],
      y: points[points.length - 1],
      stopLine: points,
      shouldDraw: true
    })
  })
  return result;
}

function extract_signals(map: Map): SignalDrawingType[] {
  const result: SignalDrawingType[] = [];


  map.signal.forEach(value => {
    const boundaryPoints = to_points_array(value.boundary.point);
    const stopLinePoints = to_points_array(value.stopLine[0].segment[0].lineSegment.point);
    result.push({
      id: value.id.id,
      x: boundaryPoints[0],
      y: boundaryPoints[1],
      points: boundaryPoints,
      stopLine: stopLinePoints,
      mappingLine: [boundaryPoints[0], boundaryPoints[1], stopLinePoints[2], stopLinePoints[3]],
      shouldDraw: true,
      shoudDrawStopLine: true,
      shouldDrawMappingLine: true,
    })
  })
  return result;
}

const ViewContent: React.FC<ViewContentProps> = ({ map, checkedList }) => {

  // Set up window size
  const windowRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const updateSize = () => {
    setWidth(windowRef.current.offsetWidth);
    setHeight(windowRef.current.offsetHeight);
  }
  window.addEventListener("resize", updateSize);
  useLayoutEffect(() => {
    const fn = async () => {
      setTimeout(() => updateSize(), 50)
    }
    fn();
  }, []);


  // Konva zoom
  const [konvaState, setKonvaState] = useState({ stageScaleX: 1, stageScaleY: -1, stageX: 0, stageY: 0 });
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const scaleBy = 1.2;
    const stage = e.target.getStage();
    const oldXScale = stage.scaleX();
    const oldYScale = stage.scaleY();
    const mousePointsTo = {
      x: stage.getPointerPosition().x / oldXScale - stage.x() / oldXScale,
      y: stage.getPointerPosition().y / oldYScale - stage.y() / oldYScale
    }

    const newXScale = e.evt.deltaY > 0 ? oldXScale * scaleBy : oldXScale / scaleBy;
    const newYScale = e.evt.deltaY > 0 ? oldYScale * scaleBy : oldYScale / scaleBy;

    setKonvaState({
      stageScaleX: newXScale,
      stageScaleY: newYScale,
      stageX: -(mousePointsTo.x - stage.getPointerPosition().x / newXScale) * newXScale,
      stageY: -(mousePointsTo.y - stage.getPointerPosition().y / newYScale) * newYScale
    })
  }

  // controls
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [stopSignPlain, setStopSignPlain] = useState<string[]>();
  const [stopSignSelection, setStopSignSelection] = useState<string[]>();

  const [signalPlain, setSignalPlain] = useState<string[]>();
  const [signalSelection, setSignalSelection] = useState<string[]>();

  const [lanePlain, setLanePlain] = useState<string[]>();
  const [laneSelection, setLaneSelection] = useState<string[]>();


  // drawing
  const [drawingData, setDrawingData] = useState<DrawingType>({ stopSign: [], signal: [], lane: [] });

  useEffect(() => {
    const initData = {
      stopSign: extract_stop_signs(map),
      signal: extract_signals(map),
      lane: extract_lane_lines(map)
    }
    setDrawingData(initData)

    const plainStopSignSelection = initData.stopSign.map(v => v.id);
    plainStopSignSelection.sort()
    setStopSignPlain(plainStopSignSelection);
    setStopSignSelection(plainStopSignSelection);

    const plainSignalSelection = initData.signal.map(v => v.id);
    plainSignalSelection.sort()
    setSignalPlain(plainSignalSelection)
    setSignalSelection(plainSignalSelection);

    const plainLaneSelection = initData.lane.map(v => v.id);
    plainLaneSelection.sort();
    setLanePlain(plainLaneSelection);
    setLaneSelection(plainLaneSelection);

    return () => {
    }
  }, [])

  return (
    <div ref={windowRef} style={{ height: '100%', width: '100%', position: 'relative', backgroundColor: 'white' }}>
      {windowRef && drawingData.lane.length > 0 && <Stage
        width={width} height={height} draggable
        onWheel={handleWheel} scaleX={konvaState.stageScaleX} scaleY={konvaState.stageScaleY}
        x={konvaState.stageX} y={konvaState.stageY}
        offsetX={drawingData.lane[0].x} offsetY={drawingData.lane[0].y}
      >
        <Layer id="lane">
          {
            drawingData.lane.map((value, index) => {
              // if (!laneSelection.includes(value.id)) return;
              const result = [];
              let idCounter = 0;
              if (checkedList.includes("Lane Line")) {
                value.boundary.forEach((v, i) => {
                  result.push(
                    <Line key={idCounter++} points={v} stroke="black"
                      strokeWidth={1} opacity={
                        laneSelection.includes(value.id) ? 0.5 : 0.1
                      }
                      strokeScaleEnabled={false}
                    />
                  )
                })
              }
              if (checkedList.includes("Lane ID")) {
                result.push(
                  <KonvaText key={idCounter++} x={value.x} y={value.y} text={value.id} fontSize={1} scaleY={-1}
                    opacity={laneSelection.includes(value.id) ? 1 : 0.1} />
                );
              }
              if (checkedList.includes("Lane Central Curve")) {
                value.central.forEach((v, i) => {
                  result.push(
                    <Line key={idCounter++} points={v} stroke="blue"
                      strokeWidth={1} opacity={
                        laneSelection.includes(value.id) ? 0.5 : 0.1
                      }
                      strokeScaleEnabled={false} />
                  )
                })
              }
              return result;
            })
          }
        </Layer>

        {checkedList.includes("Stop Sign") && <Layer id="stopSign">
          {drawingData.stopSign.map((value, index) => {
            if (!stopSignSelection.includes(value.id)) return;
            return [
              <Line key={index * 10} points={value.stopLine} stroke="red"
                strokeWidth={1} opacity={0.5} />,
              <KonvaText key={index * 10 + 1} x={value.x} y={value.y} text={value.id} fontSize={1} fill="red" scaleY={-1} />
            ]
          })}
        </Layer>}

        <Layer id="Signal">
          {drawingData.signal.map((value, index) => {
            if (!signalSelection.includes(value.id)) {
              return <KonvaText key={index * 10 + 2} x={value.x} y={value.y} text={value.id} fontSize={1} opacity={0.5} fill='green' scaleY={-1} />
            }
            const elements = [];
            if (checkedList.includes("Signal")) {
              elements.push(
                <Line key={index * 10 + 1} points={value.points} stroke="green"
                  strokeWidth={1} strokeScaleEnabled={false} />
              )
              elements.push(
                <KonvaText key={index * 10 + 2} x={value.x} y={value.y} text={value.id} fontSize={1} fill='green' scaleY={-1} />
              )
            }
            if (checkedList.includes('Signal Stop Line')) {
              elements.push(
                <Line key={index * 10 + 3} points={value.stopLine} stroke="green"
                  strokeWidth={3} opacity={0.5} strokeScaleEnabled={false} />
              )
            }
            if (checkedList.includes('Signal Mapping')) {
              elements.push(
                <Line key={index * 10 + 4}
                  points={value.mappingLine}
                  stroke="purple" strokeWidth={2} opacity={0.5} strokeScaleEnabled={false} />
              )
            }
            return elements;
          })}
        </Layer>
      </Stage>}
      <div style={{ position: 'absolute', right: 0, top: 0, padding: 5 }}>
        <Button onClick={() => setDrawerVisible(!drawerVisible)}>Controls</Button>
      </div>
      <Drawer title="Controls" placement='right' visible={drawerVisible} onClose={() => setDrawerVisible(false)}>
        <Collapse>
          <Panel header="Stop Sign" key="1">
            <SelectionComponent plainOptions={stopSignPlain} checkedList={stopSignSelection} setCheckedList={setStopSignSelection} />
          </Panel>
          <Panel header="Signal" key="2">
            <SelectionComponent plainOptions={signalPlain} checkedList={signalSelection} setCheckedList={setSignalSelection} />
          </Panel>
          <Panel header="Lane" key="3">
            <SelectionComponent plainOptions={lanePlain} checkedList={laneSelection} setCheckedList={setLaneSelection} />
          </Panel>
        </Collapse>
      </Drawer>
      <div style={{ position: 'absolute', right: 0, bottom: 0, padding: 5 }}>
        <Text>{`(${123123}, ${123123})`}</Text>
      </div>
    </div>
  )
}

export default ViewContent