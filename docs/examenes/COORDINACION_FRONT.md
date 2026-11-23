# Coordinación con el front: banco v3 de Subgerente

El árbol compartido del front (`impulso_admin_front_page`, rama
`hector_dev/rol-unico-privacidad`) es de otra sesión y **no se tocó**. La v3
vive en un front de pruebas propio:

- worktree `impulso_admin_front_page-examenes`, rama `hector_dev/examenes-front-banco-v3`
  (base `ac8f570` + copia del trabajo sin commit de la otra sesión, sellada en
  `~/.local/share/impulso-examenes/sellos.log`, línea FRONT-WORKTREE).
- Cambia solo dos archivos respecto a esa copia:
  - `src/pages/public/exams/questionBank.ts`: práctico de `assistant_manager` = banco v3.
  - `src/lib/bankFingerprint.test.ts`: `assistant_manager: "12-b76ae418bdeb02cd"`.

## Para adoptar la v3 en el front real (un solo cambio coordinado)

1. Back: `CURRENT_BANK_FINGERPRINT.practical.assistant_manager = '12-b76ae418bdeb02cd'`
   (ya en `hector_dev/examenes-practico-subgerente`). Las respuestas a v1 y v2
   se siguen calificando con su rúbrica; no se marcan «banco equivocado».
2. Front: los mismos dos archivos de arriba.
3. Desplegar back antes que front. Con el back nuevo y el front viejo, las
   respuestas v1 se califican con la rúbrica v1.1 (sin pérdida).

Mientras el front real muestre v1, cualquier ronda de Subgerente se marca
«solo probado en backend» para producción.
