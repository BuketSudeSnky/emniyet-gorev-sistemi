package com.emniyet.backend.controller;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.service.BirimService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/birimler")
public class BirimController {

    private final BirimService birimService;

    public BirimController(BirimService birimService) {
        this.birimService = birimService;
    }

    @GetMapping
    public List<Birim> tumBirimleriGetir() {
        return birimService.tumBirimleriGetir();
    }

    @PostMapping
    public Birim birimEkle(@RequestBody Birim birim) {
        return birimService.birimEkle(birim);
    }

    @PutMapping("/{id}")
    public Birim birimGuncelle(
            @PathVariable Long id,
            @RequestBody Birim birim) {

        return birimService.birimGuncelle(id, birim);
    }

    @DeleteMapping("/{id}")
    public Birim birimPasifeAl(@PathVariable Long id) {
        return birimService.birimPasifeAl(id);
    }
}