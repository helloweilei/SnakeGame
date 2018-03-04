/**
 * Created by weilei on 2017/5/25.
 */
//Cell代表了组成Snake的最小单元块
class Cell{
    constructor(r,c){
        this.row=r;
        this.col=c;
        this.csize=10;
    }
}
class Snake{
    constructor(r0,c0,color){
        this.cells=[
            new Cell(r0,c0,color),
        ];
        this.dir={v:0,h:1};//贪吃蛇的前进方向,v表示水平方向
    }
    move(){
        var tail=this.cells[this.cells.length-1];
        var newHead=new Cell(this.cells[0].row+this.dir.v,
                              this.cells[0].col+this.dir.h,this.cells[0].color);
        for(var i=this.cells.length-1;i>0;i--)
            this.cells[i]=this.cells[i-1];
        this.cells[0]=newHead;
        return tail;
    }
    turnUp(){
        if(this.dir.v!=1) {
            this.dir.v = -1;
            this.dir.h = 0;
        }
    }
    turnRight(){
        if(this.dir.h!=-1){
            this.dir.v=0;
            this.dir.h=1;
        }
    }
    turnLeft(){
        if(this.dir.h!=1){
            this.dir.v=0;
            this.dir.h=-1;
        }
    }
    turnDown(){
        if(this.dir.v!=-1){
            this.dir.v=1;
            this.dir.h=0;
        }
    }
    isUnique(){//判断是否产生环
        for(var i=1;i<this.cells.length;i++)
            if(this.cells[i].row==this.cells[0].row &&
                this.cells[i].col==this.cells[0].col)
                return false;
        return true;
    }
}