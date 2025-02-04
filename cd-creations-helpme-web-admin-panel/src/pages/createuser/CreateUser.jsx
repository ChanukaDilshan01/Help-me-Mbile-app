import React from 'react'
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./createuser.scss"
import { Table , Button } from 'antd';
import { Link } from 'react-router-dom'; 

const CreateUser = () => {
  const handleView = (record) => {
    // Implement view logic here
    console.log("View clicked for record:", record);
  };
  const handleActivate = (record) => {
    // Implement activate logic here
    console.log("Activate clicked for record:", record);
  };

  const handleDeactivate = (record) => {
    // Implement deactivate logic here
    console.log("Deactivate clicked for record:", record);
  };

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Privilage',
    dataIndex: 'privilage',
    key: 'privilage',
  },

  {
    title: 'State',
      dataIndex: 'state',
      key: 'state',
      render: (text, record) => (
        <span className={record.active ? 'active-status' : 'inactive-status'}>
          {record.active ? 'Active' : 'Inactive'}
        </span>
    ),
  },

  {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    render: (_, record) => (
      <>
     <a onClick={() => handleView(record)} className="view">View</a>
        <a onClick={() => handleView(record)} className="delete">Delete</a>
        <Button type="primary" onClick={() => handleActivate(record)}>Active</Button>
          <Button type="danger" onClick={() => handleDeactivate(record)}>Inactive</Button>
  </>
    ),
  },
  
];

const data = [
  {
    key: 1,
    name: 'John Brown',
    number: 32,
    privilage: 'Administrator',
    active: true,
  },
  {
    key: 2,
    name: 'Jim Green',
    number: 42,
    privilage: 'Accountent',
    active: false, 
  },
  {
    key: 3,
    name: 'Not Expandable',
    number: 29,
    privilage: 'Administrator',
    active: true,
  },
  {
    key: 4,
    name: 'Joe Black',
    number: 32,
    privilage: 'Administrator',
   
  },
];


  return (
    <div className='createuser'>
      <Sidebar/>
      <div className='createuserContainer'>
      <Navbar/>
      <Link to="/adduser">
      <Button type="primary" className="add-user-button" style={{ marginBottom: '16px' }}>
            Add User
          </Button>
          </Link>
     <div className='table'>
    

      <Table
    columns={columns}
    expandable={{
      expandedRowRender: (record) => (
        <p
          style={{
            margin: 0,
          }}
        >
          {record.description}
        </p>
      ),
      rowExpandable: (record) => record.name !== 'Not Expandable',
    }}
    dataSource={data}
  />
</div> 


      </div>
    </div>
  )

}
export default CreateUser
