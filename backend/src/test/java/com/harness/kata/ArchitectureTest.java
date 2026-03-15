package com.harness.kata;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

class ArchitectureTest {

    private static JavaClasses importedClasses;

    @BeforeAll
    static void setup() {
        importedClasses = new ClassFileImporter()
                .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
                .importPackages("com.harness.kata");
    }

    @Test
    void layeredArchitectureIsRespected() {
        ArchRule rule = layeredArchitecture()
                .layer("Types").definedBy("..types..")
                .layer("Config").definedBy("..config..")
                .layer("Repo").definedBy("..repo..")
                .layer("Service").definedBy("..service..")
                .layer("Runtime").definedBy("..runtime..")
                .whereLayer("Config").mayOnlyBeAccessedByLayers("Repo", "Service", "Runtime")
                .whereLayer("Repo").mayOnlyBeAccessedByLayers("Service")
                .whereLayer("Service").mayOnlyBeAccessedByLayers("Runtime")
                .whereLayer("Runtime").mayOnlyBeAccessedByLayers();
        rule.check(importedClasses);
    }

    @Test
    void runtimeMustNotDependOnRepo() {
        noClasses()
                .that().resideInAPackage("..runtime..")
                .should().dependOnClassesThat().resideInAPackage("..repo..")
                .check(importedClasses);
    }

    @Test
    void serviceMustNotDependOnRuntime() {
        noClasses()
                .that().resideInAPackage("..service..")
                .should().dependOnClassesThat().resideInAPackage("..runtime..")
                .check(importedClasses);
    }
}
