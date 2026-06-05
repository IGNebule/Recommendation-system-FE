import { Outlet } from "react-router-dom";
import Header from "../components/navigation/Header";
import Footer from "../components/navigation/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#0B0813] text-white">
      <Header />
      <main className="px-6 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
