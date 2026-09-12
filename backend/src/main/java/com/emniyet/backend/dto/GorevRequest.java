package com.emniyet.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalTime;

public class GorevRequest {

    @NotNull(message = "Görev tarihi seçilmelidir")
    private LocalDate tarih;

    private LocalTime baslangicSaati;

    private LocalTime bitisSaati;

    @Size(
            max = 500,
            message = "Açıklama en fazla 500 karakter olabilir"
    )
    private String aciklama;

    public LocalDate getTarih() {
        return tarih;
    }

    public void setTarih(LocalDate tarih) {
        this.tarih = tarih;
    }

    public LocalTime getBaslangicSaati() {
        return baslangicSaati;
    }

    public void setBaslangicSaati(LocalTime baslangicSaati) {
        this.baslangicSaati = baslangicSaati;
    }

    public LocalTime getBitisSaati() {
        return bitisSaati;
    }

    public void setBitisSaati(LocalTime bitisSaati) {
        this.bitisSaati = bitisSaati;
    }

    public String getAciklama() {
        return aciklama;
    }

    public void setAciklama(String aciklama) {
        this.aciklama = aciklama;
    }
}