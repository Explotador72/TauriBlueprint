# Manual del Template Tauri (Multi-Lenguaje)

Este documento explica cómo utilizar, personalizar y extender esta plantilla base de Tauri v2 que integra Frontend web (HTML/JS) con Backend nativo (Rust) y Sidecars (Python/Java).

## 0. Instalación Inicial (Al clonar el repositorio)

Como es estándar en proyectos de Node.js, la carpeta `node_modules` no se incluye en el código fuente para ahorrar espacio. Si descargas este proyecto, lo primero que debes hacer es restaurar las dependencias.

1.  Abre una terminal en la carpeta del proyecto.
2.  Ejecuta el siguiente comando:
    ```bash
    npm install
    ```
3.  Una vez termine, ya puedes iniciar el entorno de desarrollo:
    `npm run dev`

## 1. Personalización del Proyecto

Para adaptar esta plantilla a tu nuevo proyecto, debes editar el archivo principal de configuración:
**Ubicación:** `src-tauri/tauri.conf.json`

### Cambiar Nombre y Versión
Busca y modifica las siguientes líneas al inicio del archivo JSON:
```json
{
  "productName": "NombreDeTuApp",  // El nombre que verá el usuario
  "version": "1.0.0",              // Versión del instalador
  "identifier": "com.tuempresa.tuapp", // ID único (importante para el sistema operativo)
  ...
}
```

### Cambiar Iconos
Reemplaza los archivos de imagen ubicados en la carpeta:
`src-tauri/icons/`
*   Asegúrate de mantener los nombres de archivo (`icon.ico`, `icon.png`, etc.) o actualiza la sección `"icon"` en `tauri.conf.json`.

---

## 2. Cómo agregar funcionalidad (Python o Java)

Tauri utiliza el patrón **"Sidecar"**. Esto significa que no ejecutamos archivos `.py` o `.jar` directamente, sino que empaquetamos **ejecutables compilados (.exe)** junto con la aplicación.

### Paso A: Desarrollar el Script
1.  Crea tu script en la carpeta `scripts/` (esta carpeta es solo para tu código fuente, Tauri la ignora al compilar).
2.  **Importante para Python:** Agrega esto al inicio de tu script para evitar errores de caracteres en Windows:
    ```python
    import sys, io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    ```

### Paso B: Compilar a Ejecutable (.exe)
Debes convertir tu script en un binario independiente.

*   **Para Python (usando PyInstaller):**
    Ejecuta en la terminal:
    ```bash
    pyinstaller --clean --onefile --name nombre-de-tu-script scripts/tu-script.py
    ```
    Esto generará un `.exe` en la carpeta `dist/`.

### Paso C: Renombrar y Ubicar (Regla Estricta)
Tauri requiere que el ejecutable tenga un nombre específico que incluya la arquitectura del sistema (**Target Triple**).

1.  Ve a la carpeta `src-tauri/bin/`.
2.  Pega tu ejecutable allí.
3.  **Renómbralo** siguiendo este formato (para Windows 64-bits):
    
    `nombre-original` + `-x86_64-pc-windows-msvc.exe`
    
    *Ejemplo:* Si tu script se llama `analisis`, el archivo final debe ser:
    `src-tauri/bin/analisis-x86_64-pc-windows-msvc.exe`

### Paso D: Registrar en Configuración
Debes decirle a Tauri que incluya este nuevo binario. Edita `src-tauri/tauri.conf.json`:

Busca la sección `bundle` -> `externalBin` y agrega el nombre **corto** (sin la arquitectura ni extensión):
```json
"externalBin": [
  "bin/python-script",
  "bin/analisis"      <-- Tu nuevo script
]
```

### Paso E: Dar Permisos de Ejecución
Por seguridad, Tauri bloquea todo por defecto. Debes autorizar el nuevo script en `src-tauri/capabilities/default.json`:

```json
"permissions": [
  ...,
  {
    "identifier": "shell:allow-execute",
    "allow": [
      { "name": "bin/python-script", "sidecar": true },
      { "name": "bin/analisis", "sidecar": true } <-- Tu nuevo permiso
    ]
  }
]
```

### Paso F: Ejecutar desde JavaScript
En tu archivo `src/main.js` (o tu framework frontend), invoca el comando usando el nombre corto:

```javascript
const { Command } = window.__TAURI__.shell;

// Usa el nombre corto definido en externalBin
const command = Command.sidecar("bin/analisis");
const output = await command.execute();
console.log(output.stdout); // Resultado del script
```

---

## 3. Generar el Instalador Final
Para crear el archivo `.msi` o `.exe` para distribuir tu aplicación:

`npm run tauri build`