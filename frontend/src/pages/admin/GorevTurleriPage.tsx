import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getGorevTurleri,
  pasifeAlGorevTuru,
  type GorevTuru,
} from "../../api/gorevTuru";

import GorevTuruFormModal from "../../components/gorevTuru/GorevTuruFormModal";
import GorevTuruEditModal from "../../components/gorevTuru/GorevTuruEditModal";

import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";

import { getErrorMessage } from "../../utils/getErrorMessage";

const GorevTurleriPage = () => {
  const [gorevTurleri, setGorevTurleri] = useState<GorevTuru[]>([]);
  const [loading, setLoading] = useState(true);

  const [arama, setArama] = useState("");
  const [durum, setDurum] =
    useState<"" | "aktif" | "pasif">("");

  const [showGorevTuruForm, setShowGorevTuruForm] =
    useState(false);

  const [editingGorevTuru, setEditingGorevTuru] =
    useState<GorevTuru | null>(null);

  const [pasifeAlinacakGorevTuru, setPasifeAlinacakGorevTuru] =
    useState<GorevTuru | null>(null);

  const [pasifeAlLoading, setPasifeAlLoading] =
    useState(false);

  const loadGorevTurleri = async () => {
    try {
      const data = await getGorevTurleri();

      setGorevTurleri(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Görev türleri yüklenirken bir hata oluştu."
        ),
        {
          id: "gorev-turleri-yukleme-hatasi",
        }
      );
    }
  };

  useEffect(() => {
    const fetchGorevTurleri = async () => {
      try {
        setLoading(true);

        const data = await getGorevTurleri();

        setGorevTurleri(data);
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Görev türleri yüklenirken bir hata oluştu."
          ),
          {
            id: "gorev-turleri-ilk-yukleme-hatasi",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchGorevTurleri();
  }, []);

  const handlePasifeAl = async () => {
    if (!pasifeAlinacakGorevTuru) {
      return;
    }

    try {
      setPasifeAlLoading(true);

      await pasifeAlGorevTuru(
        pasifeAlinacakGorevTuru.id
      );

      toast.success(
        `${pasifeAlinacakGorevTuru.ad} görev türü pasife alındı.`
      );

      setPasifeAlinacakGorevTuru(null);

      await loadGorevTurleri();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Görev türü pasife alınırken bir hata oluştu."
        )
      );
    } finally {
      setPasifeAlLoading(false);
    }
  };

  const filtrelenmisGorevTurleri = gorevTurleri.filter(
    (gorevTuru) => {
      const adEslesiyor = gorevTuru.ad
        .toLocaleLowerCase("tr-TR")
        .includes(
          arama
            .trim()
            .toLocaleLowerCase("tr-TR")
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
      {/* Sayfa başlığı */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Görev Türleri
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistemde tanımlı görev türlerini görüntüleyebilirsiniz.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            setShowGorevTuruForm(true)
          }
        >
          + Yeni Görev Türü
        </Button>
      </div>

      {/* Filtreler */}
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
              onChange={(e) =>
                setArama(e.target.value)
              }
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
              <option value="">
                Tümü
              </option>

              <option value="aktif">
                Aktif
              </option>

              <option value="pasif">
                Pasif
              </option>
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

      {/* Görev türleri tablosu */}
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
              ) : filtrelenmisGorevTurleri.length === 0 ? (
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
                              onClick={() =>
                                setPasifeAlinacakGorevTuru(
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

      {/* Yeni görev türü modalı */}
      {showGorevTuruForm && (
        <GorevTuruFormModal
          onClose={() =>
            setShowGorevTuruForm(false)
          }
          onSuccess={loadGorevTurleri}
        />
      )}

      {/* Görev türü düzenleme modalı */}
      {editingGorevTuru && (
        <GorevTuruEditModal
          gorevTuru={editingGorevTuru}
          onClose={() =>
            setEditingGorevTuru(null)
          }
          onSuccess={loadGorevTurleri}
        />
      )}

      {/* Görev türü pasife alma onay modalı */}
      {pasifeAlinacakGorevTuru && (
        <ConfirmModal
          title="Görev Türünü Pasife Al"
          message={`"${pasifeAlinacakGorevTuru.ad}" görev türünü pasife almak istediğinize emin misiniz?`}
          confirmText="Pasife Al"
          cancelText="İptal"
          loading={pasifeAlLoading}
          onConfirm={handlePasifeAl}
          onCancel={() =>
            setPasifeAlinacakGorevTuru(null)
          }
        />
      )}
    </div>
  );
};

export default GorevTurleriPage;