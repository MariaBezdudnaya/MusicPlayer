function chooseFile() { // Функция выбора файла, не перетаскивая из dropzone
  const input = document.createElement('input');
  input.type = 'file';

  input.onchange = function (e) {
    const file = e.target.files[0]; // Извлекаем выбранный файл
    loadToPlayer(file); // Загружаем выбранный файл в плеер
  }

  input.click();
}

function processLink() { // Функция обработки ввода ссылки на файл
  const link = document.getElementById('linkInput').value; // Извлекаем ссылку из поля ввода
  const player = document.getElementById('player');

  player.src = link; // Загружаем ссылку на файл в плеер
  player.load(); // Начинаем процессить этот файл и грузить контент
}

function setSongInfo(fileContent) { // Функция получения данных их выбранного файла
  const mp3Tags = new MP3Tag(fileContent); // Инициализируем библиотеку для парсинга мета-тегов из аудиофайлов
  mp3Tags.read();

  const { v1: {title, artist}, v2: {APIC} } = mp3Tags.tags; // Деструктуризация объекта, чтобы получить нужные значения (название + автор, обложка)
  const coverBytes = APIC[0].data;
  const coverUrl = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(coverBytes))); // btoa преобразует байты в строку

  document.getElementById('song').textContent = title; // Заполняем поля информации о треке
  document.getElementById('artist').textContent = artist; // Заполняем поля информации о треке
  document.getElementById('cover').src = coverUrl; // Заполняем поля информации о треке
}

function loadToPlayer(file) { // Функция загрузки выбранного файла в плеер
  const player = document.getElementById('player');
  
  const reader = new FileReader(); // Создаем объект для чтения файла
  
  reader.onload = (e) => { // И на конец чтения
    const content = e.target.result; // контент файла сохраняем в объект target в свойстве result, где и массив байт
    setSongInfo(content); // и передаём в функцию setSongInfo
  }

  reader.readAsArrayBuffer(file) // reader должен прочитать наш файл как array-buffer

  player.src = URL.createObjectURL(file); // Загружаем ссылку на файл в плеер, делаем из массива байт URL и передаем в src
  player.load(); // Начинаем процессить этот файл и грузить контент
}

function initDropzone() { // Функция инициализации dropzone
  const dropzone = document.getElementById('dropzone');

  dropzone.addEventListener('dragover', (e) => { // Событие при перетаскивании, браузер не откроет файл в новой вкладке
    e.preventDefault();
    e.stopPropagation(); // Останавливаем всплытие события
  });

  dropzone.addEventListener('drop', (e) => { // Событие при перетаскивании файла в dropzone
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0]; // dataTransfer отвечает за то, какие данные хранятся в элементе, который перетаскивается
    loadToPlayer(file); // Загружаем выбранный файл в плеер
  });
}

window.onload = () => { // Функция запуска при загрузке страницы
  initDropzone(); // Инициализируем dropzone
}

// https://rus.hitmotop.com/get/music/20190526/Jane_Air_-_Parizh_64518215.mp3