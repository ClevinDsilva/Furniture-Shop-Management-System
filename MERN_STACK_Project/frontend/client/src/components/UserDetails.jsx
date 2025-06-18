import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import "./userDetails.css";

const libraries = ["places"];

const UserDetailsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    house: "",
    street: "",
    area: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const autocompleteRef = useRef(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAqyJ4AK1JDLaMCn7qi0R3hhRl-PSccA0c", // replace this
    libraries,
  });

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    const addressComponents = place.address_components;

    const getComp = (type) =>
      addressComponents?.find((comp) => comp.types.includes(type))?.long_name || "";

    setFormData((prev) => ({
      ...prev,
      street: getComp("route"),
      area: getComp("sublocality_level_1"),
      city: getComp("locality"),
      pincode: getComp("postal_code"),
    }));
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Enter a valid 10-digit number";
    if (!formData.house || !formData.street || !formData.city) newErrors.address = "Complete address required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      localStorage.setItem("userDetails", JSON.stringify(formData));
      navigate("/payment");
    }
  };

  return isLoaded ? (
    <div className="user-details-container">
      <div className="form-card">
        <h2 className="title">Enter Your Delivery Details</h2>
        <form>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Contact Number:</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            {errors.contact && <span className="error">{errors.contact}</span>}
          </div>

          <div className="form-group">
            <label>House / Flat No:</label>
            <input type="text" name="house" value={formData.house} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Street:</label>
            <input type="text" name="street" value={formData.street} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Area / Landmark:</label>
            <input type="text" name="area" value={formData.area} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Pincode:</label>
            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
          </div>

          {errors.address && <span className="error">{errors.address}</span>}

          <button type="button" onClick={handleNext} className="next-btn">
            Next ➡️
          </button>
        </form>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default UserDetailsPage;
