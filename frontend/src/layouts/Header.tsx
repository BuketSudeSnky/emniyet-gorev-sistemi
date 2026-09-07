import { useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../utils/authStorage";
import Button from "../components/ui/Button";

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Yönetim Paneli
        </h2>

        {auth?.birimAdi && (
          <p className="text-xs text-slate-500">
            {auth.birimAdi}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        
        <div className="text-right">
          <p className="text-sm font-medium text-slate-800">
            {auth?.sicilNo}
          </p>

          <p className="text-xs text-slate-500">
            {auth?.rol === "ADMIN"
              ? "Sistem Yöneticisi"
              : "Birim Yetkilisi"}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleLogout}
        >
          Çıkış Yap
        </Button>

      </div>
    </header>
  );
};

export default Header;