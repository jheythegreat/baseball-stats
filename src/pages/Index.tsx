import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";
import Login from "@/components/Login";
import Register from "@/components/Register";

const Index = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Comprobar si el usuario ya está autenticado
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = () => {
    navigate("/dashboard");
  };

  const handleRegister = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col baseball-stadium-bg">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">
            ⚾ Baseball Stats Tracker
          </h1>
          <p className="text-white/90 text-xl">
            Registra y analiza tus estadísticas de béisbol
          </p>
          
          {/* Social Media Icons */}
          <div className="flex justify-center gap-4 mt-6 mb-4">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a 
              href="mailto:contact@baseballstats.com"
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>

        {showLogin ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <Register 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
      
      <footer className="bg-black/80 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Baseball Stats App</p>
      </footer>
    </div>
  );
};

export default Index;
