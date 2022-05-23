"use strict";
/*eslint-disable */

const SERVER_ROOT = 'http://localhost:3000';

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
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`

            }
        }).then(response => response.json())
            .then(data => loggedInFeatures(data))
            .catch(err=> console.log(err));
    }

    document.getElementById('logoutBtn').onclick = function () {
        localStorage.removeItem('accessToken');
        notLogin();
    }

    document.getElementById('searchBtn').onclick = function () {
        searchMusic();
    }
}

//Working....................
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


//Working....................
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

//Working...........................
function fetchPlayList() {
    fetch(`${SERVER_ROOT}/api/playlist`, {
        headers: {
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
                       <button id='removebtn' data-del="${music.orderId}" onclick='deleteById(this)'> X </button> 
                       <button class='action-btn' id= 'playBtn' data-music="${music.title}" data-playlist="${music.orderId}" onclick ='playMusic(this)'> <i class='fas fa-play' </button>
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
//working..................
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


//Working.....................
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
                       <button class='action-btn' id= 'playBtn' data-music= "${music.title}" onclick ='playMusic(this)'> <i class='fas fa-play' </button>
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

//Working..............
function addplaylist(obj) {
    let id = obj.getAttribute("data-add");
    console.log(id);
   
            fetch(`${SERVER_ROOT}/api/playlist/add`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify({
                    songId: id,
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
                       <button class='action-btn' id= 'playBtn' data-music="${music.title}" onclick ='playMusic(this)'> <i class='fas fa-play' </button>
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
    let title = document.getElementById('title');
    let id1 = obj.getAttribute("data-playlist");
    console.log(id1);
    let id = obj.getAttribute("data-music");
    console.log(id);
    fetch(`${SERVER_ROOT}/api/music?search=${id}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            
        }
    }).then(response => response.json())
        .then(music => {
            let onPlay = ` 
                 <button id="prev"  onclick="prevSong(this);"   class="action-btn"   data-prev="${id1}">     <i class="fas fa-backward"></i></button>
                 <button id="next"  onclick="nextSong(this)"    class="action-btn"   data-next="${id1}">     <i class="fas fa-forward"></i></button>
                 <audio id="media-audio" controls autoplay >
                          <source src="http://localhost:3000/${music[0].urlPath}" type="audio/mpeg">
                 </audio>
                <button id='repeat' onclick="repeatMusic()"  class="action-btn"  data-repeat="">    <i class="fas fa-repeat"></i> </button>    
                `
                ;
            let audio = document.getElementById("media-div");
            audio.innerHTML = onPlay;
            title.innerHTML =`${music[0].title}........... ` ;
        
        })
}



function prevSong(obj) {

    let title = document.getElementById('title');
    let songIndex = Number(obj.getAttribute("data-prev"));

    fetch(`${SERVER_ROOT}/api/playlist`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(response => response.json())
        .then(music => {
            let mySong = music.filter(songItem => songItem.orderId == songIndex-1);
            let onPlay = ` 
                 <button   id="prev"   onclick="prevSong(this);"  class="action-btn"   data-prev="${mySong[0].orderId}">  <i class="fas fa-backward"></i></button>
                 <button   id="next"   onclick= "nextSong(this)"  class="action-btn"   data-next="${mySong[0].orderId}">  <i class="fas fa-forward"></i></button>
                     <audio id="media-audio" controls autoplay>
                          <source src="http://localhost:3000/${mySong[0].urlPath}" type="audio/mpeg">
                     </audio>
                  <button id ='repeat'  onclick="repeatMusic()" class="action-btn"><i class="fas fa-repeat"></i> </button> `;
            let audio = document.getElementById("media-div");
            audio.innerHTML = onPlay;
            title.innerHTML = `${mySong[0].title}........... `;
        }) 
}

function nextSong(obj) {

    let songIndex = Number(obj.getAttribute("data-next"));
    let title = document.getElementById('title');
    
    fetch(`${SERVER_ROOT}/api/playlist`, {
        method: 'GET',
        headers: {
            'Content-type':  'application/json; charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    }).then(response => response.json())
        .then(music => {
            let mySong = music.filter(songItem => songItem.orderId == songIndex +1);
            let onPlay = ` 
                 <button   id="prev"   onclick="prevSong(this);"  class="action-btn"   data-prev="${mySong[0].orderId}">  <i class="fas fa-backward"></i></button>
                 <button   id="next"   onclick= "nextSong(this)"  class="action-btn"   data-next="${mySong[0].orderId}">  <i class="fas fa-forward"></i></button>
                     <audio id="media-audio" controls autoplay>
                          <source src="http://localhost:3000/${mySong[0].urlPath}" type="audio/mpeg">
                     </audio>
                  <button id ='repeat' onclick="repeatMusic()"  class="action-btn"><i class="fas fa-repeat"></i> </button> `;
            let audio = document.getElementById("media-div");
            audio.innerHTML = onPlay;
            title.innerHTML = `${mySong[0].title}........... `;
        })
}

function repeatMusic(){
    
//on progress

}




