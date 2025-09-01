import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import "./Login.css";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      const result = await axios.post("http://localhost:8080/api/user/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (result.data.message === "Login Success") {
        alert("Login Success");

        // if token is sent, store it
        if (result.data.token) {
          localStorage.setItem("token", result.data.token);
        }

        navigate("/dashboard");
      } else {
        alert(result.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login request failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              ref={emailRef}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              ref={passwordRef}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit">Login</button>
          </div>
        </form>

        <p>
          Don’t have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
