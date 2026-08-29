package com.emniyet.backend.specification;

import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.enums.Cinsiyet;
import org.springframework.data.jpa.domain.Specification;

public class PersonelSpecification {

    public static Specification<Personel> filtrele(
            String ad,
            String soyad,
            String sicilNo,
            Cinsiyet cinsiyet,
            Long birimId) {

        return (root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            predicate = criteriaBuilder.and(
                    predicate,
                    criteriaBuilder.isTrue(root.get("aktif"))
            );

            if (ad != null && !ad.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("ad")),
                                "%" + ad.toLowerCase() + "%"
                        )
                );
            }

            if (soyad != null && !soyad.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("soyad")),
                                "%" + soyad.toLowerCase() + "%"
                        )
                );
            }

            if (sicilNo != null && !sicilNo.isBlank()) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("sicilNo"), sicilNo)
                );
            }

            if (cinsiyet != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("cinsiyet"), cinsiyet)
                );
            }

            if (birimId != null) {
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("birim").get("id"), birimId)
                );
            }

            return predicate;
        };
    }
}