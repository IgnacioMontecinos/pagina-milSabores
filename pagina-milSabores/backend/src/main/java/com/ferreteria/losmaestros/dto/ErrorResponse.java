package com.ferreteria.losmaestros.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta de error uniforme de la API.")
public record ErrorResponse(
        @Schema(description = "Mensaje de error.", example = "Token ausente, inválido o expirado.")
        String message,
        @Schema(description = "Alias de message para compatibilidad.",
                example = "Token ausente, inválido o expirado.")
        String mensaje,
        @Schema(description = "Código de estado HTTP.", example = "401")
        int status
) {

    public ErrorResponse(String mensaje, int status) {
        this(mensaje, mensaje, status);
    }
}
