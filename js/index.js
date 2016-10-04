$(function () {
    canvas=$('#canvas').get(0);
    var ctx=canvas.getContext('2d');
    var row=15;
    var width=canvas.width;
    var off=width/row;
    var block={};
    var flag=true;
    var blank={};
    var AI=true;
    var a=true;
    $('.time1').addClass('t1')
    function makeBlank() {
        for (var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                blank[p2k(i,j)]=true;

            }
        }
    }
    function k2o(key) {
        var arr=key.split('_');
        return {x:parseInt(arr[0]),y:parseInt(arr[1])};

    }
    function v2k(position) {
        return position.x+'_'+position.y;
    }
    function p2k(x,y) {
        return x+'_'+y;
    }

    function makeCircle(x,y) {
        ctx.beginPath();
        ctx.arc(x*off,y*off,3,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    function draw() {
        for(var i=0;i<15;i++){
            ctx.beginPath();
            ctx.moveTo(off/2+0.5,(off/2+0.5)+i*off);
            ctx.lineTo((row-0.5)*off+0.5,(off/2+0.5)+i*off);
            ctx.stroke();
            ctx.closePath();
        }
        for(var j=0;j<15;j++){
            ctx.beginPath();
            ctx.moveTo((off/2+0.5)+j*off,off/2+0.5);
            ctx.lineTo((off/2+0.5)+j*off,(row-0.5)*off+0.5);
            ctx.stroke();
            ctx.closePath();
        }
        makeCircle(3.5,3.5);
        makeCircle(11.5,3.5);
        makeCircle(7.5,7.5);
        makeCircle(3.5,11.5);
        makeCircle(11.5,11.5);
    }
    draw();
    function drawChess(position,color) {
        ctx.save();
        ctx.beginPath();
        ctx.translate((position.x+0.5)*off,(position.y+0.5)*off);
        if(color=="black"){
            var radgrad = ctx.createRadialGradient(-5,-5,3,0,0,14);
            radgrad.addColorStop(0, '#999');
            radgrad.addColorStop(0.9, '#000');
            radgrad.addColorStop(1, 'rgba(1,159,98,0)');
            ctx.fillStyle=radgrad;
            $('.time2').addClass('t1');
            $('.time1').removeClass('t1');
            clearInterval(t);
        }else if(color=="white"){
            var radgrad = ctx.createRadialGradient(-5,-5,3,0,0,14);
            radgrad.addColorStop(0, '#fff');
            radgrad.addColorStop(0.9, '#ccc');
            radgrad.addColorStop(1, 'rgba(1,159,98,0)');
            ctx.fillStyle=radgrad;

            $('.time1').addClass('t1')
            $('.time2').removeClass('t1')
            clearInterval(t);

        }
        ctx.arc(0,0,15, 0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        block[v2k(position)]=color;
        delete blank[v2k(position)]
        clearInterval(t);
        time();
    }

    // 把棋盘中的位置分成对象

    function drawtext(pos,text,color) {
        ctx.save();
        ctx.font='20px 微软雅黑';
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        if(color=="black"){
            ctx.fillStyle="white"
        }else if(color=="white"){
            ctx.fillStyle="black"
        }
        // 把棋盘中的位置改变成画板位置
        ctx.fillText(text,(pos.x+0.5)*off,(pos.y+0.5)*off);
        ctx.restore();
    }

    function review() {
        i=0;
        // k代表着block表中的位置，9_3
        for (var k in block){
            i++;
           drawtext( k2o(k),i,block[k]);
        }
    }

    function check(pos,col,num) {
        var num=1;
        var table={};
        for(var i in block){
            if(block[i]===col){
                table[i]=true;
            }
        }
        // 横线
        var tx=pos.x;
        var ty=pos.y;
        while(table[tx+1+'_'+ty]){
            num++;tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[tx-1+'_'+ty]){
            num++;tx--;
        }


        // 竖线
        var num1=1;
        var tx=pos.x;
        var ty=pos.y;
        while(table[tx+'_'+(ty+1)]){
            num1++;ty++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[tx+'_'+(ty-1)]){
            num1++;ty--;
        }

        //右斜线
        var num2=1;
        var tx=pos.x;
        var ty=pos.y;
        while(table[(tx+1)+'_'+(ty-1)]){
            num2++;tx++;ty--;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx-1)+'_'+(ty+1)]){
            num2++;tx--;ty++;
        }

        // 左斜线
        var num3=1;
        var tx=pos.x;
        var ty=pos.y;
        while(table[(tx-1)+'_'+(ty-1)]){
            num3++;tx--;ty--;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx+1)+'_'+(ty+1)]){
            num3++;tx++;ty++;
        }
        return Math.max(num1,num2,num3,num);
    }

    function restart() {
        ctx.clearRect(0,0,width,width);
        block={};
        flag=true;
        $(canvas).off('click');
        $(canvas).on('click',handleclick);
        makeCircle();
        makeBlank();
        draw();
    }

    function handleclick(e) {
        var position={x:Math.round((e.offsetX-off/2)/off),y:Math.round((e.offsetY-off/2)/off)};
        if(block[v2k(position)]){
            return;
        }
        if(AI){
            if(flag){
                drawChess(position,"black");
                if(check(position,'black')>=5){
                    alert('黑色赢');
                    $(canvas).off('click');
                    if(confirm("是否生成棋谱")){
                        review();
                    }clearInterval(t)
                    return;
                }
            }else{
                drawChess(position,"white");
                if(check(position,'white')>=5){
                    alert('白色赢');
                    $(canvas).off('click');

                    if(confirm("是否生成棋谱")){
                        review();
                    }clearInterval(t)
                    return;
                }
            }
            flag=!flag;
        }else{
            drawChess(position,"black");
            if(check(ai(),'black')>5){
                alert('黑色赢');
                $(canvas).off('click');

                if(confirm("是否生成棋谱")){
                    review();
                }clearInterval(t)
            }
                 drawChess(ai(),"white");
                if(check(ai(),'white')>5){
                    alert('白色赢');
                    $(canvas).off('click');
                    if(confirm("是否生成棋谱")){
                        review();
                    }clearInterval(t)
                }
            }
    }

    function ai() {
        var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for (var i in blank){
            var score1=check(k2o(i),'black');
            var score2=check(k2o(i),'white');
            if(score1>max1){
                max1=score1;
                pos1=k2o(i);
            }
            if(score2>max2){
                max2=score2;
                pos2=k2o(i);
            }
        }
            if(max2>=max1){
                return pos2;
            }else{
                return pos1;
            }
    }

    $('.box').on('click',function () {
        AI=!AI;
        block={};
        makeBlank();
        // $(canvas).off('click');
        // $(canvas).on('click',handleclick);
        $(this).toggleClass('active');
    })
    $(canvas).on('click',handleclick);
    $('.restart').on('click',function () {
        restart();
        clearInterval(t)
        time();
    });



    function time() {
        var s=29;
        t=setInterval(function () {
            txt=s<10?"0"+s:s;
            s--;
            if(s<0){
                clearInterval(t);
            }
            $('.djs').find('span').text(txt);
        },1000)
    }
        time();
    //悔棋
    $('.back').on('click',function () {
        // var last=blank[]
        // delete blank[v2k(position)]
    })
    // music
    var audio=$('audio').get(0);
    audio.play();
    $('.music').on('click',function () {

        $('.vol').fadeToggle();
    })
    $('audio').on('timeupdate',function () {
        $('.timetiao .yuan').css({
            left:audio.currentTime/audio.duration*$('.timetiao').width()
        })
    });
    $('.timetiao').on('click',function (e) {
        audio.currentTime=audio.duration*e.offsetX/$('.timetiao').width()-$(this).find('.yuan').width()/2;
    });
    $('.timetiao .yuan').on('click',false);
    $('.volume').on('click',function () {
        $(this).toggleClass('jinyin');
        if($(this).attr('pre-v')){
            audio.volume=$(this).attr('pre-v');
            $(this).removeAttr('pre-v')
        }else{
            $(this).attr('pre-v',audio.volume);
            audio.volume=0;
        }
    })
    $('.voltiao').on('click',function (e) {
        audio.volume=(e.offsetX-$(this).find('.yuan').width()/2)/$(this).width();
    });
    $('.timetiao .yuan').on('click',false);
    $('audio').on('volumechange',function () {
        if(audio.volume===0){
            $('.voltiao').addClass('jinyin')
        }else{
            $('.voltiao').removeClass('jinyin')
        }
        $('.voltiao .yuan').css({
            left:$('.voltiao').width()*audio.volume
        })
    })
})
