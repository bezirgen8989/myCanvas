function div1(){
    let canvas = document.getElementById('myCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 250;
    function rect(){
        for (let i=0; i<50; i++){
            for (let j=0; j<5; j++){
                ctx.fillStyle = randomColor();
                ctx.fillRect(0+i*50, 0+j*50, 25, 25);
                ctx.fillRect(25+i*50, 25+j*50, 25, 25);
            }
        }
    }
    function randomColor () {
        const colors= [ 
            '#0923FB',
            '#04117B',
            '#FB454F',
            '#FFD418',
            '#23E1C7'
        ];
        return colors [Math.floor(Math.random()*colors.length)];
    }
    //requestAnimationFrame(rect(), 1000);
    setInterval(()=> rect(), 1000/2 );
}
div1();

function div2(){ 
    const canvas2 = document.getElementById ('myCanvas2');
    const ctx2 = canvas2.getContext ('2d');
    
    canvas2.width = window.innerWidth;
    canvas2.height = 250;
    
    const colors= [ 
        '#0923FB',
        '#04117B',
        '#FB454F',
        '#FFD418',
        '#23E1C7',
    ];
    
    function randomColor (colors) {
       return colors [Math.floor(Math.random()*colors.length)];
    }

    function randomIntFromRange (min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    
    function distance (x1, y1, x2, y2) {
        const xDist = x2-x1;
        const yDist = y2-y1;
    
       return Math.sqrt (Math.pow (xDist, 2) +Math.pow (yDist, 2));
    }
    
    function rotate (velocity, angle) {
        const rotatedVelocities = {
            x: velocity.x * Math.cos(angle) - velocity.y*Math.sin (angle),
            y: velocity.x * Math.sin(angle) + velocity.y*Math.cos (angle)
        };
        return rotatedVelocities;
    }
    
    function resolveCollision (particle, otherParticle) {
        const xVelocityDiff = particle.velocity.x-otherParticle.velocity.x;
        const yVelocityDiff = particle.velocity.y-otherParticle.velocity.y;
        const xDist = otherParticle.x - particle.x;
        const yDist = otherParticle.y - particle.y;
    
        //убрать столкновение 
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
            
            // Захватить угол между двумя сталкивающимися частицами
            const angle = -Math.atan2 (otherParticle.y - particle.y, otherParticle.x - particle.x); //Math.atan2 возвращает арктангенс
    
            //хранить массу в var для лучшей читаемости при столкновении
            const m1 = particle.mass;
            const m2 = otherParticle.mass;
    
            // Скорость перед уравнением
            const u1 = rotate (particle.velocity, angle);
            const u2 = rotate (otherParticle.velocity, angle);
    
            // скорость после 1d уравнения столкновении
            const v1 = {x: u1.x * (m1-m2) / (m1+m2) + u2.x*2*m2 / (m1+m2), y: u1.y};
            const v2 = {x: u2.x * (m1-m2) / (m1+m2) + u1.x*2*m2 / (m1+m2), y: u2.y};
    
            //конечная скорость после вращения оси обратно в исходное положение 
            const vFinal1 = rotate (v1, -angle);
            const vFinal2 = rotate (v2, -angle); 
    
            // обменять скорости частиц для реалистичного эффекта отскока
            particle.velocity.x = vFinal1.x;
            particle.velocity.y = vFinal1.y;
    
            otherParticle.velocity.x = vFinal2.x;
            otherParticle.velocity.y = vFinal2.y;
        }
    }
    
    
    
    //objects
    function Particle (x, y, radius, color) {
        this.x=x;
        this.y=y;
        this.velocity = {
            x: (Math.random () - 0.5) * 5,
            y: (Math.random () - 0.5) * 5
        }
        this.radius=radius;
        this.color= color;
    
        this.mass = 1;
        this.opacity=0;
    
        this.update=particles => {
            this.draw(); 
        
            for (let i=0; i<particles.length; i++) {
                if (this === particles[i]) continue;
                if (distance(this.x, this.y, particles[i].x, particles[i].y)-this.radius*2<0) {
                    resolveCollision (this, particles[i]);
                }
            }
            if (this.x-this.radius<=0 || this.x+this.radius>=innerWidth) {
                this.velocity.x=-this.velocity.x;
            }
            if (this.y-this.radius<=0 || this.y+this.radius>=canvas2.height) {
                this.velocity.y=-this.velocity.y;
            }
            this.x+=this.velocity.x;
            this.y+=this.velocity.y;
        };
    
        this.draw= () => {
            ctx2.beginPath();
            ctx2.arc(this.x, this.y, this.radius, 0, Math.PI *2, false);
            ctx2.fillStyle = this.color;
            ctx2.fill();
            ctx2.stroke();
            ctx2.strokeStyle = 'black';
        };
    }
    
    //Implementation - реализация
    let particles;
    
    function init() {
        particles = [];
    
        for (let i=0; i<50; i++) {
            const radius = 13;
            let x = randomIntFromRange (radius, canvas2.width - radius); 
            let y = randomIntFromRange (radius, canvas2.height - radius); 
            color = randomColor (colors);
    
            if (i !==0 ) {
                for (let j=0; j < particles.length; j++){
                    if (distance(x,y, particles[j].x, particles[j].y) - radius*2<0) {
                        x = randomIntFromRange (radius, canvas2.width - radius); 
                        y = randomIntFromRange (radius, canvas2.height - radius); 
    
                        j=-1;
                        
                    }
                }
            }
            particles.push(new Particle(x, y, radius, color));
    
        }
    
    }
    
    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        ctx2.clearRect(0,0, canvas2.width, canvas2.height);
        
        particles.forEach(particle => { 
            particle.update(particles);    
        });
        
    }
    
    init();
    animate();
}
div2();

function div3(){
    let canvas3=document.getElementById ('myCanvas3');
    ctx3 = canvas3.getContext('2d');
    canvas3.width = window.innerWidth;
    canvas3.height = 250;
    let paper3 = document.getElementById ('paper3');
    
    let NewRect = function (x,y,w,h, color ){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.color=color;
        ctx3.fillStyle = color;
        ctx3.fillRect (x,y,w,h);
    }
   
    let xx=20;
    let myColor = 'black';
    function allRect (){
        requestAnimationFrame(allRect);
        for (let i = 0; i<61;i++){
            for (let j = 0; j<12; j++){
                new NewRect (0+i*21,0+j*21,xx,xx, myColor);
            }
        }
    }

    paper3.addEventListener('mousemove', function(){
        xx-=1;
        console.log(xx)
        ctx3.clearRect(0,0, canvas3.width, canvas3.height);
        if (xx==0){
            xx=20;
        }
         
    })
    allRect ();
}
div3();