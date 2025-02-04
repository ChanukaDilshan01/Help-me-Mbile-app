import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./orders.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/nevbar/Navbar";
import { useNavigate } from 'react-router-dom';

function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.substring(0, maxLength) + "...";
    }
    return str;
  }
  

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const today = new Date(); // Get today's date
  const tomorrow = new Date(today); // Create a new date object with today's date
  tomorrow.setDate(today.getDate() + 1); // Set it to tomorrow by adding 1 to the current day

  const [endDate, setEndDate] = useState(tomorrow);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        const response = await fetch(`http://93.127.198.108:5000/order/by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        const sortedOrders = data.orders.sort((a, b) => b.order_id - a.order_id);
        setOrders(sortedOrders);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [startDate, endDate]);

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
    console.log(`View order ${orderId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatDate = (timestamp) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true // Use AM/PM format
    };
    return new Date(timestamp).toLocaleString('en-US', options);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div className="main-cont1">
          <br />
          <div className="date-pickers">
  <div className="date-picker-container">
    <label>Start Date: </label>
    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
  </div>
  <div className="date-picker-container">
    <label>End Date: </label>
    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
  </div>
</div>

          <div className="table-container">
            <Table bordered>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Item Details</th>
                  <th>Status</th>
                  <th>Customer ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{truncateString(order.item_details, 50)}</td>
                    <td>{order.status}</td>
                    <td>{order.customer_id}</td>
                    <td>
                      <Button onClick={() => handleViewOrder(order.order_id)}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
