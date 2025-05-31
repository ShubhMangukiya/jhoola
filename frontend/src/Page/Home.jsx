import React from "react";
import TopSellingProduct from "../components/TopSellingProduct";
import LastSection from "../components/LastSection";
import ShopByCategory from "../components/ShopByCategory";
import FeaturesSection from "../components/FeaturesSection";
import FeatureCollection from "../components/FeatureCollection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {

    return (

        <>
            <Navbar />
            
            <FeatureCollection />
            <TopSellingProduct />
            <ShopByCategory />
            <FeaturesSection/>
            <LastSection/>

            <Footer/>

        </>
    )
}

export default Home
