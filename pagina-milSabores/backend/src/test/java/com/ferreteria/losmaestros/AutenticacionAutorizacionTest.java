package com.ferreteria.losmaestros;

import com.ferreteria.losmaestros.repository.ProductoRepository;
import com.ferreteria.losmaestros.repository.UsuarioRepository;
import com.ferreteria.losmaestros.security.JwtService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AutenticacionAutorizacionTest {

    private static final String SECRETO_ALTERNATIVO_TEST =
            "secreto-alternativo-solo-para-probar-firmas-invalidas-2026";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarios;

    @Autowired
    private ProductoRepository productos;

    @Autowired
    private PasswordEncoder codificador;

    @Value("${jwt.secret}")
    private String secreto;

    private String token(String username, String rol) {
        return jwtService.generarToken(new UsernamePasswordAuthenticationToken(
                username, null, List.of(new SimpleGrantedAuthority(rol))));
    }

    private String tokenExpirado() {
        long ahora = System.currentTimeMillis();
        return Jwts.builder()
                .subject("user")
                .claim("authorities", "ROLE_USER")
                .issuedAt(new Date(ahora - 7_200_000))
                .expiration(new Date(ahora - 3_600_000))
                .signWith(Keys.hmacShaKeyFor(secreto.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private String tokenFirmadoConOtroSecreto() {
        long ahora = System.currentTimeMillis();
        return Jwts.builder()
                .subject("admin")
                .claim("authorities", "ROLE_ADMIN")
                .issuedAt(new Date(ahora))
                .expiration(new Date(ahora + 3_600_000))
                .signWith(Keys.hmacShaKeyFor(SECRETO_ALTERNATIVO_TEST.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    private String productoJson(String codigo) {
        return """
                {
                  "codigo": "%s",
                  "nombre": "Producto de autenticación",
                  "descripcion": "Prueba de autorización",
                  "precio": 12500,
                  "stock": 5,
                  "stockCritico": 2,
                  "categoria": "Herramientas Manuales",
                  "imagenUrl": ""
                }
                """.formatted(codigo);
    }

    @Test
    void loginConCredencialesValidasDevuelveToken() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"Admin123!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_ADMIN"));
    }

    @Test
    void loginConCabeceraTokenInvalidaSigueAutenticando() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .header("Authorization", "Bearer token-invalido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"user\",\"password\":\"User123!\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_USER"));
    }

    @Test
    void loginConClaveIncorrectaDevuelve401() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"admin\",\"password\":\"clave-erronea\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginConUsuarioInexistenteDevuelve401() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"no-existe\",\"password\":\"Admin123!\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meConTokenInvalidoDevuelve401() throws Exception {
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void meConTokenExpiradoDevuelve401() throws Exception {
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + tokenExpirado()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void meConTokenFirmadoConOtroSecretoDevuelve401() throws Exception {
        mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + tokenFirmadoConOtroSecreto()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void productoConTokenExpiradoDevuelve401SinEscribirEnBaseDeDatos() throws Exception {
        long productosAntes = productos.count();

        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + tokenExpirado())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson("AUTH-EXPIRADO-01")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));

        org.junit.jupiter.api.Assertions.assertEquals(productosAntes, productos.count(),
                "Un token expirado no debe provocar escrituras en la base de datos");
    }

    @Test
    void meConTokenUsuarioDevuelveDatosReales() throws Exception {
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + token("user", "ROLE_USER")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user"))
                .andExpect(jsonPath("$.nombre").value("Cliente"))
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_USER"));
    }

    @Test
    void meConTokenAdminDevuelveDatosReales() throws Exception {
        mockMvc.perform(get("/auth/me").header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.nombre").value("Administrador"))
                .andExpect(jsonPath("$.authorities[0]").value("ROLE_ADMIN"));
    }

    @Test
    void autenticacionNoCreaSesion() throws Exception {
        var resultado = mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + token("user", "ROLE_USER")))
                .andExpect(status().isOk())
                .andReturn();
        org.junit.jupiter.api.Assertions.assertNull(resultado.getRequest().getSession(false));
    }

    @Test
    void productoConTokenInvalidoDevuelve401() throws Exception {
        mockMvc.perform(get("/api/productos").header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void usuarioPuedeListarPeroNoModificarProductos() throws Exception {
        mockMvc.perform(get("/api/productos").header("Authorization", "Bearer " + token("user", "ROLE_USER")))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/productos/1")
                        .header("Authorization", "Bearer " + token("user", "ROLE_USER"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson("AUTH-PUT-01")))
                .andExpect(status().isForbidden());

        mockMvc.perform(delete("/api/productos/1")
                        .header("Authorization", "Bearer " + token("user", "ROLE_USER")))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminPuedeCrearYEliminarProducto() throws Exception {
        String respuesta = mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(productoJson("AUTH-ADMIN-01")))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long id = ((Number) new com.fasterxml.jackson.databind.ObjectMapper()
                .readValue(respuesta, java.util.Map.class).get("id")).longValue();

        mockMvc.perform(delete("/api/productos/" + id)
                        .header("Authorization", "Bearer " + token("admin", "ROLE_ADMIN")))
                .andExpect(status().isNoContent());
    }

    @Test
    void clavesEstanHashadasConBCrypt() {
        var admin = usuarios.findByUsername("admin").orElseThrow();
        assertNotEquals("Admin123!", admin.getPassword());
        assertTrue(admin.getPassword().startsWith("$2"));
        assertTrue(codificador.matches("Admin123!", admin.getPassword()));
    }

    @Test
    void corsSoloPermiteElOrigenDelFrontend() throws Exception {
        mockMvc.perform(options("/api/productos")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));

        mockMvc.perform(options("/api/productos")
                        .header("Origin", "http://ejemplo-malicioso.test")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
