const accountHistoryUrl1 = "https://gyoheonlee.github.io/mobile-bank/data/bank-new.json";
const accountHistoryUrl2 = "https://gyoheonlee.github.io/mobile-bank/data/bank-mother.json";
const historyEle = document.querySelector(".sec01 .contents__history > .contents__history__list");
const history2Ele = document.querySelector(".sec02 .contents__history > .contents__history__list");
const extensionBtns = document.querySelectorAll('.contents__sizeup');
const phoneElem = document.querySelector(".phone");
const sectionElems = document.querySelectorAll("section");
const accountElem = document.querySelector(".account");
const sections = document.querySelectorAll('section');
let start_x, end_x; 
let start_y, end_y;
let className;
const slideWidth=['-375px',0,'375px'];
accountHistoryUpload(accountHistoryUrl1,historyEle);
accountHistoryUpload(accountHistoryUrl2,history2Ele);
extensionBtns.forEach((btn)=>{return btn.addEventListener('touchstart', touch_start)});

sectionElems.forEach((elem)=>{return elem.addEventListener('touchend', touch_end)});
phoneElem.addEventListener('touchstart',slide_start);
phoneElem.addEventListener('touchend',slide_end);

function slide_start(e){
  start_x = e.touches[0].pageX;
}

function slide_end(e){
  end_x=e.changedTouches[0].pageX;
  if(start_x > end_x + 100){
    slideLeft();
  } else if(start_x + 100 < end_x) {
    slideRight();
  }
}

function slideLeft(){
  for(let i=0; i<sections.length; i++){
    sections[i].style.left = slideWidth[i];
  }
}

function slideRight(){
  for(let i=1; i<sections.length; i++){
    sections[i].style.left = slideWidth[i];
  }
}

function touch_start(e) {
  start_y = e.touches[0].pageY;
  className=e.target.className;
}

function touch_end(e) {
  end_y = e.changedTouches[0].pageY;
  if(start_y > end_y + 200){
    contentsExtension(className);
  } else if(start_y + 200 < end_y) {
    contentsContraction(className);
  }
}

function contentsExtension(className){
  let contents = document.querySelector(`.${className} .contents`);
  console.log(contents);
  if (!contents.classList.contains("big")){
    contents.classList.add("big");
  } 
}

function contentsContraction(className){
  let contents = document.querySelector(`.${className} .contents`);
  if (contents.classList.contains("big")){
    contents.classList.remove("big");
  }
}

function accountHistoryUpload(url, section){
  fetch(url)
  .then(res=>res.json())
  .then(function(data){
    data.bankList.reverse();
    const dateArr = [];
    for(let h=0; h < data.bankList.length; h++){
      dateArr.push(data.bankList[h].date);
    };
    const set = new Set(dateArr);
    const newDateArr = [...set];
    let dateFindIndexArr = [];
    for(let k=0; k<newDateArr.length; k++){
      dateFindIndexArr.push(data.bankList.findIndex(n=>n.date==newDateArr[k]));
    };
    dateFindIndexArr.push(data.bankList.length);
    
    for(let i=0; i<newDateArr.length; i++){
      const todayCost = 0;
      const liEle=document.createElement('li');
      const pEle = document.createElement('p');
      const ulEle = document.createElement('ul');
      const spanEle = document.createElement('span');
      if(i === 0){
        pEle.textContent='오늘';
        console.log(i,newDateArr[i]);
        
      } if(i === 1){
        pEle.textContent='어제';
      } else {
        pEle.textContent=newDateArr[i];
      }
      liEle.appendChild(pEle);
      
      for(let j=dateFindIndexArr[i];j<dateFindIndexArr[i+1];j++){
        const li2Ele = document.createElement('li');
        const pEle = document.createElement('p');
        const span1Ele = document.createElement('span');
        const span2Ele = document.createElement('span');
        const hrEle = document.createElement('hr');
        
        span1Ele.textContent=data.bankList[j].history;
        
        if(data.bankList[j].income==='in'){
          span2Ele.style.color="red";
          span2Ele.textContent='+'+(data.bankList[j].price).toLocaleString('ko-KR');
        } else {
          span2Ele.textContent='-'+(data.bankList[j].price).toLocaleString('ko-KR');
          todayCost -= Number(data.bankList[j].price);
        }
        
        li2Ele.appendChild(span1Ele);
        li2Ele.appendChild(span2Ele);
        ulEle.appendChild(li2Ele);
        ulEle.appendChild(hrEle);
      }
      todayCost = Math.abs(todayCost);
      spanEle.textContent= todayCost.toLocaleString('ko-KR')+"원 지출";
      liEle.appendChild(spanEle);
      liEle.appendChild(ulEle);
      section.appendChild(liEle);
    }
  })
}