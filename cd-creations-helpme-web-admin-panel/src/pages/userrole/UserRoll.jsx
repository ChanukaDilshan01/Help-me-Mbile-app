import React from 'react'
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./userroll.scss"
import { Table , Button } from 'antd';
import { Link } from 'react-router-dom'; 

const UserRoll = () => {
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
    title: 'Privilage',
    dataIndex: 'privilage',
    key: 'privilage',
  },
  {
    title: 'Number',
    dataIndex: 'number',
    key: 'number',
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
    privilage: 'Administrator',
    number: 1,
    active: true,
  },
  {
    key: 2,
    privilage: 'Accountant',
    number: 2,
    active: false, 
  },
  {
    key: 3,
    privilage: 'Stor Keeper',
    number: 3,
    active: true,
  },
  
];




  return (
    <div className='userroll'>
        <Sidebar/>
      <div className="userrollContainer">
        <Navbar/>
        <Link to="/privilage">
      <Button type="primary" className="add-user-button" style={{ marginBottom: '16px' }}>
            Add User Roll
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

export default UserRoll
