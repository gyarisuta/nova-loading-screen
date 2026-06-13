var fill = document.getElementById('_pf');
var fileList = document.getElementById('_fl');
var music = document.getElementById('music');
var steamIdEl = document.getElementById('_si');
var background = document.getElementById('_bg');

var total = 0;
var needed = 0;
var MAX_ENTRIES = 6;
var entries = [];
var musicStarted = false;

var params = new URLSearchParams(window.location.search);
var urlMap = params.get('Map') || params.get('map') || '';
var urlSteam = params.get('SteamId') || params.get('steamid') || '';

var song_directory = [
    {
        track_name: 'Light Velocity Ver. II',
        artist_name: 'Isamu Ohira',
        cover_id: 0,
        link: 'tracks/lightvelv2.mp3',
    },
    {
        track_name: 'GT Mode 5',
        artist_name: 'Isamu Ohira',
        cover_id: 0,
        link: 'tracks/gtmode5.mp3',
    },
    {
        track_name: 'GT Mode 2',
        artist_name: 'Isamu Ohira',
        cover_id: 0,
        link: 'tracks/gtmode2.mp3',
    },
    {
        track_name: 'GT Mode 1',
        artist_name: 'Isamu Ohira',
        cover_id: 0,
        link: 'tracks/gtmode1.mp3',
    },
    {
        track_name: 'Race Menu 2',
        artist_name: 'Isamu Ohira',
        cover_id: 0,
        link: 'tracks/racemenu2.mp3',
    },
    {
        track_name: 'Sunday Afternoon',
        artist_name: 'Sota Fujimori and Naoyuki Sato',
        cover_id: 1,
        link: 'tracks/sundayafternoon.mp3',
    },
    {
        track_name: 'See you on Saturday!',
        artist_name: 'Hyd Lunch',
        cover_id: 2,
        link: 'tracks/seeyaonsaturday.mp3',
    },
    {
        track_name: 'highway',
        artist_name: 'Chihiro Aoki',
        cover_id: 3,
        link: 'tracks/highway.mp3',
    },
    {
        track_name: 'New Serena',
        artist_name: 'Yuichi Kanatani',
        cover_id: 4,
        link: 'tracks/newserena.mp3',
    },
    {
        track_name: 'Casino',
        artist_name: 'Chihiro Aoki',
        cover_id: 4,
        link: 'tracks/casino.mp3',
    },
    {
        track_name: "Singin' Bass",
        artist_name: 'Hidenori Shoji',
        cover_id: 5,
        link: 'tracks/singinbass.mp3',
    },
    {
        track_name: 'Management',
        artist_name: 'Hideki Sakamoto',
        cover_id: 6,
        link: 'tracks/mgmt.opus',
    },
];
// Source - https://stackoverflow.com/a/2450976
// Posted by ChristopheD, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-13, License - CC BY-SA 4.0

function shuffleDatMuzak() {
    let array = song_directory;
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function setBackground(mapName) {
    var img = new Image();
    img.onload = function() {
        background.src = 'images/' + mapName + '.jpg';
    };
    img.onerror = function() {
        background.src = 'images/gm_bigcity.jpg';
    };
    img.src = 'images/' + mapName + '.jpg';
}

if (urlMap) {
    setBackground(urlMap);
} else {
    background.src = 'images/gm_bigcity.jpg';
}

if (urlSteam) {
    steamIdEl.textContent = 'STEAM ID: ' + urlSteam;
}

function startMusic(vol) {

    if (musicStarted) return;
    musicStarted = true;
    music.volume = 0.3;
    music.play();
}

function addEntry(text) {
    var el = document.createElement('div');
    el.className = '_fe _nw';
    el.textContent = text;
    fileList.insertBefore(el, fileList.firstChild);
    entries.unshift(el);
    if (entries.length > MAX_ENTRIES) {
        var removed = entries.pop();
        fileList.removeChild(removed);
    }
    void el.offsetWidth;
    updateOpacities();
}

function updateOpacities() {
    var count = entries.length;
    for (var i = 0; i < count; i++) {
        var opacity = 1 - (i / (MAX_ENTRIES - 1)) * 0.85;
        entries[i].style.opacity = opacity;
        if (i > 0) entries[i].classList.remove('_nw');
    }
}

var pages = document.querySelectorAll('._rg');
var dots = document.querySelectorAll('._dt');
var currentPage = 0;

function switchPage() {
    var outPage = pages[currentPage];
    currentPage = (currentPage + 1) % pages.length;
    var inPage = pages[currentPage];

    outPage.style.transition = 'opacity 0.5s ease';
    outPage.style.opacity = '0';

    setTimeout(function() {
        outPage.classList.remove('_ac');
        outPage.style.display = 'none';
        outPage.style.opacity = '';
        outPage.style.transition = '';

        inPage.style.display = 'flex';
        inPage.style.opacity = '0';
        inPage.style.transition = 'none';

        void inPage.offsetWidth;

        inPage.style.transition = 'opacity 0.5s ease';
        inPage.style.opacity = '1';
        inPage.classList.add('_ac');

        dots.forEach(function(d, i) {
            d.classList.toggle('active', i===currentPage);
        });

        setTimeout(function() {
            inPage.style.transition = '';
            inPage.style.opacity = '';
        }, 500);

    }, 500);
}

setInterval(switchPage, 5000);

window.GameDetails = function(serverName, serverURL, mapName, maxPlayers, steamID, gameMode, volume, language) {
    startMusic();

    if (steamID) {
        steamIdEl.textContent = 'STEAM ID: ' + steamID;
    }

    if (mapName) {
        setBackground(mapName);
        addEntry(mapName);
    }
};

window.SetFilesTotal = function(t) {
    total = t;
};

window.SetFilesNeeded = function(n) {
    needed = n;
    if (total > 0) {
        fill.style.width = ((total - needed) / total * 100) + '%';
    }
};

window.DownloadingFile = function(fileName) {
    var parts = fileName.split('/');
    addEntry(parts[parts.length - 1]);
};

window.SetStatusChanged = function(s) {
    addEntry(s);
    if (s === 'Sending client info...' || s === 'Joining game...') {
        fill.style.width = '100%';
    }
};

var _cbMsgs = document.getElementById('_cb_msgs');

var _tips = [
    { user: 'Zukma', msg: 'Si ves a un usuario rompiendo las reglas abrí ticket en discord.' },
    { user: 'Hana', msg: 'Si te metés al discord y al steamgroup recibís el rango PLANET' },
    { user: 'Zukma', msg: 'El buildmode se alterna usando los comandos !build y !pvp' },
    { user: 'Hana', msg: 'Usar el Buildmode para cualquier cosa que implique molestar es sancionable' },
    { user: 'Zukma', msg: 'Nova fue fundado en el 19/02/24' },
    { user: 'Hana', msg: 'Si querés ver la documentación de Nova usá !motd' },
    { user: 'Zukma', msg: 'Lee todas las reglas que están a la derecha de esta pantalla de carga, son pocas.' },
    { user: 'Hana', msg: 'Gracias por jugar en Nova' },
    { user: 'Hana', msg: 'Unite a nuestro servidor de discord usando !discord' },
];

var _colors = { '(owner) zukma': '#c91515', '(co-owner) hana': '#f9a8d4' };
var _tipIndex = 0;
var _MAX_MSGS = 4;
var _msgEls = [];

function _addMsg(user, text) {
    var wrap = document.createElement('div');
    wrap.className = '_cbm';

    var name = document.createElement('span');
    name.className = '_cbn';
    name.textContent = user;
    name.style.color = _colors[user] || '#ffffff';

    var msg = document.createElement('span');
    msg.className = '_cbt';
    msg.textContent = text;

    wrap.appendChild(name);
    wrap.appendChild(msg);
    _cbMsgs.appendChild(wrap);
    _msgEls.push(wrap);

    if (_msgEls.length > _MAX_MSGS) {
        var old = _msgEls.shift();
        old.style.opacity = '0';
        setTimeout(function() {
            if (old.parentNode) old.parentNode.removeChild(old);
        }, 800);
    }
}

function _nextTip() {
    var t = _tips[_tipIndex % _tips.length];
    _addMsg(t.user, t.msg);
    _tipIndex++;
}

setTimeout(function() {
    _nextTip();
    setInterval(_nextTip, 3000);
}, 1200);
