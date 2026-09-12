package com.emniyet.backend.dto;

import com.emniyet.backend.enums.Rol;

public class LoginResponse {

    private Long id;
    private String sicilNo;
    private Rol rol;
    private Long birimId;
    private String birimAdi;
    private String token;

    public LoginResponse(
            Long id,
            String sicilNo,
            Rol rol,
            Long birimId,
            String birimAdi,
            String token) {

        this.id = id;
        this.sicilNo = sicilNo;
        this.rol = rol;
        this.birimId = birimId;
        this.birimAdi = birimAdi;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getSicilNo() {
        return sicilNo;
    }

    public Rol getRol() {
        return rol;
    }

    public Long getBirimId() {
        return birimId;
    }

    public String getBirimAdi() {
        return birimAdi;
    }

    public String getToken() {
        return token;
    }
}