const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPausebtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar");
musicList = wrapper.querySelector(".music-list");
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


let musicIndex = 1;

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
})


function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb -1].name;
    musicArtist.innerText = allMusic[indexNumb -1].artist;
    musicImg.src = `images/${allMusic[indexNumb -1].img}.jpg`;
    mainAudio.src = `music/${allMusic[indexNumb -1].src}.mp3`;
}
//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPausebtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//paused music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPausebtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
//previous music function
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();

}
//next music function
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();

}

playPausebtn.addEventListener("click",()=>{
const isMusicPaused = wrapper.classList.contains("paused");

isMusicPaused ? pauseMusic() : playMusic();
});

//next button
nextBtn.addEventListener("click",()=>{
nextMusic();
});

//previous button
prevBtn.addEventListener("click",()=>{
    prevMusic();
});


//progress bar
mainAudio.addEventListener("timeupdate",(e)=>{
    // console.log(e)
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth=(currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata",()=>{
   //update song duration

        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec <10){
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerHTML = `${totalMin}:${totalSec}`;
        
    });

    //update song current time

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//play song according to the progree bar width

progressArea.addEventListener("click", (e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
})

//repeat & suffle songs acc to icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{

    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","Song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("Playback shuffle")
            break;
        case "shuffle":
        repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title","Playlist looped")
        break;
    }
});

//after song ended

mainAudio.addEventListener("ended",()=>{

    let getText = repeatBtn.innerText;

    switch(getText){
        case "repeat":
           nextMusic();
            break;
        case "repeat_one":
           mainAudio.currentTime = 0;
           loadMusic(musicIndex);
           playMusic();
        break;
        case "shuffle":
        let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        do{
            randIndex = Math.floor((Math.random() * allMusic.length) + 1);
        }while(musicIndex == randIndex);
        musicIndex = randIndex;
        loadMusic(musicIndex);
        playMusic();
        break;
    }
});

showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//li acc to array length

for (let i = 0; i< allMusic.length; i++) {
    let liTag = `<li li-index= "${i + 1}">
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
            </li>`;
    ulTag.insertAdjacentHTML("beforeend",liTag)

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        
    });
}


//play particular song on click

const allLiTags = ulTag.querySelectorAll("li");
for (let j = 0; j< allLiTags.length; j++) {
 
    if(allLiTags[j].getAttribute("li-index")==musicIndex){
        allLiTags[j].classList.add("playing");
}
    allLiTags[j].setAttribute("onclick","clicked(this)");
}

//play song on li click

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
}

