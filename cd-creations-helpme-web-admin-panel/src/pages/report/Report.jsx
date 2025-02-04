import React from 'react'
import "./report.scss"
import Navbar from "../../components/nevbar/Navbar"
import Sidebar from "../../components/sidebar/Sidebar"


const Report = () => {
  return (
    <div className='report'>
      <Sidebar/>
      <div className='reportContainer'>
      <Navbar/>
      report
      </div>
    </div>
  )
}

export default Report
