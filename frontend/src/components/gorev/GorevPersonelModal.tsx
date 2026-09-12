import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

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

import Button from "../ui/Button";

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
    error,
    setError,
  ] = useState("");

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

        setError("");
      } catch (err) {
        if (
          axios.isAxiosError(
            err
          )
        ) {
          setError(
            err.response?.data
              ?.message ||
              "Personel bilgileri yüklenirken bir hata oluştu."
          );
        } else {
          setError(
            "Personel bilgileri yüklenirken bir hata oluştu."
          );
        }
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

  Promise.all([
    getPersoneller(),
    getGoreveAtananPersoneller(gorev.id),
  ])
    .then(([personelData, atamaData]) => {
      if (!aktif) {
        return;
      }

      setPersoneller(personelData);
      setAtananPersoneller(atamaData);
      setError("");
      setLoading(false);
    })
    .catch((err) => {
      if (!aktif) {
        return;
      }

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Personel bilgileri yüklenirken bir hata oluştu."
        );
      } else {
        setError(
          "Personel bilgileri yüklenirken bir hata oluştu."
        );
      }

      setLoading(false);
    });

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
  const handleAta =
    async () => {
      if (
        seciliPersonelIdleri.length ===
        0
      ) {
        setError(
          "En az bir personel seçmelisiniz."
        );

        return;
      }

      try {
        setIslemYapiliyor(
          true
        );

        setError("");

        await personelleriGoreveAta(
          gorev.id,
          seciliPersonelIdleri
        );

        setSeciliPersonelIdleri(
          []
        );

        await loadData();
      } catch (err) {
        if (
          axios.isAxiosError(
            err
          )
        ) {
          setError(
            err.response?.data
              ?.message ||
              "Personel göreve atanırken bir hata oluştu."
          );
        } else {
          setError(
            "Personel göreve atanırken bir hata oluştu."
          );
        }
      } finally {
        setIslemYapiliyor(
          false
        );
      }
    };

  /*
   * Atanmış personeli görevden çıkarır.
   */
  const handleGorevdenCikar =
    async (
      personel: Personel
    ) => {
      const onay =
        window.confirm(
          `${personel.ad} ${personel.soyad} isimli personeli görevden çıkarmak istediğinize emin misiniz?`
        );

      if (!onay) {
        return;
      }

      try {
        setIslemYapiliyor(
          true
        );

        setError("");

        await personeliGorevdenCikar(
          gorev.id,
          personel.id
        );

        await loadData();
      } catch (err) {
        if (
          axios.isAxiosError(
            err
          )
        ) {
          setError(
            err.response?.data
              ?.message ||
              "Personel görevden çıkarılırken bir hata oluştu."
          );
        } else {
          setError(
            "Personel görevden çıkarılırken bir hata oluştu."
          );
        }
      } finally {
        setIslemYapiliyor(
          false
        );
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
            >
              Kapat
            </Button>
          </div>
        </div>

        <div className="space-y-6 p-6">

          {/* HATA */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Personeller
              yükleniyor...
            </div>
          ) : (
            <>
              {/* ATANMIŞ PERSONELLER */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-900">
                  Göreve Atanmış
                  Personeller
                </h3>

                {atananPersoneller.length ===
                0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Bu göreve henüz
                    personel
                    atanmadı.
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
                                    void handleGorevdenCikar(
                                      atama.personel
                                    )
                                  }
                                >
                                  Görevden
                                  Çıkar
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
                    Atanabilecek
                    uygun personel
                    bulunamadı.
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
                        Seçilen
                        Personelleri Ata
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GorevPersonelModal;