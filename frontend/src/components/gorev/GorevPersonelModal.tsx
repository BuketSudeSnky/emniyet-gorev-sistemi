import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import type { Gorev } from "../../api/gorev";

import {
  getGoreveAtananPersoneller,
  personeliGorevdenCikar,
  personelleriGoreveAta,
  type GorevPersonel,
} from "../../api/gorevPersonel";

import {
  getPersoneller,
} from "../../api/personel";

import type { Personel } from "../../types/personel";

import { getErrorMessage } from "../../utils/getErrorMessage";

import Button from "../ui/Button";
import ConfirmModal from "../ui/ConfirmModal";

interface GorevPersonelModalProps {
  gorev: Gorev;
  onClose: () => void;
}

const GorevPersonelModal = ({
  gorev,
  onClose,
}: GorevPersonelModalProps) => {
  const [
    personeller,
    setPersoneller,
  ] = useState<Personel[]>([]);

  const [
    atananPersoneller,
    setAtananPersoneller,
  ] = useState<GorevPersonel[]>([]);

  const [
    seciliPersonelIdleri,
    setSeciliPersonelIdleri,
  ] = useState<number[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    islemYapiliyor,
    setIslemYapiliyor,
  ] = useState(false);

  const [
    gorevdenCikarilacakPersonel,
    setGorevdenCikarilacakPersonel,
  ] = useState<Personel | null>(null);

  /*
   * Göreve atanmış personelleri ve
   * kullanılabilir personel listesini yükler.
   */
  const loadData = useCallback(
    async () => {
      try {
        const [
          personelData,
          atamaData,
        ] = await Promise.all([
          getPersoneller(),

          getGoreveAtananPersoneller(
            gorev.id
          ),
        ]);

        setPersoneller(
          personelData
        );

        setAtananPersoneller(
          atamaData
        );
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Personel bilgileri yüklenirken bir hata oluştu."
          ),
          {
            id: "gorev-personel-yukleme-hatasi",
          }
        );
      } finally {
        setLoading(false);
      }
    },
    [gorev.id]
  );

  /*
   * Modal açıldığında verileri yükler.
   */
  useEffect(() => {
    let aktif = true;

    const fetchData = async () => {
      try {
        const [
          personelData,
          atamaData,
        ] = await Promise.all([
          getPersoneller(),
          getGoreveAtananPersoneller(
            gorev.id
          ),
        ]);

        if (!aktif) {
          return;
        }

        setPersoneller(
          personelData
        );

        setAtananPersoneller(
          atamaData
        );
      } catch (error) {
        if (!aktif) {
          return;
        }

        toast.error(
          getErrorMessage(
            error,
            "Personel bilgileri yüklenirken bir hata oluştu."
          ),
          {
            id: "gorev-personel-ilk-yukleme-hatasi",
          }
        );
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      aktif = false;
    };
  }, [gorev.id]);

  /*
   * Göreve zaten atanmış personellerin
   * ID listesini oluşturuyoruz.
   */
  const atanmisPersonelIdleri =
    useMemo(
      () =>
        atananPersoneller.map(
          (atama) =>
            atama.personel.id
        ),
      [atananPersoneller]
    );

  /*
   * Personel atama listesinde:
   *
   * - aktif personel
   * - görevle aynı birimdeki personel
   * - henüz bu göreve atanmamış personel
   *
   * gösterilir.
   */
  const uygunPersoneller =
    useMemo(
      () =>
        personeller.filter(
          (personel) =>
            personel.aktif &&
            personel.birim.id ===
              gorev.birim.id &&
            !atanmisPersonelIdleri.includes(
              personel.id
            )
        ),
      [
        personeller,
        gorev.birim.id,
        atanmisPersonelIdleri,
      ]
    );

  /*
   * Checkbox seçimi.
   */
  const handleCheckboxChange = (
    personelId: number
  ) => {
    setSeciliPersonelIdleri(
      (onceki) =>
        onceki.includes(
          personelId
        )
          ? onceki.filter(
              (id) =>
                id !==
                personelId
            )
          : [
              ...onceki,
              personelId,
            ]
    );
  };

  /*
   * Seçilen personelleri göreve atar.
   */
  const handleAta = async () => {
    if (
      seciliPersonelIdleri.length ===
      0
    ) {
      toast.error(
        "En az bir personel seçmelisiniz."
      );

      return;
    }

    try {
      setIslemYapiliyor(true);

      await personelleriGoreveAta(
        gorev.id,
        seciliPersonelIdleri
      );

      const atananKisiSayisi =
        seciliPersonelIdleri.length;

      setSeciliPersonelIdleri(
        []
      );

      await loadData();

      toast.success(
        `${atananKisiSayisi} personel göreve atandı.`
      );
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Personel göreve atanırken bir hata oluştu."
        )
      );
    } finally {
      setIslemYapiliyor(false);
    }
  };

  /*
   * ConfirmModal onayından sonra personeli
   * görevden çıkarır.
   */
  const handleGorevdenCikar =
    async () => {
      if (
        !gorevdenCikarilacakPersonel
      ) {
        return;
      }

      try {
        setIslemYapiliyor(true);

        await personeliGorevdenCikar(
          gorev.id,
          gorevdenCikarilacakPersonel.id
        );

        toast.success(
          `${gorevdenCikarilacakPersonel.ad} ${gorevdenCikarilacakPersonel.soyad} görevden çıkarıldı.`
        );

        setGorevdenCikarilacakPersonel(
          null
        );

        await loadData();
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Personel görevden çıkarılırken bir hata oluştu."
          )
        );
      } finally {
        setIslemYapiliyor(false);
      }
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* BAŞLIK */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Görev Personelleri
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  gorev.gorevTuru
                    .ad
                }{" "}
                -{" "}
                {
                  gorev.birim
                    .ad
                }
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Tarih:{" "}
                {gorev.tarih}
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={
                onClose
              }
              disabled={
                islemYapiliyor
              }
            >
              Kapat
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Personeller yükleniyor...
            </div>
          ) : (
            <>
              {/* ATANMIŞ PERSONELLER */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Göreve Atanmış Personeller
                </h3>

                {atananPersoneller.length ===
                0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Bu göreve henüz personel atanmadı.
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            Sicil No
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            Ad Soyad
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            Birim
                          </th>

                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                            İşlem
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 bg-white">
                        {atananPersoneller.map(
                          (
                            atama
                          ) => (
                            <tr
                              key={
                                atama.id
                              }
                            >
                              <td className="px-4 py-3 text-sm text-slate-700">
                                {
                                  atama
                                    .personel
                                    .sicilNo
                                }
                              </td>

                              <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                {
                                  atama
                                    .personel
                                    .ad
                                }{" "}
                                {
                                  atama
                                    .personel
                                    .soyad
                                }
                              </td>

                              <td className="px-4 py-3 text-sm text-slate-700">
                                {
                                  atama
                                    .personel
                                    .birim
                                    .ad
                                }
                              </td>

                              <td className="px-4 py-3">
                                <Button
                                  type="button"
                                  variant="danger"
                                  disabled={
                                    islemYapiliyor
                                  }
                                  onClick={() =>
                                    setGorevdenCikarilacakPersonel(
                                      atama.personel
                                    )
                                  }
                                >
                                  Görevden Çıkar
                                </Button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* PERSONEL ATA */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Personel Ata
                </h3>

                {uygunPersoneller.length ===
                0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Atanabilecek uygun personel bulunamadı.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                              Seç
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                              Sicil No
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                              Ad Soyad
                            </th>

                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                              Birim
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-200 bg-white">
                          {uygunPersoneller.map(
                            (
                              personel
                            ) => (
                              <tr
                                key={
                                  personel.id
                                }
                              >
                                <td className="px-4 py-3">
                                  <input
                                    type="checkbox"
                                    checked={seciliPersonelIdleri.includes(
                                      personel.id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(
                                        personel.id
                                      )
                                    }
                                    disabled={
                                      islemYapiliyor
                                    }
                                    className="h-4 w-4 rounded border-slate-300"
                                  />
                                </td>

                                <td className="px-4 py-3 text-sm text-slate-700">
                                  {
                                    personel.sicilNo
                                  }
                                </td>

                                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                  {
                                    personel.ad
                                  }{" "}
                                  {
                                    personel.soyad
                                  }
                                </td>

                                <td className="px-4 py-3 text-sm text-slate-700">
                                  {
                                    personel
                                      .birim
                                      .ad
                                  }
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        loading={
                          islemYapiliyor
                        }
                        disabled={
                          seciliPersonelIdleri.length ===
                          0
                        }
                        onClick={() =>
                          void handleAta()
                        }
                      >
                        Seçilen Personelleri Ata
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {gorevdenCikarilacakPersonel && (
        <ConfirmModal
          title="Personeli Görevden Çıkar"
          message={`${gorevdenCikarilacakPersonel.ad} ${gorevdenCikarilacakPersonel.soyad} isimli personeli görevden çıkarmak istediğinize emin misiniz?`}
          confirmText="Görevden Çıkar"
          cancelText="İptal"
          loading={
            islemYapiliyor
          }
          onConfirm={
            handleGorevdenCikar
          }
          onCancel={() =>
            setGorevdenCikarilacakPersonel(
              null
            )
          }
        />
      )}
    </div>
  );
};

export default GorevPersonelModal;