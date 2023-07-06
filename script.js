const generarButton = document.getElementById('generarButton');
const contenedorPreguntas = document.getElementById('contenedorPreguntas');
const dificultadSelect = document.getElementById('dificultad');
const tipoSelect = document.getElementById('tipo');
const categoriaSelect = document.getElementById('categoria');
let puntaje = 0;
let indicePreguntaActual = 0;
let datosPreguntas = [];

generarButton.addEventListener('click', () => {
  const dificultad = dificultadSelect.value;
  const tipo = tipoSelect.value;
  const categoria = categoriaSelect.value;
  const apiUrl = `https://opentdb.com/api.php?amount=10&difficulty=${dificultad}&type=${tipo}&category=${categoria}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      datosPreguntas = data.results;
      indicePreguntaActual = 0;
      puntaje = 0;
      mostrarSiguientePregunta();
    })
    .catch(error => {
      console.error('Error al obtener las preguntas:', error);
    });
});

function mostrarSiguientePregunta() {
  const preguntaActual = datosPreguntas[indicePreguntaActual];

  if (preguntaActual) {
    const preguntaElemento = document.createElement('div');
    preguntaElemento.classList.add('pregunta');
    preguntaElemento.innerHTML = `<h3>Pregunta ${indicePreguntaActual + 1}</h3>
      <p>${preguntaActual.question}</p>`;

    const respuestasElemento = document.createElement('ul');
    respuestasElemento.classList.add('respuestas');

    const todasRespuestas = [...preguntaActual.incorrect_answers, preguntaActual.correct_answer];
    todasRespuestas.sort(() => Math.random() - 0.5); 

    todasRespuestas.forEach(respuesta => {
      const respuestaElemento = document.createElement('li');
      respuestaElemento.innerText = respuesta;
      respuestaElemento.addEventListener('click', () => {
        manejarClicRespuesta(respuesta, preguntaActual.correct_answer, respuestaElemento);
      });
      respuestasElemento.appendChild(respuestaElemento);
    });

    preguntaElemento.appendChild(respuestasElemento);
    contenedorPreguntas.innerHTML = '';
    contenedorPreguntas.appendChild(preguntaElemento);
    contenedorPreguntas.style.display = 'block';
  } else {
    mostrarPuntajeFinal();
  }
}

function manejarClicRespuesta(respuestaSeleccionada, respuestaCorrecta, elementoRespuesta) {
  const preguntaActual = datosPreguntas[indicePreguntaActual];

  if (respuestaSeleccionada === respuestaCorrecta) {
    puntaje += 100;
    elementoRespuesta.style.backgroundColor = '#2ecc71'; // Verde
  } else {
    elementoRespuesta.style.backgroundColor = '#e74c3c'; // Rojo
  }

  preguntaActual.respuestaUsuario = respuestaSeleccionada;

  setTimeout(() => {
    indicePreguntaActual++;
    mostrarSiguientePregunta();
  }, 1000);
}

function mostrarPuntajeFinal() {
  contenedorPreguntas.innerHTML = '';

  const puntajeElemento = document.createElement('div');
  puntajeElemento.classList.add('puntaje');
  puntajeElemento.innerText = `Puntaje final: ${puntaje}`;
  contenedorPreguntas.appendChild(puntajeElemento);
}
