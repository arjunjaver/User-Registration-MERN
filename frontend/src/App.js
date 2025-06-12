import "./App.css";
import Form from "./components/Form.js";
import Users from "./components/Users.js";
import Navbar from "./components/Navbar.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Form/>}/>
          <Route path="/users" element={<Users/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
