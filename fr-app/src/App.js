import React, { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import axios from 'axios';

const client = axios.create({
  baseURL: "http://localhost:3003"
})
export default function App() {

  const [tree , setTree] = useState({})
  useEffect(() => {
    client.get('/api/data')
    .then((rep) => setTree(rep.data))
  }, []);

  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" style={{ width: '100vw', height: '100vh' }}>
      <Tree data={tree} orientation='vertical' />
    </div>
  );
}
