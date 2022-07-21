import { Button, Space, Typography } from 'antd';
import React, { useRef } from 'react'
import { useState } from 'react'

const { Text } = Typography

type ViewHeaderProps = {
  selectedFile;
  setSelectedFile;
}

const ViewHeader: React.FC<ViewHeaderProps> = ({ selectedFile, setSelectedFile }) => {
  // const [selectedFile, setSelectedFile] = useState(null);
  const inputFile = useRef<HTMLInputElement | null>(null);

  const onFileSelected = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setSelectedFile(file);
  }

  return (
    <div>
      <input type='file' ref={inputFile} style={{ display: 'none' }} onChange={setSelectedFile} />
      <Space>
        <Button onClick={e => inputFile.current.click()}>Select File</Button>
        <Text style={{ color: 'white' }}>
          {selectedFile === null ? "No File Selected" : selectedFile.name}
        </Text>
      </Space>
    </div>
  )
}

export default ViewHeader