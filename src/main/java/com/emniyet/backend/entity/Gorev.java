package com.emniyet.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "gorevler")
public class Gorev {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gorev_turu_id", nullable = false)
    private GorevTuru gorevTuru;

    @ManyToOne
    @JoinColumn(name = "birim_id", nullable = false)
    private Birim birim;

    @Column(nullable = false)
    private LocalDate tarih;

    private LocalTime baslangicSaati;

    private LocalTime bitisSaati;

    private String aciklama;

    @Column(nullable = false)
    private Boolean aktif = true;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GorevTuru getGorevTuru() {
        return gorevTuru;
    }

    public void setGorevTuru(GorevTuru gorevTuru) {
        this.gorevTuru = gorevTuru;
    }

    public Birim getBirim() {
        return birim;
    }

    public void setBirim(Birim birim) {
        this.birim = birim;
    }

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

    public Boolean getAktif() {
        return aktif;
    }

    public void setAktif(Boolean aktif) {
        this.aktif = aktif;
    }
}