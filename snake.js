/**
 * Created by Charlie on 2017/5/25.
 */
let game = {
    pg:document.getElementById("playground"),//游戏主界面
    snakeColor:"#49CB5F", //蛇的颜色
    foodColor:"#F00",
    food:null, //下一个食物
    role:null,  //游戏主角：贪吃蛇
    timer:null,  //
	originalSpeed:200,//初始速度
    speed:null,  //贪吃蛇移动的速度
    status:0, //游戏当前的状态
    RUNNING:0,
    PAUSE:1,
    OVER:2,  //游戏结束
    score:0, //分数
    time:0,  //游戏进行的时间
	timer2:0,//对游戏时间进行计数
	__lastTime:0,//用于计时器的辅助判断
    //
    start(){
    this.score=0;
    this.time=0;
	this.speed=this.originalSpeed;
    this.status=this.RUNNING;
    this.role=new Snake(20,0,this.snakeColor);//初始化主角的起始位置
    this.food=this.randomFood();
    this.paint();
    this.timer=setInterval(this.move.bind(this),this.speed);
	this.timer2=setInterval((function(){this.time+=1;}).bind(this),1000);

    document.onkeydown=function (e) {
            switch(e.keyCode){
                case 37://向左
                    this.turnLeft();
                    break;
                case 38://向上
                    this.turnUp();
                    break;
                case 39:
                    this.turnRight();
                    break;
                case 40:
                   this.turnDown();
                    break;
                case 80://pause
                    if(this.status==this.RUNNING)
                    {
                        this.status=this.PAUSE;
                        clearInterval(this.timer);
						clearInterval(this.timer2);
                        this.paint();
                    }
                    break;
                case 67://continue
                    if(this.status==this.PAUSE)
                    {
                        this.status=this.RUNNING;
                        this.timer=setInterval(this.move.bind(this),this.speed);
						this.timer2=setInterval((function(){this.time+=1;}).bind(this),1000);
                    }
                    break;
                case 81://quit
                    if(this.status!=this.OVER){
                        this.status=this.OVER;
                        if(this.status!=this.PAUSE){
                            clearInterval(this.timer);
							clearInterval(this.timer2);
						}
                        this.paint();
                    }
                    break;
                case 83://restart  S
                    if(this.status==this.OVER){
                        this.status=this.RUNNING;
                        game.start();
                    }
                    break;
            }
        }.bind(this);
    },
    canEat(){
        var head=this.role.cells[0];
        if(this.food.row==head.row && this.food.col==head.col)
            return true;
        else
            return false;
    },
    eatFood(tail){
        this.role.cells.push(tail);//将tail加入到蛇的尾部
    },
    randomFood(){ //随机生成食物的位置
        while(true){
            var find=true;
            var c=parseInt(Math.random()*20);
            var r=parseInt(Math.random()*40);
            for(var cell of this.role.cells){
                if(cell.row==r&&cell.col==c){
                    find=false;
                    break;
                }
            }
            if(find)
                return new Cell(r,c,this.foodColor);
        }
    },
    isGameOver(){
        var r=this.role.cells[0].row;
        var c=this.role.cells[0].col;
        //debugger;
        if(r<0||r>39||c<0||c>19||!this.role.isUnique())
            return true;
        return false;
    },
    move(){
        //this.time+=this.speed;
        var tail = this.role.move();
        if (this.canEat()) {
            this.eatFood(tail);
            this.score+=10;
            this.food = this.randomFood();
        }
        //this.paint();
        if (this.isGameOver()) {
            //alert("游戏结束");
            this.status = this.OVER;
            clearInterval(this.timer);
			clearInterval(this.timer2);
        }
        this.paint();
		//每隔10秒，speed-10
		if(this.time!=this.__lastTime){ //防止由于time的较慢刷新导致下面判断语句的频繁执行
			this.__lastTime=this.time;
			if(parseInt(this.time)%10==9){
				this.speed-=10;
				console.log(this.speed);		
				clearInterval(this.timer);
				this.timer=setInterval(this.move.bind(this),this.speed);
			}
		}
    },
    turnUp(){
        this.role.turnUp();
    },
    turnRight(){
        this.role.turnRight();
    },
    turnLeft(){
        this.role.turnLeft();
    },
    turnDown(){
        this.role.turnDown();
    },
    paintRole(){//重绘主角
        let frag=document.createDocumentFragment();
        for(var cell of this.role.cells)
            this.paintCell(frag,cell,this.snakeColor);
        this.pg.appendChild(frag);
    },
    paintFood(){
        let frag=document.createDocumentFragment();
        this.paintCell(frag,this.food,this.foodColor);
        this.pg.appendChild(frag);
    },
    paintCell(frag,cell,color){    //重绘单个方块
        let newDiv=document.createElement("div");
        newDiv.style.height=cell.csize+"px";
        newDiv.style.width=cell.csize+"px";
        newDiv.style.left=cell.col*cell.csize+"px";
        newDiv.style.top=cell.row*cell.csize+"px";
        newDiv.style.backgroundColor=color;
        frag.appendChild(newDiv);
    },
    clearPlayground(){
        this.pg.innerHTML=""; //清除游戏区
    },
    paintStatus(){
        if(this.status==this.OVER){
            //
            //clearInterval(this.timer);
            document.getElementById("game-over").style.display="block";
        }
        else if(this.status==this.PAUSE){

        } else
            document.getElementById("game-over").style.display="none";
    },
    paintResult(){
        document.getElementById("score").innerHTML=
            document.getElementById("final-score").innerHTML=
                String(this.score+parseInt(this.time/10));
        document.getElementById("time").innerHTML=this.time;
    },
    paint(){
        this.clearPlayground();
        this.paintFood();
        this.paintRole();
        this.paintStatus();
        this.paintResult();
    }
};
//game.start();
document.getElementsByTagName("button")[0].onclick=function(){
    document.getElementById("game-over").style.display="none";
    //clearInterval(game.timer);
    game.start();
}
//启动游戏
var timer_s=null;
var count=3;
function start_animate() {
    var p=document.getElementById("game-start").firstElementChild;
    if(count==0) {
        count = "Go!";
        p.innerHTML = count;
    }
    else if(count=="Go!"){
        p.parentNode.style.display="none";
        clearInterval(timer_s);
        game.start();
    }else
        p.innerHTML=String(count--);
}
timer_s=setInterval(start_animate,1000);



