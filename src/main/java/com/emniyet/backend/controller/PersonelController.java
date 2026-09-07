package com.emniyet.backend.controller;

import com.emniyet.backend.dto.PersonelRequest;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.enums.KanGrubu;
import com.emniyet.backend.enums.Rol;
import com.emniyet.backend.service.KullaniciService;
import com.emniyet.backend.service.PersonelService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/personeller")
public class PersonelController {

    private final PersonelService personelService;
    private final KullaniciService kullaniciService;

    public PersonelController(
            PersonelService personelService,
            KullaniciService kullaniciService) {

        this.personelService = personelService;
        this.kullaniciService = kullaniciService;
    }

    // Tüm aktif personelleri getir
    // ADMIN -> tüm birimler
    // BIRIM_YETKILISI -> sadece kendi birimi
    @GetMapping
    public List<Personel> tumPersonelleriGetir(
            Authentication authentication) {

        Kullanici kullanici =
                kullaniciService.aktifKullaniciyiGetir(
                        authentication.getName()
                );

        if (kullanici.getRol() == Rol.ADMIN) {
            return personelService.tumPersonelleriGetir();
        }

        Long birimId = kullanici.getBirim().getId();

        return personelService
                .birimeGorePersonelleriGetir(birimId);
    }

    // Personel ekle
    @PostMapping
    public Personel personelEkle(
            @Valid @RequestBody PersonelRequest request,
            @RequestParam Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        Personel personel = new Personel();

        personel.setAd(request.getAd());
        personel.setSoyad(request.getSoyad());
        personel.setCinsiyet(request.getCinsiyet());
        personel.setSicilNo(request.getSicilNo());
        personel.setTelefon(request.getTelefon());
        personel.setKanGrubu(request.getKanGrubu());
        personel.setIban(request.getIban());

        return personelService.personelEkle(
                personel,
                birimId
        );
    }

    // Personel güncelle
    @PutMapping("/{id}")
    public Personel personelGuncelle(
            @PathVariable Long id,
            @Valid @RequestBody PersonelRequest request,
            @RequestParam Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Personel mevcutPersonel =
                personelService.idIlePersonelGetir(id);

        // Kullanıcı mevcut personelin biriminde işlem
        // yapmaya yetkili mi?
        birimYetkisiniKontrolEt(
                kullanici,
                mevcutPersonel.getBirim().getId()
        );

        // Personel yeni birime geçiriliyorsa kullanıcı
        // hedef birim üzerinde de yetkili mi?
        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        Personel personel = new Personel();

        personel.setAd(request.getAd());
        personel.setSoyad(request.getSoyad());
        personel.setCinsiyet(request.getCinsiyet());
        personel.setSicilNo(request.getSicilNo());
        personel.setTelefon(request.getTelefon());
        personel.setKanGrubu(request.getKanGrubu());
        personel.setIban(request.getIban());

        return personelService.personelGuncelle(
                id,
                personel,
                birimId
        );
    }

    // Personeli pasife al
    @DeleteMapping("/{id}")
    public Personel personelPasifeAl(
            @PathVariable Long id,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Personel mevcutPersonel =
                personelService.idIlePersonelGetir(id);

        birimYetkisiniKontrolEt(
                kullanici,
                mevcutPersonel.getBirim().getId()
        );

        return personelService.personelPasifeAl(id);
    }

    // Birime göre aktif personelleri getir
    @GetMapping("/birim/{birimId}")
    public List<Personel> birimeGorePersonelleriGetir(
            @PathVariable Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        return personelService
                .birimeGorePersonelleriGetir(birimId);
    }

    // Gelişmiş personel filtreleme
    @GetMapping("/filtrele")
    public List<Personel> personelFiltrele(
            @RequestParam(required = false) String ad,
            @RequestParam(required = false) String soyad,
            @RequestParam(required = false) String sicilNo,
            @RequestParam(required = false) String telefon,
            @RequestParam(required = false) Cinsiyet cinsiyet,
            @RequestParam(required = false) KanGrubu kanGrubu,
            @RequestParam(required = false) Long birimId,
            @RequestParam(required = false) Boolean aktif,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Long kullanilacakBirimId;

        /*
         * ADMIN isterse herhangi bir birime göre filtreleyebilir.
         *
         * BIRIM_YETKILISI ise URL üzerinden başka bir birimId
         * gönderse bile sadece kendi birimindeki personelleri
         * filtreleyebilir.
         */
        if (kullanici.getRol() == Rol.ADMIN) {
            kullanilacakBirimId = birimId;
        } else {
            kullanilacakBirimId =
                    kullanici.getBirim().getId();
        }

        return personelService.personelFiltrele(
                ad,
                soyad,
                sicilNo,
                telefon,
                cinsiyet,
                kanGrubu,
                kullanilacakBirimId,
                aktif
        );
    }

    // Aktif kullanıcıyı getir
    private Kullanici aktifKullanici(
            Authentication authentication) {

        return kullaniciService.aktifKullaniciyiGetir(
                authentication.getName()
        );
    }

    // Birim yetki kontrolü
    private void birimYetkisiniKontrolEt(
            Kullanici kullanici,
            Long birimId) {

        // ADMIN tüm birimlerde işlem yapabilir
        if (kullanici.getRol() == Rol.ADMIN) {
            return;
        }

        // Birim yetkilisi yalnızca kendi biriminde işlem yapabilir
        if (kullanici.getBirim() == null ||
                !kullanici.getBirim()
                        .getId()
                        .equals(birimId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bu birim üzerinde işlem yapma yetkiniz yok"
            );
        }
    }
}