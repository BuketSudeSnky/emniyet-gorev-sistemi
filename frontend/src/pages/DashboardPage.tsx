import { getAuth } from "../utils/authStorage";

const DashboardPage = () => {
  const auth = getAuth();

  return (
    <div className="p-6">
      {/* Karşılama */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Ana Sayfa
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Emniyet Görev Yönetim Sistemine hoş geldiniz.
        </p>
      </div>

      {/* Kullanıcı bilgisi */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">
          Aktif Oturum
        </p>

        <div className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
          <div>
            <p className="text-xs text-slate-400">
              Sicil Numarası
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {auth?.sicilNo}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              Yetki
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              {auth?.rol === "ADMIN"
                ? "Sistem Yöneticisi"
                : "Birim Yetkilisi"}
            </p>
          </div>

          {auth?.birimAdi && (
            <div>
              <p className="text-xs text-slate-400">
                Birim
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {auth.birimAdi}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bilgi kartları */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Aktif Personel
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            -
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Personel bilgileri
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Aktif Görev
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            -
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Devam eden görevler
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Görev Türleri
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            -
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Tanımlı görev türleri
          </p>
        </div>

        {auth?.rol === "ADMIN" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Birimler
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              -
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Sistemdeki birimler
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;