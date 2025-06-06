
import { Link } from "react-router-dom";
import img1 from "../image/img1.svg";
import img2 from "../image/img2.svg";

export default function NewProductPage() {
  const cardData = [
    {
      id: 1,
      image: img1,
      title: "Innovation Hub",
      description:
        "Join our dynamic environment that encourages creative thinking and innovation in furniture design.",
    },
    {
      id: 2,
      image: img2,
      title: "Team Collaboration",
      description:
        "Our dedicated professionals work together to create quality swings that exceed expectations.",
    },
    {
      id: 3,
      image: img1,
      title: "Brainstorming Session",
      description:
        "Where creativity meets functionality to develop unique furniture solutions for your space.",
    },
    {
      id: 4,
      image: img2,
      title: "Luxury Swings",
      description:
        "Experience the perfect blend of comfort and elegance with our premium swing collection.",
    },
    {
      id: 5,
      image: img1,
      title: "Luxury Swings",
      description:
        "Experience the perfect blend of comfort and elegance with our premium swing collection.",
    },
    {
      id: 6,
      image: img2,
      title: "Luxury Swings",
      description:
        "Experience the perfect blend of comfort and elegance with our premium swing collection.",
    },
    {
      id: 7,
      image: img1,
      title: "Innovation Hub",
      description:
        "Join our dynamic environment that encourages creative thinking and innovation in furniture design.",
    },
    {
      id: 8,
      image: img2,
      title: "Team Collaboration",
      description:
        "Our dedicated professionals work together to create quality swings that exceed expectations.",
    },
    {
      id: 9,
      image: img1,
      title: "Brainstorming Session",
      description:
        "Where creativity meets functionality to develop unique furniture solutions for your space.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-white px-4 py-8 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-3xl font-serif mb-2">New Product</h1>

          <div className="flex justify-center text-sm mb-12">
            <Link to="/" className="text-gray-600 hover:underline">
              Home
            </Link>
            <span className="mx-1 text-gray-600">/</span>
            <span className="text-gray-800">New Product</span>
          </div>

          <div className="bg-white max-w-7xl mx-auto md:px-12 ">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {cardData.map((card) => (
                <div
                  key={card.id}
                  className="relative rounded-4xl overflow-hidden shadow-lg group h-80"
                >
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6 bg-gradient-to-b from-transparent to-black opacity-80">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
                      <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                      <p className="text-sm">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
