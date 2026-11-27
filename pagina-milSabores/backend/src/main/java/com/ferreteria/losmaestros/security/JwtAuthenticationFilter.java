package com.ferreteria.losmaestros.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationEntryPoint entryPoint;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService,
                                   AuthenticationEntryPoint entryPoint) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.entryPoint = entryPoint;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return "OPTIONS".equalsIgnoreCase(request.getMethod())
                || "/auth/login".equals(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String cabecera = request.getHeader("Authorization");

        if (cabecera == null || !cabecera.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        String token = cabecera.substring(7).trim();
        if (token.isEmpty() || !jwtService.esValido(token)) {
            rechazar(request, response);
            return;
        }

        try {
            String username = jwtService.extraerUsername(token);
            UserDetails usuario = userDetailsService.loadUserByUsername(username);
            if (!usuario.isEnabled()) {
                rechazar(request, response);
                return;
            }
            UsernamePasswordAuthenticationToken autenticacion =
                    new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
            autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(autenticacion);
        } catch (Exception ex) {
            rechazar(request, response);
            return;
        }

        chain.doFilter(request, response);
    }

    private void rechazar(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        SecurityContextHolder.clearContext();
        entryPoint.commence(request, response, new BadCredentialsException("Token JWT inválido o expirado."));
    }
}
