import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/nevbar/Navbar";
import './AddUser.css';

function AddDriver() {
    const [formData, setFormData] = useState({
        name: '',
        bike_no: '',
        phone_no: '',
        password: '',
        gender: 'Male',
        vehicle_type: 'Delivery Vehicle'
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://93.127.198.108:5000/driver/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add driver");
                }
                return response.json();
            })
            .then((data) => {
                // Redirect to the drivers list page
                navigate("/drivers");
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <div className="main-cont1">
                    <h2>Add Driver</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBikeNo">
                            <Form.Label>Bike Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter bike number"
                                name="bike_no"
                                value={formData.bike_no}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNo">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter phone number"
                                name="phone_no"
                                value={formData.phone_no}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formGender">
                            <Form.Label>Gender</Form.Label>
                            <div>
                                <Form.Check
                                    type="radio"
                                    label="Male"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    inline
                                />
                                <Form.Check
                                    type="radio"
                                    label="Female"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    inline
                                />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="formVehicleType">
                            <Form.Label>Vehicle Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                            >
                                <option value="Delivery Vehicle">Delivery Vehicle</option>
                                <option value="Bike">Bike</option>
                            </Form.Control>
                        </Form.Group>
                        <br/>
                        <Button variant="primary" type="submit">
                            Add Driver
                        </Button>
                        {error && <p style={{color: 'red'}}>{error}</p>}
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default AddDriver;
