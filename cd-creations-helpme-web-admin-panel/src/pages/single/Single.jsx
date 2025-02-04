import "./single.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar  from "../../components/nevbar/Navbar"
import Chart from  "../../components/chart/Chart"
import List  from "../../components/table/Table"

const Single = () => {
  return (
    <div className="single">
      <Sidebar/>
      <div className="singleContainer">
        <Navbar/>
       <div className="top">
        <div className="left">
          <div className="editButton">Edit</div>
          <h1 className="title">Information</h1>
         <div className="item">
            <img src="" alt="" className="itemImage" />
        <div className="details">
          <h1 className="itemTitle">Jane Doe</h1>
          <div className="detailItem">
            <span className="itemkey">Email:</span>
            <span className="itemValue">Jane@gmail.com</span>
          </div>
          <div className="detailItem">
            <span className="itemkey">Phone:</span>
            <span className="itemValue">+94 775584420</span>
          </div>
          <div className="detailItem">
            <span className="itemkey">Address :</span>
            <span className="itemValue">Badulla</span>
          </div>
          <div className="detailItem">
            <span className="itemkey">Country:</span>
            <span className="itemValue">Sri Lanka</span>
          </div>

        </div>
  </div> 
        </div>
        <div className="right">
          <Chart aspect={3 / 1} title="User Spending ( last 6 Months)"/>
        </div>
       </div>
       <div className="bottom">
        <hi className="title">Last Transaction</hi>
        <List/>
       </div>
      
      </div>
      </div>
  )
}

export default Single
