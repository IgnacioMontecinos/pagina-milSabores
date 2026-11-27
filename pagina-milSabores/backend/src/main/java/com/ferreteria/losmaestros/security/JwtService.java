package com.ferreteria.losmaestros.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    private static final String AUTHORITIES_CLAIM = "authorities";

    @Value("${jwt.secret:ferreteria-los-maestros-clave-secreta-para-desarrollo-2026}")
    private String secreto;

    @Value("${jwt.expiration-ms:3600000}")
    private long expiracionMs;

    public String generarToken(Authentication autenticacion) {
        String authorities = autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .reduce((a, b) -> a + "," + b)
                .orElse("ROLE_USER");

        return Jwts.builder()
                .subject(autenticacion.getName())
                .claim(AUTHORITIES_CLAIM, authorities)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiracionMs))
                .signWith(clave())
                .compact();
    }

    public String extraerUsername(String token) {
        return parsear(token).getSubject();
    }

    public List<GrantedAuthority> extraerAuthorities(String token) {
        String authorities = parsear(token).get(AUTHORITIES_CLAIM, String.class);
        if (authorities == null || authorities.isBlank()) return List.of();
        return Arrays.stream(authorities.split(","))
                .filter(s -> !s.isBlank())
                .map(SimpleGrantedAuthority::new)
                .map(GrantedAuthority.class::cast)
                .toList();
    }

    public boolean esValido(String token) {
        try {
            parsear(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims parsear(String token) {
        return Jwts.parser()
                .verifyWith(clave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey clave() {
        return Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8));
    }
}
