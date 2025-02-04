import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from "../../components/nevbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import './orderDetails.css'; // Import CSS file for styling

function OrderDetails() {
    const { orderid } = useParams();
    const [order, setOrder] = useState(null);
    const [customerName, setCustomerName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [showAmountInput, setShowAmountInput] = useState(false);
    const [orderAmount, setOrderAmount] = useState('');
    const [userResponse, setUserResponse] = useState('');
    const [pending, setPending] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [deliveryDetails, setDeliveryDetails] = useState(null);
    const [routeName, setRouteName] = useState('');
    const [driverName, setDriverName] = useState('');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [items, setItems] = useState([]);
    const [itemDetails, setItemDetails] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [activeTab, setActiveTab] = useState('order-details');

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    useEffect(() => {
        // Fetch order details using the provided endpoint
        fetch(`http://93.127.198.108:5000/order/get-order/${orderid}`)
            .then(response => response.json())
            .then(data => {
                setOrder(data.order);
                // Fetch all users to find the relevant user's name
                fetch('http://93.127.198.108:5000/users/all')
                    .then(response => response.json())
                    .then(userData => {
                        const relevantUser = userData.users.find(user => user.user_id === data.order.customer_id);
                        if (relevantUser) {
                            setCustomerName(relevantUser.name);
                            setMobileNo(relevantUser.phone);
                        }
                    })
                    .catch(error => console.error('Error fetching users:', error));

                // Set destination address if available
                if (data.order.destination_address) {
                    setDestinationAddress(data.order.destination_address);
                }

                // Set order amount, user response, and pending status
                setOrderAmount(data.order.amount);
                setUserResponse(data.order.customer_response);

                // Set delivery details if available
                if (data.delivery) {
                    setDeliveryDetails(data.delivery);
                    // Fetch route name
                    fetch(`http://93.127.198.108:5000/driver/routes/${data.delivery.route_id}`)
                        .then(response => response.json())
                        .then(routeData => {
                            setRouteName(routeData.route.start_loc_name + ' - ' + routeData.route.destination_loc_name);
                        })
                        .catch(error => console.error('Error fetching route name:', error));
                    // Fetch driver name
                    fetch(`http://93.127.198.108:5000/driver/id/${data.delivery.driver_id}`)
                        .then(response => response.json())
                        .then(driverData => {
                            setDriverName(driverData.driver.name);
                        })
                        .catch(error => console.error('Error fetching driver name:', error));

                }
            })
            .catch(error => console.error('Error fetching order details:', error));
        // Fetch order items using the provided endpoint
        fetch(`http://93.127.198.108:5000/order/order-items/${orderid}`)
            .then(response => response.json())
            .then(data => {
                setItems(data.orderItems);
                // Recalculate total price
                let total = 0;
                data.orderItems.forEach(item => {
                    total += parseFloat(item.price);
                });
                setTotalPrice(total);
            })
            .catch(error => console.error('Error fetching order items:', error));
    }, [orderid]);


    useEffect(() => {
        fetchRoutes();
        fetchDrivers();
    }, []);

    const fetchRoutes = () => {
        // Fetch routes from the server and set them in state
        fetch('http://93.127.198.108:5000/driver/routes/all')
            .then(response => response.json())
            .then(data => setRoutes(data.routes))
            .catch(error => console.error('Error fetching routes:', error));
    };

    const fetchDrivers = () => {
        // Fetch drivers from the server and set them in state
        fetch('http://93.127.198.108:5000/driver/all')
            .then(response => response.json())
            .then(data => setDrivers(data.drivers))
            .catch(error => console.error('Error fetching drivers:', error));
    };



    const handleUpdateAmount = () => {
        // Call the API to update the amount and status
        fetch('http://93.127.198.108:5000/order/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: orderid,
                newData: {
                    amount: parseFloat(amount),
                    status: 'amount added by admin'
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                // Update order amount, user response, and pending status
                setOrderAmount(data.order.amount);
                setUserResponse(data.order.customer_response);
                setPending('pending');
                // Reload the page
                window.location.reload();
            })
            .catch(error => console.error('Error updating amount:', error));
    };

    const handleUpdateDelivery = () => {
        // Call the API to update the delivery details
        fetch('http://93.127.198.108:5000/delivery/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                route_id: selectedRoute,
                driver_id: selectedVehicle,
                order_id: orderid
            })
        })
            .then(response => response.json())
            .then(data => {
                // Handle success or error response if needed
                console.log('Delivery details updated:', data);
                // Reload the page
                window.location.reload();
            })
            .catch(error => console.error('Error updating delivery details:', error));
    };


    if (!order || !customerName) {
        return <div>Loading...</div>;
    }

    const addItem = async () => {
        try {
            const response = await fetch(`http://93.127.198.108:5000/order/order-item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: orderid,
                    item_name: itemDetails, // Assuming item_details is the property name
                    price: 0 // You may adjust the price as needed
                })
            });
            if (response.ok) {
                const newItem = await response.json();
                setItems([...items, newItem.orderItem]);
                setItemDetails(''); // Clear item details textbox after adding
            } else {
                console.error('Failed to add item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    const handlePriceChange = (index, newPrice) => {
        const updatedItems = [...items];
        updatedItems[index].price = newPrice;
        setItems(updatedItems);

        // Recalculate total price
        let total = 0;
        updatedItems.forEach(item => {
            total += parseFloat(item.price);
        });
        setTotalPrice(total);
    };

    const updatePrice = async (index) => {
        try {
            const response = await fetch(`http://93.127.198.108:5000/order/order-item/${items[index].id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_id: orderid,
                    item_name: items[index].item_name,
                    price: items[index].price
                })
            });
            if (response.ok) {
                console.log('Price updated successfully');
            } else {
                console.error('Failed to update price');
            }
        } catch (error) {
            console.error('Error updating price:', error);
        }
    };

    const updatePrices = async () => {
        for (const item of items) {
            const index = items.indexOf(item);
            await updatePrice(index);
        }

        try {
            const response = await fetch('http://93.127.198.108:5000/order/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId: orderid,
                    newData: {
                        amount: totalPrice,
                        status: 'amount added by admin'
                    }
                })
            });
            if (response.ok) {
                console.log('Amount and status updated successfully');
                window.location.reload();
            } else {
                console.error('Failed to update amount and status');
            }
        } catch (error) {
            console.error('Error updating amount and status:', error);
        }
    };

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
                    <br/>
                    <div className="tab-container">
                        <div className={`tab ${activeTab === 'order-details' ? 'active' : ''}`}
                             onClick={() => setActiveTab('order-details')}>
                            <span className="step-label">Order Details</span>
                        </div>
                        <div className={`tab ${activeTab === 'items' ? 'active' : ''}`}
                             onClick={() => setActiveTab('items')}>
                            <span className="step-label">Items</span>
                        </div>
                        <div className={`tab ${activeTab === 'delivery-details' ? 'active' : ''}`}
                             onClick={() => setActiveTab('delivery-details')}>
                            <span className="step-label">Delivery Details</span>
                        </div>
                        <div className={`tab ${activeTab === 'complete' ? 'active' : ''}`}
                             onClick={() => setActiveTab('complete')}>
                            <span className="step-label">Summary</span>
                        </div>
                    </div>


                    <div className="tab-content">
                        {activeTab === 'order-details' && (
                            <div className="order-details">
                                <h2>Order Details</h2>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td><strong>Order ID:</strong></td>
                                        <td>{order.order_id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Customer Name:</strong></td>
                                        <td>{customerName}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Mobile No:</strong></td>
                                        <td>{mobileNo}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Item Details:</strong></td>
                                        <td>{order.item_details}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Delivery Status:</strong></td>
                                        <td>{order.status}</td>
                                    </tr>
                                    {destinationAddress && (
                                        <tr>
                                            <td><strong>Destination Address:</strong></td>
                                            <td>{destinationAddress}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td><strong>Details Image:</strong></td>
                                        <td>
                                            {order && order.details_pic && (
                                                <div onClick={toggleFullscreen}
                                                     style={{cursor: isFullscreen ? 'zoom-out' : 'zoom-in'}}>
                                                    <img
                                                        src={order.details_pic}
                                                        alt="Order Details"
                                                        style={{
                                                            width: isFullscreen ? '100%' : '200px',
                                                            height: isFullscreen ? '100vh' : '200px'
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                    </tr>

                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeTab === 'items' && (
                            <div className="items">
                                {/* Display amount input field and update button if status is "user created order" */}
                                {order.status === 'user created order' && (
                                    <div>
                                        <div>
                                            <br/>
                                            <h2>Add Order Items</h2>
                                            <input
                                                type="text"
                                                placeholder="Item Details"
                                                value={itemDetails}
                                                onChange={e => setItemDetails(e.target.value)}
                                            />
                                            <button onClick={addItem}>Add Item</button>
                                        </div>
                                        {/* List of items with details */}
                                        <div>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Item Name</th>
                                                    <th>Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.item_name}</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                onChange={e => handlePriceChange(index, parseInt(e.target.value))}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td><strong>Total</strong></td>
                                                    <td>{totalPrice}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <br/>
                                            {totalPrice !== 0 && (
                                                <button onClick={updatePrices}>Update Prices</button>
                                            )}
                                        </div>
                                        <br/>

                                    </div>
                                )}
                                {/* Display order amount, user response, and pending status if status is "amount added by admin" */}
                                {order.status !== 'user created order' && (
                                    <div>
                                        <br/>
                                        <h2>Order Item Details</h2>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.item_name}</td>
                                                    <td>
                                                        {item.price}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td><strong>Total</strong></td>
                                                <td>{totalPrice}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>
                                        <p><strong>User Response:</strong> {userResponse || 'Pending'}</p>
                                        <br/>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'delivery-details' && (
                            <div className="delivery-details">
                                {/* Display delivery details area with dropdowns if status is "amount accepted by user" and user response is "accepted" */}
                                {order.status === 'amount accepted by user' && userResponse === 'accepted' && (
                                    <div>
                                        <h2>Delivery Details</h2>
                                        <div className="dropdown-container">
                                            <select className="dropdown" value={selectedRoute}
                                                    onChange={e => setSelectedRoute(e.target.value)}>
                                                <option value="">Select Route</option>
                                                {routes.map(route => (
                                                    <option key={route.route_id} value={route.route_id}>
                                                        {route.start_loc_name} - {route.destination_loc_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="dropdown-container">
                                            <select className="dropdown" value={selectedVehicle}
                                                    onChange={e => setSelectedVehicle(e.target.value)}>
                                                <option value="">Select Vehicle</option>
                                                {drivers.map(driver => (
                                                    <option key={driver.driver_id} value={driver.driver_id}>
                                                        {driver.bike_no} - {driver.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <br/> {/* Add space between the dropdowns and button */}
                                        <button className="delivery_btn" onClick={handleUpdateDelivery}>Update
                                            Delivery
                                        </button>
                                        <br/>
                                    </div>
                                )}
                                {deliveryDetails && (
                                    <div>
                                        <h2>Delivery Details</h2>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td><strong>Route</strong></td>
                                                <td>{routeName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Driver Name</strong></td>
                                                <td>{driverName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Delivery Status</strong></td>
                                                <td>{deliveryDetails.status}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Create At</strong></td>
                                                <td>{formatDate(deliveryDetails.add_date)}</td>
                                            </tr>
                                            {deliveryDetails.complete_date && (
                                                <tr>
                                                    <td><strong>Complete At</strong></td>
                                                    <td>{formatDate(deliveryDetails.complete_date)}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                        <br/>
                                        <br/>
                                    </div>

                                )}
                            </div>
                        )}
                        {activeTab === 'complete' && (
                            <div>
                                <div className="order-details">
                                    <h2>Order Details</h2>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td><strong>Order ID:</strong></td>
                                            <td>{order.order_id}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Customer Name:</strong></td>
                                            <td>{customerName}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Mobile No:</strong></td>
                                            <td>{mobileNo}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Item Details:</strong></td>
                                            <td>{order.item_details}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Delivery Status:</strong></td>
                                            <td>{order.status}</td>
                                        </tr>
                                        {destinationAddress && (
                                            <tr>
                                                <td><strong>Destination Address:</strong></td>
                                                <td>{destinationAddress}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td><strong>Details Image:</strong></td>
                                            <td>
                                                {order && order.details_pic && (
                                                    <div onClick={toggleFullscreen}
                                                         style={{cursor: isFullscreen ? 'zoom-out' : 'zoom-in'}}>
                                                        <img
                                                            src={order.details_pic}
                                                            alt="Order Details"
                                                            style={{
                                                                width: isFullscreen ? '100%' : '200px',
                                                                height: isFullscreen ? '100vh' : '200px'
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>
                                </div>
                                {/* Display amount input field and update button if status is "user created order" */}
                                {order.status === 'user created order' && (
                                    <div>
                                        <div>
                                            <br/>
                                            <h2>Add Order Items</h2>
                                            <input
                                                type="text"
                                                placeholder="Item Details"
                                                value={itemDetails}
                                                onChange={e => setItemDetails(e.target.value)}
                                            />
                                            <button onClick={addItem}>Add Item</button>
                                        </div>
                                        {/* List of items with details */}
                                        <div>
                                            <table>
                                                <thead>
                                                <tr>
                                                    <th>Item Name</th>
                                                    <th>Price</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.item_name}</td>
                                                        <td>
                                                            <input
                                                                type="number"
                                                                value={item.price}
                                                                onChange={e => handlePriceChange(index, parseInt(e.target.value))}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td><strong>Total</strong></td>
                                                    <td>{totalPrice}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <br/>
                                            {totalPrice !== 0 && (
                                                <button onClick={updatePrices}>Update Prices</button>
                                            )}
                                        </div>
                                        <br/>

                                    </div>
                                )}
                                {/* Display order amount, user response, and pending status if status is "amount added by admin" */}
                                {order.status !== 'user created order' && (
                                    <div>
                                        <br/>
                                        <h2>Order Item Details</h2>
                                        <table>
                                            <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Price</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.item_name}</td>
                                                    <td>
                                                        {item.price}
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td><strong>Total</strong></td>
                                                <td>{totalPrice}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <br/>
                                        <p><strong>User Response:</strong> {userResponse || 'Pending'}</p>
                                        <br/>
                                    </div>
                                )}
                                {/* Display delivery details area with dropdowns if status is "amount accepted by user" and user response is "accepted" */}
                                {order.status === 'amount accepted by user' && userResponse === 'accepted' && (
                                    <div>
                                        <h2>Delivery Details</h2>
                                        <div className="dropdown-container">
                                            <select className="dropdown" value={selectedRoute}
                                                    onChange={e => setSelectedRoute(e.target.value)}>
                                                <option value="">Select Route</option>
                                                {routes.map(route => (
                                                    <option key={route.route_id} value={route.route_id}>
                                                        {route.start_loc_name} - {route.destination_loc_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="dropdown-container">
                                            <select className="dropdown" value={selectedVehicle}
                                                    onChange={e => setSelectedVehicle(e.target.value)}>
                                                <option value="">Select Vehicle</option>
                                                {drivers.map(driver => (
                                                    <option key={driver.driver_id} value={driver.driver_id}>
                                                        {driver.bike_no} - {driver.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <br/> {/* Add space between the dropdowns and button */}
                                        <button className="delivery_btn" onClick={handleUpdateDelivery}>Update
                                            Delivery
                                        </button>
                                        <br/>
                                    </div>
                                )}
                                {deliveryDetails && (
                                    <div>
                                        <h2>Delivery Details</h2>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td><strong>Route</strong></td>
                                                <td>{routeName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Driver Name</strong></td>
                                                <td>{driverName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Delivery Status</strong></td>
                                                <td>{deliveryDetails.status}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Create At</strong></td>
                                                <td>{formatDate(deliveryDetails.add_date)}</td>
                                            </tr>
                                            {deliveryDetails.complete_date && (
                                                <tr>
                                                    <td><strong>Complete At</strong></td>
                                                    <td>{formatDate(deliveryDetails.complete_date)}</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                        <br/>
                                        <br/>
                                    </div>

                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;
