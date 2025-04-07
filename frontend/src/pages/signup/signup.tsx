import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Signup as signupApi } from "../../api/signup";
import { isValidEmail } from "../../utils/validation";
interface InputState {
  userName: string;
  mobile: string;
  email: string;
  password: string;
}

type FieldError = {
    required: boolean;
    valid?: boolean; 
  };
  
  type ErrorState = {
    userName: FieldError;
    mobile: FieldError;
    email: FieldError;
    password: FieldError;
  };

const initialInputs: InputState = {
  userName: "",
  mobile: "",
  email: "",
  password: "",
};

const initialErrors: ErrorState = {
  userName: { required: false },
  mobile: { required: false },
  email: { required: false },
  password: { required: false },
};

const Signup = () => {
  const [inputs, setInputs] = useState(initialInputs);
  const [errors, setErrors] = useState(initialErrors);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();



  const handleValidation = (data: InputState) => {
    const error = { ...initialErrors };

    if (data.userName === "") {
        error.userName.required = true;
      }
      if (data.mobile === "") {
        error.mobile.required = true;
      }
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
      signupApi(inputs)
        .then((res) => {
          const result = res?.data?.result;
          console.log("result",result);
            toast.success(res?.data?.message || "Signup Successful");
            navigate("/");

        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Signup Failed");
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl w-full max-w-4xl">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center">
          <h1 className="text-3xl text-blue-600 font-bold mb-6">Sign Up</h1>
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-1 font-bold text-blue-600">Username:</label>
              <input
                name="userName"
                type="text"
                className="border rounded p-2"
                placeholder="Enter your username"
                value={inputs.userName}
                onChange={handleChange}
              />
              {errors.userName.required && <span className="text-red-500 text-sm">Username is required</span>}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-bold text-blue-600">Mobile No:</label>
              <input
                name="mobile"
                type="text"
                className="border rounded p-2"
                placeholder="Enter your mobile number"
                value={inputs.mobile}
                onChange={handleChange}
              />
              {errors.mobile.required && <span className="text-red-500 text-sm">Mobile number is required</span>}
            </div>

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
              Register
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-blue-600 hidden md:flex items-center justify-center">
          <h1 className="text-white text-3xl font-bold">User Registration</h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
