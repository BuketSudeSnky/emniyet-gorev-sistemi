package com.emniyet.backend.config;

import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.enums.Rol;
import com.emniyet.backend.repository.KullaniciRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner ilkAdminOlustur(
            KullaniciRepository kullaniciRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (kullaniciRepository
                    .findBySicilNo("ADMIN001")
                    .isEmpty()) {

                Kullanici admin = new Kullanici();

                admin.setSicilNo("ADMIN001");
                admin.setSifre(
                        passwordEncoder.encode("Admin123!")
                );
                admin.setRol(Rol.ADMIN);
                admin.setAktif(true);
                admin.setBirim(null);

                kullaniciRepository.save(admin);

                System.out.println("İlk admin hesabı oluşturuldu.");
            }
        };
    }
}