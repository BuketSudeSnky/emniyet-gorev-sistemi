package com.emniyet.backend.config;

import com.emniyet.backend.security.CustomAccessDeniedHandler;
import com.emniyet.backend.security.CustomAuthenticationEntryPoint;
import com.emniyet.backend.security.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            CustomAccessDeniedHandler customAccessDeniedHandler,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.customAuthenticationEntryPoint =
                customAuthenticationEntryPoint;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                .cors(cors -> {})

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exception -> exception

                        .authenticationEntryPoint(
                                customAuthenticationEntryPoint
                        )

                        .accessDeniedHandler(
                                customAccessDeniedHandler
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // LOGIN - herkes erişebilir
                        .requestMatchers("/api/auth/login")
                        .permitAll()

                        // Spring hata endpointi
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

                        // Diğer tüm endpointler giriş ister
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