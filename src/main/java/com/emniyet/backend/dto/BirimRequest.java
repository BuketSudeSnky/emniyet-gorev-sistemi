package com.emniyet.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BirimRequest {

    @NotBlank(message = "Birim adı boş bırakılamaz")
    @Size(
            max = 100,
            message = "Birim adı en fazla 100 karakter olabilir"
    )
    private String ad;

    public String getAd() {
        return ad;
    }

    public void setAd(String ad) {
        this.ad = ad;
    }
}