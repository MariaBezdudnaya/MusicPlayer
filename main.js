const songElement = document.getElementById('currentSong'); // элемент, где хранится текущий трек
const player = document.getElementById('player');
const cover = document.getElementById('cover');
const artist = document.getElementById('artist');
const song = document.getElementById('song');
const playlistContainer = document.getElementById('playlist');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults'); 


function chooseFile() { // Функция выбора файла, не перетаскивая из dropzone
  const input = document.createElement('input');
  input.type = 'file';

  input.onchange = function (e) {
    const file = e.target.files[0]; // Извлекаем выбранный файл
    loadToPlayer(file); // Загружаем выбранный файл в плеер
    addToPlaylist(file); // Добавляем трек в плейлист
  }

  input.click();
}


function initDropzone() { // Функция инициализации dropzone при перетаскивании файла
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
    addToPlaylist(file); // Добавляем трек в плейлист
  });
}


searchInput.addEventListener('input', () => { // Функция обработки ввода ссылки на файл
  const searchTerm = searchInput.value;

  const music = [
    'music/Deadkedy_-_INCorporated_Introduction_58666241.mp3',
    'music/Jane_Air_-_Parizh_64518215.mp3',
    'music/DeaDKeDy_-_Vesennyaya_gryaz_75519002.mp3',
    'music/Jane_Air_-_S_dobrym_utrom_64518205.mp3',
    '/music/Neil_Frances_-_Dumb_Love_72928694.mp3',
  ];

  searchResults.innerHTML = ''; // Очищаем предыдущие результаты

  const foundTracks = music.filter(file => file.includes(searchTerm)); // Фильтруем массив музыки по поисковому запросу
  
  foundTracks.forEach(file => {
    const trackElement = document.createElement('li');
    trackElement.textContent = file;
    searchResults.appendChild(trackElement);

    addToPlaylist(file); // добавляем трек в плейлист
    // loadToPlayer(file);
    console.log(trackElement);
  });

  // // Отправка запроса на API Yandex-music:
  // fetch(`https://courier.yandex.ru/api/v1/search?q=${searchTerm}&type=track`, {
  //   method: 'POST',
  //   mode: 'no-cors',
  //   headers: {
  //     'Authorization': ''
  //   }
  // })
  // .then(response => response.json())
  // .then(data => {
  //   // Обработка данных
  //   searchResults.innerHTML = ''; // Очищаем предыдущие результаты
    
  //   data.tracks.items.forEach(track => {
  //     // Создаем элемент с информацией о треке
  //     const trackElement = document.createElement('div');
  //     trackElement.textContent = `${track.artists[0].name} - ${track.name}`;
  //     searchResults.appendChild(trackElement);
  //     addToPlaylist(trackElement); // добавляем трек в плейлист
  //     console.log(trackElement);
  //   });
  // })
  // .catch(error => {
  // console.error(error);
  // });
});

//  // token Yandex Music
// https://courier.yandex.ru/api/v1/search?q=${searchTerm}&type=track  // API Yandex Music
// https://www.cherkashin.dev/yandex-music-open-api/  // API Yandex Music
// https://music.yandex.ru/album/33607058/track/130488335  // track

function setSongInfo(fileContent) { // Функция получения данных из выбранного файла
  const mp3Tags = new MP3Tag(fileContent); // Инициализируем библиотеку для парсинга мета-тегов из аудиофайлов
  mp3Tags.read();

  const { v1: {title, artist}, v2: {APIC} } = mp3Tags.tags; // Деструктуризация объекта, чтобы получить нужные значения (название + автор, обложка)
  const coverBytes = APIC[0].data;
  const coverUrl = "data:image/png;base64," + btoa(String.fromCharCode.apply(null, new Uint8Array(coverBytes))); // btoa преобразует байты в строку

  const art = document.getElementById('artist');
  song.textContent = title; // Заполняем поля информации о треке
  art.textContent = artist; 
  cover.src = coverUrl;
}

function addToPlaylist(file) { // Функция добавления трека в плейлист
  const li = document.createElement('li'); // Создаем новый элемент списка для трека
  li.classList.add('playlist-item');
  li.textContent = "• " + file.name; // Устанавливаем имя файла в качестве содержимого элемента списка

  const playing = document.createElement('div'); // контейнер для кнопок воспроизведения и остановки трека
  playing.classList.add('playing-container');
  li.appendChild(playing); // Добавляем элемент списка в плейлист


  const playButton = document.createElement('button'); // Добавляем обработчик события для воспроизведения трека
  playButton.classList.add('playlist-button');
  playButton.textContent = 'Play';
  playButton.addEventListener('click', () => {

    // songElement.addEventListener('change', () => {
    //   const currentSong = songElement.value; // Получаем текущий трек 
    //   // Обновляем информацию из текущего трека 
    //   cover.src = currentSong.albumCoverUrl; 
    //   artist.textContent = currentSong.artist;
    //   song.textContent = currentSong.title; 
    // });
    
    playTrack(file);
  });
  playing.appendChild(playButton); // Добавляем кнопку в элемент списка

  const stopButton = document.createElement('button'); // Добавляем обработчик события для остановки трека
  stopButton.classList.add('playlist-button');
  stopButton.textContent = 'Stop';
  stopButton.addEventListener('click', () => {
    stopTrack(file);
  });
  playing.appendChild(stopButton); // Добавляем кнопку в элемент списка

  const playlist = document.getElementById('playlist');
  playlist.appendChild(li); // Добавляем элемент списка в плейлист

}

function playTrack(file) { // Функция воспроизведения трека
  const player = document.getElementById('player');
  player.src = URL.createObjectURL(file); // Загружаем ссылку на файл в плеер, делаем из массива байт URL и передаем в src
  player.load(); // Начинаем процессить этот файл и грузить контент
  player.play();
}


function stopTrack() { // Функция остановки трека
  const player = document.getElementById('player');
  player.pause();
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


window.onload = () => { // Функция запуска при загрузке страницы
  initDropzone(); // Инициализируем dropzone
}

