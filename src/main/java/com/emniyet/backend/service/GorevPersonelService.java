package com.emniyet.backend.service;

import com.emniyet.backend.dto.PersonelGorevSirasiDTO;
import com.emniyet.backend.entity.Gorev;
import com.emniyet.backend.entity.GorevPersonel;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.GorevPersonelRepository;
import com.emniyet.backend.repository.GorevRepository;
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

    public GorevPersonelService(
            GorevPersonelRepository gorevPersonelRepository,
            GorevRepository gorevRepository,
            PersonelRepository personelRepository) {

        this.gorevPersonelRepository = gorevPersonelRepository;
        this.gorevRepository = gorevRepository;
        this.personelRepository = personelRepository;
    }

    @Transactional
    public List<GorevPersonel> personelleriGoreveAta(
            Long gorevId,
            List<Long> personelIdleri) {

        Gorev gorev = gorevRepository.findById(gorevId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Görev bulunamadı"
                        )
                );

        if (!Boolean.TRUE.equals(gorev.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif göreve personel atanamaz"
            );
        }

        List<GorevPersonel> atamalar = new ArrayList<>();

        for (Long personelId : personelIdleri) {

            Personel personel =
                    personelRepository.findById(personelId)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Personel bulunamadı: "
                                                    + personelId
                                    )
                            );

            if (!Boolean.TRUE.equals(personel.getAktif())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Pasif personel göreve atanamaz: "
                                + personelId
                );
            }

            if (!personel.getBirim().getId()
                    .equals(gorev.getBirim().getId())) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Personel ile görev aynı birime ait olmalıdır"
                );
            }

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

        return gorevPersonelRepository.findByGorevId(gorevId);
    }

    public List<GorevPersonel> personelinGorevGecmisiniGetir(
            Long personelId) {

        return gorevPersonelRepository.findByPersonelId(personelId);
    }

    public List<PersonelGorevSirasiDTO> gorevDagitimSirasiGetir(
            Long birimId,
            Long gorevTuruId) {

        List<Personel> personeller =
                personelRepository
                        .findByBirimIdAndAktifTrue(birimId);

        List<PersonelGorevSirasiDTO> sonuc =
                new ArrayList<>();

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

        sonuc.sort(
                Comparator.comparingLong(
                        PersonelGorevSirasiDTO::getGorevSayisi
                )
        );

        return sonuc;
    }
}