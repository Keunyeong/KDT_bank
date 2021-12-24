import _ from 'lodash';
import Chart from 'chart.js/auto';
const today = new Date();
const month = today.getMonth()+1;
const date = today.getDate();
const monthDate = [31,28,31,30,31,30,31,31,30,31,30,31];
let accountHistoryUrl = ["https://gyoheonlee.github.io/mobile-bank/data/bank-new.json","https://gyoheonlee.github.io/mobile-bank/data/bank-mother.json"];
const phoneElem = document.querySelector(".phone");
const accountElem = document.querySelector(".account");
const sections = document.querySelectorAll('section');
const accountManageElems = document.querySelectorAll(".account__manager");
let start_x, end_x; 
let start_y, end_y;
const slideWidth=['-375px',0,'375px'];
const color=[['#f06292','#ba68c8','#5c6bc0','#4db6ac','#ffeb3b'],['#4dd0e1','#2979ff', '#e040fb', '#ffa726', '#ff9e80']];

sections.forEach((section,index)=>{
  const extensionBtn = section.children[1].children[0];
  const accountUrl = accountHistoryUrl[index];
  const accountElem = section.children[0];
  const accountMainElem = section.children[0].children[1];
  const accountMainBoxElem = section.children[0].children[1].children[1];
  const accountManageBtn = section.children[0].children[1].children[1].children[3];
  accountHistoryUpload(accountUrl, section, index);
  extensionBtn.addEventListener('touchstart', touch_start);
  section.addEventListener('touchend', touch_end);
  section.children[0].addEventListener('touchstart',slide_start);
  section.children[0].addEventListener('touchend',(event)=>{ slide_end(event, index) });
  accountManageElems[index].addEventListener('touchstart',slide_start);
  accountManageElems[index].addEventListener('touchend',(event)=>{ slide_end(event, index) });
  section.children[1].children[1].children[0].lastElementChild.addEventListener('click',()=>{
    section.children[2].style.zIndex=5;
  });
  section.children[2].children[4].children[1].addEventListener('click',()=>{
    section.children[2].style.zIndex=-1;
  });
  section.children[2].children[4].children[0].addEventListener('click',(event)=>{
    addMoneyBox(event, section, index, accountUrl)
  });
  accountManageBtn.addEventListener("click",()=>{
    openAccountManager(0);
  });

  console.log(accountManageElems[index].children[3]);
  accountManageElems[index].children[3].addEventListener('click',()=>{
    openAccountManager(1);
  });
});

function addChart(index,month,monthCostArray){
  const ctx = accountManageElems[index].children[2].children[0].children[1].children[0];
  const labels = [];
  for(let i=2; i < monthDate[month-1]; i +=2){
    if(i <= date){
      labels.push(i);
    }
  }
  const data = {
    labels: labels,
    datasets: [{
      label: month+'월 지출 내역',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: monthCostArray,
    }]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {}
  };
  const myChart = new Chart(
    ctx,
    config
  );

  return myChart
}


function openAccountManager(btn){
  if(btn === 0 ){
    sections.forEach((sec, index)=>{
      sec.style.display = "none";
      accountManageElems[index].style.display = "block";
    });
  } else if (1){
    sections.forEach((sec, index)=>{
      sec.style.display = "block";
      accountManageElems[index].style.display = "none";
    });
  }
  
}

function fundingMoneyBox(section, num){
  if(num === -1){
    for(let i=0; i<section.children[1].children[1].children[0].children.length-1; i++){
      section.children[1].children[1].children[0].children[i].addEventListener('click',(event)=>{
        pushMoneyBox(i, section);
      })
    };
  } else {
    for(let i=num; i<section.children[1].children[1].children[0].children.length-1; i++){
      section.children[1].children[1].children[0].children[i].addEventListener('click',(event)=>{
        pushMoneyBox(i, section);
      })
    };
  }
}

function pushMoneyBox(i, section){
  const ratio = section.children[1].children[1].children[0].children[i].children[0];
  const fundAmount = section.children[1].children[1].children[0].children[i].children[2];
  const fundAmount2 = section.children[1].children[1].children[0].children[i].children[4];
  const targetAmount = section.children[1].children[1].children[0].children[i].children[3];
  const totalAmountElem = section.children[0].children[1].children[1].children[1].children[0].children[0];
  const totalAmount2Elem = section.children[0].children[1].children[1].children[1].children[0].children[1];
  if(Number(fundAmount2.children[0].innerText)>=Number(targetAmount.innerText)){
    console.log("FULL")
  } else {
    printRemainingCost(section, 5000);
    let fundNum = Number(fundAmount2.children[0].innerText)+5000;
    fundAmount2.children[0].innerText = fundNum
    fundAmount.children[0].innerText = fundNum.toLocaleString('ko-KR');
    let ratioNum = Number(fundAmount2.children[0].innerText)/Number(targetAmount.innerText)*100;
    ratio.style.width = ratioNum+"%";
  }
}

function addMoneyBox(event, section, index){
  const moneyBoxLength = section.children[1].children[1].children[0].children.length;
  const num = Number(moneyBoxLength)-1;
  const titleElem = section.children[2].children[1];
  const targetAmountElem = section.children[2].children[3];
  if(titleElem.value === '' || targetAmountElem.value === ''){
    console.log('failed');
    titleElem.value = '';
    targetAmountElem.value = '';
    section.children[2].style.zIndex=-1;
  } else {
    const title = titleElem.value;
    const targetAmount = targetAmountElem.value;
    console.log(title, targetAmount);
    const MBLiDivElem = document.createElement('div');
    const MBLiRatioElem = document.createElement('div');
    const MBLiTitleElem = document.createElement('p');
    const MBLiFundElem = document.createElement('p');
    const MBLiTargetElem = document.createElement('p');
    const MBLiFund2Elem = document.createElement('p');
    const fundAmount = 0;
    MBLiTargetElem.innerText=targetAmount;
    MBLiTargetElem.style.display="none";
    MBLiFund2Elem.innerHTML=`<span>${fundAmount}</span>원`;
    MBLiFund2Elem.style.display="none";
    MBLiRatioElem.classList.add("money-box__ratio");
    MBLiTitleElem.textContent = title;
    MBLiRatioElem.style.width=fundAmount+"%";
    MBLiRatioElem.style.backgroundColor=color[index][num];
    MBLiFundElem.innerHTML=`<span>${fundAmount.toLocaleString('ko-KR')}</span>원`;
    MBLiDivElem.appendChild(MBLiRatioElem);
    MBLiDivElem.appendChild(MBLiTitleElem);
    MBLiDivElem.appendChild(MBLiFundElem);
    MBLiDivElem.appendChild(MBLiTargetElem);
    MBLiDivElem.appendChild(MBLiFund2Elem);
    section.children[1].children[1].children[0].lastElementChild.before(MBLiDivElem);
    titleElem.value = '';
    targetAmountElem.value = '';
    section.children[2].style.zIndex=-1;
  }
  fundingMoneyBox(section, num);
}

function slide_start(e){
  start_x = e.touches[0].pageX;
}

function slide_end(event, index){
  end_x=event.changedTouches[0].pageX;
  if(start_x > end_x + 100){
    slideLeft(index);
  } else if(start_x + 100 < end_x) {
    slideRight(index);
  }
}

function slideLeft(index){
  if(index<sections.length-1){
    sections[index].style.left = '-375px';
    sections[index+1].style.left = 0;
    accountManageElems[index].style.left = '-375px';
    accountManageElems[index+1].style.left = 0;
    
  }
}

function slideRight(index){
  if(0<index){
    sections[index-1].style.left = 0;
    sections[index].style.left = '+375px';
    accountManageElems[index-1].style.left = 0;
    accountManageElems[index].style.left = '+375px';
  }
}

function touch_start(e) {
  start_y = e.touches[0].pageY;
}

function touch_end(e) {
  end_y = e.changedTouches[0].pageY;
  const contents = e.target.offsetParent;
  if(start_y > end_y + 60){
    contentsExtension(contents);
  } else if(start_y + 60 < end_y) {
    contentsContraction(contents);
  }
}

function contentsExtension(contents){
  if (!contents.classList.contains("big")){
    contents.classList.add("big");
  } 
}

function contentsContraction(contents){
  if (contents.classList.contains("big")){
    contents.classList.remove("big");
  }
}

function accountHistoryUpload(AccountUrl, section, index){
  fetch(AccountUrl,{
    headers:{
      "Accept":"application / json"
    }})
  .then(res=>{return res.json()})
  .then(function(data){
    //LODASH TEST
    const test = _.remove(data.bankList,{'date':'2021-11-03'});
    data.bankList.reverse()

    // ACCOUNT
    const accountElem = section.children[0];
    // ACCOUNT__HEADER
    const accountHeaderElem = accountElem.children[0];
    const accountAdElem = accountElem.children[2];
    const avatarElem = accountHeaderElem.children[0];
    const h2Elem = accountHeaderElem.children[1];
    const avatarImage = "https://firebasestorage.googleapis.com/v0/b/bankapp-3e013.appspot.com/o/avatar.png?alt=media&token=f929ad96-af1e-47bf-adfd-016135d338a6";
    const avatarImageElem = avatarElem.children[0];
    h2Elem.textContent = data.accountId;
    avatarImageElem.src = avatarImage;
    //ACCOUNT__MAIN
    const accountMainElem = accountElem.children[1];
    const accountNumElem = accountMainElem.children[1].children[0].children[0];
    const accountTotalAmountElem = accountMainElem.children[1].children[1].children[0].children[0];
    const accountTotalAmount2Elem = accountMainElem.children[1].children[1].children[0].children[1];
    accountNumElem.textContent = data.accountNumber;
    accountTotalAmount2Elem.textContent = Number(data.deposit);
    accountTotalAmountElem.textContent = (Number(data.deposit)).toLocaleString('ko-KR');
    //CONTENTS
    const contentsElem = section.children[1];
    const contentsMoneyboxElem = section.children[1].children[1];
    const contentsMoneyboxListElem = section.children[1].children[1].children[0];
    const contentsMoneyboxAddBtn = section.children[1].children[1].children[0].lastElementChild;
    
    data.moneyBox.forEach((obj,num)=>{
      const MBLiDivElem = document.createElement('div');
      const MBLiRatioElem = document.createElement('div');
      const MBLiTitleElem = document.createElement('p');
      const MBLiFundElem = document.createElement('p');
      const MBLiTargetElem = document.createElement('p');
      const MBLiFund2Elem = document.createElement('p');
      const fundAmount = (Number(obj.fundAmount))/(Number(obj.targetAmount))*100;
      MBLiTargetElem.innerText=obj.targetAmount;
      MBLiTargetElem.style.display="none";
      MBLiFund2Elem.innerHTML=`<span>${obj.fundAmount}</span>원`;
      MBLiFund2Elem.style.display="none";
      MBLiRatioElem.classList.add("money-box__ratio");
      MBLiTitleElem.textContent = obj.title;
      MBLiRatioElem.style.width=fundAmount+"%";
      MBLiRatioElem.style.backgroundColor=color[index][num];
      MBLiFundElem.innerHTML=`<span>${obj.fundAmount.toLocaleString('ko-KR')}</span>원`;
      MBLiDivElem.appendChild(MBLiRatioElem);
      MBLiDivElem.appendChild(MBLiTitleElem);
      MBLiDivElem.appendChild(MBLiFundElem);
      MBLiDivElem.appendChild(MBLiTargetElem);
      MBLiDivElem.appendChild(MBLiFund2Elem);
      contentsMoneyboxAddBtn.before(MBLiDivElem);
    })
    // HISTORY
    const historyElem = section.children[1].children[2].children[0];
    const monthCostArray=[];
    let monthCost = 0;
    const dateArr = [];
    data.bankList.forEach((bank)=>{
      dateArr.push(bank.date);
    });
    
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
      } else if(i === 1){
        pEle.textContent='어제';
      } else {
        pEle.textContent=newDateArr[i]+"일";
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
      const thisMonth = Number(newDateArr[i][5]+newDateArr[i][6]);
      if(thisMonth === month){
        monthCost+=Number(todayCost);
        monthCostArray.push(Number(todayCost));
      };
      spanEle.textContent= todayCost.toLocaleString('ko-KR')+"원 지출";
      liEle.appendChild(spanEle);
      liEle.appendChild(ulEle);
      historyElem.appendChild(liEle);
    }
    // ACCOUNTBAR
    //month(현재month)에 해당하는 설정해놓은 지출가능 총액을 json에서 꺼내온다.
    //현재month / 지출가능 총액 * 100
    //const setAmount = _.find(data.setTotalAmount,{"month":month}).setAmount;
    const setAmountNum = 10000000;
    accountMainElem.children[1].children[2].children[2].textContent=setAmountNum;
    const costAmount = Number(monthCost)/Number(setAmountNum)*100
    accountMainElem.children[1].children[2].children[0].children[0].style.width = costAmount+'%';
    accountMainElem.children[1].children[2].children[1].style.left = costAmount-1+'%';
    const remainingDate = monthDate[month-1]-date;
    accountMainElem.children[1].children[4].children[0].children[0].textContent=remainingDate;
    const remainingCost = setAmountNum-monthCost;
    accountMainElem.children[1].children[4].children[0].children[1].textContent=remainingCost.toLocaleString('ko-KR');
    accountMainElem.children[1].children[4].children[0].children[2].textContent=remainingCost;
    printRemainingCost(section,0);
    fundingMoneyBox(section, -1);

    // 지출관리 페이지
    // console.log(accountManageElems);
    addChart(index,month, monthCostArray);
  })
}

function printRemainingCost(section, minusCost){
  let remainingCost = section.children[0].children[1].children[1].children[4].children[0].children[2].textContent;
  let totalAmount = section.children[0].children[1].children[1].children[1].children[0].children[1].textContent;
  const setAmountNum = section.children[0].children[1].children[1].children[2].children[2].textContent;
  let monthCost = Number(setAmountNum)-Number(remainingCost);
  if(minusCost){
    remainingCost = Number(remainingCost)-Number(minusCost);
    totalAmount = Number(totalAmount)-Number(minusCost);
  };
  section.children[0].children[1].children[1].children[4].children[0].children[1].textContent=numberWithCommas(remainingCost);
  section.children[0].children[1].children[1].children[4].children[0].children[2].textContent=remainingCost;
  section.children[0].children[2].children[0].children[0].children[0].textContent=numberWithCommas(totalAmount);
  section.children[0].children[1].children[1].children[1].children[0].children[0].textContent = numberWithCommas(totalAmount);
  section.children[0].children[1].children[1].children[1].children[0].children[1].textContent = totalAmount;
  const costAmount = Number(monthCost)/Number(setAmountNum)*100
  section.children[0].children[1].children[1].children[2].children[0].children[0].style.width = costAmount+'%';
  section.children[0].children[1].children[1].children[2].children[1].style.left = costAmount-1+'%';
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}