import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getKullanicilar,
  pasifeAlKullanici,
  aktifeAlKullanici,
  type Kullanici,
} from "../api/kullanici";

import { getErrorMessage } from "../utils/getErrorMessage";

import KullaniciFormModal from "../components/kullanici/KullaniciFormModal";
import KullaniciEditModal from "../components/kullanici/KullaniciEditModal";
import KullaniciSifreModal from "../components/kullanici/KullaniciSifreModal";

export default function KullanicilarPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [loading, setLoading] = useState(true);

  const [formModalAcik, setFormModalAcik] = useState(false);

  const [duzenlenecekKullanici, setDuzenlenecekKullanici] =
    useState<Kullanici | null>(null);

  const [sifreDegisecekKullanici, setSifreDegisecekKullanici] =
    useState<Kullanici | null>(null);

  const [durumDegistirilenId, setDurumDegistirilenId] =
    useState<number | null>(null);

  const kullanicilariYukle = async () => {
    try {
      const data = await getKullanicilar();
      setKullanicilar(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Kullanıcılar yüklenirken bir hata oluştu."
        ),
        {
          id: "kullanicilar-yukleme-hatasi",
        }
      );
    }
  };

  const kullaniciDurumDegistir = async (kullanici: Kullanici) => {
    try {
      setDurumDegistirilenId(kullanici.id);

      if (kullanici.aktif) {
        await pasifeAlKullanici(kullanici.id);

        toast.success(
          `${kullanici.sicilNo} kullanıcısı pasife alındı.`
        );
      } else {
        await aktifeAlKullanici(kullanici.id);

        toast.success(
          `${kullanici.sicilNo} kullanıcısı aktife alındı.`
        );
      }

      await kullanicilariYukle();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Kullanıcı durumu değiştirilirken bir hata oluştu."
        )
      );
    } finally {
      setDurumDegistirilenId(null);
    }
  };

  useEffect(() => {
    let active = true;

    getKullanicilar()
      .then((data) => {
        if (active) {
          setKullanicilar(data);
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(
            getErrorMessage(
              error,
              "Kullanıcılar yüklenirken bir hata oluştu."
            ),
            {
              id: "kullanicilar-yukleme-hatasi",
            }
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">
          Kullanıcılar yükleniyor...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Kullanıcı Yönetimi
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Sistem kullanıcılarını ve yetkilerini yönetin.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormModalAcik(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Yeni Kullanıcı Ekle
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    Sicil No
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Rol
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Birim
                  </th>

                  <th className="px-4 py-3 font-medium">
                    Durum
                  </th>

                  <th className="px-4 py-3 font-medium">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {kullanicilar.map((kullanici) => (
                  <tr
                    key={kullanici.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {kullanici.sicilNo}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {kullanici.rol === "ADMIN"
                        ? "Admin"
                        : "Birim Yetkilisi"}
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {kullanici.birimAdi ?? "-"}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={
                          kullanici.aktif
                            ? "rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                        }
                      >
                        {kullanici.aktif ? "Aktif" : "Pasif"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDuzenlenecekKullanici(kullanici)
                          }
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Düzenle
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSifreDegisecekKullanici(kullanici)
                          }
                          className="rounded-lg border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                        >
                          Şifre Sıfırla
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            kullaniciDurumDegistir(kullanici)
                          }
                          disabled={
                            durumDegistirilenId === kullanici.id
                          }
                          className={
                            kullanici.aktif
                              ? "rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              : "rounded-lg border border-green-200 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                          }
                        >
                          {durumDegistirilenId === kullanici.id
                            ? "İşleniyor..."
                            : kullanici.aktif
                              ? "Pasife Al"
                              : "Aktife Al"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {kullanicilar.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Kullanıcı bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {formModalAcik && (
        <KullaniciFormModal
          onClose={() => setFormModalAcik(false)}
          onSuccess={kullanicilariYukle}
        />
      )}

      {duzenlenecekKullanici && (
        <KullaniciEditModal
          kullanici={duzenlenecekKullanici}
          onClose={() => setDuzenlenecekKullanici(null)}
          onSuccess={kullanicilariYukle}
        />
      )}

      {sifreDegisecekKullanici && (
        <KullaniciSifreModal
          kullanici={sifreDegisecekKullanici}
          onClose={() => setSifreDegisecekKullanici(null)}
        />
      )}
    </>
  );
}