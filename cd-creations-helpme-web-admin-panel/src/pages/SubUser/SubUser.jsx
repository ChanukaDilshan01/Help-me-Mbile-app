import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from "../../components/nevbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import "./subuser.scss";

const SubUser = () => {
    const [taxiBookings, setTaxiBookings] = useState([]);

    useEffect(() => {
        // Fetch existing taxi bookings when the component mounts
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://93.127.198.108:5000/taxi/today-booking');
                const sortedBookings = response.data.taxiBookings.sort((a, b) => b.booking_id - a.booking_id);
                setTaxiBookings(sortedBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        };

        fetchBookings();

        // Connect to the Socket.IO server
        const socket = io('http://93.127.198.108:5000');

        // Listen for new taxi bookings
        socket.on('new-taxi-booking', (data) => {
            setTaxiBookings(prevBookings => {
                const updatedBookings = [...prevBookings, data];
                return updatedBookings.sort((a, b) => b.booking_id - a.booking_id);
            });
        });

        // Listen for updated taxi bookings
        socket.on('updated-taxi-booking', (updatedBooking) => {
            setTaxiBookings(prevBookings => {
                const updatedBookings = prevBookings.map(booking =>
                    booking.booking_id === updatedBooking.booking_id ? updatedBooking : booking
                );
                return updatedBookings.sort((a, b) => b.booking_id - a.booking_id);
            });
        });

        // Cleanup the effect on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className='subuse'>
            <Sidebar />
            <div className="subuseContainer">
                <Navbar/>
                <h2 >Taxi Bookings</h2>
                <br/>
                <div className="taxiBookings">
                    {taxiBookings.length === 0 ? (
                        <p>No bookings available</p>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Customer ID</th>
                                <th>Pickup Location</th>
                                <th>Drop Location</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Payment Type</th>
                                <th>Payment Status</th>
                                <th>Driver Gender</th>
                                <th>Created At</th>
                            </tr>
                            </thead>
                            <tbody>
                            {taxiBookings.map((booking) => (
                                <tr key={booking.booking_id}>
                                    <td>{booking.booking_id}</td>
                                    <td>{booking.customer_id}</td>
                                    <td>{booking.pick_location}</td>
                                    <td>{booking.drop_location}</td>
                                    <td>${booking.amount}</td>
                                    <td>{booking.status}</td>
                                    <td>{booking.payment_type}</td>
                                    <td>{booking.payment_status}</td>
                                    <td>{booking.driver_gender}</td>
                                    <td>{new Date(booking.create_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SubUser;
