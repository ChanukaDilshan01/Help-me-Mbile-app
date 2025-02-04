import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/nevbar/Navbar";
import './DeliveryRoutes.css';

function DeliveryRoutes() {
    const [routes, setRoutes] = useState([]);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [newRoute, setNewRoute] = useState({
        start_loc_name: "",
        destination_loc_name: ""
    });
    const [editRouteId, setEditRouteId] = useState(null);
    const [editRoute, setEditRoute] = useState({
        start_loc_name: "",
        destination_loc_name: ""
    });
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = () => {
        fetch("http://93.127.198.108:5000/driver/routes/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch route data");
                }
                return response.json();
            })
            .then((data) => {
                setRoutes(data.routes);
            })
            .catch((error) => {
                console.error("Error fetching routes:", error);
            });
    };

    const handleAddRoute = () => {
        fetch("http://93.127.198.108:5000/delivery/add-route", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newRoute)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add route");
                }
                return response.json();
            })
            .then((data) => {
                // Fetch updated routes after adding a new route
                fetchRoutes();

                // Reset newRoute state and close modal
                setNewRoute({
                    start_loc_name: "",
                    destination_loc_name: ""
                });
                setShowRouteModal(false);
            })
            .catch((error) => {
                console.error("Error adding route:", error);
            });
    };


    const handleEditRoute = (routeId) => {
        const routeToEdit = routes.find((route) => route.route_id === routeId);
        setEditRouteId(routeId);
        setEditRoute(routeToEdit);
        setShowEditModal(true);
    };

    const saveEditedRoute = () => {
        const updatedRouteData = {
            start_loc_name: editRoute.start_loc_name,
            destination_loc_name: editRoute.destination_loc_name
        };

        fetch(`http://93.127.198.108:5000/driver/routes/edit/${editRouteId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRouteData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to edit route with ID ${editRouteId}`);
                }
                return response.json();
            })
            .then((data) => {
                const updatedRoutes = routes.map((route) =>
                    route.route_id === editRouteId ? data.route : route
                );
                setRoutes(updatedRoutes);
                setShowEditModal(false);
            })
            .catch((error) => {
                console.error("Error editing route:", error);
            });
    };

    const handleRouteChange = (e) => {
        const { name, value } = e.target;
        setNewRoute((prevRoute) => ({
            ...prevRoute,
            [name]: value
        }));
    };

    const handleEditRouteChange = (e) => {
        const { name, value } = e.target;
        setEditRoute((prevRoute) => ({
            ...prevRoute,
            [name]: value
        }));
    };

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <div className="main-cont1">
                    <br />
                    <Button onClick={() => setShowRouteModal(true)}>Add Route</Button>
                    <br />
                    <div className="table-container">
                        <Table bordered>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Start Location</th>
                                <th>Destination Location</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {routes.map((route) => (
                                <tr key={route.route_id}>
                                    <td>{route.route_id}</td>
                                    <td>{route.start_loc_name}</td>
                                    <td>{route.destination_loc_name}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleEditRoute(route.route_id)}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <Modal show={showRouteModal} onHide={() => setShowRouteModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Route</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formStartLoc">
                                    <Form.Label>Start Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter start location"
                                        name="start_loc_name"
                                        value={newRoute.start_loc_name}
                                        onChange={handleRouteChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDestLoc">
                                    <Form.Label>Destination Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter destination location"
                                        name="destination_loc_name"
                                        value={newRoute.destination_loc_name}
                                        onChange={handleRouteChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowRouteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleAddRoute}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Route</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formEditStartLoc">
                                    <Form.Label>Start Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter start location"
                                        name="start_loc_name"
                                        value={editRoute.start_loc_name}
                                        onChange={handleEditRouteChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEditDestLoc">
                                    <Form.Label>Destination Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter destination location"
                                        name="destination_loc_name"
                                        value={editRoute.destination_loc_name}
                                        onChange={handleEditRouteChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={saveEditedRoute}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );

}

export default DeliveryRoutes;
