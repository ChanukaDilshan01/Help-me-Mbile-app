import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from "react-bootstrap";
import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/nevbar/Navbar";
import './Subscriptions.css';

function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
    const [newSubscription, setNewSubscription] = useState({
        user_id: "",
        start_date: "",
        package_id: "",
        status: "pending",
        end_date: "",
        dependent_id: null
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = () => {
        fetch("http://93.127.198.108:5000/subs/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch subscription data");
                }
                return response.json();
            })
            .then((data) => {
                // Sort subscriptions: pending at the top, then by descending subscription ID
                const sortedSubscriptions = data.subscriptions.sort((a, b) => {
                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                    return b.sub_id - a.sub_id;
                });
                setSubscriptions(sortedSubscriptions);
            })
            .catch((error) => {
                console.error("Error fetching subscriptions:", error);
            });
    };

    const handleAddSubscription = () => {
        fetch("http://93.127.198.108:5000/subs/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newSubscription)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add subscription");
                }
                return response.json();
            })
            .then((data) => {
                fetchSubscriptions();

                setNewSubscription({
                    user_id: "",
                    start_date: "",
                    package_id: "",
                    status: "pending",
                    end_date: "",
                    dependent_id: null
                });
                setShowSubscriptionModal(false);
            })
            .catch((error) => {
                console.error("Error adding subscription:", error);
            });
    };

    const handleActivateSubscription = (subscriptionId) => {
        fetch("http://93.127.198.108:5000/subs/status-update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ subscriptionId, status: "active" })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update status for subscription ID ${subscriptionId}`);
                }
                return response.json();
            })
            .then((data) => {
                fetchSubscriptions();
            })
            .catch((error) => {
                console.error("Error updating subscription status:", error);
            });
    };

    const handleSubscriptionChange = (e) => {
        const { name, value } = e.target;
        setNewSubscription((prevSubscription) => ({
            ...prevSubscription,
            [name]: value
        }));
    };

    const renderStatus = (status, subscriptionId, withButton = false) => {
        if (status === 'pending' && withButton) {
            return (
                <Button variant="primary" onClick={() => handleActivateSubscription(subscriptionId)}>
                    Activate
                </Button>
            );
        } else {
            const statusColor = status === 'active' ? 'green' : 'red';
            return (
                <span style={{ color: statusColor }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            );
        }
    };


    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <div className="main-cont1">
                    <br />
                    <Button onClick={() => setShowSubscriptionModal(true)}>Add Subscription</Button>
                    <br />
                    <div className="table-container">
                        <Table bordered>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>User ID</th>
                                <th>Start Date</th>
                                <th>Package ID</th>
                                <th>End Date</th>
                                <th>Dependent ID</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {subscriptions.map((sub) => (
                                <tr key={sub.sub_id}>
                                    <td>{sub.sub_id}</td>
                                    <td>{sub.user_id}</td>
                                    <td>{sub.start_date}</td>
                                    <td>{sub.package_id}</td>
                                    <td>{sub.end_date}</td>
                                    <td>{sub.dependent_id || 'N/A'}</td>
                                    <td>
                                        {renderStatus(sub.status, sub.sub_id, true)}
                                    </td>


                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <Modal show={showSubscriptionModal} onHide={() => setShowSubscriptionModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Subscription</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formUserId">
                                    <Form.Label>User ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter user ID"
                                        name="user_id"
                                        value={newSubscription.user_id}
                                        onChange={handleSubscriptionChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        value={newSubscription.start_date}
                                        onChange={handleSubscriptionChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPackageId">
                                    <Form.Label>Package ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter package ID"
                                        name="package_id"
                                        value={newSubscription.package_id}
                                        onChange={handleSubscriptionChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        value={newSubscription.end_date}
                                        onChange={handleSubscriptionChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDependentId">
                                    <Form.Label>Dependent ID</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter dependent ID (optional)"
                                        name="dependent_id"
                                        value={newSubscription.dependent_id || ''}
                                        onChange={handleSubscriptionChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowSubscriptionModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleAddSubscription}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Subscriptions;
