import React, { useState, useEffect } from 'react';
import { PowerSettingsNew, Person, NotificationsNone } from '@mui/icons-material';
import { Button, Dropdown, Menu, Avatar, Modal } from 'antd';
import { Link } from 'react-router-dom';
import "./navbar.scss";

const Navbar = () => {
    const [adminData, setAdminData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const admin = JSON.parse(localStorage.getItem("adminData"));
        if (admin) {
            setAdminData(admin);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            window.location.href = "/";
        }
    }, []);

    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminData");
        setIsLoggedIn(false);
        console.log("Logged out!");
        window.location.href = "/";
    };

    const showModal = () => {
        Modal.confirm({
            title: 'Logout',
            content: 'Are you sure you want to log out?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: handleLogout,
        });
    };

    const menu = (
        <Menu>
            <Menu.Item key="logout">
                <Button type="text" style={{ color: '#f5222d' }} icon={<PowerSettingsNew />} onClick={showModal}>
                    Logout
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className='navbar'>
            <div className="wrapper">
                <div className="items">
                    <div className="item">
                        {currentDate.toLocaleString()}
                    </div>
                </div>
                <div className="items">
                    <div className="item">
                        <Link to="/notifications" style={{ textDecorationLine: "none" }}>
                            <NotificationsNone className="icon" />
                            <div className="counter">1</div>
                        </Link>
                    </div>
                    {isLoggedIn && (
                        <div className="item">
                            <Avatar src={adminData && adminData.profile_pic} icon={<Person style={{ color: '#1890ff', fontSize: 24 }} />} className="avatar" style={{ marginRight: '5px' }} />
                            {adminData && adminData.name} {/* Display admin name */}
                        </div>
                    )}
                    <div className="item">
                        <Dropdown overlay={menu} placement="bottomLeft">
                            <Button type="text" style={{ color: '#1890ff' }} icon={<PowerSettingsNew />} />
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
