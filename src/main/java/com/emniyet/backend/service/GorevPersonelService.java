package com.emniyet.backend.service;

import com.emniyet.backend.dto.PersonelGorevSirasiDTO;
import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.entity.Gorev;
import com.emniyet.backend.entity.GorevPersonel;
import com.emniyet.backend.entity.GorevTuru;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.BirimRepository;
import com.emniyet.backend.repository.GorevPersonelRepository;
import com.emniyet.backend.repository.GorevRepository;
import com.emniyet.backend.repository.GorevTuruRepository;
import com.emniyet.backend.repository.PersonelRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class GorevPersonelService {

    private final GorevPersonelRepository gorevPersonelRepository;
    private final GorevRepository gorevRepository;
    private final PersonelRepository personelRepository;
    private final BirimRepository birimRepository;
    private final GorevTuruRepository gorevTuruRepository;

    public GorevPersonelService(
            GorevPersonelRepository gorevPersonelRepository,
            GorevRepository gorevRepository,
            PersonelRepository personelRepository,
            BirimRepository birimRepository,
            GorevTuruRepository gorevTuruRepository) {

        this.gorevPersonelRepository = gorevPersonelRepository;
        this.gorevRepository = gorevRepository;
        this.personelRepository = personelRepository;
        this.birimRepository = birimRepository;
        this.gorevTuruRepository = gorevTuruRepository;
    }

    @Transactional
    public List<GorevPersonel> personelleriGoreveAta(
            Long gorevId,
            List<Long> personelIdleri) {

        // En az bir personel seçilmiş olmalı
        if (personelIdleri == null || personelIdleri.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "En az bir personel seçilmelidir"
            );
        }

        // Liste içinde null personel ID olamaz
        if (personelIdleri.contains(null)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Personel ID boş olamaz"
            );
        }

        // Aynı personel aynı istekte birden fazla kez seçilemez
        if (personelIdleri.stream().distinct().count()
                != personelIdleri.size()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Aynı personel birden fazla kez seçilemez"
            );
        }

        // Görev mevcut mu?
        Gorev gorev = gorevRepository.findById(gorevId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Görev bulunamadı"
                        )
                );

        // Pasif göreve personel atanamaz
        if (!Boolean.TRUE.equals(gorev.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif göreve personel atanamaz"
            );
        }

        List<GorevPersonel> atamalar = new ArrayList<>();

        for (Long personelId : personelIdleri) {

            // Personel mevcut mu?
            Personel personel =
                    personelRepository.findById(personelId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Personel bulunamadı: "
                                                    + personelId
                                    )
                            );

            // Pasif personel göreve atanamaz
            if (!Boolean.TRUE.equals(personel.getAktif())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Pasif personel göreve atanamaz: "
                                + personelId
                );
            }

            // Personel ve görev aynı birime ait olmalı
            if (!personel.getBirim().getId()
                    .equals(gorev.getBirim().getId())) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Personel ile görev aynı birime ait olmalıdır"
                );
            }

            // Aynı personel aynı göreve tekrar atanamaz
            boolean zatenAtanmis =
                    gorevPersonelRepository
                            .existsByGorevIdAndPersonelId(
                                    gorevId,
                                    personelId
                            );

            if (zatenAtanmis) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Personel bu göreve zaten atanmış: "
                                + personelId
                );
            }

            GorevPersonel atama = new GorevPersonel();

            atama.setGorev(gorev);
            atama.setPersonel(personel);

            atamalar.add(atama);
        }

        return gorevPersonelRepository.saveAll(atamalar);
    }

    public List<GorevPersonel> goreveAtananPersonelleriGetir(
            Long gorevId) {

        return gorevPersonelRepository
                .findByGorevId(gorevId);
    }

    public List<GorevPersonel> personelinGorevGecmisiniGetir(
            Long personelId) {

        return gorevPersonelRepository
                .findByPersonelId(personelId);
    }

    public List<PersonelGorevSirasiDTO> gorevDagitimSirasiGetir(
            Long birimId,
            Long gorevTuruId) {

        // Birim mevcut mu?
        Birim birim = birimRepository.findById(birimId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Birim bulunamadı"
                        )
                );

        // Birim aktif mi?
        if (!Boolean.TRUE.equals(birim.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif birim için görev dağıtım sırası oluşturulamaz"
            );
        }

        // Görev türü mevcut mu?
        GorevTuru gorevTuru =
                gorevTuruRepository.findById(gorevTuruId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev türü bulunamadı"
                                )
                        );

        // Görev türü aktif mi?
        if (!Boolean.TRUE.equals(gorevTuru.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif görev türü için dağıtım sırası oluşturulamaz"
            );
        }

        // Birimdeki aktif personelleri getir
        List<Personel> personeller =
                personelRepository
                        .findByBirimIdAndAktifTrue(birimId);

        List<PersonelGorevSirasiDTO> sonuc =
                new ArrayList<>();

        // Her personelin bu görev türünü daha önce
        // kaç kez aldığını hesapla
        for (Personel personel : personeller) {

            long gorevSayisi =
                    gorevPersonelRepository
                            .countByPersonelAndGorevTuru(
                                    personel.getId(),
                                    gorevTuruId
                            );

            PersonelGorevSirasiDTO dto =
                    new PersonelGorevSirasiDTO(
                            personel.getId(),
                            personel.getAd(),
                            personel.getSoyad(),
                            personel.getSicilNo(),
                            gorevSayisi
                    );

            sonuc.add(dto);
        }

        // En az görev alandan en çok görev alana doğru sırala
        sonuc.sort(
                Comparator.comparingLong(
                        PersonelGorevSirasiDTO::getGorevSayisi
                )
        );

        return sonuc;
    }
}