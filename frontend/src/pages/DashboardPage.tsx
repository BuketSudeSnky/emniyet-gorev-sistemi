import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { clearAuth, getAuth } from "../utils/authStorage";

const DashboardPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h1 className="text-2xl font-bold text-slate-900">
            Emniyet Görev Sistemi
          </h1>

          <p className="mt-2 text-slate-600">
            Sisteme başarıyla giriş yaptınız.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              Sicil No:
              <span className="ml-2 font-semibold text-slate-900">
                {auth?.sicilNo}
              </span>
            </p>

            <p className="mt-2 text-sm text-slate-600">
              Rol:
              <span className="ml-2 font-semibold text-slate-900">
                {auth?.rol}
              </span>
            </p>

            {auth?.birimAdi && (
              <p className="mt-2 text-sm text-slate-600">
                Birim:
                <span className="ml-2 font-semibold text-slate-900">
                  {auth.birimAdi}
                </span>
              </p>
            )}
          </div>

          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={handleLogout}
            >
              Çıkış Yap
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;