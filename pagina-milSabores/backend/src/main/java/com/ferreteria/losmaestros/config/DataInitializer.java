package com.ferreteria.losmaestros.config;

import com.ferreteria.losmaestros.domain.Categoria;
import com.ferreteria.losmaestros.domain.Producto;
import com.ferreteria.losmaestros.domain.Usuario;
import com.ferreteria.losmaestros.repository.CategoriaRepository;
import com.ferreteria.losmaestros.repository.ProductoRepository;
import com.ferreteria.losmaestros.repository.UsuarioRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner inicializar(UsuarioRepository usuarios, ProductoRepository productos,
                                         CategoriaRepository categorias, PasswordEncoder codificador) {
        return args -> {
            crearUsuario(usuarios, codificador, "admin", "Admin123!", "Administrador", "ROLE_ADMIN");
            crearUsuario(usuarios, codificador, "user", "User123!", "Cliente", "ROLE_USER");

            obtenerCategoria(categorias, "Herramientas Manuales", "Herramientas accionadas manualmente.");
            obtenerCategoria(categorias, "Herramientas Eléctricas", "Herramientas accionadas por electricidad.");
            obtenerCategoria(categorias, "Materiales y Construcción", "Materiales para obras y construcción.");
            obtenerCategoria(categorias, "Pinturas y Acabados", "Pinturas, brochas y accesorios de acabado.");

            if (productos.count() == 0) {
                crearProducto(productos, categorias, "HM-001", "Martillo de acero 20 oz", "Mango de fibra de vidrio y cabeza forjada para trabajos de carpintería.", 12990, 12, 3, "Herramientas Manuales", "/images/martillo_img.jpg");
                crearProducto(productos, categorias, "HM-002", "Serrucho de carpintero 20\"", "Hoja de acero templado y mango ergonómico para cortes longitudinales.", 9990, 8, 2, "Herramientas Manuales", "/images/serrucho__img.jpg");
                crearProducto(productos, categorias, "HE-001", "Taladro percutor 800 W", "Taladro con control de velocidad y mandril rápido de 13 mm.", 59990, 6, 2, "Herramientas Eléctricas", "/images/taladro.svg");
                crearProducto(productos, categorias, "HM-003", "Serrucho de punta fina 12\"", "Sierra manual de dientes finos para cortes precisos en madera.", 7990, 18, 4, "Herramientas Manuales", "/images/serrucho__img.jpg");
                crearProducto(productos, categorias, "HE-002", "Motosierra eléctrica 1600 W", "Espada de 40 cm, freno de cadena y lubricación automática.", 84990, 5, 2, "Herramientas Eléctricas", "/images/motosierra_img.jpg");
                crearProducto(productos, categorias, "HE-003", "Motosierra profesional 2000 W", "Motor de alta potencia con cadena de corte rápido para trabajos pesados.", 109990, 4, 1, "Herramientas Eléctricas", "/images/motosierra_img.jpg");
                crearProducto(productos, categorias, "MC-001", "Cemento Portland 50 kg", "Cemento de uso general para morteros y concretos.", 7990, 30, 8, "Materiales y Construcción", "/images/cemento.svg");
                crearProducto(productos, categorias, "MC-002", "Clavos galvanizados 1 kg", "Clavos de acero galvanizado para fijaciones en madera y muebles.", 3290, 45, 10, "Materiales y Construcción", "/images/clavos_img.jpg");
                crearProducto(productos, categorias, "MC-003", "Tornillería mixta x 100", "Set de tornillos y tuercas galvanizadas para fijaciones.", 4990, 22, 5, "Materiales y Construcción", "/images/clavos_img.jpg");
                crearProducto(productos, categorias, "PA-001", "Brocha profesional 2\"", "Brocha de cerdas naturales para pinturas al óleo y esmaltes.", 3990, 25, 6, "Pinturas y Acabados", "/images/pintura.svg");
                crearProducto(productos, categorias, "PA-002", "Rodillo con bandeja 9\"", "Rodillo de espuma con bandeja para pintar superficies amplias.", 6490, 16, 4, "Pinturas y Acabados", "/images/pintura.svg");
                crearProducto(productos, categorias, "PA-003", "Esmalte sintético 1 L", "Esmalte de alto brillo para metales y madera, secado rápido.", 14990, 10, 3, "Pinturas y Acabados", "/images/pintura.svg");
            }
        };
    }

    private void crearUsuario(UsuarioRepository repositorio, PasswordEncoder codificador,
                              String username, String password, String nombre, String rol) {
        if (repositorio.findByUsername(username).isEmpty()) {
            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setPassword(codificador.encode(password));
            usuario.setNombre(nombre);
            usuario.setRol(rol);
            usuario.setActivo(true);
            repositorio.save(usuario);
        }
    }

    private Categoria obtenerCategoria(CategoriaRepository repositorio, String nombre, String descripcion) {
        return repositorio.findByNombreIgnoreCase(nombre)
                .orElseGet(() -> repositorio.save(new Categoria(nombre, descripcion)));
    }

    private void crearProducto(ProductoRepository repositorio, CategoriaRepository categorias,
                               String codigo, String nombre, String descripcion,
                               int precio, int stock, int critico, String categoria, String imagenUrl) {
        Categoria categoriaEntidad = obtenerCategoria(categorias, categoria, null);
        Producto producto = new Producto();
        producto.setCodigo(codigo);
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(BigDecimal.valueOf(precio));
        producto.setStock(stock);
        producto.setStockCritico(critico);
        producto.setCategoria(categoriaEntidad);
        producto.setCategoriaNombre(categoriaEntidad.getNombre());
        producto.setImagenUrl(imagenUrl);
        repositorio.save(producto);
    }
}
