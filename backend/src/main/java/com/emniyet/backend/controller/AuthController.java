package com.emniyet.backend.controller;

import com.emniyet.backend.dto.LoginRequest;
import com.emniyet.backend.dto.LoginResponse;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.service.JwtService;
import com.emniyet.backend.service.KullaniciService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final KullaniciService kullaniciService;
    private final JwtService jwtService;

    public AuthController(
            KullaniciService kullaniciService,
            JwtService jwtService) {

        this.kullaniciService = kullaniciService;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Kullanici kullanici = kullaniciService.girisYap(
                request.getSicilNo(),
                request.getSifre()
        );

        String token = jwtService.tokenOlustur(kullanici);

        Long birimId = null;
        String birimAdi = null;

        if (kullanici.getBirim() != null) {
            birimId = kullanici.getBirim().getId();
            birimAdi = kullanici.getBirim().getAd();
        }

        return new LoginResponse(
                kullanici.getId(),
                kullanici.getSicilNo(),
                kullanici.getRol(),
                birimId,
                birimAdi,
                token
        );
    }
}