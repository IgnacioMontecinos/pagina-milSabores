package com.ferreteria.losmaestros.service;

import com.ferreteria.losmaestros.domain.Categoria;
import com.ferreteria.losmaestros.domain.Producto;
import com.ferreteria.losmaestros.dto.ProductoDTO;
import com.ferreteria.losmaestros.exception.BadRequestException;
import com.ferreteria.losmaestros.exception.ResourceNotFoundException;
import com.ferreteria.losmaestros.repository.CategoriaRepository;
import com.ferreteria.losmaestros.repository.ProductoRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductoService {

    private static final Logger log = LoggerFactory.getLogger(ProductoService.class);
    private static final int LIMITE_STOCK_BAJO = 5;

    private final ProductoRepository repositorio;
    private final CategoriaRepository categorias;

    public ProductoService(ProductoRepository repositorio, CategoriaRepository categorias) {
        this.repositorio = repositorio;
        this.categorias = categorias;
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findAll() {
        return listar();
    }

    @Transactional(readOnly = true)
    public ProductoDTO findById(Long id) {
        return buscar(id);
    }

    public ProductoDTO save(ProductoDTO dto) {
        return crear(dto);
    }

    public ProductoDTO update(Long id, ProductoDTO dto) {
        return actualizar(id, dto);
    }

    public void delete(Long id) {
        eliminar(id);
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listar() {
        return repositorio.findAll().stream().map(this::mapear).toList();
    }

    @Transactional(readOnly = true)
    public ProductoDTO buscar(Long id) {
        return mapear(buscarEntidad(id));
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> listarStockCritico() {
        return repositorio.findAll().stream()
                .filter(this::esStockBajo)
                .map(this::mapear)
                .toList();
    }

    public ProductoDTO crear(ProductoDTO dto) {
        validar(dto, null);
        Producto producto = new Producto();
        aplicar(producto, dto);
        Producto guardado = repositorio.save(producto);
        avisarStock(guardado);
        return mapear(guardado);
    }

    public ProductoDTO actualizar(Long id, ProductoDTO dto) {
        Producto producto = buscarEntidad(id);
        validar(dto, producto);
        aplicar(producto, dto);
        Producto guardado = repositorio.save(producto);
        avisarStock(guardado);
        return mapear(guardado);
    }

    public void eliminar(Long id) {
        if (!repositorio.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con id " + id);
        }
        repositorio.deleteById(id);
    }

    private Producto buscarEntidad(Long id) {
        return repositorio.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con id " + id));
    }

    private void validar(ProductoDTO dto, Producto productoActual) {
        if (dto.nombre() == null || dto.nombre().isBlank()) {
            throw new BadRequestException("El nombre del producto es obligatorio.");
        }
        if (dto.codigo() == null || dto.codigo().isBlank()) {
            throw new BadRequestException("El código del producto es obligatorio.");
        }
        if (dto.precio() == null || dto.precio().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("El precio debe ser mayor que cero.");
        }
        if (dto.stock() == null || dto.stock() < 0) {
            throw new BadRequestException("El stock no puede ser negativo.");
        }
        if (dto.stockCritico() != null && dto.stockCritico() < 0) {
            throw new BadRequestException("El stock crítico no puede ser negativo.");
        }
        boolean cambioDeCodigo = productoActual == null || !Objects.equals(productoActual.getCodigo(), dto.codigo());
        if (cambioDeCodigo && repositorio.existsByCodigo(dto.codigo())) {
            throw new BadRequestException("Ya existe un producto con el código " + dto.codigo());
        }
    }

    private Categoria resolverCategoria(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new BadRequestException("La categoría es obligatoria.");
        }
        String nombreNormalizado = nombre.trim();
        return categorias.findByNombreIgnoreCase(nombreNormalizado)
                .orElseGet(() -> categorias.save(new Categoria(nombreNormalizado, null)));
    }

    private void aplicar(Producto producto, ProductoDTO dto) {
        Categoria categoria = resolverCategoria(dto.categoria());
        producto.setCodigo(dto.codigo());
        producto.setNombre(dto.nombre());
        producto.setDescripcion(dto.descripcion());
        producto.setPrecio(dto.precio());
        producto.setStock(dto.stock());
        producto.setStockCritico(dto.stockCritico());
        producto.setCategoria(categoria);
        producto.setCategoriaNombre(categoria.getNombre());
        producto.setImagenUrl(dto.imagenUrl());
    }

    private boolean esStockBajo(Producto producto) {
        if (producto.getStock() == null) {
            return false;
        }
        return producto.getStock() < LIMITE_STOCK_BAJO
                || (producto.getStockCritico() != null && producto.getStock() <= producto.getStockCritico());
    }

    private void avisarStock(Producto producto) {
        if (producto.getStock() != null && producto.getStock() == 0) {
            log.warn("Producto agotado: {} ({})", producto.getNombre(), producto.getCodigo());
        } else if (esStockBajo(producto)) {
            log.warn("Stock bajo: {} ({}) tiene {} unidades",
                    producto.getNombre(), producto.getCodigo(), producto.getStock());
        }
    }

    private ProductoDTO mapear(Producto producto) {
        boolean stockBajo = esStockBajo(producto);
        boolean agotado = producto.getStock() != null && producto.getStock() == 0;
        String advertencia;
        if (agotado) {
            advertencia = "Producto agotado";
        } else if (stockBajo) {
            advertencia = "Stock bajo: quedan " + producto.getStock() + " unidades";
        } else {
            advertencia = null;
        }
        String nombreCategoria = producto.getCategoria() != null
                ? producto.getCategoria().getNombre()
                : producto.getCategoriaNombre();
        return new ProductoDTO(
                producto.getId(),
                producto.getCodigo(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getStockCritico(),
                nombreCategoria,
                producto.getImagenUrl(),
                stockBajo,
                agotado,
                advertencia
        );
    }
}
