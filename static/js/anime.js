var cj = createjs,
    stage,
    particles = [],
    centerX,
    centerY,
    particleNum = window.innerWidth / 6,
    color = ["blue","black","red","yellow","green"];
    speed = Math.PI / 60,
    RADIUS = window.innerWidth / 7,
    margin = RADIUS / 10;
    SPEED_MIN = RADIUS / 2,
    SPEED_MAX = RADIUS;



function init(){
    var rotateCenterX,
        rotateCenterY,
        circle,
        radius = RADIUS;

    stage = new cj.Stage("world");
    stage.canvas.width　= window.innerWidth;
    stage.canvas.height　= window.innerHeight;


    for(var i = 1;i <= 3;i++){
        circle = new Circle(i,1,radius,color[i - 1]);
        circle.create();
        
    }
    
    circle = new Circle(1,2,radius,color[3]);  
    circle.create();
    
    circle = new Circle(2,2,radius,color[4]); 
    circle.create();
  

    
    stage.update();
}
cj.Ticker.timingMode = cj.Ticker.RAF;
cj.Ticker.addEventListener("tick",tick);



function tick(){
    for(var i = 0;i < particles.length;i++){
        var particle = particles[i];
        particle.move();
    }

    
    stage.update();
}



function Particle(cx,cy,_angle,_radius,_color){
    this.initialize();

    
    this.radius = getRandomNum(10,20);
    
    getColor(this,_color);
            
    this.graphics.drawCircle(0,0,getRandomNum(1,10))
    .endFill();
    
    this.centerX = cx;
    this.centerY = cy;
    
    this.angle = _angle;
    
    if(getRandomNum(1,10) % 2 == 0){
        this.speed =  Math.PI / (getRandomNum(SPEED_MIN,SPEED_MAX));
    }else{
        this.speed =  - Math.PI / (getRandomNum(SPEED_MIN,SPEED_MAX));
    }
    
    this.rotateCenterX = cx + _radius;
    this.rotateCenterY = cy;
    
    this.compositeOperation = "darker";    
}

Particle.prototype = new cj.Shape();

Particle.prototype.move = function(){
    this.angle += this.speed;
    
    this.rotateCenterX = this.centerX + (RADIUS - margin) * Math.cos(this.angle / 5);
    this.rotateCenterY = this.centerY + (RADIUS - margin) * Math.sin(this.angle / 5);
    
    this.x = this.rotateCenterX + this.radius * Math.cos(this.angle / 360) * Math.cos(this.angle);
    this.y = this.rotateCenterY + this.radius * Math.sin(this.angle / 360) * Math.sin(this.angle);

};


function Circle(cx,cy,r,_color){
    if(cy == 1){
        this.centerX = r + 2 * r * (cx - 1) + ((window.innerWidth / 2) - 3 * r);
        this.centerY = r * cy + ((window.innerHeight / 2) - 1.5 * r);
    }else{
        this.centerX = r + 2 * r * (cx - 1) + r + ((window.innerWidth / 2) - 3 * r);
        this.centerY = r * cy + ((window.innerHeight / 2) - 1.5 * r);
    }
    
    this.radius = r;
    this.color = _color;
}


Circle.prototype.create = function(){
    var rotateCenterX = this.centerX + this.radius,
        rotateCenterY = this.centerY;
    
    for(var j = 1;j < particleNum;j++){
        var angle = j * 15 * 10;
        
        var particle = new Particle(this.centerX,this.centerY,angle,this.radius,this.color);
        particles.push(particle);

        stage.addChild(particle);
    }

};

function getRandomNum( min, max ) {
    return ( Math.random() * ( max - min ) + min ) | 0;
}

function getColor(obj,_color){
    var fillColor;
    //色
    switch(_color){
        case "blue":
            switch((Math.random() * 5 | 0 ) % 5){
                case 0:
                    fillColor = obj.graphics.beginFill("#0B5FA5");
                    break;
                case 1:
                    fillColor = obj.graphics.beginFill("#25547B");
                    break;
                case 2:
                    fillColor = obj.graphics.beginFill("#043C6B");
                    break;
                case 3:
                    fillColor = obj.graphics.beginFill("#3F8FD2");
                    break;
                case 4:
                    fillColor = obj.graphics.beginFill("#66A1D2");
                    break;
                default:
                    break;
            }
            break;
        case "black":
            switch((Math.random() * 5 | 0 ) % 5){
                case 0:
                    fillColor = obj.graphics.beginFill("#000");
                    break;
                case 1:
                    fillColor = obj.graphics.beginFill("#111");
                    break;
                case 2:
                    fillColor = obj.graphics.beginFill("#191919");
                    break;
                case 3:
                    fillColor = obj.graphics.beginFill("#2a2a2a");
                    break;
                case 4:
                    fillColor = obj.graphics.beginFill("#3b3b3b");
                    break;
                default:
                    break;
            }
            break;
        case "red":
            switch((Math.random() * 5 | 0 ) % 5){
                case 0:
                    fillColor = obj.graphics.beginFill("#FF0000");
                    break;
                case 1:
                    fillColor = obj.graphics.beginFill("#BF3030");
                    break;
                case 2:
                    fillColor = obj.graphics.beginFill("#A60000");
                    break;
                case 3:
                    fillColor = obj.graphics.beginFill("#FF4040");
                    break;
                case 4:
                    fillColor = obj.graphics.beginFill("FF7373");
                    break;
                default:
                    break;
            }
            break; 
        case "yellow":
            switch((Math.random() * 5 | 0 ) % 5){
                case 0:
                    fillColor = obj.graphics.beginFill("#FFF500");
                    break;
                case 1:
                    fillColor = obj.graphics.beginFill("#BFBA30");
                    break;
                case 2:
                    fillColor = obj.graphics.beginFill("#A69F00");
                    break;
                case 3:
                    fillColor = obj.graphics.beginFill("#FFF840");
                    break;
                case 4:
                    fillColor = obj.graphics.beginFill("#FFFA73");
                    break;
                default:
                    break;
            }
            break; 
        case "green":
            switch((Math.random() * 5 | 0 ) % 5){
                case 0:
                    fillColor = obj.graphics.beginFill("#25D500");
                    break;
                case 1:
                    fillColor = obj.graphics.beginFill("#3DA028");
                    break;
                case 2:
                    fillColor = obj.graphics.beginFill("#188A00");
                    break;
                case 3:
                    fillColor = obj.graphics.beginFill("#59EA3A");
                    break;
                case 4:
                    fillColor = obj.graphics.beginFill("#80EA69");
                    break;
                default:
                    break;
            }
            break; 
        default:
            break;              
    }
    
    return fillColor;
}
init();