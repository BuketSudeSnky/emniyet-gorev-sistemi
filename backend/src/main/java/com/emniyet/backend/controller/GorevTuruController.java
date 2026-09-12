package com.emniyet.backend.controller;

import com.emniyet.backend.dto.GorevTuruRequest;
import com.emniyet.backend.entity.GorevTuru;
import com.emniyet.backend.service.GorevTuruService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gorev-turleri")
public class GorevTuruController {

    private final GorevTuruService gorevTuruService;

    public GorevTuruController(
            GorevTuruService gorevTuruService) {

        this.gorevTuruService = gorevTuruService;
    }

    @GetMapping
    public List<GorevTuru> tumGorevTurleriniGetir() {

        return gorevTuruService
                .tumGorevTurleriniGetir();
    }

    @PostMapping
    public GorevTuru gorevTuruEkle(
            @Valid @RequestBody GorevTuruRequest request) {

        GorevTuru gorevTuru = new GorevTuru();

        gorevTuru.setAd(request.getAd());
        gorevTuru.setAciklama(request.getAciklama());

        return gorevTuruService
                .gorevTuruEkle(gorevTuru);
    }

    @PutMapping("/{id}")
    public GorevTuru gorevTuruGuncelle(
            @PathVariable Long id,
            @Valid @RequestBody GorevTuruRequest request) {

        GorevTuru gorevTuru = new GorevTuru();

        gorevTuru.setAd(request.getAd());
        gorevTuru.setAciklama(request.getAciklama());

        return gorevTuruService
                .gorevTuruGuncelle(
                        id,
                        gorevTuru
                );
    }

    @DeleteMapping("/{id}")
    public GorevTuru gorevTuruPasifeAl(
            @PathVariable Long id) {

        return gorevTuruService
                .gorevTuruPasifeAl(id);
    }
}