const sectionEle = document.querySelector(".contents__history__list");
function accountHistoryUpload(url){
  fetch(url)
  .then(res=>res.json())
  .then(function(data){
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

const accountHistoryUrl = "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6e4d3d3-c52c-4ea8-b665-968a3b17c5ea/bank.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211217%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211217T084316Z&X-Amz-Expires=86400&X-Amz-Signature=f53f385c302c470c8f93ab8c115f90f534961bd8c37cd103f6c34f8c73d56ea3&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22bank.json%22&x-id=GetObject";

accountHistoryUpload(accountHistoryUrl);

const extenstionBtn = document.querySelector(".contents__sizeup > a")

extenstionBtn.addEventListener("click",function(){
  const contents = document.querySelector(".contents");
  if (contents.classList.contains("big")){
    contents.classList.remove("big");
  } else {
    contents.classList.add("big");
  }
})