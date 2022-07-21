import React from 'react';
import { Layout } from 'antd';
import ViewHeader from './components/ViewHeader';
import ViewSidebar from './components/ViewSidebar';
import ViewContent from './components/ViewContent';
import { useState } from 'react';
import { load } from 'protobufjs';
import { Map, Point } from './types';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

const { Header, Content, Sider } = Layout;


function App() {
  const [hdMap, setHdMap] = useState(null);
  const [mapData, setMapData] = useState(null);

  const onFileSelected = async (e) => {
    setHdMap(e.target.files[0]);
    const root = await load("/proto/map/map.proto");
    const MapMessage = root.lookupType("proto.hdmap.Map");
    const reader = new FileReader();
    reader.onload = function (e) {
      let arrayBuffer = new Uint8Array(reader.result as ArrayBufferLike);
      const map = MapMessage.decode(arrayBuffer);
      setMapData(map);

    }
    reader.readAsArrayBuffer(e.target.files[0]);
  }

  const plainOptions = [
    'Lane Line', 'Lane ID', 'Lane Central Curve',
    'Stop Sign',
    'Signal', 'Signal Stop Line', 'Signal Mapping'
  ];
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(plainOptions);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider style={{ backgroundColor: 'white', borderRight: '1px solid black' }}>
        <ViewSidebar plainOptions={plainOptions} checkedList={checkedList} setCheckedList={setCheckedList} />
      </Sider>
      <Layout>
        <Header>
          <ViewHeader selectedFile={hdMap} setSelectedFile={onFileSelected} />
        </Header>
        <Content>
          {mapData && <ViewContent map={mapData as undefined as Map} checkedList={checkedList} />}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
