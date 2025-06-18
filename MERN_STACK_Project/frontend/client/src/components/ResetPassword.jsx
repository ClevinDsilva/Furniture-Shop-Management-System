import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const email = localStorage.getItem("resetEmail");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", { email, password });
      if (res.data.success) {
        setMessage({ type: "success", text: "Password updated!" });
        localStorage.removeItem("resetEmail");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Reset failed." });
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h3>Create New Password</h3>
      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      {message && <p>{message.text}</p>}
    </form>
  );
};

export default ResetPassword;
