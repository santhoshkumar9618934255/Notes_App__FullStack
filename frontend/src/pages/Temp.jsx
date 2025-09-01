import{useRef}  from "react"
import {Link} from "react-router-dom"

const Temp = () => {
  const emailRef = useRef('');
  const passwordRef = useRef('');

  const load_data=async (req,res)=>{
     const result=await axios.post("http://localhost:8000/api/login",{
                                                                       "email":emailRef.current.value,
                                                                       "password":passwordRef.current.value   })
  }

  const submit=()=>{
        load_data();

  }

  return (
    <div className="register-container">
      <form className="register-form">
        <h2>Login</h2>
        <input type="email" ref={emailRef} placeholder="Enter email" />
        <input type="password" ref={passwordRef} placeholder="Enter password" />
        <button type="submit" onClick={submit}>Login</button>

        <p>
          Don’t have an account?{" "}
         
        </p>
      </form>
    </div>
  );
};

export default Temp;
