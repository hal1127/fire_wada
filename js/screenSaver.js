'use strict';

(() => {
  class Screen {
    constructor(canvas, imgs, name) {
      this.ctx = canvas.getContext('2d');
      this.imgs = imgs;
      this.name = name;

      this.width = canvas.width;
      this.height = canvas.height;
      
      this.wadaWidth = this.height/5;
      this.wadaHeight = this.height/5 * 262/206;

      this.wadas = [];
      imgs.forEach(img => {
        this.wada = new Wada(img, this.width - this.wadaWidth, this.height - this.wadaHeight);
        this.wadas.push(this.wada);
      });

      const dpr = window.devicePixelRatio || 1;
      canvas.width = this.width * dpr;
      canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
      canvas.style.width = this.width + 'px';
      canvas.style.height = this.height + 'px';

      this.fcount = 0;
      this.messa_cnt = 0;
    }
    
    
    draw(i) {
      this.ctx.drawImage(this.wadas[i].img, this.wadas[i].pos.x, this.wadas[i].pos.y, this.wadaWidth, this.wadaHeight);
    }
    
    update(i) {
      if (this.wadas[i].pos.x + this.wadaWidth > this.width
        || this.wadas[i].pos.x <= 0) {
          this.wadas[i].speed.x *= -1;
        }
        if (this.wadas[i].pos.y + this.wadaHeight > this.height
          || this.wadas[i].pos.y < 0) {
            this.wadas[i].speed.y *= -1;
          }
          this.wadas[i].pos.x += this.wadas[i].speed.x;
          this.wadas[i].pos.y += this.wadas[i].speed.y;
          this.draw(i);
        }
        
      run() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      if (Math.sin(++this.fcount*Math.PI/20) > 0) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${this.width/15}px Verdana`;
        this.ctx.fillText(`Touch ${this.name}!!`, this.width/2 - this.ctx.measureText(`Touch ${this.name}!!`).width/2, this.height/2);
      }
      if (this.name === 'Tanaka') {
        if (this.width < 500) {
          this.ctx.font = `bold ${this.width/30}px Verdana`;
        } else if (this.width > 1000) {
          this.ctx.font = `bold ${this.width/100}px Verdana`;
        } else {
          this.ctx.font = `bold ${this.width/50}px Verdana`;
        }
        const height = this.ctx.measureText('Ajpan pda "benaswzw" wp pdeo lwca.').fontBoundingBoxAscent+this.ctx.measureText('Ajpan pda "benaswzw" wp pdeo lwca.').fontBoundingBoxDescent
  
        this.ctx.fillText('Ajpan pda "benaswzw" wp pdeo lwca.', this.width/2 - this.ctx.measureText('Ajpan pda "benaswzw" wp pdeo lwca.').width/2, height);
      }
      
      if (this.fcount > 10000) {
        this.fcount = 0;
      }
      // if (++this.fcount % 3 === 0) {
      //   this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      //   this.ctx.fillRect(0, 0, this.width, this.height);
      // }
      for (let i = 0; i < 4; i++) {
        this.update(i);
      }
      
      
      setTimeout(() => {
        this.run();
      }, 30);
    }
  }
  
  class Wada {
    constructor(img, width, height) {
      this.img = img;
      this.pos = {x: Math.random() * width, y: Math.random() * height};
      const pm = Math.random() > 0.5 ? 1 : -1;
      const angle = 180 * Math.random() / 180 * Math.PI;
      this.speed = {x: Math.cos(angle) * 5 * pm, y: Math.sin(angle) * 5 * pm};
    }
  }

  let index = location.href.indexOf('?');
  // console.log(location.href.substr(index+1));
  let true_mode = false;
  if (location.href.substr(index+1) === 'true_mode') {
    true_mode = true;
  }
  if (true_mode === true) {
    document.title = "ファイヤー和田";
    document.getElementsByName('description')[0].content = 'ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田ファイヤー和田';
  }
  const canvas = document.querySelector('canvas');
  if (typeof(canvas.getContext) === 'undefined') return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let true_srcs = ['img/FireWada.png', 'img/FireWadaBlue.png', 'img/FireWadaGreen.png', 'img/FireWadaRed.png'];
  let srcs = ['img/tanaka.png', 'img/bluetanaka.png', 'img/greentanaka.png', 'img/redtanaka.png'];
  srcs = true_mode === true ? true_srcs : srcs;
  let imgs = [];
  for (let i = 0; i < 4; i++) {
    const img = document.createElement('img');
    img.src = srcs[i];
    imgs.push(img);
  }
  
  let name = true_mode === true ? 'Wada' : 'Tanaka';
  const screen = new Screen(canvas, imgs, name);
  let count = 0;
  for (let i = 0; i < 4; i++) {
    imgs[i].addEventListener('load', () => {
      count++;
      if (count === 4) screen.run();
    });
  }

  canvas.addEventListener('mousemove', on_mousemove, false);
  canvas.addEventListener('click', on_click, false);
  canvas.addEventListener('touchend', on_click, false);
  
  document.body.addEventListener('keydown', keydown, false);
  
  function on_mousemove(e) {
    let x, y;
    if (e.layerX || e.layerX == 0) {
      x = e.layerX;
      y = e.layerY;
    }
    for (let i = 3; i >= 0; i--) {
      if (x >= screen.wadas[i].pos.x
        && x <= (screen.wadas[i].pos.x + screen.wadaWidth)
        && y >= screen.wadas[i].pos.y
        && y <= (screen.wadas[i].pos.y + screen.wadaHeight)) {
          document.body.style.cursor = 'pointer';
          return i;
      } else {
        document.body.style.cursor = "";
      }
    }
  }

  function on_click(e) {
    let wadaNum = on_mousemove(e);
    if (typeof(wadaNum) === 'undefined') {
      return;
    }
    if (true_mode === true) {
      window.location = 'true'+String(wadaNum)+'.html';
    } else {
      window.location = String(wadaNum)+'.html';
    }
  }

  const ans = 'firewada';
  let ans_index = 0;
  function keydown(e) {
    if (e.key === ans[ans_index]) {
      ans_index++;
    } else {
      ans_index = 0;
    }
    if (ans_index === ans.length) {
      location.href += '?true_mode'; 
    }
    console.log(e.key);
  }

})();