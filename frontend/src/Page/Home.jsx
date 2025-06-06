import React from "react";
import TopSellingProduct from "../components/TopSellingProduct";
import LastSection from "../components/LastSection";
import ShopByCategory from "../components/ShopByCategory";
import FeaturesSection from "../components/FeaturesSection";
import FeatureCollection from "../components/FeatureCollection";
import ImageSlider1 from '../components/ImageSlider1'


const Home = () => {

    return (

        <>
            <ImageSlider1/>
            <FeatureCollection />
            <TopSellingProduct />
            <ShopByCategory />
            <FeaturesSection/>
            <LastSection/>
        </>
    )
}

export default Home
