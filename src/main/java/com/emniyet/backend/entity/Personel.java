package com.emniyet.backend.entity;

import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.enums.KanGrubu;
import jakarta.persistence.*;

@Entity
@Table(name = "personeller")
public class Personel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ad;

    @Column(nullable = false)
    private String soyad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cinsiyet cinsiyet;

    @Column(nullable = false)
    private String telefon;

    @Column(unique = true)
    private String sicilNo;

    @Column(nullable = false)
    private Boolean aktif = true;

    @ManyToOne
    @JoinColumn(name = "birim_id", nullable = false)
    private Birim birim;

    @Enumerated(EnumType.STRING)
    @Column(name = "kan_grubu", nullable = false)
    private KanGrubu kanGrubu;

    @Column(nullable = false, length = 26)
    private String iban;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAd() {
        return ad;
    }

    public void setAd(String ad) {
        this.ad = ad;
    }

    public String getSoyad() {
        return soyad;
    }

    public void setSoyad(String soyad) {
        this.soyad = soyad;
    }

    public Cinsiyet getCinsiyet() {
        return cinsiyet;
    }

    public void setCinsiyet(Cinsiyet cinsiyet) {
        this.cinsiyet = cinsiyet;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public String getSicilNo() {
        return sicilNo;
    }

    public void setSicilNo(String sicilNo) {
        this.sicilNo = sicilNo;
    }

    public Boolean getAktif() {
        return aktif;
    }

    public void setAktif(Boolean aktif) {
        this.aktif = aktif;
    }

    public Birim getBirim() {
        return birim;
    }

    public void setBirim(Birim birim) {
        this.birim = birim;
    }

    public KanGrubu getKanGrubu() {
        return kanGrubu;
    }

    public void setKanGrubu(KanGrubu kanGrubu) {
        this.kanGrubu = kanGrubu;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }
}