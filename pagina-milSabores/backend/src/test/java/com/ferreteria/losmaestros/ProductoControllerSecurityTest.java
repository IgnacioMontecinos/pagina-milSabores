package com.ferreteria.losmaestros;

import com.ferreteria.losmaestros.security.JwtService;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductoControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    private String token(String username, String rol) {
        return jwtService.generarToken(new UsernamePasswordAuthenticationToken(
                username,
                null,
                List.of(new SimpleGrantedAuthority(rol))
        ));
    }

    private String productoJson() {
        return """
                {
                  "codigo": "HE-TEST-01",
                  "nombre": "Taladro de prueba",
                  "descripcion": "Herramienta para tests",
                  "precio": 45990,
                  "stock": 7,
                  "stockCritico": 2,
                  "categoria": "Herramientas Eléctricas",
                  "imagenUrl": "/images/taladro.svg"
                }
                """;
    }

    @Test
    void listaProductosSinToken() throws Exception {
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").exists());
    }

    @Test
    void buscarProductoInexistenteDevuelve404() throws Exception {
        mockMvc.perform(get("/api/productos/999999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void crearSinTokenDevuelve401() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearConTokenInvalidoDevuelve401() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer token-invalido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rolUsuarioNoPuedeCrearProductos() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("user", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson()))
                .andExpect(status().isForbidden());
    }

    @Test
    void rolAdminPuedeCrearActualizarYEliminar() throws Exception {
        String respuesta = mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Taladro de prueba"))
                .andReturn().getResponse().getContentAsString();

        Long id = ((Number) new com.fasterxml.jackson.databind.ObjectMapper()
                .readValue(respuesta, Map.class).get("id")).longValue();

        mockMvc.perform(put("/api/productos/" + id)
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson().replace("Taladro de prueba", "Taladro actualizado")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Taladro actualizado"));

        mockMvc.perform(delete("/api/productos/" + id)
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN")))
                .andExpect(status().isNoContent());
    }

    @Test
    void loginDevuelveTokenYAuthorities() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"Admin123!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_ADMIN"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"user\",\"password\":\"User123!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_USER"));
    }

    @Test
    void authMeSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void crearConStockNegativoDevuelve400ConErrorConsistente() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson().replace("\"stock\": 7", "\"stock\": -1")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void crearConPrecioCeroDevuelve400() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson().replace("\"precio\": 45990", "\"precio\": 0")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").exists());
    }

    @Test
    void productoAgotadoExposeAdvertencia() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson().replace("HE-TEST-01", "HE-TEST-AGOTADO")
                                .replace("\"stock\": 7", "\"stock\": 0")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.agotado").value(true))
                .andExpect(jsonPath("$.advertenciaStock").value("Producto agotado"));
    }

    @Test
    void productoConStockBajoExposeAdvertencia() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson().replace("HE-TEST-01", "HE-TEST-STOCK-BAJO")
                                .replace("\"stock\": 7", "\"stock\": 3")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.stockBajo").value(true))
                .andExpect(jsonPath("$.advertenciaStock").value("Stock bajo: quedan 3 unidades"));
    }
}
