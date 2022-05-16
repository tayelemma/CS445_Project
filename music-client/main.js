
const SERVER_ROOT = 'http://localhost:3000';
//Attributs for Playing the songs......................................... 
// const musicContainer = document.querySelector('.music-container');
// const playBtn = document.querySelector('#play');
// const prevBtn = document.querySelector('#prev');
// const nextBtn = document.querySelector('#next');
// const audio = document.querySelector('#audio');
// const progress = document.querySelector('.progress');
// const progressContainer = document.querySelector('.progress-container');
// const title = document.querySelector('#title');

window.onload = function () {

    if (localStorage.getItem('accessToken')) {
        afterLogin();
    } else {
        notLogin();
    }
    document.getElementById('loginBtn').onclick = function () {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch(`${SERVER_ROOT}/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => loggedInFeatures(data));
    }

    document.getElementById('logoutBtn').onclick = function () {
        localStorage.removeItem('accessToken');
        notLogin();
    }

    document.getElementById('searchBtn').onclick = function () {
        searchMusic();
    }


    //Actions for playing the song..........................

    // playBtn.addEventListener('click', playMusic);
    // prevBtn.addEventListener('click', prevSong);
    // nextBtn.addEventListender('click', nextSong);
    // audio.addEventListener('timeupdate', updateProgress);
    // progressContainer.addEventListener('click', setProgress);
    // audio.addEventListener('ended', nextSong);


}

//Working
function loggedInFeatures(data) {
    if (data.status) {
        document.getElementById('errormessage').innerHTML = data.message;
    } else {
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        localStorage.setItem('accessToken', data.accessToken);
        afterLogin();
    }
}


//Working
function fetchMusic() {

    fetch(`${SERVER_ROOT}/api/music`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => response.json())
        .then(playlist => {
            let html = `
            <table class= "table" id="music-table">
            <thead>
                <tr>
                    <th> # </th>
                    <th> Title </th>
                    <th> Release Date</th>
                    <th> Action </th>
                </tr>
        `;
            let counter = 0;
            playlist.forEach(music => {

                html += `
                <tr>
                    <td>${counter = counter + 1} </td>
                    <td> ${music.title}</td>
                    <td> ${music.releaseDate}</td>
                    <td> 
                        <button id="addBtn" class="addBtn" data-add="${music.id}" onclick ="addplaylist(this)"> + </button>
                    </td>
                </tr>
            `;
            });
            html += `
            </tbody>
            </table>
        `;
            document.getElementById('content').innerHTML = html;
        });
}

//Working
function fetchPlayList() {
    fetch(`${SERVER_ROOT}/api/playlist`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
        .then(response => response.json())
        .then(playlist => {
            let html = `
            <table class= "table" id="playlist-table">
            <thead>
                <tr>
                    <th> Order </th>
                    <th> Title </th>
                    <th> Action </th>
                </tr>
        `;
            playlist.forEach(music => {

                html += `
                <tr id="trplaylist">
                    <td>${music.orderId} </td>
                    <td> ${music.title}</td>
                    <td>  
                       <button id='removebtn' data-del="${music.songId}" onclick='deleteById(this)'> X </button> 
                       <button class='action-btn' id= 'playBtn' onclick ='addplaylist(${music.orderId})'> <i class='fas fa-play' </button>
                    </td>
                </tr>
            `;
            });
            html += `
            </tbody>
            </table>
        `;
            document.getElementById('playlist').innerHTML = html;
        });
}

//Working................
function afterLogin() {
    document.getElementById('search').style.display = 'block';
    document.getElementById('logout-div').style.display = 'block';
    document.getElementById('player').style.display = 'block';
    document.getElementById('login-div').style.display = 'none';
    document.getElementById('playlist').style.display = 'block';
    document.getElementById('play-bar').style.display = 'block'
    document.getElementById('head-title').style.display = 'block';
    document.getElementById('playlist-header').style.display = 'block';
    document.getElementById('entry').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    fetchMusic();
    fetchPlayList();
}

//Working.............
function notLogin() {
    document.getElementById('search').style.display = 'none';
    document.getElementById('logout-div').style.display = 'none';
    document.getElementById('player').style.display = 'none';
    document.getElementById('playlist').style.display = 'none';
    document.getElementById('login-div').style.display = 'block';
    document.getElementById('play-bar').style.display = 'none'
    document.getElementById('head-title').style.display = 'none';
    document.getElementById('playlist-header').style.display = 'none';
    document.getElementById('entry').style.display = 'block';
    document.getElementById('content').style.display='none';

}
//SEARCH..................
function searchMusic() {
    let searchText = document.getElementById('search-input');
    fetch(`${SERVER_ROOT}/api/music?search=${searchText.value}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },   
    })
        .then(response => response.json())
        .then(searchValue => {
            let html = `
            <table class= "table" id="playlist-table">
            <thead>
                <tr>
                    <th> # </th>
                    <th> Title </th>
                    <th> Release Date</th>
                    <th> Action </th>
                </tr>
        `;
            let counter = 1;
            searchValue.forEach(music => {

                html += `
                <tr >
                    <td> ${counter++} </td>
                    <td> ${music.title}</td>
                    <td> ${music.releaseDate}</td>
                    <td> 
                        <button id='addBtn' class='addBtn' data-add='${music.id}' onclick ='addplaylist(this)'> + </button> 
                    </td>
                </tr>
            `;
            });
            html += `
            </tbody>
            </table>
        `;        
            document.getElementById('content').innerHTML = html;
             searchText.value = "";
        });
}


//Working
function deleteById(obj) {
let id = obj.getAttribute("data-del");
    fetch(`${SERVER_ROOT}/api/playlist/remove`, {
        method: 'POST',
        body:JSON.stringify({
            songId: id
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
       
    })
        .then(response => response.json())
        .then(playlist => {
            let html = `
            <table class= "table" id="playlist-table">
            <thead>
                <tr>
                    <th> Order </th>
                    <th> Title </th>
                    <th> Action </th>
                </tr>
        `;
            playlist.forEach(music => {

                html += `
                <tr id="trplaylist">
                    <td>${music.orderId} </td>
                    <td> ${music.title}</td>
                    <td>  
                       <button id='removebtn'  data-del="${music.songId}" onclick='deleteById(this)'> X </button>
                       <button class='action-btn' id= 'playBtn' data-playBtn= "${music.title}" onclick ='playMusic(this)'> <i class='fas fa-play' </button>
                    </td>
                </tr>
            `;
            });
            html += `
            </tbody>
            </table>
        `;
            document.getElementById('playlist').innerHTML = html;
        });
}


//Working..............need some adution
function addplaylist(obj) {
    let playlistTble = document.getElementById("trplaylist");
    // playlistTble.innerHTML = "";
    let id = obj.getAttribute("data-add");
    console.log(id);
   
            fetch(`${SERVER_ROOT}/api/playlist/add`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    songId: id
                })
            })
                .then(response => response.json())
                .then(playlist => {
                    let html = `
            <table class= "table" id="playlist-table">
            <thead>
                <tr>
                    <th> Order </th>
                    <th> Title </th>
                    <th> Action </th>
                </tr>
        `;
                    playlist.forEach(music => {

                        html += `
                <tr id="trplaylist">
                    <td>${music.orderId} </td>
                    <td> ${music.title}</td>
                    <td>  
                       <button id='removebtn'  data-del="${music.songId}" onclick='deleteById(this)'> X </button>
                       <button class='action-btn' id= 'playBtn' data-playBtn= "${music.title}" onclick ='playMusic(this)'> <i class='fas fa-play' </button>
                    </td>
                </tr>
            `;
                    });
                    html += `
            </tbody>
            </table>
        `;
                    document.getElementById('playlist').innerHTML = html;

                    
                });
        }

function playMusic(obj) {

    let id = obj.getAttribute("data-playBtn");
    fetch(`${SERVER_ROOT}/api/music?search=${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${sessionStorage.getItem('keyaccess')}`
        }
    }).then(response => response.json())
        .then(music => {
            console.log(music[0].urlPath);
            title.innerText = music.title;
            audio.src = music[0].urlPath;          
        })
}
 
let songIndex = 1;
// function loadSong(song) {
//     fetch(`${SERVER_ROOT}/api/music?search=${id}`, {
//         method: 'GET
//         headers: {
//         'Content-type': 'application/json; charset=UTF-8',
//             'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//         }
//     })
//         .then(response => response.json())
//         .then(music => {
//             title.innerText = music.title;
//             audio.src = music[0].urlPath;
//         });
// }


// function palySong() {
//     musicContainer.classList.add('play');
//     playBtn.querySelector('i.fas').classList.remove('fa-play');
//     playBtn.querySelector('i.fas').classList.add('fa-pause');
//     audio.play();
// }

// function pauseSong() {
//     musicContainer.classList.remove('play');
//     playBtn.querySelector('i.fas').classList.add('fa-play');
//     playBtn.querySelector('i.fas').classList.remove('fa-pause');
//     audio.pause();
// }

// function playMusic() {
//     const isPlaying = musicContainer.classList.contains('play');
//     if (isPlaying) {
//         pauseSong();
//     } else {
//         playSong();
//     }
// }

// function prevSong() {
//     songIndex--;
//     if (songIndex < 0) {
//         songIndex = songs.length - 1;
//     }
//     loadSong(songs[songIndex]);
//     playSong();
// }

// function nextSong() {
//     songIndex++;
//     if (songIndex > songs.length - 1) {
//         songIndex = 0;
//     }
//     loadSong(songs[songIndex]);
//     playSong();
// }


// function updateProgress(e) {
//     const { duration, currentTime } = e.srcElement;
//     const progressPercent = (currentTime / duration) / 100;
//     progress.style.width = `${progressPrecent}%`
// }


// function setProgress(e) {
//     const width = this.clientWidth
//     const clickX = e.offsetX;
//     const duration = audio.duration;
//     audio.currentTime = (clickX / width) * duration;
// }






