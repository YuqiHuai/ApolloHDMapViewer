import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { Checkbox } from 'antd';

import React, { useState } from 'react'
type SelectionComponentProps = {
    plainOptions;
    checkedList;
    setCheckedList;
}
const SelectionComponent: React.FC<SelectionComponentProps> = ({ plainOptions, checkedList, setCheckedList }) => {

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
        <>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Check all
            </Checkbox>
            <Checkbox.Group
                style={{ display: 'flex', flexDirection: 'column' }}
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
            /></>
    )
}

export default SelectionComponent