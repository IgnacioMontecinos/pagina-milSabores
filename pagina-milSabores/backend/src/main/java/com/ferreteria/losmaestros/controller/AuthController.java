package com.ferreteria.losmaestros.controller;

import com.ferreteria.losmaestros.domain.Usuario;
import com.ferreteria.losmaestros.dto.ErrorResponse;
import com.ferreteria.losmaestros.dto.LoginRequest;
import com.ferreteria.losmaestros.dto.LoginResponse;
import com.ferreteria.losmaestros.dto.UsuarioDTO;
import com.ferreteria.losmaestros.repository.UsuarioRepository;
import com.ferreteria.losmaestros.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Autenticación", description = "Inicio de sesión y consulta del usuario autenticado")
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtService jwtService,
                          UsuarioRepository usuarioRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
    }

    @Operation(summary = "Iniciar sesión", description = "Valida credenciales y devuelve un token JWT Bearer.",
            security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Credenciales válidas; devuelve el token JWT.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales incorrectas.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest solicitud) {
        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(solicitud.username(), solicitud.password())
        );

        Usuario usuario = usuarioRepository.findByUsername(solicitud.username())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        List<String> authorities = autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        return new LoginResponse(
                jwtService.generarToken(autenticacion),
                usuario.getUsername(),
                usuario.getNombre(),
                authorities
        );
    }

    @Operation(summary = "Usuario autenticado",
            description = "Devuelve username, nombre y authorities del token JWT vigente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos del usuario autenticado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UsuarioDTO.class))),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o expirado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/me")
    public UsuarioDTO yo(Authentication autenticacion) {
        List<String> authorities = autenticacion.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        Usuario usuario = usuarioRepository.findByUsername(autenticacion.getName()).orElse(null);
        String username = usuario == null ? autenticacion.getName() : usuario.getUsername();
        String nombre = usuario == null ? autenticacion.getName() : usuario.getNombre();
        return new UsuarioDTO(username, nombre, authorities);
    }
}
