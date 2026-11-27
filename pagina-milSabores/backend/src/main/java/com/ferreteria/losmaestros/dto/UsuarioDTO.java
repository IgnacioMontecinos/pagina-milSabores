package com.ferreteria.losmaestros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Datos del usuario autenticado.")
public record UsuarioDTO(
        @Schema(description = "Nombre de usuario.", example = "user")
        String username,
        @Schema(description = "Nombre visible del usuario.", example = "Cliente")
        String nombre,
        @Schema(description = "Roles/authorities del usuario.", example = "ROLE_USER")
        List<String> authorities
) {
}
