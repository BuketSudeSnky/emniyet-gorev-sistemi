package com.emniyet.backend.security;

import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.repository.KullaniciRepository;
import com.emniyet.backend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final KullaniciRepository kullaniciRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            KullaniciRepository kullaniciRepository) {

        this.jwtService = jwtService;
        this.kullaniciRepository = kullaniciRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader =
                request.getHeader("Authorization");

        if (authorizationHeader == null ||
                !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        String token = authorizationHeader.substring(7);

        if (!jwtService.tokenGecerliMi(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        String sicilNo =
                jwtService.sicilNoGetir(token);

        Kullanici kullanici = kullaniciRepository
                .findBySicilNo(sicilNo)
                .orElse(null);

        if (kullanici != null &&
                Boolean.TRUE.equals(kullanici.getAktif())) {

            SimpleGrantedAuthority authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" + kullanici.getRol().name()
                    );

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            kullanici.getSicilNo(),
                            null,
                            List.of(authority)
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}