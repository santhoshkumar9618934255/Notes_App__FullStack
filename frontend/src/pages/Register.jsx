import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const register_data = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const result = await axios.post("http://localhost:8080/api/user/register", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      if (result.data.message === "Registration Success") {

        localStorage.setItem("name", nameRef.current.value);

        alert("Registration Success");
        if (result.data.message === "Registration Success") {
          navigate("/login");
        }
      } else {
        alert(result.data.message);
      }
    } catch (err) {
      console.error("Registration failed", err);
      alert("Registration failed, please try again.");
    }
  };

  return (
    <div className="body">
      <div className="register-container">
        <form className="register-form" onSubmit={register_data}>
          <h2>Registration Form</h2>
          <input type="text" ref={nameRef} placeholder="Enter name" required />
          
          <input type="email" ref={emailRef} placeholder="Enter email" required />
        
          <input type="password" ref={passwordRef} placeholder="Enter password" required />
          <button type="submit">Register</button>

          <p className="account">
            Already have an account?{" "}
            <span
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
