package com.emniyet.backend.service;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.enums.Rol;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.BirimRepository;
import com.emniyet.backend.repository.KullaniciRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KullaniciService {

    private final KullaniciRepository kullaniciRepository;
    private final BirimRepository birimRepository;
    private final PasswordEncoder passwordEncoder;

    public KullaniciService(
            KullaniciRepository kullaniciRepository,
            BirimRepository birimRepository,
            PasswordEncoder passwordEncoder) {

        this.kullaniciRepository = kullaniciRepository;
        this.birimRepository = birimRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Kullanici kullaniciOlustur(
            Kullanici kullanici,
            Long birimId) {

        if (kullaniciRepository
                .findBySicilNo(kullanici.getSicilNo())
                .isPresent()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Bu sicil numarası zaten kullanılıyor"
            );
        }

        if (kullanici.getRol() == Rol.BIRIM_YETKILISI) {

            if (birimId == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Birim yetkilisi için birim seçilmelidir"
                );
            }

            Birim birim = birimRepository.findById(birimId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Birim bulunamadı"
                            ));

            if (!Boolean.TRUE.equals(birim.getAktif())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Pasif birime kullanıcı atanamaz"
                );
            }

            kullanici.setBirim(birim);

        } else if (kullanici.getRol() == Rol.ADMIN) {

            kullanici.setBirim(null);

        } else {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Geçersiz kullanıcı rolü"
            );
        }

        kullanici.setSifre(
                passwordEncoder.encode(
                        kullanici.getSifre()
                )
        );

        kullanici.setAktif(true);

        return kullaniciRepository.save(kullanici);
    }

    public Kullanici girisYap(
            String sicilNo,
            String sifre) {

        Kullanici kullanici = kullaniciRepository
                .findBySicilNo(sicilNo)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Sicil numarası veya şifre hatalı"
                        ));

        if (!Boolean.TRUE.equals(kullanici.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Kullanıcı hesabı pasif"
            );
        }

        if (!passwordEncoder.matches(
                sifre,
                kullanici.getSifre())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Sicil numarası veya şifre hatalı"
            );
        }

        return kullanici;
    }

    public Kullanici aktifKullaniciyiGetir(
            String sicilNo) {

        Kullanici kullanici = kullaniciRepository
                .findBySicilNo(sicilNo)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Kullanıcı bulunamadı"
                        ));

        if (!Boolean.TRUE.equals(kullanici.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Kullanıcı hesabı pasif"
            );
        }

        return kullanici;
    }
}