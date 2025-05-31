"use client"

import { useState } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import C1 from "../image/C1.svg"
import { Link } from "react-router-dom"

const locations = [
  {
    id: "surat",
    name: "Surat",
    address:
      "102, Ashapura Square Nizampura Plot 77A Ambika Industrial Estate Opp Vanmora Near Navjivan Circle Udhna-Magdalla, Main Road, Surat, Gujarat",
    email: "info.zulasmore@gmail.com",
    phone: "9824441703",
    image: C1
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    address: "Some Ahmedabad Address Here",
    email: "ahmedabad@example.com",
    phone: "1234567890",
    image: C1
  },
  {
    id: "mumbai",
    name: "Mumbai",
    address: "Some Mumbai Address Here",
    email: "mumbai@example.com",
    phone: "0987654321",
    image: C1
  }
]

export default function Contact() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])

  return (
    <>
      <Navbar />
      <div className="bg-white p-6 md:p-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-semibold">Contact Us</h2>
          <p className="text-sm text-gray-600">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            /Contact Us
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 my-6">
          {locations.map(location => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location)}
              className={`px-4 py-2 border rounded-md transition ${
                selectedLocation.id === location.id
                  ? "bg-lime-950 text-white"
                  : "bg-white text-black"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        {/* First section - always shows image first, then details */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="order-1 md:order-1">
              <img
                src={selectedLocation.image || "/placeholder.svg"}
                alt="Location Image"
                className="w-full max-w-[500px] h-auto rounded-lg mx-auto"
              />
            </div>
            <div className="order-2 md:order-2 bg-white p-6 rounded-lg shadow-md text-center md:text-left">
              <h3 className="text-xl font-semibold">{selectedLocation.name}</h3>
              <p className="mt-2 text-gray-700">{selectedLocation.address}</p>
              <p className="mt-2 text-gray-700">{selectedLocation.email}</p>
              <p className="mt-2 text-gray-700">{selectedLocation.phone}</p>
            </div>
          </div>
        </div>

        {/* Second section - always shows details first, then image */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="order-2 md:order-1 bg-white p-6 rounded-lg shadow-md text-center md:text-left">
              <h3 className="text-xl font-semibold">{selectedLocation.name}</h3>
              <p className="mt-2 text-gray-700">{selectedLocation.address}</p>
              <p className="mt-2 text-gray-700">{selectedLocation.email}</p>
              <p className="mt-2 text-gray-700">{selectedLocation.phone}</p>
            </div>
            <div className="order-1 md:order-2">
              <img
                src={selectedLocation.image || "/placeholder.svg"}
                alt="Location Image"
                className="w-full max-w-[500px] h-auto rounded-lg mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
