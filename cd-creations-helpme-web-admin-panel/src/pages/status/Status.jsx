import React from 'react'
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"
import "./status.scss"

const Status = () => {
  return (
    <div className='status'>
      <Sidebar/>
      <div className="statusContainer">
        <Navbar/>
       status
        </div>
    </div>
  )
}

export default Status
