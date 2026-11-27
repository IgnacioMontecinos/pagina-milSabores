package com.ferreteria.losmaestros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Credenciales de inicio de sesión.")
public record LoginRequest(
        @Schema(description = "Nombre de usuario.", example = "admin")
        @NotBlank String username,
        @Schema(description = "Contraseña del usuario.", example = "Admin123!")
        @NotBlank String password
) {
}

