package com.ferreteria.losmaestros;

import com.ferreteria.losmaestros.config.DatabaseStartupDiagnostics;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FerreteriaApplication {

    public static void main(String[] args) {
        try {
            SpringApplication.run(FerreteriaApplication.class, args);
        } catch (RuntimeException ex) {
            System.err.println(DatabaseStartupDiagnostics.describir(ex));
            throw ex;
        }
    }
}
