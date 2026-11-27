package com.ferreteria.losmaestros.repository;

import com.ferreteria.losmaestros.domain.Producto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByStockLessThanEqual(Integer stock);

    boolean existsByCodigo(String codigo);
}
