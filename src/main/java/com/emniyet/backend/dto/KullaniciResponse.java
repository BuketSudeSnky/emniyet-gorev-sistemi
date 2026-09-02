package com.emniyet.backend.dto;

import com.emniyet.backend.enums.Rol;

public class KullaniciResponse {

    private Long id;
    private String kullaniciAdi;
    private Rol rol;
    private Boolean aktif;
    private Long birimId;
    private String birimAdi;

    public KullaniciResponse(
            Long id,
            String kullaniciAdi,
            Rol rol,
            Boolean aktif,
            Long birimId,
            String birimAdi) {

        this.id = id;
        this.kullaniciAdi = kullaniciAdi;
        this.rol = rol;
        this.aktif = aktif;
        this.birimId = birimId;
        this.birimAdi = birimAdi;
    }

    public Long getId() {
        return id;
    }

    public String getKullaniciAdi() {
        return kullaniciAdi;
    }

    public Rol getRol() {
        return rol;
    }

    public Boolean getAktif() {
        return aktif;
    }

    public Long getBirimId() {
        return birimId;
    }

    public String getBirimAdi() {
        return birimAdi;
    }
}