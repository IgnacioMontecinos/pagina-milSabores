package com.ferreteria.losmaestros.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

@Schema(description = "Producto del catálogo de la ferretería.")
public record ProductoDTO(
        @Schema(description = "Identificador del producto.", example = "1")
        Long id,
        @Schema(description = "Código único del producto.", example = "HE-001")
        @NotBlank @Size(max = 40) String codigo,
        @Schema(description = "Nombre del producto.", example = "Taladro percutor 650W")
        @NotBlank @Size(max = 120) String nombre,
        @Schema(description = "Descripción del producto.", example = "Taladro con velocidad variable")
        @Size(max = 500) String descripcion,
        @Schema(description = "Precio unitario.", example = "45990.00")
        @NotNull @DecimalMin(value = "0.01") BigDecimal precio,
        @Schema(description = "Unidades disponibles.", example = "7")
        @NotNull @Min(0) Integer stock,
        @Schema(description = "Umbral de stock crítico.", example = "2")
        @Min(0) Integer stockCritico,
        @Schema(description = "Categoría del producto.", example = "Herramientas Eléctricas")
        @NotBlank @Size(max = 80) String categoria,
        @Schema(description = "URL de la imagen del producto.", example = "/images/taladro.svg")
        @Size(max = 500) String imagenUrl,
        @Schema(description = "Indica si el stock está por debajo del umbral.", example = "false")
        boolean stockBajo,
        @Schema(description = "Indica si el producto está agotado.", example = "false")
        boolean agotado,
        @Schema(description = "Advertencia de stock, si aplica.", example = "Stock bajo: quedan 3 unidades")
        String advertenciaStock
) {

    public ProductoDTO(Long id, String codigo, String nombre, String descripcion,
                       BigDecimal precio, Integer stock, Integer stockCritico,
                       String categoria, String imagenUrl, boolean stockBajo) {
        this(id, codigo, nombre, descripcion, precio, stock, stockCritico, categoria, imagenUrl,
                stockBajo, calcularAgotado(stock), calcularAdvertencia(stock, stockBajo));
    }

    private static boolean calcularAgotado(Integer stock) {
        return stock != null && stock == 0;
    }

    private static String calcularAdvertencia(Integer stock, boolean stockBajo) {
        if (stock != null && stock == 0) {
            return "Producto agotado";
        }
        if (stockBajo && stock != null) {
            return "Stock bajo: quedan " + stock + " unidades";
        }
        return null;
    }
}
