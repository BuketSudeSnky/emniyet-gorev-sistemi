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

    @PostMapping
    public Gorev gorevEkle(
            @Valid @RequestBody GorevRequest request,
            @RequestParam Long birimId,
            @RequestParam Long gorevTuruId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        Gorev gorev = new Gorev();

        gorev.setTarih(request.getTarih());
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

        birimYetkisiniKontrolEt(
                kullanici,
                mevcutGorev.getBirim().getId()
        );

        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        Gorev gorev = new Gorev();

        gorev.setTarih(request.getTarih());
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

    private Kullanici aktifKullanici(
            Authentication authentication) {

        return kullaniciService
                .aktifKullaniciyiGetir(
                        authentication.getName()
                );
    }

    private void birimYetkisiniKontrolEt(
            Kullanici kullanici,
            Long birimId) {

        if (kullanici.getRol() == Rol.ADMIN) {
            return;
        }

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