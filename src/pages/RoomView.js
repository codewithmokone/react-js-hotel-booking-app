import React, { useState, useContext } from 'react';
// import Carousel from 'react-bootstrap/Carousel';
// import CarouselImage from './CarouselImage';
import { CartContext } from '../../src/components/context/CartContext';
import { faBed, faUserGroup, faPhone, faHouse, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Box, Divider, Modal, TextField } from '@mui/material';
// import InputComponent from './InputComponent';
import { useUserAuth } from '../components/context/UserAuthContext';
import InputComponent from '../components/InputComponent';

function RoomView() {

    // const location = useLocation();
    // const room = location.state.room;

    const { dispatch } = useContext(CartContext);
    const { user } = useUserAuth();
    const navigate = useNavigate()
    const { selectedRoom } = useParams()

    console.log("Selected Room.", selectedRoom);

    const [room, setRoom] = useState(selectedRoom);
    const [checkBookings, setCheckBookings] = useState('')
    const [checkInDate, setCheckInDate] = useState(null);
    const [checkOutDate, setCheckOutDate] = useState(null);
    const [isAvailable, setIsAvailable] = useState(true);

    // Handles closing the view room modal
    const closeModal = () => {
        // setOpenModal(false)
    }

    // Function to check room availability
    const checkAvailability = async () => {

        try {
            const docRef = query(collection(db, "bookings"), where("roomId", "==", room.id));
            const querySnapshot = await getDocs(docRef);

            if (querySnapshot.size === 1) {
                querySnapshot.forEach((doc) => {
                    const roomDate = doc.data()
                    setCheckBookings(roomDate);
                });
            } else {
                console.error('Room not found or multiple rooms found with the same roomId.');
            }

            if (checkBookings) {
                const start = checkBookings.checkInDate;
                const end = checkBookings.checkOutDate;
                const checkIn = checkInDate;
                const checkOut = checkOutDate;
                // console.log("Booking start date: ", start)
                // console.log("Booking end date: ", end)
                // console.log("Checking: ", checkIn)
                // console.log("Checking: ", checkOut)
                // Check if the selected check-in and check-out dates are within the room's availability range
                const isRoomAvailable = checkIn <= start && checkOut > end;

                setIsAvailable(isRoomAvailable);

                if (isRoomAvailable) {
                    alert('Room is available for the selected dates!');
                } else {
                    alert('Room is not available for the selected dates.');
                }
            }
        } catch (error) {
            console.error('Error checking room availability:', error);
        }
    };

    // Handles the reservation function
    const handleReservation = () => {
        if (user) {
            dispatch({ type: 'ADD_TO_CART', id: room.id, room })
            alert("Room added to bookings page")
            navigate('/clienthome')
        } else {
            alert('Please login or register to continue.')
            navigate('login')
        }
    }

    return (
        <Box className="room-view-container m-auto fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center " >
            {
                selectedRoom ? (

                    <Box
                        sx={{
                            width: { xs: 400, sm: 786, md: 900 },
                            height: { xs: 700, sm: 600, md: 630 }
                        }}
                        className="bg-white rounded flex flex-col justify-center items-center ">
                        <div className='roomHearding flex flex-col '>
                            <Box
                                sx={{
                                    width: { xs: 400, sm: 700, md: 900 }
                                }}
                                className='w-[960px] flex flex-row justify-between items-center '
                            >
                                <p className='mt-2 ml-8 mb-[5px] font-extrabold text-lg'>{room.title}</p>
                                <button className='bg-[#0088a9] text-white w-[35px] h-[30px] rounded mt-2 mr-7' onClick={closeModal}>X</button>
                            </Box>
                            <Box
                                sx={{
                                    width: { xs: 350 },
                                    fontSize: { xs: 11 }
                                }}
                            >
                                <p className='ml-8 mb-[-35px]'> <FontAwesomeIcon icon={faLocationDot} className=" text-[#0088a9] text-lg font-bold" /> {room.address}</p>
                            </Box>
                        </div>
                        <Box
                            sx={{
                                width: { xs: 300, sm: 500, md: 600 },
                                height: { xs: 250, sm: 200, md: 250 },
                                marginTop: { xs: 2, sm: 8, md: 8 }
                            }}
                            className="carousel flex flex-row justify-center items-center"
                        >
                            {/* <Carousel
                                slide={false}
                                data-bs-theme="dark"
                                sx={{
                                width: { xs: 400, sm: 786, md: 1024 },
                                height: { sm: 300, md:500 }
                                }}
                                className="h-[300px] flex flex-row justify-center items-center">
                                <Carousel.Item>
                                <CarouselImage text="First slide" images={room.roomImage} />
                                <Carousel.Caption>
                                </Carousel.Caption>
                                </Carousel.Item>
                            </Carousel> */}
                            <img width={'100%'} height={'100%'} src={room.roomImage} />
                        </Box>
                        <Box
                            sx={{
                                width: { xs: 380, sm: 750, md: 600 },
                                fontSize: { xs: 10, sm: 14, md: 16 },
                                marginTop: { xs: -3, sm: 6, md: 4 }
                            }}
                            className="room-details flex border-b-2"
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: { xs: 'row', sm: 'row', md: 'row' }
                                }}
                                className='flex flex-row justify-center items-center m-auto'>
                                <p className='ml-8 mt-6'><FontAwesomeIcon icon={faHouse} className=" text-[#0088a9] text-lg font-bold" /> : {room.roomType}</p>
                                <p className='ml-8 mt-6'><FontAwesomeIcon icon={faBed} className=" text-[#0088a9] text-lg font-bold" /> : {room.bedType}</p>
                                <p className='ml-8 mt-6'><FontAwesomeIcon icon={faUserGroup} className=" text-[#0088a9] text-lg font-bold" /> : {room.numberOfPeople}</p>
                                <p className='ml-8 mt-6'><FontAwesomeIcon icon={faPhone} className=" text-[#0088a9] text-lg font-bold" /> : {room.contact}</p>
                                <p className='ml-8 mt-6 font-bold '>R{room.price}</p>
                            </Box>
                            <Divider variant="middle" />
                        </Box>
                        <Box
                            sx={{
                                fontSize: { xs: 13, sm: 14, md: 16 },
                                width: { xs: 350, sm: 750 },
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                            className='border-b-2 w-[900px] min-h-min flex justify-center items-center'>
                            <p className='mt-3 ml-8 mb-3'>{room.description}</p>
                        </Box>
                        <Box
                            sx={{
                                width: { xs: 350, md: 500 },
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} className=' m-auto mt-[20px] '
                        >
                            <Box
                                sx={{
                                    width: { xs: 300, sm: 400, md: 600 },
                                    display: 'flex',
                                    flexDirection: { xs: 'row' },
                                    justifyContent: { xs: 'center' },
                                    alignItems: 'center',
                                    margin: 'auto'
                                }}
                            >
                                {/* <input
                                type="date"
                                size='normal'
                                className='rounded outline focus:ring focus:ring-[#0088a9] w-[200px] mr-6'
                                placeholder=" Check in date..."
                                onChange={(e) => setCheckInDate(e.target.value)}
                                required
                                /> */}
                                <InputComponent
                                    type="date"
                                    className='rounded outline focus:ring focus:ring-[#0088a9] w-[200px]'
                                    placeholder=" Check out date..."
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    required
                                />
                                <InputComponent
                                    type="date"
                                    className='rounded outline focus:ring focus:ring-[#0088a9] w-[200px]'
                                    placeholder=" Check out date..."
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                    required
                                />
                            </Box>

                            {/* <input
                            type="date"
                            className='rounded outline focus:ring focus:ring-[#0088a9] w-[200px]'
                            placeholder=" Check out date..."
                            onChange={(e) => setCheckOutDate(e.target.value)}
                            required
                        /> */}
                            <Box
                                sx={{
                                    width: { xs: 400, sm: 500, md: 600 },
                                    display: 'flex',
                                    flexDirection: { xs: 'row', sm: 'row', md: 'row' },

                                    marginTop: { xs: 4 }
                                }}
                            >
                                <button className='bg-[#0088a9] text-white w-[140px] h-[30px] rounded ml-6' onClick={checkAvailability}>Check Availability</button>
                                <button className='bg-[#0088a9] text-white w-[140px] h-[30px] rounded ml-6' onClick={handleReservation}>Reserve Room</button>
                            </Box>
                            {/* <button className='bg-[#0088a9] text-white w-[140px] h-[30px] rounded ml-6' onClick={checkAvailability}>Check Availability</button>
                            <button className='bg-[#0088a9] text-white w-[140px] h-[30px] rounded ml-6' onClick={handleReservation}>Reserve Room</button> */}
                        </Box>
                    </Box>

                )
                    :
                    (
                        <div>
                            <p>Room data is not available</p>
                            {/* You can add further UI elements or messages as needed */}
                        </div>
                    )
            }
        </Box>
    )
}

export default RoomView
