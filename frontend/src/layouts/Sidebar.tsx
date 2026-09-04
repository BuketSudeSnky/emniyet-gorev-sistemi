import { NavLink } from "react-router-dom";
import { getAuth } from "./../utils/authStorage";

const Sidebar = () => {
  const auth = getAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">

      {/* Logo / Sistem adı */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-bold text-slate-900">
            EGS
          </div>

          <div>
            <h1 className="text-sm font-semibold">
              Emniyet Görev
            </h1>

            <p className="text-xs text-slate-400">
              Yönetim Sistemi
            </p>
          </div>

        </div>
      </div>

      {/* Menü */}
      <nav className="flex-1 space-y-1 px-4 py-6">

        <NavLink to="/" end className={linkClass}>
          Ana Sayfa
        </NavLink>

        {/* ADMIN + BIRIM_YETKILISI */}
        <NavLink to="/personeller" className={linkClass}>
          Personeller
        </NavLink>

        <NavLink to="/gorevler" className={linkClass}>
          Görevler
        </NavLink>

        <NavLink to="/gorev-dagitim" className={linkClass}>
          Görev Dağıtımı
        </NavLink>

        {/* Sadece ADMIN */}
        {auth?.rol === "ADMIN" && (
          <>
            <div className="px-3 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Yönetim
            </div>

            <NavLink to="/birimler" className={linkClass}>
              Birimler
            </NavLink>

            <NavLink to="/gorev-turleri" className={linkClass}>
              Görev Türleri
            </NavLink>

            <NavLink to="/kullanicilar" className={linkClass}>
              Kullanıcı Yönetimi
            </NavLink>
          </>
        )}

      </nav>

      {/* Alt kullanıcı bilgisi */}
      <div className="border-t border-slate-800 p-4">

        <p className="text-sm font-medium text-white">
          {auth?.sicilNo}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {auth?.rol === "ADMIN"
            ? "Sistem Yöneticisi"
            : "Birim Yetkilisi"}
        </p>

        {auth?.birimAdi && (
          <p className="mt-1 text-xs text-slate-500">
            {auth.birimAdi}
          </p>
        )}

      </div>

    </aside>
  );
};

export default Sidebar;