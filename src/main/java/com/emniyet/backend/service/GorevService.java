package com.emniyet.backend.service;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.entity.Gorev;
import com.emniyet.backend.entity.GorevTuru;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.BirimRepository;
import com.emniyet.backend.repository.GorevRepository;
import com.emniyet.backend.repository.GorevTuruRepository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GorevService {

    private final GorevRepository gorevRepository;
    private final BirimRepository birimRepository;
    private final GorevTuruRepository gorevTuruRepository;

    public GorevService(
            GorevRepository gorevRepository,
            BirimRepository birimRepository,
            GorevTuruRepository gorevTuruRepository) {

        this.gorevRepository = gorevRepository;
        this.birimRepository = birimRepository;
        this.gorevTuruRepository = gorevTuruRepository;
    }

    public List<Gorev> tumGorevleriGetir() {
        return gorevRepository.findByAktifTrue();
    }

    public Gorev gorevEkle(
            Gorev gorev,
            Long birimId,
            Long gorevTuruId) {

        Birim birim = birimRepository.findById(birimId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Birim bulunamadı"
                        ));

        if (!Boolean.TRUE.equals(birim.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif birime görev eklenemez"
            );
        }

        GorevTuru gorevTuru =
                gorevTuruRepository.findById(gorevTuruId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev türü bulunamadı"
                                ));

        if (!Boolean.TRUE.equals(gorevTuru.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif görev türü kullanılamaz"
            );
        }

        gorev.setBirim(birim);
        gorev.setGorevTuru(gorevTuru);

        // Yeni görev her zaman aktif oluşturulsun
        gorev.setAktif(true);

        return gorevRepository.save(gorev);
    }

    public Gorev gorevGuncelle(
            Long id,
            Gorev yeniGorev,
            Long birimId,
            Long gorevTuruId) {

        Gorev mevcutGorev =
                gorevRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev bulunamadı"
                                ));

        Birim birim =
                birimRepository.findById(birimId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Birim bulunamadı"
                                ));

        if (!Boolean.TRUE.equals(birim.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Görev pasif birime atanamaz"
            );
        }

        GorevTuru gorevTuru =
                gorevTuruRepository.findById(gorevTuruId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev türü bulunamadı"
                                ));

        if (!Boolean.TRUE.equals(gorevTuru.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif görev türü kullanılamaz"
            );
        }

        mevcutGorev.setTarih(yeniGorev.getTarih());
        mevcutGorev.setBaslangicSaati(
                yeniGorev.getBaslangicSaati()
        );
        mevcutGorev.setBitisSaati(
                yeniGorev.getBitisSaati()
        );
        mevcutGorev.setAciklama(
                yeniGorev.getAciklama()
        );

        mevcutGorev.setBirim(birim);
        mevcutGorev.setGorevTuru(gorevTuru);

        return gorevRepository.save(mevcutGorev);
    }

    public Gorev gorevPasifeAl(Long id) {

        Gorev mevcutGorev =
                gorevRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev bulunamadı"
                                ));

        mevcutGorev.setAktif(false);

        return gorevRepository.save(mevcutGorev);
    }

    public List<Gorev> birimeGoreGorevleriGetir(
            Long birimId) {

        return gorevRepository
                .findByBirimIdAndAktifTrue(birimId);
    }

    public List<Gorev> tariheGoreGorevleriGetir(
            LocalDate tarih) {

        return gorevRepository
                .findByTarihAndAktifTrue(tarih);
    }

    public List<Gorev> gorevTuruneGoreGorevleriGetir(
            Long gorevTuruId) {

        return gorevRepository
                .findByGorevTuruIdAndAktifTrue(
                        gorevTuruId
                );
    }

    public List<Gorev> birimVeTariheGoreGorevleriGetir(
            Long birimId,
            LocalDate tarih) {

        return gorevRepository
                .findByBirimIdAndTarihAndAktifTrue(
                        birimId,
                        tarih
                );
    }

    public List<Gorev> birimVeGorevTuruneGoreGorevleriGetir(
            Long birimId,
            Long gorevTuruId) {

        return gorevRepository
                .findByBirimIdAndGorevTuruIdAndAktifTrue(
                        birimId,
                        gorevTuruId
                );
    }

    public Gorev idIleGorevGetir(Long id) {

        return gorevRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Görev bulunamadı"
                        ));
    }
}