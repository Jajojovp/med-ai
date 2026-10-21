# MedAI Oncología — especificación del MVP de revisión

## Objetivo

Adaptar MedAI para que un oncólogo pueda revisar tres flujos clínicos de forma segura: cáncer de mama, cáncer de pulmón no microcítico y cáncer gástrico. La primera entrega sirve para pruebas de usabilidad, completitud de datos y revisión clínica; no emite diagnóstico, recomendación terapéutica ni riesgo clínico validado.

## Alcance clínico

- Cáncer de mama: estadio, grado, ER, PR, HER2, Ki-67, ganglios y tratamiento previo.
- Pulmón no microcítico: estadio, histología, PD-L1, EGFR, ALK, ROS1, KRAS, BRAF, hábito tabáquico y tratamiento previo.
- Cáncer gástrico: localización, histología, estadio, HER2, PD-L1 CPS, MSI/MMR, ganglios y tratamiento previo.

La selección se basa en los modelos locales existentes (`cancer_mama_*`, `cancer_pulmon_*`, `cancer_estomago_*`) y en biomarcadores descritos por NCI/SEER. Los modelos no se ejecutan como herramienta clínica hasta contar con diccionario de variables, población de validación, calibración, sensibilidad/especificidad, versión y aprobación del equipo clínico.

## Datos y procedencia

El formulario acepta datos de un caso anonimizado y exige indicar la fuente del caso, fecha de la última actualización y si cada biomarcador está confirmado por informe de anatomía patológica o laboratorio. Las referencias visibles en la aplicación son NCI para biomarcadores de mama y pulmón y SEER para biomarcadores colorrectales como guía de interoperabilidad; no sustituyen guías locales.

## Criterios de aceptación

1. El oncólogo puede elegir una de las tres enfermedades y completar un caso sin identificadores directos.
2. La interfaz separa datos clínicos, biomarcadores, calidad de evidencia y contexto de tratamiento.
3. El sistema muestra qué campos faltan y un estado de preparación (`incompleto`, `listo para revisión`, `modelo no validado`).
4. Ningún resultado se presenta como diagnóstico ni como recomendación terapéutica.
5. No se persisten datos del paciente en esta versión.
6. La build, los tests y una prueba de navegador quedan documentados.

## Comandos

```powershell
npm run build
npm run test:e2e
```

## Límites de seguridad

- Nunca usar credenciales o secretos de ejemplo en producción.
- No cargar un modelo `.pkl` sin procedencia y revisión de integridad.
- No enviar PHI/PII a servicios externos.
- Mantener cookies HttpOnly, Secure y SameSite y añadir controles de cabeceras antes de despliegue.

