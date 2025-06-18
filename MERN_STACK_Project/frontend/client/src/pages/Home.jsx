import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";



const Home = () => {
  return (
    <>
      <div className="main-content"></div>
      <Navbar />
      <Hero id="hero" />
      <div id="sofa">
  {/* Sofa section content */}
</div>

<div id="bed">
  {/* Bed section content */}
</div>

<div id="table">
  {/* Table section content */}
</div>

<div id="chair">
  {/* Chair section content */}
</div>
      <Categories />
      
      
      <Footer />
      <Chatbot />
    </>
    

  );
};

export default Home;
