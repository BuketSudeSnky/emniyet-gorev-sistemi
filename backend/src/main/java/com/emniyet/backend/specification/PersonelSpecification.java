package com.emniyet.backend.specification;

import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.enums.KanGrubu;

import org.springframework.data.jpa.domain.Specification;

public class PersonelSpecification {

    public static Specification<Personel> filtrele(
            String ad,
            String soyad,
            String sicilNo,
            String telefon,
            Cinsiyet cinsiyet,
            KanGrubu kanGrubu,
            Long birimId,
            Boolean aktif) {

        return (root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            // Ad
            if (ad != null && !ad.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("ad")),
                                "%" + ad.toLowerCase() + "%"
                        )
                );
            }

            // Soyad
            if (soyad != null && !soyad.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("soyad")),
                                "%" + soyad.toLowerCase() + "%"
                        )
                );
            }

            // Sicil No
            if (sicilNo != null && !sicilNo.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("sicilNo")),
                                "%" + sicilNo.toLowerCase() + "%"
                        )
                );
            }

            // Telefon
            if (telefon != null && !telefon.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                root.get("telefon"),
                                "%" + telefon + "%"
                        )
                );
            }

            // Cinsiyet
            if (cinsiyet != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("cinsiyet"),
                                cinsiyet
                        )
                );
            }

            // Kan Grubu
            if (kanGrubu != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("kanGrubu"),
                                kanGrubu
                        )
                );
            }

            // Birim
            if (birimId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("birim").get("id"),
                                birimId
                        )
                );
            }

            // Aktif / Pasif
            if (aktif != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(
                                root.get("aktif"),
                                aktif
                        )
                );
            }

            return predicate;
        };
    }
}