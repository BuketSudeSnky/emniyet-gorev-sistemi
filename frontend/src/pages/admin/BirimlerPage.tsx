import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getBirimler,
  pasifeAlBirim,
  type Birim,
} from "../../api/birim";

import BirimFormModal from "../../components/birim/BirimFormModal";
import BirimEditModal from "../../components/birim/BirimEditModal";

import Button from "../../components/ui/Button";
import ConfirmModal from "../../components/ui/ConfirmModal";

import { getErrorMessage } from "../../utils/getErrorMessage";

const BirimlerPage = () => {
  const [birimler, setBirimler] = useState<Birim[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBirimForm, setShowBirimForm] =
    useState(false);

  const [editingBirim, setEditingBirim] =
    useState<Birim | null>(null);

  const [pasifeAlinacakBirim, setPasifeAlinacakBirim] =
    useState<Birim | null>(null);

  const [pasifeAlLoading, setPasifeAlLoading] =
    useState(false);

  const [arama, setArama] = useState("");

  const [durum, setDurum] =
    useState<"" | "aktif" | "pasif">("");

  const loadBirimler = async () => {
    try {
      setLoading(true);

      const data = await getBirimler();

      setBirimler(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Birimler alınırken bir hata oluştu."
        ),
        {
          id: "birimler-yukleme-hatasi",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBirimler = async () => {
      try {
        setLoading(true);

        const data = await getBirimler();

        setBirimler(data);
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Birimler alınırken bir hata oluştu."
          ),
          {
            id: "birimler-ilk-yukleme-hatasi",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchBirimler();
  }, []);

  const handlePasifeAl = async () => {
    if (!pasifeAlinacakBirim) {
      return;
    }

    try {
      setPasifeAlLoading(true);

      await pasifeAlBirim(
        pasifeAlinacakBirim.id
      );

      toast.success(
        `${pasifeAlinacakBirim.ad} birimi pasife alındı.`
      );

      setPasifeAlinacakBirim(null);

      await loadBirimler();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Birim pasife alınırken bir hata oluştu."
        )
      );
    } finally {
      setPasifeAlLoading(false);
    }
  };

  const handleFiltreleriTemizle = () => {
    setArama("");
    setDurum("");
  };

  const filtrelenmisBirimler = birimler.filter(
    (birim) => {
      const adEslesiyor = birim.ad
        .toLocaleLowerCase("tr-TR")
        .includes(
          arama
            .trim()
            .toLocaleLowerCase("tr-TR")
        );

      const durumEslesiyor =
        durum === "" ||
        (durum === "aktif" &&
          birim.aktif) ||
        (durum === "pasif" &&
          !birim.aktif);

      return adEslesiyor && durumEslesiyor;
    }
  );

  return (
    <div className="p-6">
      {/* Sayfa başlığı */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Birimler
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistemde kayıtlı birimleri görüntüleyebilir,
            filtreleyebilir ve yönetebilirsiniz.
          </p>
        </div>

        <Button
          onClick={() =>
            setShowBirimForm(true)
          }
        >
          + Yeni Birim Ekle
        </Button>
      </div>

      {/* Filtre paneli */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Birim Filtreleri
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Birim adına ve aktiflik durumuna göre filtreleme
            yapabilirsiniz.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Birim adı */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Birim Adı
            </label>

            <input
              type="text"
              value={arama}
              onChange={(e) =>
                setArama(e.target.value)
              }
              placeholder="Birim ara..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Durum */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
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
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            variant="secondary"
            onClick={
              handleFiltreleriTemizle
            }
          >
            Temizle
          </Button>
        </div>
      </div>

      {/* Birimler tablosu */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Birimler yükleniyor...
          </div>
        ) : filtrelenmisBirimler.length ===
          0 ? (
          <div className="p-6 text-sm text-slate-500">
            {arama || durum
              ? "Arama kriterlerine uygun birim bulunamadı."
              : "Kayıtlı birim bulunamadı."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    ID
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Birim Adı
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Durum
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtrelenmisBirimler.map(
                  (birim) => (
                    <tr
                      key={birim.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-slate-700">
                        {birim.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        {birim.ad}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            birim.aktif
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {birim.aktif
                            ? "Aktif"
                            : "Pasif"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingBirim(
                                birim
                              )
                            }
                            className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                          >
                            Düzenle
                          </button>

                          {birim.aktif && (
                            <button
                              type="button"
                              onClick={() =>
                                setPasifeAlinacakBirim(
                                  birim
                                )
                              }
                              className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                            >
                              Pasife Al
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Yeni birim ekleme modalı */}
      {showBirimForm && (
        <BirimFormModal
          onClose={() =>
            setShowBirimForm(false)
          }
          onSuccess={loadBirimler}
        />
      )}

      {/* Birim düzenleme modalı */}
      {editingBirim && (
        <BirimEditModal
          birim={editingBirim}
          onClose={() =>
            setEditingBirim(null)
          }
          onSuccess={loadBirimler}
        />
      )}

      {/* Birim pasife alma onay modalı */}
      {pasifeAlinacakBirim && (
        <ConfirmModal
          title="Birimi Pasife Al"
          message={`${pasifeAlinacakBirim.ad} birimini pasife almak istediğinize emin misiniz?`}
          confirmText="Pasife Al"
          cancelText="İptal"
          loading={pasifeAlLoading}
          onConfirm={handlePasifeAl}
          onCancel={() =>
            setPasifeAlinacakBirim(null)
          }
        />
      )}
    </div>
  );
};

export default BirimlerPage;