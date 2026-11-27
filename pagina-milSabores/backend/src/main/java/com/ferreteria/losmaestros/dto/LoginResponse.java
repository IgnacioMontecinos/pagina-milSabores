package com.ferreteria.losmaestros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Respuesta de un inicio de sesión exitoso.")
public record LoginResponse(
        @Schema(description = "Token JWT Bearer.", example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,
        @Schema(description = "Nombre de usuario autenticado.", example = "admin")
        String username,
        @Schema(description = "Nombre visible del usuario.", example = "Administrador")
        String nombre,
        @Schema(description = "Roles/authorities del usuario.", example = "ROLE_ADMIN")
        List<String> authorities
) {
}
