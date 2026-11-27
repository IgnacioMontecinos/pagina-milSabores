package com.ferreteria.losmaestros;

import com.ferreteria.losmaestros.domain.Categoria;
import com.ferreteria.losmaestros.domain.Producto;
import com.ferreteria.losmaestros.dto.ProductoDTO;
import com.ferreteria.losmaestros.exception.BadRequestException;
import com.ferreteria.losmaestros.exception.ResourceNotFoundException;
import com.ferreteria.losmaestros.repository.CategoriaRepository;
import com.ferreteria.losmaestros.repository.ProductoRepository;
import com.ferreteria.losmaestros.service.ProductoService;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {

    @Mock
    private ProductoRepository repositorio;

    @Mock
    private CategoriaRepository categorias;

    @InjectMocks
    private ProductoService servicio;

    private ProductoDTO dto(int stock, int critico) {
        return new ProductoDTO(null, "HM-100", "Martillo de prueba", "Descripción",
                BigDecimal.valueOf(15000), stock, critico, "Herramientas Manuales", "/images/martillo.svg", false);
    }

    private void categoriaDisponible() {
        when(categorias.findByNombreIgnoreCase("Herramientas Manuales"))
                .thenReturn(Optional.of(new Categoria("Herramientas Manuales", null)));
    }

    private void guardarDevuelveArgumento() {
        when(repositorio.save(any(Producto.class))).thenAnswer(invocacion -> invocacion.getArgument(0));
    }

    @Test
    void rechazaStockNegativo() {
        assertThrows(BadRequestException.class, () -> servicio.crear(dto(-1, 2)));
        verify(repositorio, never()).save(any());
    }

    @Test
    void rechazaPrecioCero() {
        ProductoDTO producto = new ProductoDTO(null, "HM-100", "Martillo", "Descripción",
                BigDecimal.ZERO, 5, 2, "Herramientas Manuales", "", false);
        assertThrows(BadRequestException.class, () -> servicio.crear(producto));
        verify(repositorio, never()).save(any());
    }

    @Test
    void rechazaNombreVacio() {
        ProductoDTO producto = new ProductoDTO(null, "HM-100", "   ", "Descripción",
                BigDecimal.TEN, 5, 2, "Herramientas Manuales", "", false);
        assertThrows(BadRequestException.class, () -> servicio.crear(producto));
        verify(repositorio, never()).save(any());
    }

    @Test
    void creaProductoConCategoriaRelacionada() {
        categoriaDisponible();
        guardarDevuelveArgumento();

        ProductoDTO resultado = servicio.crear(dto(10, 2));

        ArgumentCaptor<Producto> captor = ArgumentCaptor.forClass(Producto.class);
        verify(repositorio).save(captor.capture());
        assertNotNull(captor.getValue().getCategoria());
        assertEquals("Herramientas Manuales", resultado.categoria());
        assertEquals("Herramientas Manuales", captor.getValue().getCategoriaNombre());
    }

    @Test
    void marcaStockCriticoAlActualizar() {
        Producto existente = new Producto();
        existente.setId(1L);
        existente.setCodigo("HM-100");
        existente.setStock(10);
        existente.setStockCritico(2);
        existente.setCategoriaNombre("Herramientas Manuales");

        categoriaDisponible();
        when(repositorio.findById(1L)).thenReturn(Optional.of(existente));
        guardarDevuelveArgumento();

        ProductoDTO resultado = servicio.actualizar(1L, dto(1, 2));

        assertTrue(resultado.stockBajo());
        assertEquals(1, resultado.stock());
        assertTrue(resultado.advertenciaStock().contains("Stock bajo"));
    }

    @Test
    void identificaProductoAgotado() {
        categoriaDisponible();
        guardarDevuelveArgumento();

        ProductoDTO resultado = servicio.crear(dto(0, 2));

        assertTrue(resultado.agotado());
        assertEquals("Producto agotado", resultado.advertenciaStock());
    }

    @Test
    void listaSoloProductosConStockCritico() {
        Producto critico = new Producto();
        critico.setCodigo("HM-001");
        critico.setNombre("Martillo");
        critico.setPrecio(BigDecimal.TEN);
        critico.setStock(1);
        critico.setStockCritico(2);
        critico.setCategoria("Herramientas Manuales");

        Producto normal = new Producto();
        normal.setCodigo("HM-002");
        normal.setNombre("Alicate");
        normal.setPrecio(BigDecimal.TEN);
        normal.setStock(20);
        normal.setStockCritico(2);
        normal.setCategoria("Herramientas Manuales");

        when(repositorio.findAll()).thenReturn(List.of(critico, normal));

        List<ProductoDTO> resultado = servicio.listarStockCritico();

        assertEquals(1, resultado.size());
        assertEquals("HM-001", resultado.get(0).codigo());
    }

    @Test
    void rechazaActualizacionInexistente() {
        when(repositorio.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> servicio.actualizar(999L, dto(5, 2)));
        verify(repositorio, never()).save(any());
    }

    @Test
    void rechazaEliminacionInexistente() {
        when(repositorio.existsById(999L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> servicio.eliminar(999L));
        verify(repositorio, never()).deleteById(any());
    }
}
