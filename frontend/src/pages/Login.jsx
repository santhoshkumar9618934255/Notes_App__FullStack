import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

      if (result.data.token) {
        // store token
        localStorage.setItem("token", result.data.token);

        // verify token with backend
        try {
          const verify = await axios.get(
            "http://localhost:8080/api/user/verify-token",
            {
              headers: {
                Authorization: `Bearer ${result.data.token}`,
              },
            }
          );

          if (verify.data.valid) {
            alert("Login Success");
            navigate("/dashboard"); 
          } else {
            alert("Token verification failed. Please login again.");
          }
        } catch (err) {
          console.error("Token verification error:", err);
          alert("Token verification failed. Please login again.");
        }
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
