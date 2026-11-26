// Importar Zod
import { z } from "https://cdn.jsdelivr.net/npm/zod@4.6.5/+esm";


// 1. Definir el esquema de validación
const esquema = z.object({

    nombre: z.string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(60, "El nombre no puede superar 60 caracteres."),

    correo: z.email({
        error: "Ingresa un correo electrónico válido."
    }),

    contrasena: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/[A-Z]/, "Debe contener una letra mayúscula.")
        .regex(/[0-9]/, "Debe contener al menos un número.")

});


// 2. Obtener elementos del DOM
const formulario = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

const campos = ["nombre", "correo", "contrasena"];


// 3. Obtener los datos del formulario
function obtenerDatos() {

    return {
        nombre: document.getElementById("nombre").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        contrasena: document.getElementById("contrasena").value
    };

}


// 4. Validar un campo individual
function validarCampo(campo) {

    const input = document.getElementById(campo);
    const error = document.getElementById(`error-${campo}`);

    const datos = obtenerDatos();

    const validacion = esquema.shape[campo].safeParse(datos[campo]);

    if (validacion.success) {

        error.textContent = "";
        input.setAttribute("aria-invalid", "false");

        return true;

    } else {

        error.textContent = validacion.error.issues[0].message;
        input.setAttribute("aria-invalid", "true");

        return false;
    }

}


// 5. Validación en tiempo real
campos.forEach(campo => {

    const input = document.getElementById(campo);

    input.addEventListener("input", () => {

        validarCampo(campo);

        resultado.textContent = "";
        resultado.className = "";

    });

});


// 6. Validar al enviar el formulario
formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const datos = obtenerDatos();

    const validacion = esquema.safeParse(datos);

    // Mostrar los errores de cada campo
    campos.forEach(campo => validarCampo(campo));

    if (!validacion.success) {

        resultado.textContent =
            "Revisa los campos marcados antes de continuar.";

        resultado.className = "fallo";

        return;
    }

    // Los datos cumplen el esquema
    resultado.textContent =
        "¡Datos válidos! Registro simulado correctamente.";

    resultado.className = "exito";

    // No mostramos ni guardamos la contraseña
    formulario.reset();

    campos.forEach(campo => {
        document.getElementById(campo).removeAttribute("aria-invalid");
        document.getElementById(`error-${campo}`).textContent = "";
    });

});