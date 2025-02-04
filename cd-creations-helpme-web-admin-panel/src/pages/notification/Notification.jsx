import React from 'react'
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./notification.scss"
import { Table , Button } from 'antd';
import { Link } from 'react-router-dom'; 

const Notification = () => {
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
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Iteam',
      dataIndex: 'iteam',
      key: 'iteam',
    },
    {
      title: 'Date ',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
   
   
  
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <>
        <Link to="/orders">View</Link>
          <a onClick={() => handleView(record)} className="delete">Delete</a>
          <Button type="primary" onClick={() => handleActivate(record)}>Conform</Button>
            
    </>
      ),
    },
    
  ];

  const data = [
    {
      key: 1,
      location: 'haliala',
      iteam: 10,
      date:'2024/05/08',
      time:'12:10 PM',
      
    },
    {
      key: 2,
      location: 'badulupitiya',
      iteam: 12,
      date:'2024/05/08',
      time:'12:10 PM',
     
    },
    {
      key: 3,
      location: 'rockil',
      iteam: 23,
      date:'2024/05/08',
      time:'12:10 PM',
      
    },
    
  ];
  


  return (
    <div className='notification'>
      <Sidebar/>
      <div className='notificationContainer'>
      <Navbar/>
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

export default Notification
