# CrediGaMi — Sistema financiero (Frontend)

Interfaz completa del sistema de préstamos pequeños **CrediGaMi**, lista para
abrir directamente con doble clic (`file:///.../index.html`) o integrar con tu
backend en Visual Studio Code / Render.

## Cómo abrir

Abre `frontend/login/index.html` (o el `index.html` de la raíz, que te
redirige automáticamente). Usuario de prueba: `asesor` o `admin`, con
cualquier contraseña.

## Estructura

```
CrediGaMi/
├── index.html                  → redirige al login
├── frontend/
│   ├── login/index.html
│   ├── dashboard/index.html
│   ├── clientes/index.html
│   ├── prestamos/index.html    → incluye firma del asesor, firma del
│   │                             cliente y verificación por huella digital
│   ├── pagos/index.html
│   ├── caja/index.html
│   ├── reportes/index.html
│   └── configuracion/index.html → aquí aparece el logo oficial
├── assets/
│   ├── img/logo-credigami.jpeg
│   ├── css/styles.css          → colores, tipografía y componentes
│   └── js/
│       ├── layout.js           → arma el menú lateral y la barra superior
│       ├── data.js             → datos de demostración (localStorage)
│       └── firma.js            → firma digital + huella (ver abajo)
└── README.md
```

## Colores de marca (tomados del logo)

| Color | Hex | Uso |
|---|---|---|
| Azul oscuro | `#153A66` | Confianza / finanzas — menú lateral, botones oscuros |
| Azul medio | `#2E6FB0` | Acentos, enlaces, gráficos |
| Naranja | `#F2941D` | Crecimiento / acción — botón primario, estado activo |
| Negro | `#181C22` | Texto fuerte / base |

El logo se muestra en el menú lateral de **todas** las páginas y, de forma
destacada, en **Configuración → Identidad de marca**, tal como pediste.

## Firma del asesor, firma del cliente y huella digital

Esto ya está **habilitado y funcionando** dentro de *Préstamos → Nueva
solicitud* (asistente de 4 pasos):

1. **Firma del asesor** y **firma del cliente**: son lienzos (`<canvas>`)
   donde se dibuja con el mouse o el dedo. Se guardan como imagen dentro del
   préstamo, con botones "Limpiar" y "Confirmar firma".
2. **Huella digital**: los navegadores, por seguridad, no permiten leer un
   lector de huella de forma directa. La manera real y compatible de usar la
   huella del propio equipo desde una página web es la API estándar
   **WebAuthn**, que activa el lector de huella o rostro del dispositivo
   (Windows Hello, Touch ID, huella de Android) para **verificar identidad**.
   Eso es lo que hace el botón "Verificar con huella digital" en
   `assets/js/firma.js`.
   - Si el equipo no tiene sensor biométrico, el sistema lo detecta
     automáticamente y ofrece un respaldo manual: adjuntar una imagen/
     constancia, para no bloquear el proceso.
   - Si antes lo veías "no habilitado", probablemente el código anterior no
     tenía este módulo conectado o el navegador bloqueó la función por abrir
     el archivo sin `https`/`localhost`. WebAuthn funciona en `file://` y
     `localhost` para pruebas; en producción debe servirse por `https`.

## Recibo de pago con código QR

Al registrar un pago (o al presionar "Ver recibo" en el historial), el sistema
abre un recibo imprimible con:

- N.º de recibo, N.º de cliente, fecha de emisión y fecha de pago.
- Datos del emisor (CrediGaMi) y del receptor (cliente).
- Detalle del consumo (pago de la cuota N.º X del préstamo correspondiente).
- Monto total en Lempiras (HNL).
- Un **código QR** que confirma que el recibo está pagado (útil para que el
  cliente lo escanee y verifique). El QR se genera con la API pública
  `api.qrserver.com` — si prefieres generarlo sin depender de internet,
  se puede reemplazar por una librería QR local más adelante.
- Botón **"Imprimir / Guardar PDF"**, que usa el diálogo de impresión del
  navegador (ahí puedes elegir "Guardar como PDF").

Este módulo vive en `assets/js/recibo.js` y se usa desde
`frontend/pagos/index.html`.

## Tipo de negocio del cliente

En **Clientes → Nuevo cliente** ahora se pide el tipo de negocio (venta de
ropa, pulpería, taller mecánico, repostería, etc.), y se muestra como
etiqueta en la tabla de clientes.

## Datos de demostración


`assets/js/data.js` guarda clientes, préstamos, pagos, caja y configuración en
`localStorage` para que puedas navegar el sistema con datos reales de
ejemplo. Cuando conectes tu backend (Node/Render, etc.), reemplaza las
funciones de `CG_DATA` por llamadas `fetch()` a tu API — el resto de la
interfaz no necesita cambiar.

## Integrarlo con tu proyecto existente

Copia la carpeta `CrediGaMi/` completa dentro de tu proyecto de Visual
Studio Code, sin sobrescribir tu backend. Todas las rutas dentro de
`frontend/*/index.html` son relativas (`../../assets/...`), así que puedes
mover la carpeta `CrediGaMi` a cualquier ubicación sin romper enlaces,
siempre que la estructura interna se mantenga igual.
