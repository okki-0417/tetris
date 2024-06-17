//落ちるスピード
const GAME_SPEED = 500;

//フィールドのブロック数
const FIELD_COL = 10;
const FIELD_ROW = 20;

//ブロックひとつのサイズ(ピクセル)
const BLOCK_SIZE = 25;

//キャンバスサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

//キャンバスの宣言
let can = document.getElementById("can");
let con = can.getContext("2d");

//キャンバスの大きさ
can.width = SCREEN_W;
can.height = SCREEN_H;

can.style.border = "4px solid";

//テトロミノのサイズ
const TETRO_SIZE = 4;

//スタート地点の位置
const START_X = FIELD_COL/2 - TETRO_SIZE/2;
const START_Y = 0;

//テトロミノの座標
let tetro_x = START_X;
let tetro_y = START_Y;

//テトロミノ本体
let tetro;

const TETRO_COLORS = [
    "#000",              //0空
    "#6CF",              //1水色
    "#F92",              //2オレンジ
    "#66F",              //3青
    "#C5C",              //4紫
    "#FD2",              //5黄色
    "#F44",              //6赤
    "#5B5"               //7緑
]

//テトロミノの種類
const TETRO_TYPES = [
    [],                 //0. 空っぽ
    [                   //1. I
        [ 0, 0, 0, 0],
        [ 1, 1, 1, 1],
        [ 0, 0, 0, 0],
        [ 0, 0, 0, 0]
    ],
    [                   //2. L
        [ 0, 1, 0, 0],
        [ 0, 1, 0, 0],
        [ 0, 1, 1, 0],
        [ 0, 0, 0, 0]
    ],
    [                   //3. J
        [ 0, 0, 1, 0],
        [ 0, 0, 1, 0],
        [ 0, 1, 1, 0],
        [ 0, 0, 0, 0]
    ],
    [                   //4. T
        [ 0, 1, 0, 0],
        [ 0, 1, 1, 0],
        [ 0, 1, 0, 0],
        [ 0, 0, 0, 0]
    ],
    [                   //5. O
        [ 0, 0, 0, 0],
        [ 0, 1, 1, 0],
        [ 0, 1, 1, 0],
        [ 0, 0, 0, 0]
    ],
    [                   //6. Z
        [ 0, 0, 0, 0],
        [ 1, 1, 0, 0],
        [ 0, 1, 1, 0],
        [ 0, 0, 0, 0]
    ],
    [                   //7. S
        [ 0, 0, 0, 0],
        [ 0, 1, 1, 0],
        [ 1, 1, 0, 0],
        [ 0, 0, 0, 0]
    ]
]

//テトロミノの形
let tetro_t

//テトロミノの形をランダムで決める
tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1))+1;
tetro = TETRO_TYPES[tetro_t];

//フィールド本体
let field = [];

//ゲームオーバーフラグ
let over = false;



/*-------------------------------------------------------
        処理
-------------------------------------------------------*/
init();
drawAll();

//カーソルを押されたときの処理
document.onkeydown = function(e)
{
    if(over) return;

    switch(e.keyCode)
    {
        case 37: //左
            if(checkMove(-1, 0)) tetro_x--;
            break;
        /*case 38: //上
        if(checkMove(0, -1)) tetro_y--;     
            break;*/
        case 39: //右
        if(checkMove(1, 0))tetro_x++;
            break;
        case 40: //下
        if(checkMove(0, 1))tetro_y++;
            break;
        case 32: //スペース
            let ntetro = rotate();
            if(checkMove(0, 0, ntetro)) tetro = ntetro;
            break;
    }
    drawAll();
}


setInterval(dropTetro, GAME_SPEED);



/*-------------------------------------------------------
        関数
-------------------------------------------------------*/
//フィールドの初期化関数
function init()
{ 
    for(let y=0; y<FIELD_ROW; y++)
    {
        field[y] = [];

        for(let x=0; x<FIELD_COL; x++)
        {
            field[y][x] = 0;
        }
    }
}

//ブロックをひとつ描画する関数
function drawBlock(x, y, c)
{
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;

    con.fillStyle = TETRO_COLORS[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE)

    con.strokeStyle = "blcak";
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

//全部を描画する
function drawAll()
{
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);
    
    for(let y=0; y<FIELD_ROW; y++)
    {
        for(let x=0; x<FIELD_COL; x++)
        {
            if(field[y][x])
            {
                drawBlock(x, y, field[y][x]);
            }
        }
    }

    for(let y=0; y<TETRO_SIZE; y++)
    {
        for(let x=0; x<TETRO_SIZE; x++)
            {
                if(tetro[y][x])
                    {
                        drawBlock(x+tetro_x, y+tetro_y, tetro_t);
                    }
            }
    }

    if(over)
    {
        showGameOverText();
    }
}

function showGameOverText()
{
    let over_text = "GAME OVER";
    con.font = "40px MS ゴシック";
    let text_length = con.measureText(over_text).width;
    let text_x = SCREEN_W/2 - text_length/2;
    let text_y = SCREEN_H/2 - 20;
    con.lineWidth = 4;
    con.strokeText(over_text, text_x, text_y);
    con.fillStyle = "white";
    con.fillText(over_text, text_x, text_y);
}

//ブロックの衝突を判定する関数
function checkMove( mx, my, ntetro )
{
    if(ntetro == undefined) ntetro = tetro;

    for(let y=0; y<TETRO_SIZE; y++)
    {   
        for(let x=0; x<TETRO_SIZE; x++)
        {      
            if(ntetro[y][x])
            {
                let nx = tetro_x + mx + x;
                let ny = tetro_y + my + y;

                if( ny < 0 ||
                    nx < 0 ||
                    ny >= FIELD_ROW ||
                    nx >= FIELD_COL ||
                    field[ny][nx] )
                    return false;
            }
        }
    }
    return true;
}

//テトロを回転させる関数
function rotate()
{
    let ntetro = [];

    for(let y=0; y<TETRO_SIZE; y++)
    {   
        ntetro[y] = [];
        for(let x=0; x<TETRO_SIZE; x++)
        {
            ntetro[y][x] = tetro[TETRO_SIZE-x-1][y];
        }
    }

    return ntetro;
}


//テトロを固定する関数
function fixTetro()
{
    for(let y=0; y<TETRO_SIZE; y++)
        {   
            for(let x=0; x<TETRO_SIZE; x++)
            {
                if(tetro[y][x])
                {
                    field[tetro_y + y][tetro_x + x] = tetro_t;
                }
            }
        }
}


//ラインが揃ったかチェックして消す関数
function checkLine()
{
    for(let y=0; y<FIELD_ROW; y++)
        {   
            let flag = true;

            for(let x=0; x<FIELD_COL; x++)
            {
                if(!field[y][x])
                {
                    flag = false;
                    break;
                }
            }

            if(flag)
            {
                //linec++;

                for(let ny=y; ny>0; ny--)
                {
                    for(let nx=0; nx<FIELD_COL; nx++)
                    {
                        field[ny][nx] = field[ny-1][nx];
                    }
                }
            }
        }
}


//ブロックが落ちる処理の関数
function dropTetro()
{
    if(over) return;
    
    if(checkMove(0, 1)) tetro_y++;
    else
    {
        fixTetro();
        checkLine();

        tetro_t = Math.floor(Math.random()*(TETRO_TYPES.length-1))+1;
        tetro = TETRO_TYPES[tetro_t];

        tetro_x = START_X;
        tetro_y = START_Y;

        if(!checkMove(0, 0))
        {
            over = true;
        }
    }

    drawAll();
}