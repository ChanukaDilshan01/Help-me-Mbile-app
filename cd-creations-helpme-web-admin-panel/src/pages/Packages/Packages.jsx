import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Modal } from "react-bootstrap";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/nevbar/Navbar";
import './Packages.css';

function Packages() {
    const [packages, setPackages] = useState([]);
    const [showPackageModal, setShowPackageModal] = useState(false);
    const [newPackage, setNewPackage] = useState({
        user_type: "regular",
        name: "",
        amount: "",
        duration: "",
        status: 1
    });
    const [editPackageId, setEditPackageId] = useState(null);
    const [editPackage, setEditPackage] = useState({
        user_type: "regular",
        name: "",
        amount: "",
        duration: "",
        status: 1
    });
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = () => {
        fetch("http://93.127.198.108:5000/subs/packages")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch package data");
                }
                return response.json();
            })
            .then((data) => {
                setPackages(data.packages);
            })
            .catch((error) => {
                console.error("Error fetching packages:", error);
            });
    };

    const handleAddPackage = () => {
        const packageData = { ...newPackage, duration_unit: "days" };

        fetch("http://93.127.198.108:5000/subs/package-add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(packageData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to add package");
                }
                return response.json();
            })
            .then((data) => {
                fetchPackages();

                setNewPackage({
                    user_type: "regular",
                    name: "",
                    amount: "",
                    duration: "",
                    status: 1
                });
                setShowPackageModal(false);
            })
            .catch((error) => {
                console.error("Error adding package:", error);
            });
    };

    const handleEditPackage = (packageId) => {
        const packageToEdit = packages.find((pkg) => pkg.package_id === packageId);
        setEditPackageId(packageId);
        setEditPackage(packageToEdit);
        setShowEditModal(true);
    };

    const saveEditedPackage = () => {
        const updatedPackageData = { ...editPackage, duration_unit: "days" };

        fetch(`http://93.127.198.108:5000/subs/package/edit/${editPackageId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPackageData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to edit package with ID ${editPackageId}`);
                }
                return response.json();
            })
            .then((data) => {
                const updatedPackages = packages.map((pkg) =>
                    pkg.package_id === editPackageId ? data.package : pkg
                );
                setPackages(updatedPackages);
                setShowEditModal(false);
            })
            .catch((error) => {
                console.error("Error editing package:", error);
            });
    };

    const handlePackageChange = (e) => {
        const { name, value } = e.target;
        setNewPackage((prevPackage) => ({
            ...prevPackage,
            [name]: value
        }));
    };

    const handleEditPackageChange = (e) => {
        const { name, value } = e.target;
        setEditPackage((prevPackage) => ({
            ...prevPackage,
            [name]: value
        }));
    };

    const renderStatus = (status) => {
        return (
            <span style={{ color: status === 1 ? 'green' : 'red' }}>
                {status === 1 ? 'Active' : 'Inactive'}
            </span>
        );
    };

    return (
        <div className="list">
            <Sidebar />
            <div className="listContainer">
                <Navbar />
                <div className="main-cont1">
                    <br />
                    <Button onClick={() => setShowPackageModal(true)}>Add Package</Button>
                    <br />
                    <div className="table-container">
                        <Table bordered>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Type</th>
                                <th>Name</th>
                                <th>Amount</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {packages.map((pkg) => (
                                <tr key={pkg.package_id}>
                                    <td>{pkg.package_id}</td>
                                    <td>{pkg.user_type}</td>
                                    <td>{pkg.name}</td>
                                    <td>Rs {pkg.amount}</td>
                                    <td>{pkg.duration} days</td>
                                    <td>{renderStatus(pkg.status)}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleEditPackage(pkg.package_id)}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <Modal show={showPackageModal} onHide={() => setShowPackageModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Package</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formUserType">
                                    <Form.Label>User Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="user_type"
                                        value={newPackage.user_type}
                                        onChange={handlePackageChange}
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="premium">Premium</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name="name"
                                        value={newPackage.name}
                                        onChange={handlePackageChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formAmount">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter amount"
                                        name="amount"
                                        value={newPackage.amount}
                                        onChange={handlePackageChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDuration">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter duration"
                                        name="duration"
                                        value={newPackage.duration}
                                        onChange={handlePackageChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPackageModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleAddPackage}>
                                Add
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Package</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formEditUserType">
                                    <Form.Label>User Type</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="user_type"
                                        value={editPackage.user_type}
                                        onChange={handleEditPackageChange}
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="premium">Premium</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formEditName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter name"
                                        name="name"
                                        value={editPackage.name}
                                        onChange={handleEditPackageChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEditAmount">
                                    <Form.Label>Amount</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter amount"
                                        name="amount"
                                        value={editPackage.amount}
                                        onChange={handleEditPackageChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEditDuration">
                                    <Form.Label>Duration</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter duration"
                                        name="duration"
                                        value={editPackage.duration}
                                        onChange={handleEditPackageChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={saveEditedPackage}>
                                Save
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Packages;
