//colors
const transparent='transparent';
const transparentblue='#ddddff';


const tableheadrow=document.getElementById('table-head-row');
const cols=26;
const rows=100;
let currentcells;
let prevcell;
let cutCell;
let lastpressbtn;

let matrix= new Array(rows)
let numSheets=1;
let currentsheet=1;
let prevSheet;
let arrMatrix='arrMatrix';
function createnewMAtrix(){

for(let i=0;i<rows;i++){
    matrix[i]=new Array(cols);

    for(let col=0;col<cols;col++){
        matrix[i][col]={};
    }
}
}
createnewMAtrix();
const currentcell= document.getElementById('current-cell');
function colgen(typeofcell,tablerow,isinnertext,rownumber){
for(let col=0;col<cols;col++){
    const cell=document.createElement(typeofcell);
        if(isinnertext){
            cell.innerText= String.fromCharCode(col+65) ;
            cell.setAttribute("id",String.fromCharCode(col+65));
        }else{
            cell.setAttribute('id',`${String.fromCharCode(col+65)}${rownumber}`)
            cell.setAttribute("contenteditable",true);
            cell.addEventListener('input',updateobjectmatrix);
            cell.addEventListener("focus", (event) => focusHandler(event.target));
        }
    tablerow.append(cell)
}
}

colgen("th",tableheadrow,true);


//update sheet in matrix 
function updateobjectmatrix(){
    //console.log(matrix[0][0])
    let id = currentcells.id;
    let col=id[0].charCodeAt(0)-65;
    let row=id.substring(1)-1;
    matrix[row][col]={
     text: currentcells.innerText,
     style: currentcells.style.cssText,
     id: id,
    };
}
//console.log(updateobjectmatrix())


//doenload ,atrix
function downloadmatrix(){
    const matrixString = JSON.stringify(matrix);
    // matrixString -> into a blob
    const blob = new Blob([matrixString],{ type: 'application/json'});
    console.log(blob);
    const link = document.createElement('a');
    // createObjectURL converts my blob to link
    link.href = URL.createObjectURL(blob);
    link.download = 'table.json';
    link.click();

}

const uploadinput=document.getElementById('upload-input');

function uploadMatrix(event){
  const file=event.target.files[0];
 

  //helps to read blob
  if(file){
    const reader=new FileReader();
    reader.readAsText(file);

    reader.onload=function(event){
        const filecontent=JSON.parse(event.target.result);
       // console.log(filecontent)
       matrix=filecontent;
       renderMatrix();
    }
  }
 
}

uploadinput.addEventListener('input',uploadMatrix);







function setheadercolor(colid,rowid,color){
    const colhead=document.getElementById(colid);
    const rowhead=document.getElementById(rowid);
    colhead.style.backgroundColor=color;
    rowhead.style.backgroundColor=color;
}

function buttonHighlighter(button,styleproperty,style){
    if(currentcells.style[styleproperty]===style){
        button.style.backgroundColor=transparentblue;
    }else{
        button.style.backgroundColor=transparent;
    }
}


function focusHandler(cell){
   currentcells=cell;
   if(prevcell){
    setheadercolor(prevcell.id[0],prevcell.id.substring(1),transparent);
   }
   buttonHighlighter(boldbtn,"fontWeight","bold");
   buttonHighlighter(italicbtn,"fontStyle","italic");
   buttonHighlighter(underlinebtn,"textDecoration","underline");
   buttonHighlighter(leftbtn, "textAlign", "left");
   buttonHighlighter(centerbtn, "textAlign", "center");
   buttonHighlighter(rightbtn, "textAlign", "right");
    setheadercolor(cell.id[0],cell.id.substring(1),transparentblue);
    currentcell.innerText=cell.id+ ' ' +'selected';
    prevcell=currentcells;
}
const tablesiderow=document.getElementById('table-side-row');
function tableBodyGen(){
tablesiderow.innerHTML='';
    
for(let row=1;row<=rows;row++){
    const tr=document.createElement('tr');
    const th=document.createElement('th');
    th.innerText=row;
    th.setAttribute('id',row);
    tr.append(th);

    colgen('td',tr,false,row)
    tablesiderow.append(tr);

}
}
tableBodyGen();

if(localStorage.getItem(arrMatrix)){
    matrix=JSON.parse(localStorage.getItem(arrMatrix))[0];
   renderMatrix();
  }
//excel btns
const boldbtn=document.getElementById('bold-btn');
const italicbtn=document.getElementById('italic-btn');
const underlinebtn=document.getElementById('underline-btn');
const leftbtn=document.getElementById('left-btn');
const centerbtn=document.getElementById('center-btn');
const rightbtn=document.getElementById('right-btn');
const Fontstyledropdown=document.getElementById("Font-style-dropdown");
const Fontstylesize=document.getElementById("Font-style-size");
const bgcolorinput=document.getElementById("bgcolor");
const fontcolor=document.getElementById("fontcolor");
const cutbtn=document.getElementById('cut-text');
const copybtn=document.getElementById('copy-text');
const pastebtn=document.getElementById('paste-text');
const sheetno=document.getElementById("sheet-no");
const buttoncontainer=document.getElementById("button-container");
const addsheetbtn=document.getElementById("add-sheet-button");
const savesheetbtn=document.getElementById("save-sheet-button");



function CellsHighlighter(button,styleproperty,style,defaultstyle, resetButtons = []){
button.addEventListener('click',()=>{
    if(currentcells.style[styleproperty]===style){
                  currentcells.style[styleproperty]=defaultstyle;
                  button.style.backgroundColor=transparent;
    }else{
        currentcells.style[styleproperty]=style;
        button.style.backgroundColor=transparentblue;
        resetButtons.forEach(resetBtn => {
            resetBtn.style.backgroundColor = transparent;
        });
    }
   updateobjectmatrix();
})
}


CellsHighlighter(boldbtn,"fontWeight","bold","normal");
CellsHighlighter(italicbtn,"fontStyle","italic","normal");
CellsHighlighter(underlinebtn,"textDecoration",'underline',"none");
CellsHighlighter(leftbtn, "textAlign", "left", "", [centerbtn, rightbtn]);
CellsHighlighter(centerbtn, "textAlign", "center", "", [leftbtn, rightbtn]);
CellsHighlighter(rightbtn, "textAlign", "right", "", [leftbtn, centerbtn]);

function fontdesign(input,styleproperty,event){
   input.addEventListener(event,()=>{
    currentcells.style[styleproperty]=input.value;
    updateobjectmatrix();
   })
  
}
fontdesign(Fontstyledropdown,"fontFamily",'change');

const dataListFontStyle = document.getElementById('fontStyles');

Fontstyledropdown.addEventListener('change', function() {
    const inputValue = this.value;

    // Check if the value exists in the datalist options
    let exists = [...dataListFontStyle.options].some(option => option.value === inputValue);
    
    // If the value doesn't exist and it's not empty, add it to the datalist
    if (!exists && inputValue.trim() !== "") {
        const newOption = document.createElement('option');
        newOption.value = inputValue;
        dataListFontStyle.append(newOption);
    }
});
fontdesign(Fontstylesize,"fontSize","change");
fontdesign(bgcolorinput,"backgroundColor","input");
fontdesign(fontcolor,"color","input");



cutbtn.addEventListener('click',()=>{
    lastpressbtn='cut';
    cutCell={
        text: currentcells.innerText,
        style:currentcells.style.cssText,
    }
    currentcells.innerText='id';
    currentcells.style.cssText='';
    updateobjectmatrix();
})
copybtn.addEventListener('click',()=>{
    lastpressbtn='copy';
    cutCell={
        text: currentcells.innerText,
        style:currentcells.style.cssText,
    }
   
})

pastebtn.addEventListener('click',()=>{
    currentcells.innerText=cutCell.text;
    currentcells.style=cutCell.style;

    if(lastpressbtn==='cut'){
        cutCell=undefined
    }

    updateobjectmatrix();
})


function gennextsheetbtn(){
    const btn=document.createElement('button');
    numSheets++;
    currentsheet=numSheets;
    btn.innerText=`sheet ${currentsheet}`;
    btn.setAttribute('id',`sheet-${currentsheet}`)
    btn.setAttribute('onclick','viewSheet(event)')
    buttoncontainer.append(btn);
}

addsheetbtn.addEventListener('click',()=>{

    gennextsheetbtn();
    sheetno.innerText=`Sheet No-${currentsheet}`;

    //add next sheet btn
    //save matrix
    saveMatrix();
    //clean matrix
    createnewMAtrix();
    //clean html
    tableBodyGen();


})

function saveMatrix(){
    if(localStorage.getItem(arrMatrix)){
        let tempArrmatrix=JSON.parse(localStorage.getItem(arrMatrix));
        tempArrmatrix.push(matrix);
        localStorage.setItem(arrMatrix,JSON.stringify(tempArrmatrix));

    }else{
        //pressing add sheet for first time
        let tempArrmatrix=[matrix];
        localStorage.setItem(arrMatrix,JSON.stringify(tempArrmatrix));

    }
}
function renderMatrix(){
    matrix.forEach(row=>{
        row.forEach(CellObj=>{
          if(CellObj.id){
            let currentCell=document.getElementById(CellObj.id);
            currentCell.innerText=CellObj.text;
            currentCell.style=CellObj.style;
          }
        })
    })
}

function viewSheet(event){
  prevSheet=currentsheet;

  currentsheet=event.target.id.split('-')[1];
  let matrixarr=JSON.parse(localStorage.getItem(arrMatrix));
  matrixarr[prevSheet-1]=matrix;
  localStorage.setItem(arrMatrix,JSON.stringify(matrixarr));
  
  matrix=matrixarr[currentsheet-1];
  tableBodyGen();

  renderMatrix();

}


