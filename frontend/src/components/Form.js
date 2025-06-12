import React from 'react';
import { useState, useEffect, createContext, useRef } from "react";
import "./Form.css";



export default function Form() {
  const [userData, setUserData] = useState({
      fullName: "",
      email: "",
      password: "",
      mobile: "",
      age: "",
      address: "",
    });
  
    const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;
      setUserData((values) => ({ ...values, [name]: value }));
    };
  
    const [errors, setErrors] = useState({});
  
    const validate = () => {
      const newErrors = {};
      const nameRegex = /^[A-Za-z\s]+$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordgRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      const mobileRegex = /^[0-9]{10}$/;
  
      if (!userData.fullName.trim()) {
        newErrors.fullName = "name is required";
      } else if (!nameRegex.test(userData.fullName)) {
        newErrors.fullName = "name must be only letters";
      }
  
      if (!userData.email.trim()) {
        newErrors.email = "email is required";
      } else if (!emailRegex.test(userData.email)) {
        newErrors.email = "enter vaild email";
      }
  
      if (!userData.password.trim()) {
        newErrors.password = "password is required";
      } else if (!passwordgRegex.test(userData.password)) {
        newErrors.password =
          "password must be 8 characters with uppercase,lowercase,special character";
      }
  
      if (!userData.mobile.trim()) {
        newErrors.mobile = "mobile is required";
      } else if (!mobileRegex.test(userData.mobile) ) {
        newErrors.mobile ="mobile must be 10 digit";
      }
  
      if (!userData.age.trim()) {
        newErrors.age = "age is required";
      } else if (isNaN(userData.age) || parseInt(userData.age) <= 0) {
        newErrors.age = "enter vaild age";
      }
  
      if (!userData.address.trim()) {
        newErrors.address = "address is required";
      }
  
      return newErrors;
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      const validationErrors = validate();
      setErrors(validationErrors);
  
      if (Object.keys(validationErrors).length === 0) {
        try{
          const response = await fetch(`${process.env.REACT_APP_Backend_URL}/api/user`,{
            method: "POST",
            headers: {
              "Content-Type":"application/json"
            },
            body: JSON.stringify(userData)
          });
  
          const data = await response.json();
  
          if(response.ok){
            alert("Form submitted successfully");
            console.log("Server response:", data);
            setUserData({
              fullName: "",
              email: "",
              password: "",
              mobile: "",
              age: "",
              address: "",
            });
          }else{
            alert("Error: "+data.error);
            console.error("Submission error",data);
          }
        }catch(error){
          console.error("Network error:",error);
          alert("Something went wrong while submitting the form.");
        }
      }
        };
  
    return (
    <div className="form-wrapper">
      <div className="registration form">
        <h1>Registration form</h1>
        <form onSubmit={handleSubmit}>
          <label className="form-label">full name</label>
          <input
            className="form-control"
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p style={{ color: "red" }}>{errors.fullName}</p>}
          <br />
          <label className="form-label">email</label>
          <input
            className="form-control"
            type="text"
            name="email"
            value={userData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          <br />
          <label className="form-label">password</label>
          <input
            className="form-control"
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
          <br />
          <label className="form-label">mobile</label>
          <input
            className="form-control"
            type="text"
            name="mobile"
            value={userData.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <p style={{ color: "red" }}>{errors.mobile}</p>}
          <br />
          <label className="form-label">age</label>
          <input
            className="form-control"
            type="text"
            name="age"
            value={userData.age}
            onChange={handleChange}
          />
          {errors.age && <p style={{ color: "red" }}>{errors.age}</p>}
          <br />
          <label className="form-label">address</label>
          <input
            className="form-control"
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
          {errors.address && <p style={{ color: "red" }}>{errors.address}</p>}
          <br />
          <button className="btn btn-primary" type="submit">submit</button>
        </form>
      </div>
      </div>
    );
}
