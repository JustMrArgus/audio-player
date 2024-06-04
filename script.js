// The player is have to play already preloaded songs
const songs = [
  { title: "Great War", artist: "Sabaton", img_src: "1.jpg", src: "1.mp3" },
  { title: "Last Stand", artist: "Sabaton", img_src: "2.jpg", src: "2.mp3" },
  { title: "Megalovania", artist: "Toby Fox", img_src: "3.jpg", src: "3.mp3" }
];

// Declare main variables and constants
const menuBtn = document.querySelector(".menu-btn");
const screen = document.querySelector(".screen");
const playlistContainer = document.getElementById("playlist");
const coverImage = document.querySelector(".coverImage");
const infoWrapper = document.querySelector(".info");
const current = document.querySelector(".current");
const playPause = document.getElementById("playpause");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const currentFavourite = document.querySelector("#current-favourite");
const shuffleBtn = document.querySelector("#shuffle");
const repeatBtn = document.querySelector("#repeat");
const progressBar = document.querySelector(".bar");
const progressDot = document.querySelector(".dot");
const currentTimeEl = document.querySelector(".current-time");
const durationEl = document.querySelector(".duration");

let playing = false;
let currentSong = 0;
let favourites = [];
let shuffle = false;
let repeat = 0;

// Create new of Audio class
const audio = new Audio();

// Add to list and load first song from there to start the player
const init = () => {
  addToList(songs);
  loadSong(currentSong);
};

// Add songs to the playlist
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

// Load the current song
const loadSong = (num) => {
  const song = songs[num];
  coverImage.style.backgroundImage = `url(data/${song.img_src})`;
  infoWrapper.innerHTML = `<h2>${song.title}</h2><h3>${song.artist}</h3>`;
  current.innerHTML = song.title;
  audio.src = `data/${song.src}`;
  currentFavourite.classList.toggle("active", favourites.includes(num));
  updateProgress();
};

// Play the next song
const nextSong = () => {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else if (currentSong < songs.length - 1) {
    currentSong++;
  } else {
    currentSong = 0;
  }
  loadSong(currentSong);
  if (playing) {
    audio.play();
  }
};

// Play the previous song
const prevSong = () => {
  if (shuffle) {
    currentSong = Math.floor(Math.random() * songs.length);
  } else if (currentSong > 0) {
    currentSong--;
  } else {
    currentSong = songs.length - 1;
  }
  loadSong(currentSong);
  if (playing) {
    audio.play();
  }
};

// Toggle the play/pause button
const togglePlayPause = () => {
  if (playing) {
    audio.pause();
    playPause.classList.replace("fa-pause", "fa-play");
  } else {
    audio.play();
    playPause.classList.replace("fa-play", "fa-pause");
  }
  playing = !playing;
};

// Toggle the favourite status of the current song
const toggleFavourite = (index) => {
  if (favourites.includes(index)) {
    favourites = favourites.filter((item) => item !== index);
  } else {
    favourites.push(index);
  }
  currentFavourite.classList.toggle("active", favourites.includes(currentSong));
  addToList(songs);
};

// Toggle the shuffle button
const toggleShuffle = () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
};

// Toggle the repeat button
const toggleRepeat = () => {
  repeat = (repeat + 1) % 3;
  repeatBtn.classList.toggle("active", repeat > 0);
};

// Update the progress bar
const updateProgress = () => {
  const { duration, currentTime } = audio;
  currentTimeEl.innerHTML = formatTime(currentTime);
  durationEl.innerHTML = formatTime(duration);
  const progressPercent = (currentTime / duration) * 100;
  progressDot.style.left = `${progressPercent}%`;
};

// Format the time
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
};

// Set the progress of the song
const setProgress = (e) => {
  const width = progressBar.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
};

// Add event listeners
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
menuBtn.addEventListener("click", () => {
  screen.classList.toggle("active");
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

// Call the init function
init();
