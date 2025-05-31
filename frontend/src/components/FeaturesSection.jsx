

import React from 'react';
import icon1 from "../image/icon1.png";
import icon2 from "../image/icon2.png";
import icon3 from "../image/icon3.png";
import icon4 from "../image/icon4.png";
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/4 p-2 sm:p-3 md:p-4">
      <div className="rounded-2xl bg-[#262B0D] p-4 sm:p-5 md:p-6 flex flex-col items-start h-full transition-transform hover:scale-105">
        <div className="text-white mb-3 sm:mb-4">
          <img
            src={icon || "/placeholder.svg"}
            alt={title}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
        </div>
        <h3 className="text-white text-base sm:text-lg font-semibold mb-1 sm:mb-2">
          {title}
        </h3>
        <p className="text-gray-300 text-xs sm:text-sm">{description}</p>
      </div>
    </div>
  )
}

const FeaturesSection = () => {
  const features = [
    {
      icon: icon1,
      title: "PAN India Delivery",
      description: "Get your products delivered at your home with ease."
    },
    {
      icon: icon2,
      title: "Quality Assurance",
      description: "Easy exchange and return options. Premium Materials"
    },
    {
      icon:icon3,
      title: "Online Support",
      description: "24 hours a day, 7 days a week."
    },
    {
      icon: icon4,
      title: "Flexible Payment",
      description: "Pay with Multiple payment options."
    }
  ]

  return (
    <div className="bg-white py-8 sm:py-10 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap -mx-2 sm:-mx-3 md:-mx-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
