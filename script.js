let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
    let response = await fetch(`Song`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/Song/")[1]);
        }
    }
    return songs;
}

const playMusic = (track) => {
    currentsong.pause(); 
    currentsong = new Audio("/Song/" + track);
    currentsong.play();
    play.src = "Assets/pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function main() {

    //Get the list of song
    let songs = await getSongs();
    playMusic(songs[0],);
    console.log(songs);

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUl.innerHTML += `<li>
        <img class="invert" src="Assets/music.svg" alt="">  
        <div class="info">
           <div>${song.replaceAll("%20", " ")}</div>
           <div>Song Artist</div>
        </div> 
        <div class="playnow">
           <span>
               <img class="invert" src="Assets/play.svg" alt="">
           </span>
        </div>
         </li>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info").firstElementChild.textContent;
            playMusic(songName);
        });
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "Assets/pause.svg";
        } else {
            currentsong.pause();
            play.src = "Assets/play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        let currentTime = currentsong.currentTime;
        let duration = currentsong.duration;
        let currentTimeFormatted = secondsToMinutesSeconds(currentTime);
        let durationFormatted = isNaN(duration) || duration === 0 ? "00:00" : secondsToMinutesSeconds(duration);
    
        document.querySelector(".songtime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
    
        // Calculate the percentage of the progress bar
        let progress = (currentTime / duration) * 100;
    
        // Update the position of the circle element
        document.querySelector(".circle").style.left = progress + "%";
    });
    
    document.querySelector(".seekbar").addEventListener("click", e => {
        const seekBar = e.target;
        const seekBarPercent = (e.offsetX / seekBar.clientWidth) * 100;
        const seekBarCircle = document.querySelector(".circle");
      
        seekBarCircle.style.left = seekBarPercent + "%";
      
        // Update the current time of the audio
        const currentTime = (seekBarPercent / 100) * currentsong.duration;
        currentsong.currentTime = currentTime;
      });

}

main();
