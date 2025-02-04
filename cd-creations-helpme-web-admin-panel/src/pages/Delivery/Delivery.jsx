import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/nevbar/Navbar";
import './delivery.css';

function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDriver, setEditDriver] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch("http://93.127.198.108:5000/driver/all")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch driver data");
                }
                return response.json();
            })
            .then((data) => {
                const sortedDrivers = data.drivers.sort((a, b) => b.driver_id - a.driver_id);
                setDrivers(sortedDrivers);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    const handleEdit = (driver) => {
        setEditDriver({ ...driver, newData: { ...driver } });
        setShowModal(true);
    };

    const handleSave = () => {
        const updatedDriverData = {
            driverId: editDriver.driver_id,
            newData: {
                ...editDriver.newData
            }
        };

        fetch(`http://93.127.198.108:5000/driver/edit/`, {  // Note the corrected URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedDriverData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to update driver with ID ${editDriver.driver_id}`);
                }
                setEditDriver(null);
                setShowModal(false);
                return response.json();
            })
            .then((data) => {
                const updatedDrivers = drivers.map((driver) =>
                    driver.driver_id === editDriver.driver_id ? data.driver : driver
                );
                setDrivers(updatedDrivers);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditDriver((prevEditDriver) => ({
            ...prevEditDriver,
            newData: {
                ...(prevEditDriver && prevEditDriver.newData ? prevEditDriver.newData : {}),
                [name]: value
            }
        }));
    };

    const handleDelete = (id) => {
        alert("You do not have permission to delete this user.");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <div className="main-cont1">
                    <br />
                    <Link to="/addDriver">
                        <Button>Add Driver</Button>
                    </Link>
                    <br />
                    <div className="table-container">
                        <Table bordered>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Bike No</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {drivers.map((driver) => (
                                <tr key={driver.driver_id}>
                                    <td>{driver.driver_id}</td>
                                    <td style={{ textAlign: "start" }}>{driver.name}</td>
                                    <td style={{ textAlign: "start" }}>{driver.phone_no}</td>
                                    <td style={{ textAlign: "start" }}>{driver.bike_no}</td>
                                    <td style={{ textAlign: "center" }}>
                                            <span
                                                role="img"
                                                aria-label="edit"
                                                style={{ cursor: "pointer", marginRight: "10px" }}
                                                onClick={() => handleEdit(driver)}
                                            >
                                                ✏️
                                            </span>
                                        <span
                                            role="img"
                                            aria-label="delete"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDelete(driver.driver_id)}
                                        >
                                                🗑️
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Driver</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name="name"
                                        value={editDriver?.newData?.name || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formBikeNo">
                                    <Form.Label>Bike Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter bike number"
                                        name="bike_no"
                                        value={editDriver?.newData?.bike_no || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formPhoneNo">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter phone number"
                                        name="phone_no"
                                        value={editDriver?.newData?.phone_no || ''}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formGender">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="gender"
                                        value={editDriver?.newData?.gender || 'Male'}
                                        onChange={handleChange}
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formVehicleType">
                                    <Form.Label>Vehicle Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="vehicle_type"
                                        value={editDriver?.newData?.vehicle_type || 'Delivery Vehicle'}
                                        onChange={handleChange}
                                    >
                                        <option value="Delivery Vehicle">Delivery Vehicle</option>
                                        <option value="Bike">Bike</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleSave}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Drivers;
