import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getPersoneller } from "../api/personel";
import { getGorevler } from "../api/gorev";
import { getGorevTurleri } from "../api/gorevTuru";
import { getBirimler } from "../api/birim";

import { getAuth } from "../utils/authStorage";
import { getErrorMessage } from "../utils/getErrorMessage";

const DashboardPage = () => {
  const auth = getAuth();

  const [aktifPersonelSayisi, setAktifPersonelSayisi] =
    useState(0);

  const [aktifGorevSayisi, setAktifGorevSayisi] =
    useState(0);

  const [aktifGorevTuruSayisi, setAktifGorevTuruSayisi] =
    useState(0);

  const [aktifBirimSayisi, setAktifBirimSayisi] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let aktif = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        /*
         * Personel, görev ve görev türü bilgileri
         * ADMIN ve BIRIM_YETKILISI tarafından
         * okunabilir.
         */
        const [
          personelData,
          gorevData,
          gorevTuruData,
        ] = await Promise.all([
          getPersoneller(),
          getGorevler(),
          getGorevTurleri(),
        ]);

        if (!aktif) {
          return;
        }

        /*
         * Sadece aktif kayıtları sayıyoruz.
         */
        setAktifPersonelSayisi(
          personelData.filter(
            (personel) => personel.aktif
          ).length
        );

        setAktifGorevSayisi(
          gorevData.filter(
            (gorev) => gorev.aktif
          ).length
        );

        setAktifGorevTuruSayisi(
          gorevTuruData.filter(
            (gorevTuru) => gorevTuru.aktif
          ).length
        );

        /*
         * Birimleri yalnızca ADMIN okuyabiliyor.
         */
        if (auth?.rol === "ADMIN") {
          const birimData =
            await getBirimler();

          if (!aktif) {
            return;
          }

          setAktifBirimSayisi(
            birimData.filter(
              (birim) => birim.aktif
            ).length
          );
        }
      } catch (error) {
        if (!aktif) {
          return;
        }

        toast.error(
          getErrorMessage(
            error,
            "Ana sayfa bilgileri yüklenirken bir hata oluştu."
          ),
          {
            id: "dashboard-yukleme-hatasi",
          }
        );
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    };

    void fetchDashboardData();

    return () => {
      aktif = false;
    };
  }, [auth?.rol]);

  return (
    <div className="p-6">
      {/* KARŞILAMA */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Ana Sayfa
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Emniyet Görev Yönetim Sistemine hoş geldiniz.
        </p>
      </div>

      {/* KULLANICI BİLGİSİ */}
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
              {auth?.sicilNo || "-"}
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

      {/* BİLGİ KARTLARI */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* AKTİF PERSONEL */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Aktif Personel
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {loading
              ? "..."
              : aktifPersonelSayisi}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {auth?.rol === "BIRIM_YETKILISI"
              ? "Biriminizdeki aktif personel"
              : "Sistemdeki aktif personel"}
          </p>
        </div>

        {/* AKTİF GÖREV */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Aktif Görev
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {loading
              ? "..."
              : aktifGorevSayisi}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {auth?.rol === "BIRIM_YETKILISI"
              ? "Biriminizdeki aktif görevler"
              : "Sistemdeki aktif görevler"}
          </p>
        </div>

        {/* GÖREV TÜRLERİ */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Aktif Görev Türleri
          </p>

          <p className="mt-3 text-3xl font-bold text-slate-900">
            {loading
              ? "..."
              : aktifGorevTuruSayisi}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Kullanılabilir görev türleri
          </p>
        </div>

        {/* BİRİMLER - SADECE ADMIN */}
        {auth?.rol === "ADMIN" && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Aktif Birimler
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {loading
                ? "..."
                : aktifBirimSayisi}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Sistemde kullanılan birimler
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;