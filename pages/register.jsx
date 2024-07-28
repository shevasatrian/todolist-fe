/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import {useToast} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useMutation } from "../hooks/useMutation";

export default function Register() {
  const router = useRouter();
  const toast = useToast();
  const { mutate } = useMutation();
  const [payload, setPayload] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const HandleSubmit = async () => {
    const { firstname, lastname, email, password } = payload;

    if (!firstname || !lastname || !email || !password) {
      toast({
        title: "All fields are required",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email format",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const response = await mutate({
      url: "http://localhost:8181/api/v1/auth/register",
      payload,
    });
    console.log('response => ', response)
    if (!response?.token) {
      toast({
        title: "Register Failed",
        description: "Please repeat the registration",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Register Success",
        description: "Please Login",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-1/3">
        <h4 className="text-2xl font-bold mb-4 text-center">Todo List Register</h4>
        <div className="mb-4">
          <label htmlFor="email">First Name</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.firstname}
            onChange={(event) => setPayload({ ...payload, firstname: event.target.value })}
            placeholder="First Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email">Last Name</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.lastname}
            onChange={(event) => setPayload({ ...payload, lastname: event.target.value })}
            placeholder="Last Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.email}
            onChange={(event) => setPayload({ ...payload, email: event.target.value })}
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            className="border w-full p-2 rounded-2xl focus:outline-none focus:border-blue-500"
            value={payload?.password}
            onChange={(event) => setPayload({ ...payload, password: event.target.value })}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/4 px-2 py-3 text-sm text-gray-500 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div>
          <button
            onClick={() => HandleSubmit()}
            className="bg-blue-500 text-white w-full px-6 py-2 rounded-2xl hover:bg-blue-700 focus:outline-none"
          >
            Register
          </button>
          <div className="mt-1 pl-1 pt-1 text-sm">
            <p className="text-gray-600">already have an account? <Link className="text-blue-600 hover:text-gray-800" href="/login">Login</Link> </p>
          </div>
        </div>
      </div>
    </div>
  );
}
