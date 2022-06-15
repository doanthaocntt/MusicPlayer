/*
  1. Render songs
  2. Scroll top
  3. Play/ pause/ seek
  4. CD rotate
  5. Next / previous
  6. Random
  7. Next/ Repeat when ended
  8. Active song
  9. Scroll active song into view
  10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$  = document.querySelectorAll.bind(document);
const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const PlayBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const app = {
  currentIndex:0,
  isPlaying: false,
  isRandom: false,
  songs: [
    {
    name:'Ai muốn nghe không?',
    singer:'Đen Vâu',
    path:'./assets/music/song1.mp3',
    image:'./assets/img/song1.jpg'
  },
  {
    name: 'Ai đưa em về',
    singer: 'TIA - Thiện Hiếu',
    path: './assets/music/song2.mp3',
    image: './assets/img/song2.jpg'
  },
  {
    name: 'Lớn rồi còn khóc nhè',
    singer: 'Trúc Nhân',
    path: './assets/music/song3.mp3',
    image: './assets/img/song3.jpg'
  },
  {
    name: 'Đem tiền về cho mẹ',
    singer: 'Đen Vâu',
    path: './assets/music/song4.mp3',
    image: './assets/img/song4.jpg'
  },
  {
    name: 'Happy',
    singer: 'Pharrell Williams',
    path: './assets/music/song5.mp3',
    image: './assets/img/song5.jpg'
  },
  {
    name: 'Vẽ',
    singer: 'Trúc Nhân',
    path: './assets/music/song6.mp3',
    image: './assets/img/song6.jpg'
  }
],
  render: function(){ //render ra view
  const htmls = this.songs.map(song =>{
    return `
    <div class="song">
      <div class="thumb" style="background-image: url('${song.image}')">
      </div>
      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>
      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>
    </div> 
  `
  })
  $('.playlist').innerHTML = htmls.join('\n');
},
  defineProperties: function(){
    Object.defineProperty(this,'currentSong',{
      get: function(){
        return this.songs[this.currentIndex];
      }
    })
  },
  handleEvents: function(){
    const _this = this;
    const cdWidth = cd.offsetWidth;
    //Xử lý CD quay/ dừng
    const cdthumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}
    ],{
      duration: 10000, //10 seconds
      iterations: Infinity
    })
    cdthumbAnimate.pause();
    //Xử lý phong to/ thu nhỏ CD
    document.onscroll = function(){
      const scrollTop  = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0 ;
      cd.style.opacity = newCdWidth / cdWidth;
    }
    //Xử lý khi click Play
    PlayBtn.onclick = function(){
      if (_this.isPlaying){
        audio.pause();
      }
      else{
        audio.play();
      }
      //Khi song được play 
      audio.onplay  = function(){
        _this.isPlaying = true;
        player.classList.add('playing');
        cdthumbAnimate.play()
      },
      // Khi song pause
      audio.onpause = function () {
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdthumbAnimate.pause();
      }
      //Khi tiến độ bài hát thay đổi
      audio.ontimeupdate = function () {
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
        }
      }
    }
    //Xử lý khi tua song
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value;
      audio.currentTime = seekTime;
    }
    // Khi next songs
    nextBtn.onclick = function () {
      if(_this.isRandom){
        _this.playRandomSong()
        audio.play();
      }else{
        _this.nextSong();
        audio.play();
      }
    }
    //Khi prev songs
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong()
        audio.play();
      } else {
        _this.prevSong();
        audio.play();
      }
    }
    //Random songs
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom
      randomBtn.classList.toggle('active', _this.isRandom);
    }
  },
  loadCurrentSong: function(){
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(' ${this.currentSong.image} ')`;
    audio.src = this.currentSong.path;
  },
  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0 ) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function(){
    let newIndex;
    do{
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex===this.currentIndex)
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function(){
    //Định nghĩa các thuộc  tính cho object
    this.defineProperties();
    //Lắng nghe/ xử lý các sự kiện (DOM events)
    this.handleEvents();
    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();
    //thực hiện duy nhất start 
    this.render(); 
  }
}
app.start(); 