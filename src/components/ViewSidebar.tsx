import React, { useState } from 'react'
import { Checkbox, Divider, Space, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
const { Text, Title } = Typography;
const CheckboxGroup = Checkbox.Group;

type ViewSidebarProps = {
  plainOptions;
  checkedList;
  setCheckedList;
}

const ViewSidebar: React.FC<ViewSidebarProps> = ({ plainOptions, checkedList, setCheckedList }) => {

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  return (
    <div>
      <div style={{ width: '100%' }}>
        <Title level={5} style={{ textAlign: 'left', margin: '10px' }}>Hd Map Viewer</Title>
      </div>
      <div style={{ width: '100%' }}>
        <Divider orientation='left'>Layers</Divider>
        <div style={{ padding: 5 }}>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            Check all
          </Checkbox>
          <CheckboxGroup
            style={{ display: 'flex', flexDirection: 'column' }}
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
          />
        </div>

      </div>
      <div style={{ width: '100%' }}>
        <Divider orientation='left' style={{ borderLeft: '1px solid white' }}>Routes</Divider>
      </div>
    </div>
  )
}

export default ViewSidebar