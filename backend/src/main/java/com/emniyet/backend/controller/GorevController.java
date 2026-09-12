package com.emniyet.backend.controller;

import com.emniyet.backend.dto.GorevRequest;
import com.emniyet.backend.entity.Gorev;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.enums.Rol;
import com.emniyet.backend.service.GorevService;
import com.emniyet.backend.service.KullaniciService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gorevler")
public class GorevController {

    private final GorevService gorevService;
    private final KullaniciService kullaniciService;

    public GorevController(
            GorevService gorevService,
            KullaniciService kullaniciService) {

        this.gorevService = gorevService;
        this.kullaniciService = kullaniciService;
    }

    // TÜM GÖREVLER
    @GetMapping
    public List<Gorev> tumGorevleriGetir(
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        if (kullanici.getRol() == Rol.ADMIN) {
            return gorevService.tumGorevleriGetir();
        }

        Long birimId = kullanici.getBirim().getId();

        return gorevService
                .birimeGoreGorevleriGetir(birimId);
    }

    // YENİ GÖREV EKLE
    @PostMapping
    public Gorev gorevEkle(
            @Valid @RequestBody GorevRequest request,
            @RequestParam Long birimId,
            @RequestParam Long gorevTuruId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        // Geçmiş tarihli yeni görev oluşturulamaz.
        if (request.getTarih().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Geçmiş tarihli görev oluşturulamaz."
            );
        }

        // Kullanıcının ilgili birim üzerinde yetkisi var mı?
        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        Gorev gorev = new Gorev();

        gorev.setTarih(
                request.getTarih()
        );

        gorev.setBaslangicSaati(
                request.getBaslangicSaati()
        );

        gorev.setBitisSaati(
                request.getBitisSaati()
        );

        gorev.setAciklama(
                request.getAciklama()
        );

        return gorevService.gorevEkle(
                gorev,
                birimId,
                gorevTuruId
        );
    }

    // GÖREV GÜNCELLE
    @PutMapping("/{id}")
    public Gorev gorevGuncelle(
            @PathVariable Long id,
            @Valid @RequestBody GorevRequest request,
            @RequestParam Long birimId,
            @RequestParam Long gorevTuruId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Gorev mevcutGorev =
                gorevService.idIleGorevGetir(id);

        /*
         * Geçmiş tarihli bir görev varsa,
         * mevcut tarihi korunabilir.
         *
         * Ancak görev başka bir geçmiş tarihe
         * değiştirilemez.
         *
         * Bugün veya ileri tarih seçilebilir.
         */
        LocalDate bugun = LocalDate.now();

        if (
                request.getTarih().isBefore(bugun)
                        &&
                        !request.getTarih().equals(
                                mevcutGorev.getTarih()
                        )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Görev tarihi geçmiş bir tarihe değiştirilemez."
            );
        }

        // Kullanıcı mevcut görevin biriminde yetkili mi?
        birimYetkisiniKontrolEt(
                kullanici,
                mevcutGorev.getBirim().getId()
        );

        // Görev başka bir birime taşınıyorsa
        // yeni birim üzerinde de yetkisi var mı?
        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        Gorev gorev = new Gorev();

        gorev.setTarih(
                request.getTarih()
        );

        gorev.setBaslangicSaati(
                request.getBaslangicSaati()
        );

        gorev.setBitisSaati(
                request.getBitisSaati()
        );

        gorev.setAciklama(
                request.getAciklama()
        );

        return gorevService.gorevGuncelle(
                id,
                gorev,
                birimId,
                gorevTuruId
        );
    }

    // GÖREVİ PASİFE AL
    @DeleteMapping("/{id}")
    public Gorev gorevPasifeAl(
            @PathVariable Long id,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Gorev mevcutGorev =
                gorevService.idIleGorevGetir(id);

        birimYetkisiniKontrolEt(
                kullanici,
                mevcutGorev.getBirim().getId()
        );

        return gorevService.gorevPasifeAl(id);
    }

    // BİRİME GÖRE GÖREVLER
    @GetMapping("/birim/{birimId}")
    public List<Gorev> birimeGoreGorevleriGetir(
            @PathVariable Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        return gorevService
                .birimeGoreGorevleriGetir(birimId);
    }

    // TARİHE GÖRE GÖREVLER
    @GetMapping("/tarih")
    public List<Gorev> tariheGoreGorevleriGetir(
            @RequestParam LocalDate tarih,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        if (kullanici.getRol() == Rol.ADMIN) {
            return gorevService
                    .tariheGoreGorevleriGetir(tarih);
        }

        Long birimId = kullanici.getBirim().getId();

        return gorevService
                .birimVeTariheGoreGorevleriGetir(
                        birimId,
                        tarih
                );
    }

    // GÖREV TÜRÜNE GÖRE GÖREVLER
    @GetMapping("/tur/{gorevTuruId}")
    public List<Gorev> gorevTuruneGoreGorevleriGetir(
            @PathVariable Long gorevTuruId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        if (kullanici.getRol() == Rol.ADMIN) {
            return gorevService
                    .gorevTuruneGoreGorevleriGetir(
                            gorevTuruId
                    );
        }

        Long birimId = kullanici.getBirim().getId();

        return gorevService
                .birimVeGorevTuruneGoreGorevleriGetir(
                        birimId,
                        gorevTuruId
                );
    }

    // AKTİF KULLANICIYI GETİR
    private Kullanici aktifKullanici(
            Authentication authentication) {

        return kullaniciService
                .aktifKullaniciyiGetir(
                        authentication.getName()
                );
    }

    // BİRİM YETKİ KONTROLÜ
    private void birimYetkisiniKontrolEt(
            Kullanici kullanici,
            Long birimId) {

        // Admin bütün birimlerde işlem yapabilir.
        if (kullanici.getRol() == Rol.ADMIN) {
            return;
        }

        // Birim yetkilisi sadece kendi biriminde işlem yapabilir.
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