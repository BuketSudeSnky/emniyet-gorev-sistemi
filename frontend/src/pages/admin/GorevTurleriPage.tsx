import { useEffect, useState } from "react";
import axios from "axios";

import {
  getGorevTurleri,
  pasifeAlGorevTuru,
  type GorevTuru,
} from "../../api/gorevTuru";

import GorevTuruFormModal from "../../components/gorevTuru/GorevTuruFormModal";
import GorevTuruEditModal from "../../components/gorevTuru/GorevTuruEditModal";
import Button from "../../components/ui/Button";

const GorevTurleriPage = () => {
  const [gorevTurleri, setGorevTurleri] = useState<GorevTuru[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [arama, setArama] = useState("");
  const [durum, setDurum] = useState<"" | "aktif" | "pasif">("");

  const [showGorevTuruForm, setShowGorevTuruForm] = useState(false);

  const [editingGorevTuru, setEditingGorevTuru] =
    useState<GorevTuru | null>(null);

  const [pasifeAlLoadingId, setPasifeAlLoadingId] =
    useState<number | null>(null);

  const loadGorevTurleri = async () => {
    try {
      setError("");

      const data = await getGorevTurleri();
      setGorevTurleri(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Görev türleri yüklenirken bir hata oluştu."
        );
      } else {
        setError("Görev türleri yüklenirken bir hata oluştu.");
      }
    }
  };

  useEffect(() => {
    const fetchGorevTurleri = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getGorevTurleri();
        setGorevTurleri(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Görev türleri yüklenirken bir hata oluştu."
          );
        } else {
          setError("Görev türleri yüklenirken bir hata oluştu.");
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchGorevTurleri();
  }, []);

  const handlePasifeAl = async (gorevTuru: GorevTuru) => {
    const onay = window.confirm(
      `"${gorevTuru.ad}" görev türünü pasife almak istediğinize emin misiniz?`
    );

    if (!onay) {
      return;
    }

    try {
      setPasifeAlLoadingId(gorevTuru.id);
      setError("");

      await pasifeAlGorevTuru(gorevTuru.id);

      await loadGorevTurleri();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Görev türü pasife alınırken bir hata oluştu."
        );
      } else {
        setError(
          "Görev türü pasife alınırken bir hata oluştu."
        );
      }
    } finally {
      setPasifeAlLoadingId(null);
    }
  };

  const filtrelenmisGorevTurleri = gorevTurleri.filter(
    (gorevTuru) => {
      const adEslesiyor = gorevTuru.ad
        .toLocaleLowerCase("tr-TR")
        .includes(
          arama.trim().toLocaleLowerCase("tr-TR")
        );

      const durumEslesiyor =
        durum === "" ||
        (durum === "aktif" && gorevTuru.aktif) ||
        (durum === "pasif" && !gorevTuru.aktif);

      return adEslesiyor && durumEslesiyor;
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Görev Türleri
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistemde tanımlı görev türlerini
            görüntüleyebilirsiniz.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowGorevTuruForm(true)}
        >
          + Yeni Görev Türü
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Görev Türü Filtreleri
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Görev Türü Adı
            </label>

            <input
              type="text"
              value={arama}
              onChange={(e) => setArama(e.target.value)}
              placeholder="Görev türü ara..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Durum
            </label>

            <select
              value={durum}
              onChange={(e) =>
                setDurum(
                  e.target.value as
                    | ""
                    | "aktif"
                    | "pasif"
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Tümü</option>
              <option value="aktif">Aktif</option>
              <option value="pasif">Pasif</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => {
                setArama("");
                setDurum("");
              }}
            >
              Temizle
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Görev Türü
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Açıklama
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Durum
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  İşlemler
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Görev türleri yükleniyor...
                  </td>
                </tr>
              ) : filtrelenmisGorevTurleri.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    {arama || durum
                      ? "Arama kriterlerine uygun görev türü bulunamadı."
                      : "Kayıtlı görev türü bulunamadı."}
                  </td>
                </tr>
              ) : (
                filtrelenmisGorevTurleri.map(
                  (gorevTuru) => (
                    <tr
                      key={gorevTuru.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {gorevTuru.ad}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {gorevTuru.aciklama || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            gorevTuru.aktif
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {gorevTuru.aktif
                            ? "Aktif"
                            : "Pasif"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              setEditingGorevTuru(
                                gorevTuru
                              )
                            }
                          >
                            Düzenle
                          </Button>

                          {gorevTuru.aktif && (
                            <Button
                              type="button"
                              variant="danger"
                              loading={
                                pasifeAlLoadingId ===
                                gorevTuru.id
                              }
                              onClick={() =>
                                void handlePasifeAl(
                                  gorevTuru
                                )
                              }
                            >
                              Pasife Al
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showGorevTuruForm && (
        <GorevTuruFormModal
          onClose={() =>
            setShowGorevTuruForm(false)
          }
          onSuccess={loadGorevTurleri}
        />
      )}

      {editingGorevTuru && (
        <GorevTuruEditModal
          gorevTuru={editingGorevTuru}
          onClose={() =>
            setEditingGorevTuru(null)
          }
          onSuccess={loadGorevTurleri}
        />
      )}
    </div>
  );
};

export default GorevTurleriPage;