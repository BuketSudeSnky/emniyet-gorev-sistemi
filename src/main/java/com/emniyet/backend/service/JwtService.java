package com.emniyet.backend.service;

import com.emniyet.backend.entity.Kullanici;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "emniyet-gorev-sistemi-icin-cok-uzun-ve-guvenli-jwt-anahtari-2026";

    private final SecretKey key = Keys.hmacShaKeyFor(
            SECRET_KEY.getBytes(StandardCharsets.UTF_8)
    );

    public String tokenOlustur(Kullanici kullanici) {

        long simdi = System.currentTimeMillis();

        return Jwts.builder()
                .subject(kullanici.getKullaniciAdi())
                .claim("rol", kullanici.getRol().name())
                .claim(
                        "birimId",
                        kullanici.getBirim() != null
                                ? kullanici.getBirim().getId()
                                : null
                )
                .issuedAt(new Date(simdi))
                .expiration(new Date(simdi + 1000 * 60 * 60 * 8))
                .signWith(key)
                .compact();
    }

    public String kullaniciAdiGetir(String token) {

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean tokenGecerliMi(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);

            return true;
        } catch (Exception e) {
            return false;
        }
    }
}