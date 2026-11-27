package com.ferreteria.losmaestros.controller;

import com.ferreteria.losmaestros.dto.ErrorResponse;
import com.ferreteria.losmaestros.dto.ProductoDTO;
import com.ferreteria.losmaestros.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Productos", description = "Consulta y gestión del catálogo de productos")
@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService servicio;

    public ProductoController(ProductoService servicio) {
        this.servicio = servicio;
    }

    @Operation(summary = "Listar productos", description = "Devuelve el catálogo completo.", security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Catálogo de productos.",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProductoDTO.class))))
    })
    @GetMapping
    public List<ProductoDTO> listar() {
        return servicio.listar();
    }

    @Operation(summary = "Productos con stock crítico",
            description = "Devuelve los productos cuyo stock está por debajo del umbral configurado.",
            security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Productos con stock crítico.",
                    content = @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = ProductoDTO.class))))
    })
    @GetMapping("/stock-critico")
    public List<ProductoDTO> stockCritico() {
        return servicio.listarStockCritico();
    }

    @Operation(summary = "Buscar producto por id", description = "Devuelve un producto por su identificador.",
            security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductoDTO.class))),
            @ApiResponse(responseCode = "400", description = "Identificador con formato inválido.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ProductoDTO buscar(@PathVariable Long id) {
        return servicio.buscar(id);
    }

    @Operation(summary = "Crear producto", description = "Crea un producto. Requiere ROLE_ADMIN.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto creado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductoDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos del producto inválidos.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o expirado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene ROLE_ADMIN.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Código de producto duplicado o restricción violada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductoDTO crear(@Valid @RequestBody ProductoDTO producto) {
        return servicio.crear(producto);
    }

    @Operation(summary = "Actualizar producto", description = "Actualiza un producto. Requiere ROLE_ADMIN.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ProductoDTO.class))),
            @ApiResponse(responseCode = "400", description = "Datos del producto inválidos.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o expirado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene ROLE_ADMIN.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Código de producto duplicado o restricción violada.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ProductoDTO actualizar(@PathVariable Long id, @Valid @RequestBody ProductoDTO producto) {
        return servicio.actualizar(id, producto);
    }

    @Operation(summary = "Eliminar producto", description = "Elimina un producto. Requiere ROLE_ADMIN.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Producto eliminado."),
            @ApiResponse(responseCode = "401", description = "Token ausente, inválido o expirado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene ROLE_ADMIN.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Producto no encontrado.",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id) {
        servicio.eliminar(id);
    }
}
