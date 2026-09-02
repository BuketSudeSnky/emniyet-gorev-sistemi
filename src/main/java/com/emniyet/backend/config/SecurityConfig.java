package com.emniyet.backend.config;

import com.emniyet.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // LOGIN - herkes erişebilir
                        .requestMatchers("/api/auth/login")
                        .permitAll()

                        // Spring hata cevabını gösterebilsin
                        .requestMatchers("/error")
                        .permitAll()

                        // SADECE ADMIN
                        .requestMatchers(
                                "/api/birimler",
                                "/api/birimler/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/gorev-turleri",
                                "/api/gorev-turleri/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                "/api/kullanicilar",
                                "/api/kullanicilar/**"
                        )
                        .hasRole("ADMIN")

                        // ADMIN + BIRIM_YETKILISI
                        .requestMatchers(
                                "/api/personeller",
                                "/api/personeller/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BIRIM_YETKILISI"
                        )

                        .requestMatchers(
                                "/api/gorevler",
                                "/api/gorevler/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BIRIM_YETKILISI"
                        )

                        .requestMatchers(
                                "/api/gorev-personel",
                                "/api/gorev-personel/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BIRIM_YETKILISI"
                        )

                        // Diğer tüm endpointler login ister
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}