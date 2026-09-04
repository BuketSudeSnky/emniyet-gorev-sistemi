package com.emniyet.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GorevTuruRequest {

    @NotBlank(message = "Görev türü adı boş bırakılamaz")
    @Size(
            max = 100,
            message = "Görev türü adı en fazla 100 karakter olabilir"
    )
    private String ad;

    @Size(
            max = 500,
            message = "Açıklama en fazla 500 karakter olabilir"
    )
    private String aciklama;

    public String getAd() {
        return ad;
    }

    public void setAd(String ad) {
        this.ad = ad;
    }

    public String getAciklama() {
        return aciklama;
    }

    public void setAciklama(String aciklama) {
        this.aciklama = aciklama;
    }
}