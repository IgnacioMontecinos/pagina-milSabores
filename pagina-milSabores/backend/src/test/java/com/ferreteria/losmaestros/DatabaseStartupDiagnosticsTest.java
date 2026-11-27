package com.ferreteria.losmaestros;

import com.ferreteria.losmaestros.config.DatabaseStartupDiagnostics;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DatabaseStartupDiagnosticsTest {

    @Test
    void detectaServidorNoDisponible() {
        String mensaje = DatabaseStartupDiagnostics.describir(
                new RuntimeException("Connection refused: connect"));
        assertTrue(mensaje.contains("no está disponible"));
    }

    @Test
    void detectaCredencialesIncorrectas() {
        String mensaje = DatabaseStartupDiagnostics.describir(
                new RuntimeException("Access denied for user 'test' (using password: YES)"));
        assertTrue(mensaje.contains("Credenciales de MariaDB/MySQL incorrectas"));
    }

    @Test
    void detectaBaseDeDatosAusente() {
        String mensaje = DatabaseStartupDiagnostics.describir(
                new RuntimeException("Unknown database 'ferreteria_los_maestros'"));
        assertTrue(mensaje.contains("no existe"));
    }

    @Test
    void detectaFalloDeEsquema() {
        String mensaje = DatabaseStartupDiagnostics.describir(
                new RuntimeException("SchemaManagementException: Unsuccessful: create table categorias"));
        assertTrue(mensaje.contains("Hibernate no pudo crear o actualizar el esquema"));
    }

    @Test
    void detectaUsuarioConHost() {
        String mensaje = DatabaseStartupDiagnostics.describir(
                new RuntimeException("Access denied for user 'root@localhost'@'localhost' (using password: YES)"));
        assertTrue(mensaje.contains("DB_USER parece incluir el host"));
    }

    @Test
    void detectaVariablesDeEntornoFaltantes() {
        String mensaje = DatabaseStartupDiagnostics.describir(
                new RuntimeException("Could not resolve placeholder 'DB_USER'"));
        assertTrue(mensaje.contains("Faltan variables de entorno"));
    }

    @Test
    void rechazaUsuarioConArroba() {
        IllegalStateException error = assertThrows(IllegalStateException.class,
                () -> DatabaseStartupDiagnostics.validarNombreUsuario("root@localhost"));
        assertTrue(error.getMessage().contains("sin '@localhost'"));
    }
}
