import { useState } from "react";
import C1 from "../image/C1.svg";
import { Link } from "react-router-dom";
import Surat from "../image/Surat.jpeg"
import Pune from "../image/Pune.jpeg"
import Bhayli from "../image/Bhayli.jpg"
import Nizampura from "../image/Nizampura.jpeg"
import Mumbai from "../image/Mumbai.jpeg"
const locations = [
  {
    id: "surat",
    name: "Surat",
    shops: [
      {
        id: "surat-1",
        name1:'Surat',
        address:
          "Plot 77A Ambika Industrial Estate, Magdalla Main Road, near Navjivan Circle, Udhana, Surat, Gujarat 395017",
        email: "info.zulasmore@gmail.com",
        phone: "9824441703",
        image: Surat,
      },
    ],
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    shops: [
      {
        id: "ahmedabad-1",
        name1:'Ahmedabad',
        address:
          "NRI TOWER, A-001 GF, Judges Bunglow Rd, nr. Pakwan Chokdi, opp. Pride Plaza Hotel, Bodakdev, Ahmedabad, Gujarat 380015",
        email: "ahmedabad@example.com",
        phone: "8866667494",
        image: C1,
      },
    ],
  },
  {
    id: "pune",
    name: "Pune",
    shops: [
      {
        id: "pune-1",
        name1:'Pune',
        address: "Shop No- 5&6, Laxman plaza, Aundh-Wakad Rd, mankar chowk, Kaspate Wasti, Wakad, Pune, Maharashtra 411057",
        email: "pune@example.com",
        phone: "1234567890",
        image: Pune,
      },
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai",
    shops: [
      {
        id: "mumbai-1",
        name1:'Mumbai',
        address: "Gala 32, Laxmi Industrial Estate, no R&H, New Link Rd, Laxmi Industrial Estate, Suresh Nagar, Andheri West, Mumbai, Maharashtra 400053",
        email: "mumbai@example.com",
        phone: "0987654321",
        image: Mumbai,
      },
    ],
  },
  {
    id: "vadodara",
    name: "Vadodara",
    shops: [
      {
        id: "vadodara-1",
        name1:'Nizampura, Vadodara',
        address: "102, Ashapura Square, Nr. Ghelani Petroleum, opp. Octant Pizza, Nizampura Rd, above Poojara Telecom, Vadodara, Gujarat 390024",
        email: "vadodara1@example.com",
        phone: "1111111111",
        image: Nizampura,
      },
      {
        id: "vadodara-2",
        name1:'Bhayli, Vadodara',
        address: "Raajpath Complex, 134, Vasna - Bhayli Main Rd, above TG Gathiya, Bhayli, Vadodara, Gujarat 391410",
        email: "vadodara2@example.com",
        phone: "2222222222",
        image: Bhayli,
      },
    ],
  },
];

export default function Contact() {
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <>
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
          {locations.map((location) => (
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

        {/* Render shops */}
        <div className="max-w-7xl mx-auto mb-10 space-y-10">
          {selectedLocation.shops.map((shop) => (
            <div
              key={shop.id}
              className="grid md:grid-cols-2 gap-6 items-center bg-white p-6 rounded-lg shadow-md"
            >
              <div>
                <img
                  src={shop.image || "/placeholder.svg"}
                  alt="Location Image"
                  className="w-full max-w-[500px] h-[300px] rounded-lg object-cover mx-auto"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-semibold">{shop.name1}</h3>
                <p className="mt-2 text-gray-700">{shop.address}</p>
                <p className="mt-2 text-gray-700">{shop.email}</p>
                <p className="mt-2 text-gray-700">{shop.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
