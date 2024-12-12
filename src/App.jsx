import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Initial seat structure: 7 seats per row for rows 1-10, 3 seats per row for rows 11-12
const initialSeats = Array.from({ length: 12 }, (_, row) =>
  Array(row >= 11 ? 3 : 7).fill(0)
);

function SeatMap({ seats }) {
  return (
    <div className="grid grid-cols-7 gap-2 max-w-3xl mx-auto mt-4">
      {seats.flat().map((seat, index) => (
        <div
          key={index}
          className={`w-10 h-10 rounded-md flex items-center justify-center text-white font-semibold transition-transform transform hover:scale-110 shadow-lg ${
            seat === 1
              ? "bg-red-600 shadow-red-500/50"
              : seat === 2
              ? "bg-blue-600 shadow-blue-500/50"
              : "bg-green-600 shadow-green-500/50"
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [seats, setSeats] = useState(initialSeats);
  const [numSeats, setNumSeats] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);

  // Function to book seats based on user input
  const bookSeats = () => {
    if (numSeats < 1 || numSeats > 7) {
      // Error if seat booking request is out of range
      toast.error("You can only book between 1 to 7 seats!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const updatedSeats = seats.map((row) => [...row]);
    let seatsToBook = numSeats;
    const newBookedSeats = [];

    // Try to book contiguous seats first
    for (let row = 0; row < updatedSeats.length; row++) {
      const availableSeats = updatedSeats[row]
        .map((seat, index) => (seat === 0 ? index : null))
        .filter((index) => index !== null);

      if (availableSeats.length >= seatsToBook) {
        for (let i = 0; i < seatsToBook; i++) {
          updatedSeats[row][availableSeats[i]] = 1;
          newBookedSeats.push(row * (row > 11 ? 3 : 7) + availableSeats[i] + 1);
        }
        setSeats(updatedSeats);
        setBookedSeats((prev) => [...prev, ...newBookedSeats]);

        toast.success(`Seats ${newBookedSeats.join(", ")} successfully booked!`, {
          position: "top-center",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }
    }

    // Fallback: Book non-contiguous seats if contiguous seats are unavailable
    for (let row = 0; row < updatedSeats.length; row++) {
      for (let col = 0; col < updatedSeats[row].length; col++) {
        if (updatedSeats[row][col] === 0 && seatsToBook > 0) {
          updatedSeats[row][col] = 1;
          newBookedSeats.push(row * (row >= 11 ? 3 : 7) + col + 1);
          seatsToBook--;
        }
      }
    }

    // If not enough seats are available
    if (seatsToBook > 0) {
      toast.error("Not enough seats available to fulfill your request.", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    } else {
      setSeats(updatedSeats);
      setBookedSeats((prev) => [...prev, ...newBookedSeats]);
      toast.success(`Seats ${newBookedSeats.join(", ")} successfully booked!`, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  // Function to reset all seats to vacant state
  const resetSeats = () => {
    setSeats(initialSeats.map((row) => row.map(() => 0)));
    setBookedSeats([]);
    toast.info("All seats have been reset.", {
      position: "top-center",
      autoClose: 2000,
      theme: "dark",
    });
  };

  return (
    <div className="App p-6 bg-gray-800 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">
        Train Seat Reservation System
      </h1>

      {/* Seat availability legend */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-green-600 shadow-green-500/50"></div>
          <span className="text-gray-300">Vacant Seats</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-red-600 shadow-red-500/50"></div>
          <span className="text-gray-300">Booked Seats</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 shadow-blue-500/50"></div>
          <span className="text-gray-300">Reserved Seats</span>
        </div>
      </div>

      {/* Display seat map */}
      <SeatMap seats={seats} />

      {/* Display booked seats */}
      <div className="text-center mt-4">
        <div className="font-medium text-gray-300">
          Booked Seats: {bookedSeats.join(", ") || "None"}
        </div>
      </div>

      {/* Booking controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <label className="flex items-center space-x-2">
          <span className="font-medium text-gray-300">Number of Seats:</span>
          <input
            type="number"
            value={numSeats}
            min="1"
            max="7"
            onChange={(e) => setNumSeats(Number(e.target.value))}
            className="border rounded p-2 w-20 text-center bg-gray-700 text-gray-100 border-gray-600"
          />
        </label>
        <button
          onClick={bookSeats}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 hover:shadow-blue-500/50 transform hover:scale-105 transition"
        >
          Reserve Seats
        </button>
        <button
          onClick={resetSeats}
          className="bg-yellow-600 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-700 hover:shadow-yellow-500/50 transform hover:scale-105 transition"
        >
          Reset Seats
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
