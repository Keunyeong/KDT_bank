const accountHistoryUrl = "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6e4d3d3-c52c-4ea8-b665-968a3b17c5ea/bank.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211220%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211220T041540Z&X-Amz-Expires=86400&X-Amz-Signature=730c6e0812549d1772458c47dd88109cc6877187aa6ef3408ea3b9eb6bd32f90&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22bank.json%22&x-id=GetObject";
const sectionEle = document.querySelector(".contents__history__list");
const extensionBtn = document.querySelector(".contents__sizeup > a")
const phoneElem = document.querySelector(".phone");
let start_y, end_y;

accountHistoryUpload(accountHistoryUrl);
extensionBtn.addEventListener('touchstart', touch_start);
phoneElem.addEventListener('touchend', touch_end);

function touch_start(event) {
  start_y = event.touches[0].pageY;
}

function touch_end(event) {
  end_y = event.changedTouches[0].pageY;
  if(start_y > end_y){
    contentsExtension();
  } else {
    contentsContraction();
  }
}

function contentsExtension(){
  const contents = document.querySelector(".contents");
  if (!contents.classList.contains("big")){
    contents.classList.add("big");
  } 
}
function contentsContraction(){
  const contents = document.querySelector(".contents");
  if (contents.classList.contains("big")){
    contents.classList.remove("big");
  }
}

function accountHistoryUpload(url){
  fetch(url)
  .then(res=>res.json())
  .then(function(data){
    data.bankList.reverse();
    const dateArr = [];
    for(let i=0; i < data.bankList.length; i++){
      dateArr.push(data.bankList[i].date);
    };
    const set = new Set(dateArr);
    const newDateArr = [...set];

    let dateFindIndexArr = [];
    for(let i=0; i<newDateArr.length; i++){
      dateFindIndexArr.push(data.bankList.findIndex(n=>n.date==newDateArr[i]));
    };
    dateFindIndexArr.push(data.bankList.length);
    
    for(let i=0; i<newDateArr.length; i++){
      const liEle=document.createElement('li');
      const pEle = document.createElement('p');
      const ulEle = document.createElement('ul');
      
      pEle.textContent=newDateArr[i];
      
      liEle.appendChild(pEle);
      
      for(let j=dateFindIndexArr[i];j<dateFindIndexArr[i+1];j++){
        const li2Ele = document.createElement('li');
        const pEle = document.createElement('p');
        const span1Ele = document.createElement('span');
        const span2Ele = document.createElement('span');
        const hrEle = document.createElement('hr');
        span1Ele.textContent=data.bankList[j].history;
        span2Ele.textContent=data.bankList[j].price;
        li2Ele.setAttribute("class","contents__history__list__el");
        li2Ele.appendChild(span1Ele);
        li2Ele.appendChild(span2Ele);
        ulEle.appendChild(li2Ele);
        ulEle.appendChild(hrEle);
      }
      liEle.appendChild(ulEle);
      sectionEle.appendChild(liEle);
    }
  })
}