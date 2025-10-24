// Sound setup: clicks, typing, ambient music
// (A bit of everything that makes the space feel alive)

// UI click sound (currently not used but kept just in case)

var clickSound = new Audio("assets/audio/ui/click.mp3");
clickSound.volume = 0.4;

function playGlobalClick() {
  try {
    clickSound.currentTime = 0;
    clickSound.play();
  } catch (err) {
    console.warn("Click sound didnt go through:", err);
  }
}

// Background typing loop (softly plays while typing on the keyboard object)
var keyboardLoop = new Audio("assets/audio/ui/keyboard_loop.mp3");
keyboardLoop.loop = true;
keyboardLoop.volume = 0.2;

function playKeyboardLoop() {
  try {
    keyboardLoop.currentTime = 0;
    keyboardLoop.play();
  } catch (err) {
    console.warn("Typing sound got blocked, classic browser thing");
  }
}

function stopKeyboardLoop() {
  keyboardLoop.pause();
  keyboardLoop.currentTime = 0;
}

function fadeOutKeyboardLoop(ms = 1500) {
  var startVol = keyboardLoop.volume;
  var step = startVol / (ms / 50);

  var timer = setInterval(() => {
    if (keyboardLoop.volume - step > 0) {
      keyboardLoop.volume -= step;
    } else {
      clearInterval(timer);
      stopKeyboardLoop();
      keyboardLoop.volume = startVol;
    }
  }, 50);
}

// Background music playlist and fade control
const musicTracks = [
  "assets/audio/music/1.mp3",
  "assets/audio/music/2.mp3",
  "assets/audio/music/3.mp3",
  "assets/audio/music/4.mp3",
  "assets/audio/music/5.mp3",
  "assets/audio/music/6.mp3"
];

let currentMusicIndex = Math.floor(Math.random() * musicTracks.length);
let currentMusic = null;
let isSoundEnabled = true;

// Optionally restore user setting
// if (localStorage.getItem("soundEnabled") == "false") isSoundEnabled = false;

function startBackgroundMusic() {
  if (isSoundEnabled == false) return;

  musicTracks.sort(() => Math.random() - 0.5);

  if (currentMusic && !currentMusic.paused) {
    currentMusic.pause();
  }

  const audio = new Audio(musicTracks[currentMusicIndex]);
  audio.volume = 0;

  audio.play()
    .then(() => {
      currentMusic = audio;
      fadeInMusic(currentMusic, 0.3, 2000);
      setupMusicEvents(currentMusic);
    })
    .catch((err) => {
      console.warn("Autoplay blocked for music:", err);
    });
}

function nextMusicTrack() {
  currentMusicIndex = (currentMusicIndex + 1) % musicTracks.length;
  const nextAudio = new Audio(musicTracks[currentMusicIndex]);
  nextAudio.volume = 0;

  nextAudio.play()
    .then(() => {
      currentMusic = nextAudio;
      fadeInMusic(currentMusic);
      setupMusicEvents(currentMusic);
    })
    .catch(() => {
      console.warn("Couldn’t play next track.");
    });
}

function setupMusicEvents(audio) {
  audio.addEventListener("timeupdate", function () {
    if (audio.duration && audio.currentTime >= audio.duration - 2) {
      fadeOutMusic(function () {
        nextMusicTrack();
      });
    }
  });

  audio.addEventListener("ended", function () {
    nextMusicTrack();
  });
}

function fadeOutMusic(cb, duration = 1500) {
  if (!currentMusic) return;
  var startVol = currentMusic.volume;
  var step = startVol / (duration / 50);

  var fade = setInterval(() => {
    if (currentMusic.volume - step > 0) {
      currentMusic.volume -= step;
    } else {
      clearInterval(fade);
      currentMusic.pause();
      currentMusic.volume = startVol;
      if (cb) cb();
    }
  }, 50);
}

function fadeInMusic(audio, targetVol = 0.3, duration = 1500) {
  audio.volume = 0;
  audio.play().catch(() => {});
  var step = targetVol / (duration / 50);

  var fade = setInterval(() => {
    if (audio.volume + step < targetVol) {
      audio.volume += step;
    } else {
      clearInterval(fade);
      audio.volume = targetVol;
    }
  }, 50);
}

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;
  localStorage.setItem("soundEnabled", isSoundEnabled);

  if (isSoundEnabled) {
    if (currentMusic) {
      currentMusic.play().catch(() => {});
    } else {
      startBackgroundMusic();
    }
  } else {
    if (currentMusic) currentMusic.pause();
  }

  clickSound.muted = !isSoundEnabled;
  keyboardLoop.muted = !isSoundEnabled;

  updateSoundIcon();
}

function setMusicVolume(targetVol, duration = 1000) {
  if (!currentMusic) return;

  var startVol = currentMusic.volume;
  var step = (targetVol - startVol) / (duration / 50);

  var fade = setInterval(() => {
    if (!currentMusic) return clearInterval(fade);

    var nextVol = currentMusic.volume + step;
    if (
      (step > 0 && nextVol >= targetVol) ||
      (step < 0 && nextVol <= targetVol)
    ) {
      currentMusic.volume = targetVol;
      clearInterval(fade);
    } else {
      currentMusic.volume = nextVol;
    }
  }, 50);
}

window.addEventListener("load", function () {
  if (isSoundEnabled) startBackgroundMusic();
  updateSoundIcon();
});

document.querySelectorAll(".sound-toggle").forEach(function (btn) {
  btn.addEventListener("click", toggleSound);
});

function updateSoundIcon() {
  const icons = document.querySelectorAll(".sound-toggle img");
  icons.forEach(function (icon) {
    icon.src = isSoundEnabled
      ? "assets/icons/icon_soundon.svg"
      : "assets/icons/icon_soundoff.svg";
  });
}