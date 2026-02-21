const { invoke } = window.__TAURI__.core;
const { Command } = window.__TAURI__.shell;

const outputEl = document.querySelector("#output");

// 1. Lógica JavaScript Pura + Rust Invoke
document.querySelector("#btn-js").addEventListener("click", async () => {
  // Llamada a una función simple de Rust (definida en main.rs)
  try {
    const response = await invoke("greet", { name: "Usuario" });
    outputEl.textContent = response;
  } catch (e) {
    outputEl.textContent = "Error: " + e;
  }
});

// 2. Lógica para Python (Sidecar)
document.querySelector("#btn-python").addEventListener("click", async () => {
  outputEl.textContent = "Ejecutando Python...";
  try {
    // 'run-python' es el nombre definido en tauri.conf.json
    // Nota: Esto requiere que tengas el binario configurado (ver instrucciones abajo)
    const command = Command.sidecar("bin/template");
    const output = await command.execute();
    outputEl.textContent = `Python Output: ${output.stdout}`;
  } catch (e) {
    outputEl.textContent = "Error Python (¿Configuraste el binario?): " + e;
  }
});

// 3. Lógica para Java (Sidecar)
document.querySelector("#btn-java").addEventListener("click", async () => {
  outputEl.textContent = "Ejecutando Java...";
  try {
    // Ejecutar un JAR requiere tener java instalado en el PATH del usuario
    // o empaquetar el JRE. Aquí asumimos un comando de sistema simple.
    const command = new Command('run-java', ['-jar', 'app.jar']);
    const output = await command.execute();
    outputEl.textContent = `Java Output: ${output.stdout}`;
  } catch (e) {
    outputEl.textContent = "Error Java: " + e;
  }
});
