import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import sampleImg1 from "../assets/user1.jpg";
import sampleImg2 from "../assets/user2.jpg";
import sampleImg3 from "../assets/user3.jpg";

const Profile = () => {
  const navigate = useNavigate();

  let storedUser = {};
try {
  const userData = localStorage.getItem("user");
  if (userData) {
    storedUser = JSON.parse(userData);
  }
} catch (error) {
  console.error("Invalid user data in localStorage:", error);
}


  const [user, setUser] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    password: storedUser.password || "",
    address: storedUser.address || "",
    contact: storedUser.contact || "",
    image: storedUser.image || sampleImg1,
  });

  const [editing, setEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(user.image);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (!storedUser || !storedUser.email) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleImageChange = (img) => {
    setUser((prev) => ({ ...prev, image: img }));
    setImagePreview(img);
  };

  const handleSave = async () => {
    if (oldPassword && oldPassword !== storedUser.password) {
      setError("❌ Old password is incorrect!");
      return;
    }
  
    const updatedUser = {
      ...user,
      password: newPassword || user.password,
    };
  
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`http://localhost:5000/api/update-profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
  
      const data = await res.json();
  
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setEditing(false);
        setOldPassword("");
        setNewPassword("");
        setError("");
        alert("✅ Profile updated successfully!");
      } else {
        setError("❌ Failed to update profile.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("❌ Something went wrong!");
    }
  };
  

  return (
    <div className="profile-container">
      <h1>👤 User Profile</h1>

      <div className="profile-header">
        <img src={imagePreview} alt="Profile" className="profile-img" />
        {editing ? (
          <div className="image-options">
            {[sampleImg1, sampleImg2, sampleImg3].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Sample ${index + 1}`}
                onClick={() => handleImageChange(img)}
                className="thumbnail"
              />
            ))}
          </div>
        ) : (
          <p>Click Edit to change image</p>
        )}
      </div>

      <div className="profile-details">
        <label>Name:</label>
        {editing ? (
          <input type="text" name="name" value={user.name} onChange={handleChange} />
        ) : (
          <p>{user.name}</p>
        )}

        <label>Email:</label>
        {editing ? (
          <input type="email" name="email" value={user.email} onChange={handleChange} />
        ) : (
          <p>{user.email}</p>
        )}

        {/* <label>Password:</label>
        {editing ? (
          <>
            <input
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={handleOldPasswordChange}
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </>
        ) : (
          <p>********</p>
        )} */}

        {error && <p className="error">{error}</p>}

        <label>Address:</label>
        {editing ? (
          <input type="text" name="address" value={user.address} onChange={handleChange} />
        ) : (
          <p>{user.address || "Not added yet"}</p>
        )}

        <label>Contact Number:</label>
        {editing ? (
          <input type="tel" name="contact" value={user.contact} onChange={handleChange} />
        ) : (
          <p>{user.contact || "Not added yet"}</p>
        )}
      </div>

      <div className="profile-buttons">
        {editing ? (
          <button className="btn save-btn" onClick={handleSave}>💾 Save</button>
        ) : (
          <button className="btn edit-btn" onClick={() => setEditing(true)}>✏️ Edit</button>
        )}
        <button className="btn back-btn" onClick={() => navigate("/")}>🔙 Back to Home</button>
      </div>
    </div>
  );
};

export default Profile;
