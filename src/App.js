import './App.css';
import {Table,Avatar,Button,Modal,Input} from "antd";
import {useState, useEffect} from "react";
import { EditOutlined,DeleteOutlined } from '@ant-design/icons';

function App() {
  const [dataSource, setDataSource] = useState([]);
  const [currentRecord, setCurrentRecord] = useState({});
  const [modalVisible, setModalVisible ] = useState(false);
  
  const getAllRecords = async() => {
    try{
      const res = await fetch('https://reqres.in/api/users?page=1');
      const {data} = await res.json();
      if(!localStorage.getItem('data')){
        localStorage.setItem('data', JSON.stringify(data));
        setDataSource(JSON.parse(localStorage.getItem('data')));
      }
      else{
        setDataSource(JSON.parse(localStorage.getItem('data')));
      }
    }
    catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getAllRecords();
  },[]);
  
  const saveRecord =()=>{
    let allRows = JSON.parse(localStorage.getItem('data'));
    allRows.forEach((user,index)=>{
      if(user.id === currentRecord.id){
        allRows[index] = currentRecord;
      }
    }); 
    setModalVisible(false);
    localStorage.setItem('data', JSON.stringify(allRows));
    setDataSource(JSON.parse(localStorage.getItem('data')))
  }

  const getCurrentRecord = (record) =>{
    setCurrentRecord(record);
    setModalVisible(true);
  }

  const deleteRecord=(record)=>{
    let updateList = dataSource.filter( user=> user.id !== record);
    console.log(updateList)
    localStorage.setItem('data', JSON.stringify(updateList));
    setDataSource(JSON.parse(localStorage.getItem('data')));
  }

  const columns = [{
    title:"id",
    dataIndex: "id",
    key:(_,record)=>{return record.id}
  },
  {
    title:"Email Id",
    dataIndex: "email",
    key:'email'
  },
  {
    title:"First Name",
    dataIndex: "first_name",
    key:'first_name'
  },
  {
    title:"Last Name",
    dataIndex: "last_name",
    key:"last_name"
  },
  {
    title:"Avatar",
    key: "avatar",
    render: (_, record) => { return (<Avatar src={record.avatar} />)}
  },
  {
    title:"Actions",
    key:"actions",
    render:(record)=>{return (<>
                        <Button 
                          type="dashed" 
                          onClick={()=>{getCurrentRecord(record)}} 
                          icon={<EditOutlined/>} />

                        <Button 
                          icon={<DeleteOutlined/>} 
                          onClick={()=>{deleteRecord(record.id)}}/>
                      </>)}
  }];

  return (
    <div className="App">
      <div className="App-header">
        <Table rowKey="id" bordered columns={columns} dataSource={dataSource} />
        <Modal title="Edit User" visible={modalVisible} onOk={()=>saveRecord()} onCancel={()=>setModalVisible(false)}>
          <Input 
            value={currentRecord.first_name} 
            onChange={(e)=>{setCurrentRecord(prev => {return {...prev,first_name:e.target.value}})}}/>
            <Input 
            value={currentRecord.last_name} 
            onChange={(e)=>{setCurrentRecord(prev => {return {...prev,last_name:e.target.value}})}}/>
            <Input 
            value={currentRecord.email} 
            onChange={(e)=>{setCurrentRecord(prev => {return {...prev,email:e.target.value}})}}/>
            <Input 
            value={currentRecord.avatar} 
            onChange={(e)=>{setCurrentRecord(prev => {return {...prev,avatar:e.target.value}})}}/>
        </Modal>
      </div>
    </div>
  );
}

export default App;
