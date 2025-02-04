import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ListAltIcon from '@mui/icons-material/ListAlt'; // Changed
import GroupIcon from '@mui/icons-material/Group'; // Changed
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'; // Changed
import AssignmentIcon from '@mui/icons-material/Assignment'; // Changed
import ReportIcon from '@mui/icons-material/Report'; // Changed
import SettingsIcon from '@mui/icons-material/Settings'; // Changed
import CreateIcon from '@mui/icons-material/Create';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className='sidebar'>

            {/* logo and click  */}
            <div className="top">
                <Link to="/home" style={{textDecorationLine: "none"}}>
                    <span className="logo">HelpMe</span>
                </Link>
            </div>
            <hr/>

            {/* sidebar topics  */}
            <div className="center">
                <ul>


                    {/* dashboard title in sidebar */}
                    <Link to="/home">
                        <p className="title">MAIN</p>
                        <li>
                            <DashboardIcon/>
                            <span>Dashboard</span>
                        </li>
                    </Link>



                    {/* main topic title */}
                    <p className="title">LISTS</p>

                    {/* sub topic users  not subcription users*/}
                    <Link to="/users" style={{textDecorationLine: "none"}}>
                        <li>
                            <PersonOutlineIcon/>
                            <span>Users</span>
                        </li>
                    </Link>

                    {/* This is a single-line comment */}
                    <Link to="/orders" style={{textDecorationLine: "none"}}>
                        <li>
                            <LocalShippingIcon/>
                            <span>Orders</span>
                        </li>
                    </Link>

                    {/* sub topic users  subcription users*/}
                    <Link to="/bookings" style={{textDecorationLine: "none"}}>
                        <li>
                            <VerifiedUserIcon/>
                            <span>Taxi Bookings</span>
                        </li>
                    </Link>



                    <Link to="/drivers" style={{textDecorationLine: "none"}}>
                        <li>
                            <DirectionsCarIcon/>
                            <span>Drivers</span>
                        </li>
                    </Link>

                    {/* sub topic users  subcription users*/}
                    <Link to="/packages" style={{textDecorationLine: "none"}}>
                        <li>
                            <AssignmentIcon/>
                            <span>Packages</span>
                        </li>
                    </Link>

                    <Link to="/subscriptions" style={{textDecorationLine: "none"}}>
                        <li>
                            <ProductionQuantityLimitsIcon/>
                            <span>Subscriptions</span>
                        </li>
                    </Link>


                    <Link to="/routes" style={{textDecorationLine: "none"}}>
                        <li>
                            <ListAltIcon/>
                            <span>Routes</span>
                        </li>
                    </Link>


                    {/* side bar  use full section  */}
                    <p className="title">USEFUL</p>

                    <Link to="#" style={{textDecorationLine: "none"}}>
                        <li>
                            <ReportIcon/>
                            <span>Report</span>
                        </li>
                    </Link>




                    {/* side bar setting panel */}
                    <p className="title">Setting</p>

                    <Link to="#" style={{textDecorationLine: "none"}}>
                        <li>
                            <CreateIcon/>
                            <span>Create User</span>
                        </li>
                    </Link>

                    <Link to="#" style={{textDecorationLine: "none"}}>
                        <li>
                            <TextIncreaseIcon/>
                            <span>User Roll</span>
                        </li>
                    </Link>





                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    )
}

export default Sidebar;
