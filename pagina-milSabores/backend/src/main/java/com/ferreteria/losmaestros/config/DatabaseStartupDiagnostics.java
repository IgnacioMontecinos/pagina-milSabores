package com.ferreteria.losmaestros.config;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.Locale;
import javax.sql.DataSource;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseStartupDiagnostics {

    @Bean
    public InitializingBean databaseStartupValidator(DataSource dataSource,
                                                     @Value("${spring.datasource.url}") String url,
                                                     @Value("${spring.datasource.username}") String username) {
        return () -> {
            validarNombreUsuario(username);
            if (url == null || url.startsWith("jdbc:h2:")) {
                return;
            }
            try (Connection conexion = dataSource.getConnection()) {
                if (!conexion.isValid(5)) {
                    throw new IllegalStateException("MariaDB/MySQL no respondió a la prueba de conexión.");
                }
            } catch (SQLException ex) {
                throw new IllegalStateException(describir(ex), ex);
            }
        };
    }

    @Bean
    public static BeanFactoryPostProcessor databaseValidationBeforeJpa() {
        return fabrica -> {
            if (fabrica.containsBeanDefinition("entityManagerFactory")) {
                fabrica.getBeanDefinition("entityManagerFactory").setDependsOn("databaseStartupValidator");
            }
        };
    }

    public static void validarNombreUsuario(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalStateException("DB_USER no está definido. Configura el nombre de usuario de MariaDB/MySQL.");
        }
        if (username.contains("@")) {
            throw new IllegalStateException("DB_USER debe contener solo el usuario (por ejemplo root), sin '@localhost'. Revisa DB_USER.");
        }
    }

    public static String describir(Throwable error) {
        StringBuilder partes = new StringBuilder();
        Throwable actual = error;
        while (actual != null) {
            if (actual.getMessage() != null && !actual.getMessage().isBlank()) {
                partes.append(actual.getMessage()).append(' ');
            }
            actual = actual.getCause();
        }
        String texto = partes.toString().toLowerCase(Locale.ROOT);

        if (contiene(texto, "could not resolve placeholder", "placeholder")) {
            return "Faltan variables de entorno de base de datos. Configura DB_USER y DB_PASSWORD según .env.example.";
        }
        if (contiene(texto, "connection refused", "communications link failure",
                "connect timed out", "socket")) {
            return "MariaDB/MySQL no está disponible. Verifica que el servicio esté ejecutándose en localhost:3306.";
        }
        if (contiene(texto, "access denied", "using password: no", "using password: yes")) {
            if (contiene(texto, "root@localhost")) {
                return "DB_USER parece incluir el host ('root@localhost'). Usa solo el usuario, por ejemplo root, y revisa DB_PASSWORD.";
            }
            return "Credenciales de MariaDB/MySQL incorrectas. Revisa DB_USER (sin @localhost) y DB_PASSWORD.";
        }
        if (contiene(texto, "unknown database", "database doesn't exist", "database not exist")) {
            return "La base de datos ferreteria_los_maestros no existe. Créala con CREATE DATABASE IF NOT EXISTS ferreteria_los_maestros CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
        }
        if (contiene(texto, "schemamanagement", "schema management", "hbm2ddl", "ddl",
                "create table", "alter table", "generationtarget")) {
            return "Hibernate no pudo crear o actualizar el esquema. Revisa DDL_AUTO, permisos del usuario y coherencia de la base de datos.";
        }
        return "No se pudo iniciar la conexión con MariaDB/MySQL: " + error.getMessage();
    }

    private static boolean contiene(String texto, String... fragmentos) {
        for (String fragmento : fragmentos) {
            if (texto.contains(fragmento)) {
                return true;
            }
        }
        return false;
    }
}
