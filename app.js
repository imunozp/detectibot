const app = document.getElementById("app");

let puntaje = 0;
let moduloDesbloqueado = 1;
let moduloActual = null;
let escenariosActuales = [];
let escenarioIndex = 0;
let puntajesPorModulo = {};
const porcentajeAprobacion = 70;

const modulos = [
  {
    id: 1,
    titulo: "Gestión de Credenciales",
    descripcion: "Aprende a proteger contraseñas, cuentas compartidas y accesos digitales.",
    microleccion: `
      Las credenciales digitales representan la primera barrera de seguridad de una organización.
      Una contraseña reutilizada, compartida o almacenada de forma insegura puede permitir accesos no autorizados
      a información personal o institucional. En este módulo aprenderás a identificar decisiones seguras
      relacionadas con contraseñas, cuentas compartidas y almacenamiento de accesos.
    `,
    escenarios: [
      {
        titulo: "Computador Compartido",
        pregunta: "Estás usando un computador compartido para revisar una cuenta institucional. El navegador te pregunta si deseas guardar tu contraseña. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Guardar la contraseña para ingresar más rápido.", correcta: false, feedback: "Guardar contraseñas en equipos compartidos aumenta el riesgo de acceso no autorizado." },
          { texto: "No guardar la contraseña y cerrar sesión al terminar.", correcta: true, feedback: "Correcto. Evitar guardar credenciales y cerrar sesión reduce la exposición de la cuenta." },
          { texto: "Guardarla porque solo la usan compañeros conocidos.", correcta: false, feedback: "La confianza no elimina el riesgo. Un equipo compartido puede ser usado o vulnerado por terceros." }
        ]
      },
      {
        titulo: "Cuenta Compartida de Sección",
        pregunta: "Una cuenta de correo de sección está vinculada en varios teléfonos, notebooks y tablets. ¿Cuál es el principal riesgo de esta práctica?",
        opciones: [
          { texto: "Que la cuenta funcione más lento.", correcta: false, feedback: "La lentitud no es el riesgo principal. El problema central es la exposición del acceso." },
          { texto: "Que si un dispositivo es vulnerado, pueda comprometerse toda la cuenta.", correcta: true, feedback: "Correcto. Una cuenta compartida aumenta la superficie de ataque." },
          { texto: "Que se eliminen automáticamente los correos antiguos.", correcta: false, feedback: "Ese no es el riesgo principal. El foco está en accesos no autorizados y exposición de información." }
        ]
      },
      {
        titulo: "Reutilización de Contraseñas",
        pregunta: "Usas la misma contraseña para correo, redes sociales y una plataforma académica. ¿Qué riesgo genera esta práctica?",
        opciones: [
          { texto: "Si una cuenta se filtra, las demás también pueden quedar expuestas.", correcta: true, feedback: "Correcto. Reutilizar contraseñas facilita el acceso a múltiples cuentas si una credencial es comprometida." },
          { texto: "No genera riesgo si la contraseña es fácil de recordar.", correcta: false, feedback: "Una contraseña fácil de recordar puede ser débil y reutilizarla aumenta el impacto de una filtración." },
          { texto: "Solo afecta a las redes sociales, no al correo.", correcta: false, feedback: "El riesgo puede afectar cualquier cuenta donde se utilice la misma contraseña." }
        ]
      },
      {
        titulo: "Contraseña por Mensaje",
        pregunta: "Un compañero te pide que le envíes la clave de una cuenta compartida por WhatsApp para revisar un documento urgente. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Enviar la clave rápidamente para ayudar.", correcta: false, feedback: "Compartir contraseñas por mensajería aumenta el riesgo de exposición y pérdida de control." },
          { texto: "Evitar enviar la contraseña y buscar un mecanismo más seguro de acceso.", correcta: true, feedback: "Correcto. Las credenciales no deben compartirse por canales informales o inseguros." },
          { texto: "Enviar la clave y borrar el mensaje después.", correcta: false, feedback: "Borrar el mensaje no garantiza que la información no haya sido vista, respaldada o reenviada." }
        ]
      },
      {
        titulo: "Autocompletado del Navegador",
        pregunta: "Al ingresar a una red social personal, el navegador pregunta si quieres guardar usuario y clave. Estás usando una cuenta compartida en el mismo navegador. ¿Qué decisión es más segura?",
        opciones: [
          { texto: "Aceptar, porque la clave pertenece a una cuenta personal.", correcta: false, feedback: "Podría guardarse en el perfil equivocado o quedar disponible para otros usuarios." },
          { texto: "Rechazar el guardado automático y revisar qué cuenta está activa en el navegador.", correcta: true, feedback: "Correcto. Es importante controlar dónde se almacenan las credenciales." },
          { texto: "Guardar la clave si el navegador lo recomienda.", correcta: false, feedback: "Las recomendaciones automáticas no siempre consideran el contexto de uso compartido." }
        ]
      },
      {
        titulo: "Clave Fácil de Recordar",
        pregunta: "Para no olvidar tu contraseña, decides usar tu fecha de nacimiento junto con tus iniciales. ¿Qué tan segura es esta práctica?",
        opciones: [
          { texto: "Es segura porque solo tú conoces tus iniciales.", correcta: false, feedback: "Las fechas e iniciales pueden ser fáciles de deducir o encontrar en redes sociales." },
          { texto: "Es riesgosa porque usa datos personales predecibles.", correcta: true, feedback: "Correcto. Las contraseñas no deben basarse en información personal fácil de asociar." },
          { texto: "Es segura si se usa solo en cuentas académicas.", correcta: false, feedback: "Toda cuenta puede contener información relevante y debe protegerse adecuadamente." }
        ]
      },
      {
        titulo: "Sesión Activa",
        pregunta: "Terminaste de revisar una cuenta institucional en un computador que no es tuyo. ¿Cuál es la acción más segura antes de retirarte?",
        opciones: [
          { texto: "Cerrar la pestaña del navegador.", correcta: false, feedback: "Cerrar la pestaña no siempre cierra la sesión activa." },
          { texto: "Cerrar sesión y verificar que la cuenta no quede abierta.", correcta: true, feedback: "Correcto. Cerrar sesión reduce el riesgo de accesos posteriores no autorizados." },
          { texto: "Apagar la pantalla del computador.", correcta: false, feedback: "Apagar la pantalla no protege necesariamente la sesión ni la cuenta." }
        ]
      },
      {
        titulo: "Acceso Prestado",
        pregunta: "Un compañero te pide usar tu sesión abierta para descargar material académico porque olvidó su acceso. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Permitirlo porque es solo material académico.", correcta: false, feedback: "Prestar una sesión impide controlar qué acciones se realizan con tu cuenta." },
          { texto: "No prestar la sesión y sugerir recuperar o solicitar su propio acceso.", correcta: true, feedback: "Correcto. Cada usuario debe utilizar sus propias credenciales." },
          { texto: "Permitirlo, pero mirando lo que hace.", correcta: false, feedback: "Aunque observes, sigues exponiendo tu cuenta y responsabilidad sobre acciones realizadas." }
        ]
      }
    ]
  },
  {
    id: 2,
    titulo: "Phishing e Ingeniería Social",
    descripcion: "Reconoce mensajes sospechosos, enlaces falsos y técnicas de engaño.",
    microleccion: `
      El phishing y la ingeniería social buscan engañar al usuario para obtener información, credenciales
      o acceso a sistemas. Generalmente utilizan urgencia, suplantación de identidad, enlaces falsos
      y mensajes diseñados para provocar una respuesta rápida. En este módulo aprenderás a detenerte,
      observar señales de alerta y verificar antes de actuar.
    `,
    escenarios: [
      {
        titulo: "Correo Urgente",
        pregunta: "Recibes un correo que indica: “Tu cuenta será suspendida en 24 horas. Ingresa al enlace para validar tus credenciales”. El remitente parece extraño. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Abrir el enlace rápidamente para evitar el bloqueo.", correcta: false, feedback: "La urgencia es una técnica común de phishing para presionar al usuario." },
          { texto: "Revisar remitente, enlace y confirmar por un canal oficial.", correcta: true, feedback: "Correcto. Verificar antes de actuar reduce el riesgo de caer en suplantaciones." },
          { texto: "Reenviar el correo a compañeros para que ellos prueben primero.", correcta: false, feedback: "Reenviar un correo sospechoso puede propagar el riesgo a otros usuarios." }
        ]
      },
      {
        titulo: "Enlace de Supuesto Docente",
        pregunta: "Un supuesto docente envía por mensajería un enlace para descargar material de clases, pero el enlace no pertenece a una plataforma conocida. ¿Qué decisión es más segura?",
        opciones: [
          { texto: "Abrirlo porque parece provenir de un docente.", correcta: false, feedback: "La apariencia del remitente no basta para confiar. Puede existir suplantación." },
          { texto: "Confirmar con el docente por un canal oficial antes de abrir.", correcta: true, feedback: "Correcto. Validar la fuente es una buena práctica frente a enlaces sospechosos." },
          { texto: "Descargarlo, pero no abrir el archivo hasta después.", correcta: false, feedback: "Descargar archivos sospechosos también puede exponer el dispositivo." }
        ]
      },
      {
        titulo: "Archivo Adjunto Sospechoso",
        pregunta: "Recibes un archivo adjunto llamado “calificaciones_finales.exe” desde un correo desconocido. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Abrirlo para revisar si corresponde a tus notas.", correcta: false, feedback: "Los archivos ejecutables de origen desconocido pueden contener malware." },
          { texto: "No abrirlo y reportar o verificar su legitimidad.", correcta: true, feedback: "Correcto. Ante archivos sospechosos, lo seguro es no ejecutarlos y verificar." },
          { texto: "Abrirlo solo si el antivirus no muestra alerta.", correcta: false, feedback: "La ausencia de alerta no garantiza que el archivo sea seguro." }
        ]
      },
      {
        titulo: "Mensaje de WhatsApp",
        pregunta: "Recibes un mensaje de WhatsApp de un número desconocido que dice ser parte de la coordinación académica y solicita tus datos de acceso. ¿Qué haces?",
        opciones: [
          { texto: "Entregar los datos porque parece algo institucional.", correcta: false, feedback: "Nunca deben entregarse credenciales por mensajería informal." },
          { texto: "Verificar la identidad del remitente por un canal oficial.", correcta: true, feedback: "Correcto. La verificación por canal oficial permite reducir el riesgo de suplantación." },
          { texto: "Responder preguntando para qué necesita los datos.", correcta: false, feedback: "Continuar la conversación puede aumentar la exposición frente al atacante." }
        ]
      },
      {
        titulo: "QR Desconocido",
        pregunta: "Encuentras un código QR pegado en una sala que promete acceso rápido a material académico. No tiene identificación oficial. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Escanearlo porque podría ser útil.", correcta: false, feedback: "Los QR pueden dirigir a sitios falsos o maliciosos." },
          { texto: "Evitar escanearlo y confirmar su origen.", correcta: true, feedback: "Correcto. Antes de escanear códigos QR, se debe verificar su procedencia." },
          { texto: "Escanearlo, pero cerrar la página si se ve extraña.", correcta: false, feedback: "El riesgo puede comenzar al ingresar al enlace, incluso antes de interactuar." }
        ]
      },
      {
        titulo: "Premio Falso",
        pregunta: "Te llega un mensaje indicando que ganaste un beneficio y debes ingresar tus datos personales en un enlace para cobrarlo. ¿Cuál es la mejor decisión?",
        opciones: [
          { texto: "Ingresar los datos si el premio parece real.", correcta: false, feedback: "Las ofertas atractivas son usadas para obtener datos personales o credenciales." },
          { texto: "Desconfiar del mensaje y verificar en canales oficiales.", correcta: true, feedback: "Correcto. Los beneficios reales deben confirmarse por medios formales." },
          { texto: "Compartir el enlace para que otros también participen.", correcta: false, feedback: "Compartir enlaces sospechosos puede ampliar el alcance del ataque." }
        ]
      },
      {
        titulo: "Remitente Parecido",
        pregunta: "Recibes un correo desde una dirección muy parecida a una institucional, pero con una letra cambiada. Solicita actualizar tu contraseña. ¿Qué indica esta señal?",
        opciones: [
          { texto: "Puede ser un intento de suplantación de identidad.", correcta: true, feedback: "Correcto. Los atacantes suelen usar dominios o correos parecidos para engañar." },
          { texto: "Es normal que las instituciones cambien letras del correo.", correcta: false, feedback: "Los cambios mínimos en direcciones pueden ser señales de phishing." },
          { texto: "No importa el remitente si el mensaje está bien redactado.", correcta: false, feedback: "Un mensaje bien redactado también puede ser fraudulento." }
        ]
      },
      {
        titulo: "Solicitud de Urgencia",
        pregunta: "Un mensaje indica que debes enviar inmediatamente un documento personal porque “el plazo vence en minutos”. ¿Qué elemento de ingeniería social se observa?",
        opciones: [
          { texto: "Uso de presión o urgencia para provocar una reacción rápida.", correcta: true, feedback: "Correcto. La urgencia busca reducir el análisis crítico del usuario." },
          { texto: "Una actualización normal de seguridad.", correcta: false, feedback: "No toda solicitud urgente es legítima; puede ser una técnica de manipulación." },
          { texto: "Una mejora del proceso administrativo.", correcta: false, feedback: "La presión excesiva es una señal de alerta en ingeniería social." }
        ]
      }
    ]
  },
  {
    id: 3,
    titulo: "Uso Seguro de Dispositivos",
    descripcion: "Refuerza buenas prácticas al usar equipos personales o compartidos.",
    microleccion: `
      Los dispositivos personales y compartidos pueden convertirse en puntos de exposición si no se protegen adecuadamente.
      Bloquear pantalla, cerrar sesiones, evitar redes inseguras, controlar aplicaciones instaladas y proteger el acceso físico
      al equipo son prácticas esenciales para reducir riesgos de seguridad.
    `,
    escenarios: [
      {
        titulo: "Sesión Abierta",
        pregunta: "Después de usar una cuenta académica en un notebook compartido, debes retirarte rápidamente. ¿Cuál es la acción más segura?",
        opciones: [
          { texto: "Cerrar sesión y verificar que la cuenta no quede abierta.", correcta: true, feedback: "Correcto. Cerrar sesión evita accesos posteriores no autorizados." },
          { texto: "Cerrar solo la tapa del notebook.", correcta: false, feedback: "Cerrar la tapa no siempre bloquea el equipo ni cierra la sesión." },
          { texto: "Dejar la sesión abierta porque volverás después.", correcta: false, feedback: "Una sesión abierta puede ser utilizada por terceros, incluso en poco tiempo." }
        ]
      },
      {
        titulo: "Wi-Fi Pública",
        pregunta: "Necesitas ingresar a una cuenta con usuario y contraseña usando una red Wi-Fi pública sin clave. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Ingresar igual, pero hacerlo rápido.", correcta: false, feedback: "La rapidez no reduce el riesgo de exposición en redes inseguras." },
          { texto: "Evitar ingresar credenciales sensibles y usar una red confiable.", correcta: true, feedback: "Correcto. Las redes abiertas pueden facilitar la interceptación de información." },
          { texto: "Pedirle a otra persona que ingrese por ti desde la misma red.", correcta: false, feedback: "Eso no elimina el riesgo y además expone credenciales de otra persona." }
        ]
      },
      {
        titulo: "Teléfono sin Bloqueo",
        pregunta: "Un aspirante mantiene su teléfono sin clave, patrón ni reconocimiento biométrico. ¿Qué riesgo genera esta práctica?",
        opciones: [
          { texto: "Permite que cualquiera acceda a información y cuentas si toma el dispositivo.", correcta: true, feedback: "Correcto. El bloqueo de pantalla es una barrera básica de protección." },
          { texto: "No genera riesgo si el teléfono siempre está cerca.", correcta: false, feedback: "La cercanía no garantiza control permanente sobre el dispositivo." },
          { texto: "Solo afecta si el teléfono tiene aplicaciones bancarias.", correcta: false, feedback: "Cualquier cuenta o información almacenada puede verse comprometida." }
        ]
      },
      {
        titulo: "Aplicación Desconocida",
        pregunta: "Te recomiendan instalar una aplicación externa para descargar material académico, pero no proviene de una tienda oficial. ¿Qué deberías hacer?",
        opciones: [
          { texto: "Instalarla si parece útil para la clase.", correcta: false, feedback: "Instalar aplicaciones no verificadas puede exponer el dispositivo a malware." },
          { texto: "Evitar instalarla y confirmar si existe una fuente oficial.", correcta: true, feedback: "Correcto. Las aplicaciones deben provenir de fuentes confiables y verificadas." },
          { texto: "Instalarla y borrarla después de usarla.", correcta: false, feedback: "El daño puede ocurrir durante la instalación o ejecución de la aplicación." }
        ]
      },
      {
        titulo: "Préstamo de Dispositivo",
        pregunta: "Un compañero te pide prestado el teléfono para revisar una información, pero tienes sesiones personales abiertas. ¿Qué es lo más seguro?",
        opciones: [
          { texto: "Prestarlo rápidamente porque es un compañero.", correcta: false, feedback: "La confianza no reemplaza las medidas de seguridad ni el control de sesiones." },
          { texto: "No prestarlo con sesiones abiertas o usar un modo restringido si existe.", correcta: true, feedback: "Correcto. Evitar el acceso a sesiones abiertas protege información personal e institucional." },
          { texto: "Prestarlo, pero pedir que no revise otras aplicaciones.", correcta: false, feedback: "Las instrucciones verbales no garantizan protección de datos o cuentas." }
        ]
      },
      {
        titulo: "Notificación en Pantalla",
        pregunta: "Tu teléfono muestra notificaciones de correos y mensajes en la pantalla bloqueada. ¿Qué riesgo puede generar?",
        opciones: [
          { texto: "Que terceros vean información sensible sin desbloquear el equipo.", correcta: true, feedback: "Correcto. Las notificaciones visibles pueden exponer información privada o institucional." },
          { texto: "Ninguno, porque el teléfono está bloqueado.", correcta: false, feedback: "Aunque esté bloqueado, las notificaciones pueden mostrar contenido sensible." },
          { texto: "Solo consume más batería.", correcta: false, feedback: "El consumo de batería no es el principal riesgo de seguridad." }
        ]
      },
      {
        titulo: "Dispositivo Perdido",
        pregunta: "Pierdes un teléfono donde tenías cuentas académicas y correo abierto. ¿Cuál debería ser una acción prioritaria?",
        opciones: [
          { texto: "Esperar unas horas por si alguien lo devuelve.", correcta: false, feedback: "Esperar aumenta el tiempo de exposición de las cuentas y la información." },
          { texto: "Cambiar contraseñas, cerrar sesiones remotas y reportar la situación.", correcta: true, feedback: "Correcto. Actuar rápido reduce el riesgo de acceso no autorizado." },
          { texto: "Comprar otro teléfono y seguir usando las mismas claves.", correcta: false, feedback: "Si las sesiones quedaron abiertas, las cuentas pueden seguir expuestas." }
        ]
      },
      {
        titulo: "Bluetooth Activado",
        pregunta: "Mantienes Bluetooth y funciones de conexión activadas todo el tiempo, incluso en lugares públicos. ¿Qué práctica es más segura?",
        opciones: [
          { texto: "Dejarlas siempre activas para mayor comodidad.", correcta: false, feedback: "La comodidad no debe primar sobre la exposición innecesaria del dispositivo." },
          { texto: "Desactivar conexiones que no se estén utilizando.", correcta: true, feedback: "Correcto. Reducir servicios activos disminuye la superficie de exposición." },
          { texto: "Activarlas solo cuando la batería esté alta.", correcta: false, feedback: "El nivel de batería no determina el riesgo de seguridad." }
        ]
      }
    ]
  }
];

function mezclarArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function mostrarInicio() {
  app.innerHTML = `
    <section class="pantalla-inicio">
      <div class="numero-paso">1</div>
      <div class="version-app">DETECTIBOT v1.0</div>
      <div class="icono-sonido">🔊</div>

      <div class="contenido-principal">
        <div class="robot-area">
          <img src="detectibot.png" alt="Detectibot" class="robot">
        </div>

        <div class="texto-area">
          <div class="escudo">🛡️</div>
          <h1>DETECTI<span>BOT</span></h1>
          <p>Entrena tu seguridad.<br>Protege lo que importa.</p>
          <button id="btnComenzar">COMENZAR →</button>
        </div>
      </div>

      <div class="barra-inferior">
        <div class="info-programa">
          Programa de Concientización en Ciberseguridad<br>
          para Aspirantes de la Escuela PDI
        </div>
        <div class="logo-pdi">
          <img src="logo-pdi.png" alt="Logo PDI" class="logo-pdi-img">
        </div>
      </div>
    </section>
  `;

  document.getElementById("btnComenzar").addEventListener("click", mostrarModulos);
}

function mostrarModulos() {
  app.innerHTML = `
    <section class="pantalla-modulos">
      <div class="barra-superior">
        <button class="btn-volver" id="btnVolver">←</button>
        <div>
          <h2>Ruta de Entrenamiento</h2>
          <p>Completa cada módulo con al menos ${porcentajeAprobacion}% para avanzar.</p>
        </div>
      </div>

      <div class="modulos-layout">
        <div class="mentor-card">
          <img src="detectibot.png" alt="Detectibot" class="robot-mini">
          <h3>¡Hola! Soy Detectibot</h3>
          <p>Avanza módulo por módulo. Para desbloquear el siguiente, debes aprobar el módulo actual.</p>
        </div>

        <div class="lista-modulos">
          ${modulos.map(modulo => {
            const activo = modulo.id <= moduloDesbloqueado;
            return `
              <div class="modulo-card ${activo ? "activo" : "bloqueado"}">
                <div class="numero-modulo">${modulo.id}</div>
                <div class="contenido-modulo">
                  <h3>${modulo.titulo}</h3>
                  <p>${modulo.descripcion}</p>
                  <button class="btn-modulo ${activo ? "" : "bloqueado-btn"}" 
                          ${activo ? `onclick="iniciarModulo(${modulo.id})"` : ""}>
                    ${activo ? "INICIAR" : "BLOQUEADO 🔒"}
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    </section>
  `;

  document.getElementById("btnVolver").addEventListener("click", mostrarInicio);
}

function iniciarModulo(idModulo) {
  moduloActual = modulos.find(m => m.id === idModulo);
  puntaje = 0;
  escenarioIndex = 0;

  escenariosActuales = mezclarArray(moduloActual.escenarios).map(escenario => {
    return {
      ...escenario,
      opciones: mezclarArray(escenario.opciones)
    };
  });

  mostrarMicroleccion();
}

function mostrarMicroleccion() {
  app.innerHTML = `
    <section class="pantalla-leccion">
      <div class="leccion-card">
        <img src="detectibot.png" alt="Detectibot" class="robot-leccion">
        <div class="tag-leccion">MICROAPRENDIZAJE</div>
        <h2>${moduloActual.titulo}</h2>
        <p>${moduloActual.microleccion}</p>
        <button id="btnContinuarLeccion">CONTINUAR →</button>
      </div>
    </section>
  `;

  document.getElementById("btnContinuarLeccion").addEventListener("click", mostrarEscenario);
}

function mostrarEscenario() {
  const escenario = escenariosActuales[escenarioIndex];
  const letras = ["A", "B", "C"];
  const progreso = Math.round(((escenarioIndex + 1) / escenariosActuales.length) * 100);

  app.innerHTML = `
    <section class="pantalla-escenario nueva-ui">
      <div class="top-juego">
        <button class="btn-volver-mini" onclick="mostrarModulos()">←</button>
        <div class="titulo-escenario">ESCENARIO ${escenarioIndex + 1} DE ${escenariosActuales.length}</div>
        <div class="puntaje-pill">⭐ ${puntaje}</div>
      </div>

      <div class="barra-progreso">
        <div class="barra-progreso-interna" style="width:${progreso}%"></div>
      </div>

      <div class="escenario-grid">
        <div class="detectibot-esquina">
          <img src="detectibot.png" alt="Detectibot">
        </div>

        <div class="escenario-contenido">
          <div class="tarjeta-pregunta">
            <h2>${escenario.titulo}</h2>
            <p>${escenario.pregunta}</p>
          </div>

          <div class="opciones-lista">
            ${escenario.opciones.map((opcion, index) => `
              <button class="opcion-grafica" onclick="evaluarRespuesta(${index})">
                <span class="letra-opcion">${letras[index]}</span>
                <span>${opcion.texto}</span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    </section>
  `;
}

function evaluarRespuesta(indexOpcion) {
  const escenario = escenariosActuales[escenarioIndex];
  const opcionSeleccionada = escenario.opciones[indexOpcion];

  if (opcionSeleccionada.correcta) {
    puntaje += 10;
  }

  mostrarFeedback(opcionSeleccionada.correcta, opcionSeleccionada.feedback);
}

function mostrarFeedback(correcta, feedback) {
  app.innerHTML = `
    <section class="pantalla-feedback nueva-ui">
      <div class="top-juego">
        <div class="numero-paso-mini">${escenarioIndex + 1}</div>
        <div class="titulo-escenario">${correcta ? "¡MUY BIEN!" : "REVISEMOS ESTA DECISIÓN"}</div>
        <div class="puntaje-pill">⭐ ${puntaje}</div>
      </div>

      <div class="feedback-grid">
        <div class="feedback-robot">
          <img src="detectibot.png" alt="Detectibot">
        </div>

        <div class="feedback-contenido">
          <div class="tarjeta-feedback ${correcta ? "correcta" : "incorrecta"}">
            <h2>${correcta ? "¡Correcto!" : "Riesgo detectado"}</h2>
            <p>${feedback}</p>
          </div>

          <div class="tarjeta-buenas-practicas">
            <div class="icono-practica">🛡️</div>
            <div>
              <h3>Buenas prácticas</h3>
              <p>
                Antes de actuar, verifica el contexto, protege tus credenciales y evita exponer información personal o institucional.
              </p>
            </div>
          </div>

          <button id="btnSiguiente" class="btn-amarillo-grande">
            ${escenarioIndex < escenariosActuales.length - 1 ? "SIGUIENTE →" : "VER RESULTADO →"}
          </button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("btnSiguiente").addEventListener("click", () => {
    if (escenarioIndex < escenariosActuales.length - 1) {
      escenarioIndex++;
      mostrarEscenario();
    } else {
      mostrarResultadoModulo();
    }
  });
}

function mostrarResultadoModulo() {
  const puntajeMaximo = escenariosActuales.length * 10;
  const porcentaje = Math.round((puntaje / puntajeMaximo) * 100);
  const aprobado = porcentaje >= porcentajeAprobacion;

  if (aprobado) {
    puntajesPorModulo[moduloActual.id] = puntaje;
  }

  if (aprobado && moduloActual.id === moduloDesbloqueado && moduloDesbloqueado < modulos.length) {
    moduloDesbloqueado++;
  }

  app.innerHTML = `
    <section class="pantalla-resultado-modulo nueva-ui">
      <div class="resultado-modulo-card">
        <div class="resultado-robot">
          <img src="detectibot.png" alt="Detectibot">
        </div>

        <div class="resultado-info">
          <h2>${aprobado ? "MÓDULO APROBADO" : "MÓDULO POR REFORZAR"}</h2>

          <div class="resultado-puntaje">
            <span>${puntaje}</span>
            <small>/ ${puntajeMaximo} puntos</small>
          </div>

          <div class="estrellas">
            ${aprobado ? "⭐ ⭐ ⭐" : "⭐ ⭐ ☆"}
          </div>

          <p>
            Obtuviste un ${porcentaje}% de logro en el módulo de ${moduloActual.titulo}.
            ${
              aprobado
                ? moduloActual.id < modulos.length
                  ? "Superaste el mínimo requerido y se desbloqueó el siguiente módulo."
                  : "Completaste todos los módulos de la ruta."
                : `Debes alcanzar al menos ${porcentajeAprobacion}% para avanzar. Te recomiendo repetir este módulo.`
            }
          </p>

          <button id="btnResultadoAccion" class="btn-amarillo-grande">
            ${
              aprobado
                ? moduloActual.id < modulos.length
                  ? "CONTINUAR →"
                  : "VER RESULTADO FINAL →"
                : "REPETIR MÓDULO"
            }
          </button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("btnResultadoAccion").addEventListener("click", () => {
    if (!aprobado) {
      iniciarModulo(moduloActual.id);
    } else if (moduloActual.id < modulos.length) {
      mostrarModulos();
    } else {
      mostrarResultadoFinal();
    }
  });
}

function mostrarResultadoFinal() {
  const totalObtenido = Object.values(puntajesPorModulo).reduce((a, b) => a + b, 0);
  const totalMaximo = modulos.length * 80;
  const porcentajeFinal = Math.round((totalObtenido / totalMaximo) * 100);

  app.innerHTML = `
    <section class="pantalla-final nueva-ui">
      <div class="final-card">
        <h2>RESULTADO FINAL</h2>

        <div class="medalla-final">🛡️⭐</div>

        <h3>¡FELICITACIONES!</h3>

        <p>Has completado todos los módulos de Detectibot.</p>

        <div class="resumen-final">
          <div>
            <span>${totalObtenido}</span>
            <small>Puntaje total</small>
          </div>

          <div>
            <span>${porcentajeFinal}%</span>
            <small>Nivel de logro</small>
          </div>
        </div>

        <button class="btn-amarillo-grande" onclick="reiniciarEntrenamiento()">
          REPETIR ENTRENAMIENTO
        </button>
      </div>
    </section>
  `;
}

function reiniciarEntrenamiento() {
  puntaje = 0;
  moduloDesbloqueado = 1;
  moduloActual = null;
  escenariosActuales = [];
  escenarioIndex = 0;
  puntajesPorModulo = {};
  mostrarInicio();
}

mostrarInicio();