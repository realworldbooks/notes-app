import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import NavBar from "./components/navbar/Navbar";
import Developers from "./pages/Developers";
import Footer from "./pages/Footer";
import Join from "./pages/Join";
import Loading from "./pages/Header";
import Partners from "./pages/Partners";
import Properties from "./pages/Properties";
import Subscribe from "./pages/Subscribe";
import NotesDemo from "./pages/NotesDemo";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/notes" element={<NotesDemo/>} />
          <Route path="/" element={
            <>
            <Loading />
            <Partners />
            <Properties />
            <AboutUs />
            <Developers />
            <Join />
            <Subscribe />
            </>
          } />
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
