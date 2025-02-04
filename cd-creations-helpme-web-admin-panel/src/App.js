import Home from "./pages/home/Home";
import {BrowserRouter,Routes,Route,} from "react-router-dom";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import Delivery from "./pages/Delivery/Delivery";
import Orders from "./pages/orders/Orders";
import Privilage from "./components/Privilage/Privilage";
import SubUser from "./pages/SubUser/SubUser";
import UserRoll from "./pages/userrole/UserRoll";
import Status from "./pages/status/Status";
import Notification from "./pages/notification/Notification";
import CreateUser from "./pages/createuser/CreateUser";
import Report from "./pages/report/Report";
import AddUser from "./components/adduser/AddUser";
import OrderDetails from "./pages/OrderDetails/OrderDetails";
import AddDriver from "./pages/AddDriver/AddDriver";
import { productInputs, userInputs } from "./formSource";
import Users from "./pages/Users/Users";
import Packages from "./pages/Packages/Packages";
import Subscriptions from "./Subscriptions/Subscriptions";
import DeliveryRoutes from "./pages/DeliveryRoutes/DeliveryRoutes";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
       <Routes>
          <Route path="/">
             <Route index element ={<Login/>} />
             <Route path="home" element={<Home/>}/>
             <Route path="users">
             <Route index element={<Users/>}/>
             <Route path=":userid" element={<Single/>}/>
             </Route>
                 <Route path="addUser">
                     <Route index element={<AddUser/>}/>
                 </Route>


             
             <Route path="orders">
             <Route index element={<Orders/>}/>
             <Route path=":orderid" element={<OrderDetails/>}/>
             </Route>
             <Route path="products">
             <Route index element={<List/>}/>
             <Route path=":productid" element={<Single/>}/>
             <Route path="new" element={<New inputs = {productInputs} title="Add New Product"/>}/>
             </Route>
             <Route path="drivers" element={<Delivery />} />
            <Route path="privilage" element={<Privilage />} />
            <Route path="bookings" element={<SubUser />} />
              <Route path="packages" element={<Packages />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="routes" element={<DeliveryRoutes />} />
              <Route path="adddriver" element={<AddDriver/>} />
            
            <Route path="userroll" element={<UserRoll />} />
            <Route path="status" element={<Status />} />
            <Route path="notification" element={<Notification />} />
            <Route path="createuser">
              <Route index element={<CreateUser />} />
              <Route path="adduser" element={<AddUser />} /> {/* Updated path */}
              <Route path=":createusertid" element={<AddUser />} /> {/* You can adjust this path as needed */}
            </Route>
            <Route path="report" element={<Report />} />
          </Route>

          
       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
