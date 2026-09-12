import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getGorevler,
  pasifeAlGorev,
  type Gorev,
} from "../api/gorev";

import {
  getBirimler,
  type Birim,
} from "../api/birim";

import {
  getGorevTurleri,
  type GorevTuru,
} from "../api/gorevTuru";

import { getAuth } from "../utils/authStorage";
import { getErrorMessage } from "../utils/getErrorMessage";

import GorevFormModal from "../components/gorev/GorevFormModal";
import GorevEditModal from "../components/gorev/GorevEditModal";
import GorevPersonelModal from "../components/gorev/GorevPersonelModal";

import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";

const GorevlerPage = () => {
  const [gorevler, setGorevler] =
    useState<Gorev[]>([]);

  const [birimler, setBirimler] =
    useState<Birim[]>([]);

  const [gorevTurleri, setGorevTurleri] =
    useState<GorevTuru[]>([]);

  const [loading, setLoading] =
    useState(true);

  // Filtreler
  const [tarih, setTarih] =
    useState("");

  const [birimId, setBirimId] =
    useState("");

  const [gorevTuruId, setGorevTuruId] =
    useState("");

  const [durum, setDurum] =
    useState<"" | "aktif" | "pasif">("");

  // Yeni görev modalı
  const [showGorevForm, setShowGorevForm] =
    useState(false);

  // Düzenlenecek görev
  const [
    duzenlenecekGorev,
    setDuzenlenecekGorev,
  ] = useState<Gorev | null>(null);

  // Personel işlemi yapılacak görev
  const [
    personelGorev,
    setPersonelGorev,
  ] = useState<Gorev | null>(null);

  // Pasife alınacak görev
  const [
    pasifeAlinacakGorev,
    setPasifeAlinacakGorev,
  ] = useState<Gorev | null>(null);

  const [
    pasifeAlLoading,
    setPasifeAlLoading,
  ] = useState(false);

  const auth = getAuth();

  /*
   * Görevleri tekrar yüklemek için kullanıyoruz.
   * Yeni görev eklendikten, görev güncellendikten
   * veya pasife alındıktan sonra tablo yenilenir.
   */
  const loadGorevler = async () => {
    try {
      const data = await getGorevler();

      setGorevler(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Görevler yüklenirken bir hata oluştu."
        ),
        {
          id: "gorevler-yukleme-hatasi",
        }
      );
    }
  };

  /*
   * Sayfa ilk açıldığında gerekli verileri yüklüyoruz.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        /*
         * Görevler ve görev türleri
         * iki rol tarafından da okunabilir.
         */
        const [
          gorevData,
          gorevTuruData,
        ] = await Promise.all([
          getGorevler(),
          getGorevTurleri(),
        ]);

        setGorevler(gorevData);
        setGorevTurleri(gorevTuruData);

        /*
         * ADMIN tüm birimleri backend'den alır.
         */
        if (auth?.rol === "ADMIN") {
          const birimData =
            await getBirimler();

          setBirimler(birimData);
        }

        /*
         * BIRIM_YETKILISI ise tüm birimleri
         * çekmez. Sadece kendi birimini kullanır.
         */
        if (
          auth?.rol === "BIRIM_YETKILISI" &&
          auth.birimId &&
          auth.birimAdi
        ) {
          setBirimler([
            {
              id: auth.birimId,
              ad: auth.birimAdi,
              aktif: true,
            },
          ]);
        }
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Sayfa verileri yüklenirken bir hata oluştu."
          ),
          {
            id: "gorevler-ilk-yukleme-hatasi",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  /*
   * Filtreleme
   */
  const filtrelenmisGorevler =
    gorevler.filter((gorev) => {
      const tarihEslesiyor =
        tarih === "" ||
        gorev.tarih === tarih;

      const birimEslesiyor =
        birimId === "" ||
        gorev.birim.id ===
          Number(birimId);

      const gorevTuruEslesiyor =
        gorevTuruId === "" ||
        gorev.gorevTuru.id ===
          Number(gorevTuruId);

      const durumEslesiyor =
        durum === "" ||
        (durum === "aktif" &&
          gorev.aktif) ||
        (durum === "pasif" &&
          !gorev.aktif);

      return (
        tarihEslesiyor &&
        birimEslesiyor &&
        gorevTuruEslesiyor &&
        durumEslesiyor
      );
    });

  const saatiFormatla = (
    saat: string | null
  ) => {
    if (!saat) {
      return "-";
    }

    return saat.substring(0, 5);
  };

  const filtreleriTemizle = () => {
    setTarih("");
    setBirimId("");
    setGorevTuruId("");
    setDurum("");
  };

  /*
   * ConfirmModal'da onay verildikten sonra
   * görev pasife alınır.
   */
  const handlePasifeAl = async () => {
    if (!pasifeAlinacakGorev) {
      return;
    }

    try {
      setPasifeAlLoading(true);

      await pasifeAlGorev(
        pasifeAlinacakGorev.id
      );

      toast.success(
        `"${pasifeAlinacakGorev.gorevTuru.ad}" görevi pasife alındı.`
      );

      setPasifeAlinacakGorev(null);

      await loadGorevler();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Görev pasife alınırken bir hata oluştu."
        )
      );
    } finally {
      setPasifeAlLoading(false);
    }
  };

  /*
   * Yeni görev oluştururken ve görev düzenlerken
   * pasif birim ve pasif görev türleri seçilmemeli.
   */
  const aktifBirimler =
    birimler.filter(
      (birim) => birim.aktif
    );

  const aktifGorevTurleri =
    gorevTurleri.filter(
      (gorevTuru) =>
        gorevTuru.aktif
    );

  return (
    <div className="space-y-6">
      {/* BAŞLIK */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Görevler
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistemde tanımlı görevleri
            görüntüleyebilirsiniz.
          </p>
        </div>

        <Button
          type="button"
          onClick={() =>
            setShowGorevForm(true)
          }
        >
          + Yeni Görev
        </Button>
      </div>

      {/* FİLTRELER */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Görev Filtreleri
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {/* TARİH */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tarih
            </label>

            <input
              type="date"
              value={tarih}
              onChange={(e) =>
                setTarih(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          {/* BİRİM */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Birim
            </label>

            <select
              value={birimId}
              onChange={(e) =>
                setBirimId(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                Tümü
              </option>

              {birimler.map(
                (birim) => (
                  <option
                    key={birim.id}
                    value={birim.id}
                  >
                    {birim.ad}
                  </option>
                )
              )}
            </select>
          </div>

          {/* GÖREV TÜRÜ */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Görev Türü
            </label>

            <select
              value={gorevTuruId}
              onChange={(e) =>
                setGorevTuruId(
                  e.target.value
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                Tümü
              </option>

              {gorevTurleri.map(
                (gorevTuru) => (
                  <option
                    key={gorevTuru.id}
                    value={
                      gorevTuru.id
                    }
                  >
                    {gorevTuru.ad}
                  </option>
                )
              )}
            </select>
          </div>

          {/* DURUM */}
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

          {/* TEMİZLE */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={
                filtreleriTemizle
              }
            >
              Temizle
            </Button>
          </div>
        </div>
      </div>

      {/* TABLO */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Tarih
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Başlangıç
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Bitiş
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Birim
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Görev Türü
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Açıklama
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Durum
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  İşlemler
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    Görevler yükleniyor...
                  </td>
                </tr>
              ) : filtrelenmisGorevler.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-8 text-center text-sm text-slate-500"
                  >
                    {tarih ||
                    birimId ||
                    gorevTuruId ||
                    durum
                      ? "Filtrelere uygun görev bulunamadı."
                      : "Kayıtlı görev bulunamadı."}
                  </td>
                </tr>
              ) : (
                filtrelenmisGorevler.map(
                  (gorev) => (
                    <tr
                      key={gorev.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {gorev.tarih}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {saatiFormatla(
                          gorev.baslangicSaati
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {saatiFormatla(
                          gorev.bitisSaati
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {gorev.birim.ad}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {
                          gorev
                            .gorevTuru
                            .ad
                        }
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {gorev.aciklama ||
                          "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            gorev.aktif
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {gorev.aktif
                            ? "Aktif"
                            : "Pasif"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {gorev.aktif ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                setDuzenlenecekGorev(
                                  gorev
                                )
                              }
                            >
                              Düzenle
                            </Button>

                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() =>
                                setPersonelGorev(
                                  gorev
                                )
                              }
                            >
                              Personeller
                            </Button>

                            <Button
                              type="button"
                              variant="danger"
                              onClick={() =>
                                setPasifeAlinacakGorev(
                                  gorev
                                )
                              }
                            >
                              Pasife Al
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            İşlem yok
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ GÖREV MODALI */}
      {showGorevForm && (
        <GorevFormModal
          birimler={aktifBirimler}
          gorevTurleri={
            aktifGorevTurleri
          }
          onClose={() =>
            setShowGorevForm(false)
          }
          onSuccess={
            loadGorevler
          }
        />
      )}

      {/* GÖREV DÜZENLEME MODALI */}
      {duzenlenecekGorev && (
        <GorevEditModal
          gorev={
            duzenlenecekGorev
          }
          birimler={
            aktifBirimler
          }
          gorevTurleri={
            aktifGorevTurleri
          }
          onClose={() =>
            setDuzenlenecekGorev(
              null
            )
          }
          onSuccess={
            loadGorevler
          }
        />
      )}

      {/* GÖREV PERSONEL MODALI */}
      {personelGorev && (
        <GorevPersonelModal
          gorev={
            personelGorev
          }
          onClose={() =>
            setPersonelGorev(
              null
            )
          }
        />
      )}

      {/* GÖREV PASİFE ALMA ONAY MODALI */}
      {pasifeAlinacakGorev && (
        <ConfirmModal
          title="Görevi Pasife Al"
          message={`"${pasifeAlinacakGorev.gorevTuru.ad}" görevini pasife almak istediğinize emin misiniz?`}
          confirmText="Pasife Al"
          cancelText="İptal"
          loading={
            pasifeAlLoading
          }
          onConfirm={
            handlePasifeAl
          }
          onCancel={() =>
            setPasifeAlinacakGorev(
              null
            )
          }
        />
      )}
    </div>
  );
};

export default GorevlerPage;