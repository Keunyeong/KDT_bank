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
        const liEle = document.createElement('li');
        const pEle = document.createElement('p');
        const spanEle = document.createElement('span');
        pEle.textContent=data.bankList[j].history;
        spanEle.textContent=data.bankList[j].price;
        liEle.appendChild(pEle);
        liEle.appendChild(spanEle);
        ulEle.appendChild(liEle);
      }
      liEle.appendChild(ulEle);
      sectionEle.appendChild(liEle);
    }
  })
}

const accountHistoryUrl = "https://s3.us-west-2.amazonaws.com/secure.notion-static.com/f6e4d3d3-c52c-4ea8-b665-968a3b17c5ea/bank.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20211216%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211216T043242Z&X-Amz-Expires=86400&X-Amz-Signature=66b9d4accfc6f8331c9bbaf104c0328a4509f15a90337714dcefa5885a94f777&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22bank.json%22&x-id=GetObject";

accountHistoryUpload(accountHistoryUrl);