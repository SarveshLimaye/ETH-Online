import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import UserRegistration from "./pages/User-Registration/UserRegistration";
import AllMusic from "./pages/All-Music/AllMusic";
import AddMusic from "./pages/Add-Music/AddMusic";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all" element={<AllMusic />} />
        <Route path="/user-registration" element={<UserRegistration />} />
        <Route path="/add" element={<AddMusic />} />
      </Routes>
    </Router>
  );
}

export default App;
