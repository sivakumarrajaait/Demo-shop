import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getLoginType, saveToken } from "../../utils/storage";
import { isAuthenticated } from "../../utils/auth";
import { isValidEmail } from "../../utils/validation";
import { LoginUser } from "../../api/login";
interface InputState {
    email: string;
    password: string;
  }
  
  type FieldError = {
      required: boolean;
      valid?: boolean; 
    };
    
    type ErrorState = {
      email: FieldError;
      password: FieldError;
    };
  
  const initialInputs: InputState = {
    email: "",
    password: "",
  };
  
  const initialErrors: ErrorState = {
    email: { required: false },
    password: { required: false },
  };
const Login = () => {

      const [inputs, setInputs] = useState(initialInputs);
      const [errors, setErrors] = useState(initialErrors);
      const [submitted, setSubmitted] = useState(false);
      const navigate = useNavigate();
    
    
    
      const handleValidation = (data: InputState) => {
        const error = { ...initialErrors };

        if (data.email === "") {
            error.email.required = true;
          }
          if (data.password === "") {
            error.password.required = true;
          }
          if (!isValidEmail(data.email)) {
            error.email.valid = true;
          }
          return error;
    
      };
    
      const handleErrors = (obj: ErrorState) => {
        for (const key in obj) {
          const prop = obj[key as keyof ErrorState];
          if (prop.required || prop.valid) return false;
        }
        return true;
      };
      
    
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
        if (submitted) {
          const newErrors = handleValidation({ ...inputs, [e.target.name]: e.target.value });
          setErrors(newErrors);
        }
      };
    
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = handleValidation(inputs);
        setErrors(newErrors);
        setSubmitted(true);
    
        if (handleErrors(newErrors)) {
          LoginUser(inputs)
            .then((res) => {
              const result = res?.data?.result;
              console.log("result",result);
              saveToken({
                token: result.token,
                loginType: result.loginType,
                User: result.userDetails._id,
                UserName: result.userDetails.userName
              });
              if(isAuthenticated())
                if (getLoginType() === "User") {
                toast.success(res?.data?.message || "Login Successful");
                navigate("/product");
                }
    
            })
            .catch((err) => {
              toast.error(err?.response?.data?.message || "Login Failed");
            });
        }
      };
    return (
      <div className="min-h-screen flex items-center justify-center p-4 ">
        <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl">
          
        <div className="w-full md:w-1/2 bg-blue-600 hidden md:flex items-center justify-center">
  <h1 className="text-white text-3xl font-bold">User Login</h1>
</div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
            <h1 className="text-3xl text-blue-600 font-bold mb-6">Login</h1>
            
            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              
  
            <div className="flex flex-col">
              <label className="mb-1 font-bold text-blue-600">Email:</label>
              <input
                name="email"
                type="email"
                className="border rounded p-2"
                placeholder="Enter your email"
                value={inputs.email}
                onChange={handleChange}
              />
              {errors.email.required && <span className="text-red-500 text-sm">Email is required</span>}
              {errors.email.valid && <span className="text-red-500 text-sm">Enter a valid email</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-bold text-blue-600">Password:</label>
              <input
                name="password"
                type="password"
                className="border rounded p-2"
                placeholder="Enter your password"
                value={inputs.password}
                onChange={handleChange}
              />
              {errors.password.required && <span className="text-red-500 text-sm">Password is required</span>}
            </div>

  
              <button
                type="submit"
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-all"
              >
                Login
              </button>
            </form>
          </div>
  
      


        </div>
      </div>
    );
  };
  
  export default Login;
  