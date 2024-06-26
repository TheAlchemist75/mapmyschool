import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../api/dataService";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, user);
      const token = res.data.token;
      localStorage.setItem("token", token);
      onLogin(token);
      navigate("/map-school");
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div class="auth-image">
          <img
            src="https://res.cloudinary.com/dcprg19es/image/upload/v1718826505/MapMySchool/fpf7s1hk0cppflur1fgv.jpg"
            alt="Cloudinary-Map"
          />
        </div>
        <div className="auth-content">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            <button type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{" "}
            <button onClick={goToRegister}>Register</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
