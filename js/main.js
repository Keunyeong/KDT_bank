import _ from "lodash";
import Chart from "chart.js/auto";
const today = new Date();
const month = 12;
const date = 30;
const monthDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let accountHistoryUrl = [
  "https://gyoheonlee.github.io/mobile-bank/data/bank-me.json",
  "https://gyoheonlee.github.io/mobile-bank/data/bank-mom.json",
  "https://gyoheonlee.github.io/mobile-bank/data/bank-son.json",
];
const phoneElem = document.querySelector(".phone");
const sections = document.querySelectorAll("section");
const accountManageElems = document.querySelectorAll(".account__manager");
let start_x, end_x;
let start_y, end_y;
const color = [
  ["#f06292", "#ba68c8", "#5c6bc0", "#4db6ac", "#ff6d00", "#ffeb3b", "#8bc34a"],
  ["#ff6d00", "#4dd0e1", "#2979ff", "#8bc34a", "#e040fb", "#ffa726", "#ff9e80"],
  ["#4db6ac", "#ff6d00", "#ffeb3b", "#8bc34a", "#f06292", "#ba68c8", "#5c6bc0"],
];

sections.forEach((section, index) => {
  const extensionBtn = section.children[1].children[0];
  const accountUrl = accountHistoryUrl[index];
  const accountManageBtn =
    section.children[0].children[1].children[1].children[3];
  accountHistoryUpload(accountUrl, index);
  extensionBtn.addEventListener("touchstart", touch_start);
  section.addEventListener("touchend", touch_end);
  section.children[0].addEventListener("touchstart", slide_start);
  section.children[0].addEventListener("touchend", (event) => {
    slide_end(event, index);
  });
  accountManageElems[index].addEventListener("touchstart", slide_start);
  accountManageElems[index].addEventListener("touchend", (event) => {
    slide_end(event, index);
  });
  section.children[1].children[1].children[0].lastElementChild.addEventListener(
    "click",
    () => {
      section.children[2].style.zIndex = 5;
    }
  );
  section.children[2].children[4].children[1].addEventListener("click", () => {
    section.children[2].style.zIndex = -1;
  });
  section.children[2].children[4].children[0].addEventListener(
    "click",
    addMoneyBox(index)
  );
  accountManageBtn.addEventListener("click", () => {
    openAccountManager(0);
  });

  const amountInput =
    accountManageElems[index].children[1].children[0].children[1].children[0];
  amountInput.addEventListener("keypress", (e) => {
    const monthCost = Number(sessionStorage.getItem("monthCost" + index));
    if (e.target.value >= monthCost) {
      sections[
        index
      ].children[0].children[1].children[1].children[2].children[2].textContent =
        e.target.value;
      if (e.code === "Enter") {
        e.target.placeholder = numberWithCommas(e.target.value);
        e.target.value = numberWithCommas(e.target.value);
        printRemainingCost(0, index);
      }
    }
  });
  accountManageElems[index].children[3].addEventListener("click", () => {
    openAccountManager(1);
  });
});

function addChart(index, month, monthCostArray) {
  const ctx =
    accountManageElems[index].children[2].children[0].children[1].children[0];
  const labels = [];
  for (let i = 2; i < monthDate[month - 1]; i += 2) {
    if (i <= date) {
      labels.push(i + "일");
    }
  }
  const data = {
    labels: labels,
    datasets: [
      {
        label: month + "월 지출 내역",
        backgroundColor: color[1],
        borderColor: color[2],
        data: monthCostArray,
      },
    ],
  };
  const config = {
    type: "bar",
    data: data,
    options: {},
  };
  const myChart = new Chart(ctx, config);

  return myChart;
}

function addGraph(index, classifyArr, classifyNumArr) {
  const ctx =
    accountManageElems[index].children[2].children[1].children[1].children[0];
  const labels = [];
  for (let i = 0; i < classifyArr.length; i += 2) {
    if (i <= date) {
      labels.push(classifyArr[i]);
    }
  }
  const data = {
    labels: labels,
    datasets: [
      {
        label: month + "월 지출 내역",
        backgroundColor: color[0],
        borderColor: color[0],
        data: classifyNumArr,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: false,
      width: 300,
      borderWidth: 0,
      cutout: 100,
      plugins: {
        legend: {
          position: "none",
        },
      },
    },
  };
  const myGraph = new Chart(ctx, config);

  return myGraph;
}

function openAccountManager(btn) {
  if (btn === 0) {
    sections.forEach((sec, index) => {
      sec.style.display = "none";
      accountManageElems[index].style.display = "block";
      phoneElem.style.backgroundColor = "#fff";
    });
  } else if (1) {
    sections.forEach((sec, index) => {
      sec.style.display = "block";
      accountManageElems[index].style.display = "none";
      phoneElem.style.backgroundColor = "#EEECE5";
    });
  }
}

function fundingMoneyBox(num, index) {
  if (num === -1) {
    for (
      let i = 0;
      i <
      sections[index].children[1].children[1].children[0].children.length - 1;
      i++
    ) {
      sections[index].children[1].children[1].children[0].children[
        i
      ].addEventListener("click", (event) => {
        pushMoneyBox(i, index);
      });
    }
  } else {
    for (
      let i = num;
      i <
      sections[index].children[1].children[1].children[0].children.length - 1;
      i++
    ) {
      sections[index].children[1].children[1].children[0].children[
        i
      ].addEventListener("click", () => {
        pushMoneyBox(i, index);
      });
    }
  }
}

function pushMoneyBox(i, index) {
  const ratio =
    sections[index].children[1].children[1].children[0].children[i].children[0];
  const fundAmount =
    sections[index].children[1].children[1].children[0].children[i].children[2];
  const fundAmount2 =
    sections[index].children[1].children[1].children[0].children[i].children[4];
  const targetAmount =
    sections[index].children[1].children[1].children[0].children[i].children[3];
  const totalAmountElem =
    sections[index].children[0].children[1].children[1].children[1].children[0]
      .children[0];
  const totalAmount2Elem =
    sections[index].children[0].children[1].children[1].children[1].children[0]
      .children[1];

  if (
    Number(fundAmount2.children[0].innerText) >= Number(targetAmount.innerText)
  ) {
    console.log("FULL");
  } else {
    printRemainingCost(5000, index);
    let fundNum = Number(fundAmount2.children[0].innerText) + 5000;
    fundAmount2.children[0].innerText = fundNum;
    fundAmount.children[0].innerText = fundNum.toLocaleString("ko-KR");
    let ratioNum =
      (Number(fundAmount2.children[0].innerText) /
        Number(targetAmount.innerText)) *
      100;
    ratio.style.width = ratioNum + "%";
  }
}

function addMoneyBox(index) {
  const moneyBoxLength =
    sections[index].children[1].children[1].children[0].children.length;
  const num = Number(moneyBoxLength) - 1;
  const titleElem = sections[index].children[2].children[1];
  const targetAmountElem = sections[index].children[2].children[3];
  if (titleElem.value === "" || targetAmountElem.value === "") {
    console.log("failed");
    titleElem.value = "";
    targetAmountElem.value = "";
    sections[index].children[2].style.zIndex = -1;
  } else {
    const title = titleElem.value;
    const targetAmount = targetAmountElem.value;
    const MBLiDivElem = document.createElement("div");
    const MBLiRatioElem = document.createElement("div");
    const MBLiTitleElem = document.createElement("p");
    const MBLiFundElem = document.createElement("p");
    const MBLiTargetElem = document.createElement("p");
    const MBLiFund2Elem = document.createElement("p");
    const fundAmount = 0;
    MBLiTargetElem.innerText = targetAmount;
    MBLiTargetElem.style.display = "none";
    MBLiFund2Elem.innerHTML = `<span>${fundAmount}</span>원`;
    MBLiFund2Elem.style.display = "none";
    MBLiRatioElem.classList.add("money-box__ratio");
    MBLiTitleElem.textContent = title;
    MBLiRatioElem.style.width = fundAmount + "%";
    MBLiRatioElem.style.backgroundColor = color[index][num];
    MBLiFundElem.innerHTML = `<span>${fundAmount.toLocaleString(
      "ko-KR"
    )}</span>원`;
    MBLiDivElem.appendChild(MBLiRatioElem);
    MBLiDivElem.appendChild(MBLiTitleElem);
    MBLiDivElem.appendChild(MBLiFundElem);
    MBLiDivElem.appendChild(MBLiTargetElem);
    MBLiDivElem.appendChild(MBLiFund2Elem);
    sections[index].children[1].children[1].children[0].lastElementChild.before(
      MBLiDivElem
    );
    titleElem.value = "";
    targetAmountElem.value = "";
    sections[index].children[2].style.zIndex = -1;
  }
  fundingMoneyBox(num, index);
}

function slide_start(e) {
  start_x = e.touches[0].pageX;
}

function slide_end(event, index) {
  end_x = event.changedTouches[0].pageX;
  if (start_x > end_x + 100) {
    slideLeft(index);
  } else if (start_x + 100 < end_x) {
    slideRight(index);
  }
}

function slideLeft(index) {
  if (index === 0) {
    sections[index].style.left = "-375px";
    sections[index + 1].style.left = 0;
    sections[index + 2].style.left = "375px";
    accountManageElems[index].style.left = "-375px";
    accountManageElems[index + 1].style.left = 0;
    accountManageElems[index + 2].style.left = "375px";
  } else if (index === 1) {
    sections[index - 1].style.left = "-750px";
    sections[index].style.left = "-375px";
    sections[index + 1].style.left = 0;
    accountManageElems[index - 1].style.left = "-750px";
    accountManageElems[index].style.left = "-375px";
    accountManageElems[index + 1].style.left = 0;
  }
}

function slideRight(index) {
  if (index === 1) {
    sections[index + 1].style.left = "+750px";
    sections[index - 1].style.left = 0;
    sections[index].style.left = "375px";
    accountManageElems[index + 1].style.left = "750px";
    accountManageElems[index - 1].style.left = 0;
    accountManageElems[index].style.left = "375px";
  } else if (index === 2) {
    sections[index - 2].style.left = "-375px";
    sections[index - 1].style.left = 0;
    sections[index].style.left = "+375px";
    accountManageElems[index - 2].style.left = "-375px";
    accountManageElems[index - 1].style.left = 0;
    accountManageElems[index].style.left = "+375px";
  }
}

function touch_start(e) {
  start_y = e.touches[0].pageY;
}

function touch_end(e) {
  end_y = e.changedTouches[0].pageY;
  const contents = e.target.offsetParent;
  if (start_y > end_y + 60) {
    contentsExtension(contents);
  } else if (start_y + 60 < end_y) {
    contentsContraction(contents);
  }
}

function contentsExtension(contents) {
  if (!contents.classList.contains("big")) {
    contents.classList.add("big");
  }
}

function contentsContraction(contents) {
  if (contents.classList.contains("big")) {
    contents.classList.remove("big");
  }
}

function createMoneyBox(data, index) {
  const contentsMoneyboxAddBtn =
    sections[index].children[1].children[1].children[0].lastElementChild;
  data.moneyBox.forEach((obj, num) => {
    const MBLiDivElem = document.createElement("div");
    const MBLiRatioElem = document.createElement("div");
    const MBLiTitleElem = document.createElement("p");
    const MBLiFundElem = document.createElement("p");
    const MBLiTargetElem = document.createElement("p");
    const MBLiFund2Elem = document.createElement("p");
    const fundAmount =
      (Number(obj.fundAmount) / Number(obj.targetAmount)) * 100;
    MBLiTargetElem.innerText = obj.targetAmount;
    MBLiTargetElem.style.display = "none";
    MBLiFund2Elem.innerHTML = `<span>${obj.fundAmount}</span>원`;
    MBLiFund2Elem.style.display = "none";
    MBLiRatioElem.classList.add("money-box__ratio");
    MBLiTitleElem.textContent = obj.title;
    MBLiRatioElem.style.width = fundAmount + "%";
    MBLiRatioElem.style.backgroundColor = color[index][num];
    MBLiFundElem.innerHTML = `<span>${obj.fundAmount.toLocaleString(
      "ko-KR"
    )}</span>원`;
    MBLiDivElem.appendChild(MBLiRatioElem);
    MBLiDivElem.appendChild(MBLiTitleElem);
    MBLiDivElem.appendChild(MBLiFundElem);
    MBLiDivElem.appendChild(MBLiTargetElem);
    MBLiDivElem.appendChild(MBLiFund2Elem);
    contentsMoneyboxAddBtn.before(MBLiDivElem);
  });
}

// json 파일 받아서 출력하기
function accountHistoryUpload(AccountUrl, index) {
  fetch(AccountUrl, {
    headers: {
      Accept: "application / json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then(function (data) {
      data.bankList.reverse();
      // ACCOUNT
      const accountElem = sections[index].children[0];
      // ACCOUNT__HEADER
      const accountHeaderElem = accountElem.children[0];
      const accountAdElem = accountElem.children[2];
      const avatarElem = accountHeaderElem.children[0];
      const h2Elem = accountHeaderElem.children[1];
      const avatarImage = data.accountImg;
      const avatarImageElem = avatarElem.children[0];
      h2Elem.textContent = data.accountId;
      avatarImageElem.src = avatarImage;
      //ACCOUNT__MAIN
      const accountMainElem = accountElem.children[1];
      const accountNumElem =
        accountMainElem.children[1].children[0].children[0];
      const accountTotalAmountElem =
        accountMainElem.children[1].children[1].children[0].children[0];
      const accountTotalAmount2Elem =
        accountMainElem.children[1].children[1].children[0].children[1];
      accountNumElem.textContent = data.accountNumber;
      accountTotalAmount2Elem.textContent = Number(data.deposit);
      accountTotalAmountElem.textContent = Number(data.deposit).toLocaleString(
        "ko-KR"
      );
      //CONTENTS
      createMoneyBox(data, index);
      // HISTORY
      const historyElem = sections[index].children[1].children[2].children[0];
      const monthCostArray = [];
      let monthCost = 0;
      const dateArr = [];
      const classifyBaseArr = [];
      data.bankList.forEach((bank) => {
        dateArr.push(bank.date);
        switch (bank.classify) {
          case "oiling":
            bank.classify = "주유비";
            break;
          case "eatout":
            bank.classify = "외식";
            break;
          case "food":
            bank.classify = "식비";
            break;
          case "mart":
            bank.classify = "마트";
            break;
          case "shopping":
            bank.classify = "쇼핑";
            break;
          case "health":
            bank.classify = "건강";
            break;
          default:
            bank.classify = "기타";
        }
        classifyBaseArr.push(bank.classify);
      });
      // 분류 중복 제거(set 배열)
      // 분류 중복 제거 배열
      const classifyArr = [...new Set(classifyBaseArr)];
      // 분류별 지출횟수
      const classifyNumArr = [];
      // 분류별 지출액
      const classifyCost = [];
      createClassify(data, classifyArr, classifyNumArr, classifyCost, index);
      const newDateArr = [...new Set(dateArr)];
      let dateFindIndexArr = [];
      for (let k = 0; k < newDateArr.length; k++) {
        dateFindIndexArr.push(
          data.bankList.findIndex((n) => n.date == newDateArr[k])
        );
      }
      dateFindIndexArr.push(data.bankList.length);
      createStory(data, newDateArr, historyElem, dateFindIndexArr);
      // ACCOUNTBAR
      //month(현재month)에 해당하는 설정해놓은 지출가능 총액을 json에서 꺼내온다.
      //현재month / 지출가능 총액 * 100
      printAccountBar(data, index, monthCost);

      // 지출관리 페이지
      addChart(index, month, monthCostArray);
      addGraph(index, classifyArr, classifyNumArr);
    });
}

function createStory(data, newDateArr, historyElem, dateFindIndexArr) {
  for (let i = 0; i < newDateArr.length; i++) {
    const todayCost = 0;
    const liEle = document.createElement("li");
    const pEle = document.createElement("p");
    const ulEle = document.createElement("ul");
    const spanEle = document.createElement("span");
    if (i === 0) {
      pEle.textContent = "오늘";
    } else if (i === 1) {
      pEle.textContent = "어제";
    } else {
      pEle.textContent = date + "일";
    }
    liEle.appendChild(pEle);

    for (let j = dateFindIndexArr[i]; j < dateFindIndexArr[i + 1]; j++) {
      const li2Ele = document.createElement("li");
      const span1Ele = document.createElement("span");
      const span2Ele = document.createElement("span");
      const hrEle = document.createElement("hr");

      span1Ele.textContent = data.bankList[j].history;

      if (data.bankList[j].income === "in") {
        span2Ele.style.color = "red";
        span2Ele.textContent =
          "+" + data.bankList[j].price.toLocaleString("ko-KR");
      } else {
        span2Ele.textContent =
          "-" + data.bankList[j].price.toLocaleString("ko-KR");
        todayCost -= Number(data.bankList[j].price);
      }
      li2Ele.appendChild(span1Ele);
      li2Ele.appendChild(span2Ele);
      ulEle.appendChild(li2Ele);
      ulEle.appendChild(hrEle);
    }
    todayCost = Math.abs(todayCost);
    const thisMonth = Number(date[5] + date[6]);
    if (thisMonth === month) {
      monthCost += Number(todayCost);
      monthCostArray.push(Number(todayCost));
    }
    spanEle.textContent = todayCost.toLocaleString("ko-KR") + "원 지출";
    liEle.appendChild(spanEle);
    liEle.appendChild(ulEle);
    historyElem.appendChild(liEle);
  }
}

function createClassify(
  data,
  classifyArr,
  classifyNumArr,
  classifyCost,
  index
) {
  classifyArr.forEach((item) => {
    let num = 0;
    let cost = 0;
    const classifySame = _.filter(data.bankList, { classify: item });
    classifySame.forEach((obj) => {
      const thisMonth = Number(obj.date[5] + obj.date[6]);
      if (thisMonth === month) {
        cost += obj.price;
        num++;
      }
    });
    classifyCost.push(cost);
    classifyNumArr.push(num);
  });
  classifyArr.forEach((item, i) => {
    const classLiElem = document.createElement("li");
    const classSpanElem = document.createElement("span");
    const priceSpanElem = document.createElement("span");
    classSpanElem.textContent = item;
    priceSpanElem.textContent = classifyCost[i];
    classLiElem.appendChild(classSpanElem);
    classLiElem.appendChild(priceSpanElem);
    accountManageElems[
      index
    ].children[2].children[1].children[2].children[0].appendChild(classLiElem);
  });
}

function printAccountBar(data, index, monthCost) {
  const setAmount = data.setAmountNum;
  const setAmountNum = setAmount + 4000000;
  setAmountPrint(index, setAmountNum);
  const costAmount = (Number(monthCost) / Number(setAmountNum)) * 100;
  sessionStorage.setItem("monthCost" + index, monthCost);
  sections[
    index
  ].children[0].children[1].children[1].children[2].children[0].children[0].style.width =
    costAmount + "%";
  sections[
    index
  ].children[0].children[1].children[1].children[2].children[1].style.left =
    costAmount - 1 + "%";
  accountManageElems[index].children[1].children[1].children[1].style.left =
    costAmount - 1 + "%";
  accountManageElems[
    index
  ].children[1].children[1].children[0].children[0].style.width =
    costAmount + "%";
  const remainingDate = monthDate[month - 1] - date;
  sections[
    index
  ].children[0].children[1].children[1].children[4].children[0].children[0].textContent =
    remainingDate;
  const remainingCost = setAmountNum - monthCost;
  sections[
    index
  ].children[0].children[1].children[1].children[4].children[0].children[1].textContent =
    remainingCost.toLocaleString("ko-KR");
  sections[
    index
  ].children[0].children[1].children[1].children[4].children[0].children[2].textContent =
    remainingCost;
  printRemainingCost(0, index);
  fundingMoneyBox(-1, index);
}

function setAmountPrint(index, setAmountNum) {
  sections[
    index
  ].children[0].children[1].children[1].children[2].children[2].textContent = setAmountNum;
  accountManageElems[
    index
  ].children[1].children[0].children[1].children[0].placeholder =
    numberWithCommas(setAmountNum);
}

function printRemainingCost(minusCost, index) {
  let remainingCost =
    sections[index].children[0].children[1].children[1].children[4].children[0]
      .children[2].textContent;
  let totalAmount =
    sections[index].children[0].children[1].children[1].children[1].children[0]
      .children[1].textContent;
  const setAmountNum =
    sections[index].children[0].children[1].children[1].children[2].children[2]
      .textContent;
  let monthCost = Number(sessionStorage.getItem("monthCost" + index));
  if (minusCost) {
    remainingCost = Number(remainingCost) - Number(minusCost);
    totalAmount = Number(totalAmount) - Number(minusCost);
    monthCost = Number(monthCost) + Number(minusCost);
    sessionStorage.setItem("monthCost" + index, monthCost);
  }
  sections[
    index
  ].children[0].children[1].children[1].children[4].children[0].children[1].textContent =
    numberWithCommas(remainingCost);
  sections[
    index
  ].children[0].children[1].children[1].children[4].children[0].children[2].textContent =
    remainingCost;
  sections[
    index
  ].children[0].children[2].children[0].children[0].children[0].textContent =
    numberWithCommas(totalAmount);
  sections[
    index
  ].children[0].children[1].children[1].children[1].children[0].children[0].textContent =
    numberWithCommas(totalAmount);
  sections[
    index
  ].children[0].children[1].children[1].children[1].children[0].children[1].textContent =
    totalAmount;
  const costAmount = (Number(monthCost) / Number(setAmountNum)) * 100;
  sections[
    index
  ].children[0].children[1].children[1].children[2].children[0].children[0].style.width =
    costAmount + "%";
  sections[
    index
  ].children[0].children[1].children[1].children[2].children[1].style.left =
    costAmount - 1 + "%";
  accountManageElems[index].children[1].children[1].children[1].style.left =
    costAmount - 1 + "%";
  accountManageElems[
    index
  ].children[1].children[1].children[0].children[0].style.width =
    costAmount + "%";
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
