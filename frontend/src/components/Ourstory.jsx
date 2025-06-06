// import Navbar from "./Navbar"
// import Footer from "./Footer"
// import img1 from "../image/img1.svg"
// import img2 from "../image/img2.svg"
// import { Link } from "react-router-dom"
// // Swiper imports
// import { Swiper, SwiperSlide } from "swiper/react"
// import { Pagination, Autoplay } from "swiper/modules" // Import Autoplay module
// import "swiper/css"
// import "swiper/css/pagination"
// import "swiper/css/autoplay" // Ensure autoplay styles are loaded

// export default function Story() {
//   return (
//     <>
//       <Navbar />
//       <div className="bg-white p-6 md:p-12">
//         {/* Our Story Section */}
//         <div className="text-center mb-10">
//           <h2
//             style={{ fontFamily: "La Mango" }}
//             className="text-3xl md:text-4xl text-lime-950 font-semibold"
//           >
//             Our Story
//           </h2>
//           <p className="text-sm text-lime-950">
//             <Link to="/" className="hover:underline">
//               Home
//             </Link>{" "}
//             / Story
//           </p>
//         </div>

//         {/* Story Content */}
//         <div className="grid md:grid-cols-2 gap-6 items-center max-w-7xl mx-auto">
//           <div className="mb-10">
//             <h2
//               style={{ fontFamily: "La Mango" }}
//               className="text-2xl md:text-3xl font-semibold mb-4 text-lime-950"
//             >
//               Zulas n More brings you top-notch swings which give you better
//               comfort and luxury.
//             </h2>
//             <p className="text-gray-700 leading-relaxed mb-6">
//               Zulas n More is a leading force in the world of furniture
//               manufacturing, driven by a relentless commitment to craftsmanship,
//               innovation, and design excellence. Having cumulative experience of
//               15+ years, we have garnered a reputation for creating exceptional
//               furniture pieces that adorn homes, offices, and spaces of all
//               kinds.
//             </p>
//             {/* Small Images Grid */}
//             <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto ml-6 mt-10">
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Swing Design"
//                 className="rounded-lg w-full"
//               />
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Swing Design"
//                 className="rounded-lg w-full"
//               />
//             </div>
//           </div>
//           <img
//             src={img1 || "/placeholder.svg"}
//             alt="Swing"
//             className="rounded-lg w-full"
//           />
//         </div>

//         {/* Swiper Slider with AutoScroll */}
//         <div className="max-w-7xl mx-auto my-10 px-4">
//           <h2
//             style={{ fontFamily: "La Mango" }}
//             className="text-3xl md:text-3xl mt-10 text-lime-950 font-semibold mb-4"
//           >
//             Our Expertise
//           </h2>
//           <Swiper
//             spaceBetween={20}
//             pagination={{ clickable: true }}
//             // Autoscroll enabled
//             autoplay={{ delay: 1000, disableOnInteraction: false }}
//             // Added Autoplay module
//             modules={[Pagination, Autoplay]}
//             className="scrollbar-hidden"
//             breakpoints={{
//               320: { slidesPerView: 1 },
//               480: { slidesPerView: 2 },
//               640: { slidesPerView: 3 },
//               768: { slidesPerView: 4 },
//               1024: { slidesPerView: 5 }
//             }}
//           >
//             <SwiperSlide>
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img1 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img1 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img1 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//             <SwiperSlide>
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Expertise"
//                 className="rounded-lg w-full"
//               />
//             </SwiperSlide>
//           </Swiper>
//         </div>

//         {/* Why Choose Zulas n More? Section */}
//         <div className="bg-white max-w-7xl mx-auto md:px-12 py-12">
//           <h2
//             style={{ fontFamily: "La Mango" }}
//             className="text-3xl md:text-3xl text-lime-950 font-semibold mb-8"
//           >
//             Why Choose Zulas n More?
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
//             {/* Card 1 */}
//             <div className="relative rounded-4xl overflow-hidden shadow-lg group h-80">
//               <img
//                 src={img1 || "/placeholder.svg"}
//                 alt="Innovation Hub"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6  bg-gradient-to-b from-transparent to-black opacity-80 ">
//                 <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white ">
//                   <h3 className="text-xl font-semibold mb-2">Innovation Hub</h3>
//                   <p className="text-sm">
//                     Join our dynamic environment that encourages creative
//                     thinking and innovation in furniture design.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Card 2 */}
//             <div className="relative rounded-4xl overflow-hidden shadow-lg group h-80">
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Team Collaboration"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6 bg-gradient-to-b from-transparent to-black opacity-80">
//                 <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
//                   <h3 className="text-xl font-semibold mb-2">
//                     Team Collaboration
//                   </h3>
//                   <p className="text-sm">
//                     Our dedicated professionals work together to create quality
//                     swings that exceed expectations.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Card 3 */}
//             <div className="relative rounded-4xl overflow-hidden shadow-lg group h-80">
//               <img
//                 src={img1 || "/placeholder.svg"}
//                 alt="Brainstorming Session"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6 bg-gradient-to-b from-transparent to-black opacity-80">
//                 <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
//                   <h3 className="text-xl font-semibold mb-2">
//                     Brainstorming Session
//                   </h3>
//                   <p className="text-sm">
//                     Where creativity meets functionality to develop unique
//                     furniture solutions for your space.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Card 4 */}
//             <div className="relative rounded-4xl overflow-hidden shadow-lg group h-80">
//               <img
//                 src={img2 || "/placeholder.svg"}
//                 alt="Luxury Swings"
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6 bg-gradient-to-b from-transparent to-black opacity-80">
//                 <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
//                   <h3 className="text-xl font-semibold mb-2">Luxury Swings</h3>
//                   <p className="text-sm">
//                     Experience the perfect blend of comfort and elegance with
//                     our premium swing collection.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   )
// }


import img1 from "../image/img1.svg"
import img2 from "../image/img2.svg"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"

export default function Story() {
  return (
    <>
      <div className="bg-white p-6 md:p-12">
        {/* Our Story Section */}
        <div className="text-center mb-10">
          <h2
            style={{ fontFamily: "La Mango" }}
            className="text-3xl md:text-4xl text-lime-950 font-semibold"
          >
            Our Story
          </h2>
          <p className="text-sm text-lime-950">
            <Link to="/" className="hover:underline">
              Home
            </Link>{" "}
            / Story
          </p>
        </div>

        {/* Story Content */}
        <div className="grid md:grid-cols-2 gap-6 items-center max-w-7xl mx-auto">
          <div className="mb-10">
            <h2
              style={{ fontFamily: "La Mango" }}
              className="text-2xl md:text-3xl font-semibold mb-4 text-lime-950"
            >
              Zulas n More brings you top-notch swings which give you better
              comfort and luxury.
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Zulas n More is a leading force in the world of furniture
              manufacturing, driven by a relentless commitment to craftsmanship,
              innovation, and design excellence. Having cumulative experience of
              15+ years, we have garnered a reputation for creating exceptional
              furniture pieces that adorn homes, offices, and spaces of all
              kinds.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto ml-6 mt-10">
              <img src={img2} alt="Swing Design" className="rounded-lg w-full" />
              <img src={img2} alt="Swing Design" className="rounded-lg w-full" />
            </div>
          </div>
          <img src={img1} alt="Swing" className="rounded-lg w-full" />
        </div>

        {/* Swiper Slider with AutoScroll + Hover Effect */}
        <div className="max-w-7xl mx-auto my-10 px-4">
          <h2
            style={{ fontFamily: "La Mango" }}
            className="text-3xl md:text-3xl mt-10 text-lime-950 font-semibold mb-4"
          >
            Our Expertise
          </h2>
          <Swiper
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            modules={[Pagination, Autoplay]}
            className="scrollbar-hidden"
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 }
            }}
          >
            {[img2, img1, img2, img1, img2, img2, img1, img2].map((image, index) => (
              <SwiperSlide key={index}>
                <div className="relative rounded-4xl overflow-hidden shadow-lg group h-60">
                  <img
                    src={image}
                    alt="Expertise"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-4 bg-gradient-to-b from-transparent to-black opacity-80">
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
                      <h3 className="text-base font-semibold mb-1">Our Expertise</h3>
                      <p className="text-xs">Crafting elegance with quality craftsmanship.</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Why Choose Zulas n More? Section */}
        <div className="bg-white max-w-7xl mx-auto md:px-12 py-12">
          <h2
            style={{ fontFamily: "La Mango" }}
            className="text-3xl md:text-3xl text-lime-950 font-semibold mb-8"
          >
            Why Choose Zulas n More?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* 4 Cards */}
            {[
              {
                img: img1,
                title: "Innovation Hub",
                desc:
                  "Join our dynamic environment that encourages creative thinking and innovation in furniture design."
              },
              {
                img: img2,
                title: "Team Collaboration",
                desc:
                  "Our dedicated professionals work together to create quality swings that exceed expectations."
              },
              {
                img: img1,
                title: "Brainstorming Session",
                desc:
                  "Where creativity meets functionality to develop unique furniture solutions for your space."
              },
              {
                img: img2,
                title: "Luxury Swings",
                desc:
                  "Experience the perfect blend of comfort and elegance with our premium swing collection."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="relative rounded-4xl overflow-hidden shadow-lg group h-80"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-6 bg-gradient-to-b from-transparent to-black opacity-80">
                  <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-white">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
