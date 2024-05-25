const songs = [
  { title: "Great War", artist: "Sabaton", img_src: "1.jpg", src: "1.mp3" },
  { title: "Last Stand", artist: "Sabaton", img_src: "2.jpg", src: "2.mp3" },
  { title: "Megalovania", artist: "Toby Fox", img_src: "3.jpg", src: "3.mp3" }
];

document.querySelector("#options");
const menuBtn = document.querySelector(".menu-btn"),
    screen = document.querySelector(".screen"),
    playlistContainer = document.getElementById("playlist"),
    coverImage = document.querySelector(".coverImage"),
    infoWrapper = document.querySelector(".info"),
    current = document.querySelector(".current"),
    playPause = document.getElementById("playpause"),
    prev = document.getElementById("prev"),
    next = document.getElementById("next"),
    currentFavourite = document.querySelector("#current-favourite"),
    shuffleBtn = document.querySelector("#shuffle"),
    repeatBtn = document.querySelector("#repeat"),
    progressBar = document.querySelector(".bar"),
    progressDot = document.querySelector(".dot"),
    currentTimeEl = document.querySelector(".current-time"),
    durationEl = document.querySelector(".duration");

let playing = false,
    currentSong = 0,
    favourites = [],
    shuffle = false,
    repeat = 0;
const audio = new Audio();

menuBtn.addEventListener("click", () => {
  screen.classList.toggle("active");
});

const init = () => {
  addToList(songs);
  loadSong(currentSong);
};

const addToList = (songs) => {
  playlistContainer.innerHTML = "";

  for (const [index, song] of songs.entries()) {
    const { title, src } = song;
    const isFavourite = favourites.includes(index);
    const tr = document.createElement("tr");
    tr.classList.add("song");
    tr.innerHTML = `
      <td class="nr"><h5>${index + 1}</h5></td>
      <td class="title"><h6>${title}</h6></td>
      <td class="length"><h5>00:00</h5></td>
      <td><i class="fas fa-heart ${isFavourite ? "active" : ""} favourite-list"></i></td>
    `;

    tr.addEventListener("click", (e) => {
      if (e.target.classList.contains("favourite-list")) {
        toggleFavourite(index);
        e.target.classList.toggle("active");
        return;
      }
      currentSong = index;
      loadSong(currentSong);
      audio.play();
      screen.classList.remove("active");
      playPause.classList.replace("fa-play", "fa-pause");
      playing = true;
    });
    playlistContainer.appendChild(tr);

    const audioForDuration = new Audio(`data/${src}`);
    audioForDuration.addEventListener("loadedmetadata", () => {
      const duration = audioForDuration.duration;
      tr.querySelector(".length h5").innerText = formatTime(duration);
    });
  }
};

const loadSong = (num) => {
  const song = songs[num];
  coverImage.style.backgroundImage = `url(data/${song.img_src})`;
  infoWrapper.innerHTML = `<h2>${song.title}</h2><h3>${song.artist}</h3>`;
  current.innerHTML = song.title;
  audio.src = `data/${song.src}`;
  currentFavourite.classList.toggle("active", favourites.includes(num));
  updateProgress();
};

const nextSong = () => {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else if (currentSong < songs.length - 1) {
    currentSong++;
  } else {
    currentSong = 0;
  }
  loadSong(currentSong);
  if (playing) audio.play();
};

const prevSong = () => {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else if (currentSong > 0) {
    currentSong--;
  } else {
    currentSong = songs.length - 1;
  }
  loadSong(currentSong);
  if (playing) audio.play();
};

const togglePlayPause = () => {
  if (playing) {
    playPause.classList.replace("fa-pause", "fa-play");
    audio.pause();
  } else {
    playPause.classList.replace("fa-play", "fa-pause");
    audio.play();
  }
  playing = !playing;
};

const toggleFavourite = (index) => {
  if (favourites.includes(index)) {
    favourites = favourites.filter((item) => item !== index);
  } else {
    favourites.push(index);
  }
  currentFavourite.classList.toggle("active", favourites.includes(currentSong));
  addToList(songs);
};

const toggleShuffle = () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
};

const toggleRepeat = () => {
  repeat = (repeat + 1) % 3;
  repeatBtn.classList.toggle("active", repeat > 0);
};

const updateProgress = () => {
  const { duration, currentTime } = audio;
  currentTimeEl.innerHTML = formatTime(currentTime);
  durationEl.innerHTML = formatTime(duration);
  const progressPercent = (currentTime / duration) * 100;
  progressDot.style.left = `${progressPercent}%`;
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const setProgress = (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
};

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", () => {
  if (repeat === 1) {
    loadSong(currentSong);
    audio.play();
  } else if (repeat === 2) {
    nextSong();
    audio.play();
  } else if (currentSong < songs.length - 1) {
    nextSong();
    audio.play();
  } else {
    audio.pause();
    playPause.classList.replace("fa-pause", "fa-play");
    playing = false;
  }
});

playPause.addEventListener("click", togglePlayPause);
next.addEventListener("click", nextSong);
prev.addEventListener("click", prevSong);
shuffleBtn.addEventListener("click", toggleShuffle);
repeatBtn.addEventListener("click", toggleRepeat);
currentFavourite.addEventListener("click", () => {
  toggleFavourite(currentSong);
});

progressBar.addEventListener("click", setProgress);

init();
