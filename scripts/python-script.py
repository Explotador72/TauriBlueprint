import sys
import io

# Forzar UTF-8 en la salida estándar para que Tauri pueda leer los caracteres especiales (tildes, ñ, ¡, etc.)
# Esto es necesario especialmente en Windows donde la consola suele usar cp1252.
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Tauri captura lo que imprimas en stdout (print)
print("--- Inicio del Sidecar Python ---")
print("¡Hola desde Python compilado!")
print(f"Argumentos recibidos desde Tauri: {sys.argv[1:]}")
print("--- Fin del Sidecar Python ---")
sys.stdout.flush()