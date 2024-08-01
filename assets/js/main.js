/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
  var $window = $(window),
    $body = $("body"),
    $wrapper = $("#wrapper"),
    $header = $("#header"),
    $footer = $("#footer"),
    $main = $("#main"),
    $main_articles = $main.children("article");
})(jQuery);

const contenido = [
  [
    "Ginecologia",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "Nueva Frase 1 - 1",
    "Nueva Frase 2 - 1",
    "Nueva Frase 3 - 1",
    "Nueva Frase 4 - 1",
  ],
  [
    "Ginecologia",
    "bbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "Nueva Frase 1 - 2",
    "Nueva Frase 2 - 2",
    "Nueva Frase 3 - 2",
    "Nueva Frase 4 - 2",
  ],
  [
    "Ginecologia",
    "ccccccccccccccccccccccccccccccccc",
    "Nueva Frase 1 - 3",
    "Nueva Frase 2 - 3",
    "Nueva Frase 3 - 3",
    "Nueva Frase 4 - 3",
  ],
];
let currentIndex = 0;
function siguiente() {
  const elements = [
    document.getElementById("tituloAsignatura"),
    document.getElementById("enunciado"),
    document.getElementById("respuestaA"),
    document.getElementById("respuestaB"),
    document.getElementById("respuestaC"),
    document.getElementById("respuestaD"),
  ];
  elements.forEach((el, index) => {
    console.log(currentIndex);
    el.classList.remove("fade-in");
    el.classList.add("fade-out");
    el.addEventListener(
      "animationend",
      () => {
        console.log(currentIndex);
        el.innerText = contenido[currentIndex - 1][index];
        el.classList.remove("fade-out");
        el.classList.add("fade-in");
      },
      { once: true }
    );
  });
  console.log("suma: " + currentIndex);
  if (currentIndex != contenido.length - 1) currentIndex = currentIndex + 1;
  else {
    document.getElementById("botonSiguiente").style.display = "none";
    currentIndex = currentIndex + 1;
  }
}

//FUNCIONALIDAD DE CADA SELECTOR DE ASIGNATURA:

document.getElementById("Ginecologia").addEventListener("click", function () {
  var element = document.getElementById("wrapper");
  if (element.classList.contains("hidden")) {
    element.classList.remove("hidden");
  } else {
    element.classList.add("hidden");
  }
});
