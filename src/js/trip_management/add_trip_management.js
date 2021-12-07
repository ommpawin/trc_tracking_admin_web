let urlAPIServer;
let pageLock = false;
let fullNameRoute = [];
let serviceTime = [];
let tripTableData = {
    tableForward: [],
    tableBackward: []
};
let goStatus;
let countTrip;
let openFirstModel = false;
const dateData = new Date();
const nowValue = [dateData.getDate(), dateData.getMonth() + 1, dateData.getFullYear() + 543];

document.querySelector("#form_add_trip_management").addEventListener("change", () => {
    setPageLock();
});

window.addEventListener("beforeunload", (event) => {
    if (pageLock) {
        event.returnValue = "คุณมีการเปลี่ยนแปลงฟอร์มที่ยังไม่เสร็จสมบูรณ์ !";
    }
});

function setPageLock() {
    document.querySelector("#input_verify > div > button").disabled = false;
    pageLock = true;
}

(() => {

    async function getURLServer() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => {
            return value.json();
        });
        urlAPIServer = settingFile.urlAPIServer;
    }

    async function getAPIData() {
        const authorizationKey = new Headers();

        authorizationKey.append("Authorization", getCookie("keyAccount"));

        const data = new Promise((resolve, reject) => {
            fetch(`${urlAPIServer}/add_trip_management`, {
                    method: 'GET',
                    headers: authorizationKey
                })
                .then((response) => {
                    if (response.status == 226) {
                        resolve(response.json());
                    } else {
                        resolve(response.text());
                    }
                })
                .catch((err) => {
                    if (err == "TypeError: Failed to fetch") {
                        window.location.href = "/TRC_Tracking/pages/staff_page/trip_management/trip_management.php";
                    }
                });

        });

        if (await data == "re-login" || await data == "re-Login_KeyAccess") {
            window.location.href = "/TRC_Tracking/pages/access_system/direct_logout_process.php";
        } else {
            extractJSONData(await data);
        }

    }

    async function extractJSONData(jsonData) {
        const objectResponse = await jsonData;
        fullNameRoute = await objectResponse.serviceNameRoute;

        await setFullNameRoute();
    }

    async function setFullNameRoute() {
        const nameRouteInput = document.querySelector("select[name='service_route']");

        while (nameRouteInput.firstChild) {
            nameRouteInput.removeChild(nameRouteInput.lastChild);
        }

        const optionDF = document.createElement("option");
        optionDF.selected = true;
        optionDF.disabled = true;
        optionDF.value = "0";
        optionDF.text = "เลือกเส้นทางเดินรถ";

        nameRouteInput.appendChild(optionDF);

        await fullNameRoute.forEach((v) => {
            const optionF = document.createElement("option");
            optionF.value = v.id;
            optionF.text = v.nameRoute;
            nameRouteInput.appendChild(optionF);
        });

        await detectParam();
    }

    function setDateTimeInput() {
        const monthTitle = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const dayInput = document.querySelector("#datepicker_day");
        const monthInput = document.querySelector("#datepicker_month");
        const yearInput = document.querySelector("#datepicker_year");
        const optionDayValue = document.createElement("option");
        const optionMonthValue = document.createElement("option");
        const optionYearValue = document.createElement("option");

        optionDayValue.value = nowValue[0] < 10 ? "0" + nowValue[0] : nowValue[0];
        optionDayValue.text = nowValue[0];
        optionDayValue.selected = true;
        dayInput.appendChild(optionDayValue);

        optionMonthValue.value = nowValue[1] < 10 ? "0" + nowValue[1] : nowValue[1];
        optionMonthValue.text = `${monthTitle[parseInt(nowValue[1]) - 1]} (${nowValue[1]})`;
        optionMonthValue.selected = true;
        monthInput.appendChild(optionMonthValue);

        optionYearValue.value = nowValue[2];
        optionYearValue.text = nowValue[2];
        optionYearValue.selected = true;
        yearInput.appendChild(optionYearValue);
    }

    function detectParam() {
        const urlParams = new URLSearchParams(window.location.search);
        const value = urlParams.get("idRoute");
        if (value != null) {
            document.querySelector("select[name='service_route']").value = value;
            getServiceRoute(value);
        }
    }

    async function onRunScript() {
        setDateTimeInput();
        await getURLServer();
        await getAPIData();
    }

    onRunScript();

})();

function setIdRouteParam(value) {
    pageLock = false;
    location.href = setURLParam("idRoute", value);
}

async function getServiceRoute(value) {
    const authorizationKey = new Headers();

    authorizationKey.append("Authorization", getCookie("keyAccount"));

    const data = new Promise((resolve, reject) => {
        fetch(`${urlAPIServer}/detail_trip_management?idRoute=${value}`, {
                method: 'GET',
                headers: authorizationKey
            })
            .then((response) => {
                if (response.status == 226) {
                    resolve(response.json());
                } else {
                    resolve(response.text());
                }
            })
            .catch((err) => {
                reject(err);
            });

    });

    if (await data == "re-login" || await data == "re-Login_KeyAccess") {
        window.location.href = "/TRC_Tracking/pages/access_system/direct_logout_process.php";
    } else {
        tripTableData.tableForward = [];
        tripTableData.tableBackward = [];
        document.querySelector("#input_verify > div > button").disabled = false;
        setServiceRoute(await data);
    }
}

function setServiceRoute(objectData) {
    const serviceStartTimeInput = document.querySelector("input[name='service_start_time']");
    const serviceEndTimeInput = document.querySelector("input[name='service_end_time']");
    const serviceTimeRoundInput = document.querySelector("input[name='service_time_round']");
    const serviceCountRoundInput = document.querySelector("input[name='service_count_round']");
    const serviceTimeAverageInput = document.querySelector("input[name='service_time_average']");
    const pricePassengerInput = document.querySelector("input[name='price_passenger']");
    const priceSuppliesInput = document.querySelector("input[name='price_supplies']");
    const classAdd = ["custom-input-disabled"];

    serviceTime[0] = objectData.serviceStartTime;
    serviceTime[1] = objectData.serviceEndTime;
    countTrip = objectData.countTrip;

    serviceStartTimeInput.value = objectData.serviceStartTime;
    serviceEndTimeInput.value = objectData.serviceEndTime;
    serviceTimeRoundInput.value = objectData.serviceTimeRound;
    serviceCountRoundInput.value = objectData.serviceCountRound;
    serviceTimeAverageInput.value = objectData.serviceTimeAverage;
    pricePassengerInput.value = `${objectData.pricePassengerLower.toFixed(2) } บ. - ${objectData.pricePassengerHigher.toFixed(2)} บ.`;
    priceSuppliesInput.value = `${objectData.priceSuppliesLower.toFixed(2) } บ. - ${objectData.priceSuppliesHigher.toFixed(2)} บ.`;

    serviceStartTimeInput.classList.add(classAdd[0]);
    serviceEndTimeInput.classList.add(classAdd[0]);
    serviceTimeRoundInput.classList.add(classAdd[0]);
    serviceCountRoundInput.classList.add(classAdd[0]);
    serviceTimeAverageInput.classList.add(classAdd[0]);
    pricePassengerInput.classList.add(classAdd[0]);
    priceSuppliesInput.classList.add(classAdd[0]);

    goStatus = "forward";
    document.querySelector("#switchRouteForward").classList.replace("btn-outline-primary", "btn-primary");
    document.querySelector("#switchRouteForward").disabled = false;
    document.querySelector("#switchRouteBackward").disabled = false;

    createDataTableTrip(objectData.idRoute, objectData.serviceCountRound, objectData.serviceTimeRound);
}

function createDataTableTrip(idRoute, countTable, timeRound) {

    if (countTable > 0) {

        for (let i = 1; i <= countTable; i++) {
            const idTrip = `${nowValue[0] < 10 ? "0" + nowValue[0] : nowValue[0]}${nowValue[1] < 10 ? "0" + nowValue[1] : nowValue[1]}${nowValue[2]}-${idRoute}-${i}`;
            const timeTrip = moment(serviceTime[0], "HH:mm").add(timeRound * i, "minutes").format("HH:mm");

            tripTableData.tableForward.push({
                idTrip: `${idTrip}-F`,
                dateTrip: `${nowValue[2]}-${nowValue[1] < 10 ? "0" + nowValue[1] : nowValue[1]}-${nowValue[0] < 10 ? "0" + nowValue[0] : nowValue[0]}`,
                timeTrip: timeTrip,
                statusTrip: true
            });

            tripTableData.tableBackward.push({
                idTrip: `${idTrip}-B`,
                dateTrip: `${nowValue[2]}-${nowValue[1] < 10 ? "0" + nowValue[1] : nowValue[1]}-${nowValue[0] < 10 ? "0" + nowValue[0] : nowValue[0]}`,
                timeTrip: timeTrip,
                statusTrip: true
            });
        }

        createTable();
    }
}

function createTable() {
    const tableBody = document.querySelector("#tableBody");
    let dataTable = [];

    if (goStatus == "forward") {
        dataTable = tripTableData.tableForward;
    } else if (goStatus == "backward") {
        dataTable = tripTableData.tableBackward;
    }

    if (dataTable.length > 0) {
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }

        dataTable.forEach((v, i) => {
            const trElm = document.createElement("tr");
            const tdNumber = document.createElement("td");
            const tdIdTrip = document.createElement("td");
            const tdTimeTrip = document.createElement("td");
            const tdActionTrip = document.createElement("td");
            const butActionTable = document.createElement("button");

            tdNumber.setAttribute("class", "text-center");
            tdNumber.appendChild(document.createTextNode(i + 1));
            tdIdTrip.appendChild(document.createTextNode(v.idTrip));
            tdTimeTrip.appendChild(document.createTextNode(v.timeTrip));
            tdActionTrip.setAttribute("class", "text-center");
            butActionTable.type = "button";

            if (goStatus == "forward") {
                trElm.setAttribute("name", `trNo_F_${i}`);
                if (v.statusTrip) {
                    butActionTable.setAttribute("class", "btn btn-outline-danger btn-xs");
                    butActionTable.setAttribute("onclick", `setStatusTrip(${i}, "F", "disabled")`);
                    butActionTable.appendChild(document.createTextNode("ยกเลิกรอบให้บริการนี้"));
                    trElm.setAttribute("class", ``);
                } else {
                    butActionTable.setAttribute("class", "btn btn-outline-primary btn-xs");
                    butActionTable.setAttribute("onclick", `setStatusTrip(${i}, "F", "unable")`);
                    butActionTable.appendChild(document.createTextNode("ให้บริการรอบเดินรถนี้"));
                    trElm.setAttribute("class", `bg-disabled`);
                }
            } else if (goStatus == "backward") {
                trElm.setAttribute("name", `trNo_B_${i}`);
                if (v.statusTrip) {
                    butActionTable.setAttribute("class", "btn btn-outline-danger btn-xs");
                    butActionTable.setAttribute("onclick", `setStatusTrip(${i}, "B", "disabled")`);
                    butActionTable.appendChild(document.createTextNode("ยกเลิกรอบให้บริการนี้"));
                    trElm.setAttribute("class", ``);
                } else {
                    butActionTable.setAttribute("class", "btn btn-outline-primary btn-xs");
                    butActionTable.setAttribute("onclick", `setStatusTrip(${i}, "B", "unable")`);
                    butActionTable.appendChild(document.createTextNode("ให้บริการรอบเดินรถนี้"));
                    trElm.setAttribute("class", `bg-disabled`);
                }
            }

            tdActionTrip.appendChild(butActionTable);

            trElm.appendChild(tdNumber);
            trElm.appendChild(tdIdTrip);
            trElm.appendChild(tdTimeTrip);
            trElm.appendChild(tdActionTrip);
            tableBody.appendChild(trElm);
        });

        setPageLock();
    }
}

function setStatusTrip(index, goStatus, condition) {
    const trElm = document.querySelector(`tr[name='trNo_${goStatus}_${index}']`);
    const buttonAction = document.querySelector(`tr[name='trNo_${goStatus}_${index}'] > td > button`);

    if (condition == "disabled") {
        buttonAction.classList.replace("btn-outline-danger", "btn-outline-primary");
        buttonAction.innerHTML = "ให้บริการรอบเดินรถนี้";
        trElm.classList.add("bg-disabled");
        
        if (goStatus == "F") {
            buttonAction.setAttribute("onclick", `setStatusTrip(${index}, "F", "unable")`);
            tripTableData.tableForward[index].statusTrip = false;
        } else if (goStatus == "B") {
            buttonAction.setAttribute("onclick", `setStatusTrip(${index}, "B", "unable")`);
            tripTableData.tableBackward[index].statusTrip = false;
        }
    } else if (condition == "unable") {
        buttonAction.classList.replace("btn-outline-primary", "btn-outline-danger");
        buttonAction.setAttribute("onclick", `setStatusTrip(${index}, "disabled")`);
        buttonAction.innerHTML = "ยกเลิกรอบให้บริการนี้";
        trElm.classList.remove("bg-disabled");
        
        if (goStatus == "F") {
            buttonAction.setAttribute("onclick", `setStatusTrip(${index}, "F", "disabled")`);
            tripTableData.tableForward[index].statusTrip = true;
        } else if (goStatus == "B") {
            buttonAction.setAttribute("onclick", `setStatusTrip(${index}, "B", "disabled")`);
            tripTableData.tableBackward[index].statusTrip = true;
        }
    }

    setPageLock();
}

function setURLParam(tag_1, value_1) {
    let url = new URL(window.location.href);
    let params = url.searchParams;

    params.set(tag_1, value_1);

    url.search = params.toString();

    return url.toString();
}

function verifyInputForm() {
    const dayDateInput = document.querySelector("#datepicker_day");
    const monthDateInput = document.querySelector("#datepicker_month");
    const yearDateInput = document.querySelector("#datepicker_year");
    const serviceRouteInput = document.querySelector("select[name='service_route']");
    const serviceStartTimeInput = document.querySelector("input[name='service_start_time']");
    const serviceEndTimeInput = document.querySelector("input[name='service_end_time']");
    const serviceTimeRoundInput = document.querySelector("input[name='service_time_round']");
    const serviceCountRoundInput = document.querySelector("input[name='service_count_round']");

    const modelWaningFooter = document.querySelector("#modelWaningFooter");
    const serviceDateVerify = document.querySelector("#serviceDateVerify");
    const serviceRouteVerify = document.querySelector("#serviceRouteVerify");
    const serviceTimeVerify = document.querySelector("#serviceTimeVerify");
    const serviceTimeRoundVerify = document.querySelector("#serviceTimeRoundVerify");
    const serviceCountRoundVerify = document.querySelector("#serviceCountRoundVerify");
    const countTripDisabledVerify = document.querySelector("#countTripDisabledVerify");
    const countTripVerify = document.querySelector("#countTripVerify");

    const monthName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    countTripDisabledVerify.classList.remove("text-danger");

    if (countTrip > 0) {
        if (openFirstModel == false) {
            const pElm = document.createElement("p");
            pElm.setAttribute("class", "text-danger pl-2 pr-2 card-verify-warning-text using-custom-font");
            pElm.innerHTML = `<i class="fas fa-exclamation-circle"></i> เส้นทางเดินรถนี้มีรอบเดินรถ (เก่า) ที่ถูกเพิ่มอยู่แล้ว <b>${countTrip} จำนวน</b> <u>หากบันทึกรอบเดินรถเส้นทางนี้ รอบเดินรถที่ถูกเพิ่มก่อนหน้าจะถูกลบทั้งหมด</u> และเพิ่มรอบเดินรถใหม่นี้แทน`;
            modelWaningFooter.appendChild(pElm);
        }
    }

    serviceDateVerify.value = `วันที่ ${parseInt(dayDateInput.value)} เดือน${monthName[parseInt(monthDateInput.value)]} พ.ศ. ${parseInt(yearDateInput.value)}`;
    serviceRouteVerify.value = findRouteName(serviceRouteInput.value);
    serviceTimeVerify.value = `${serviceStartTimeInput.value} น. - ${serviceEndTimeInput.value} น.`;
    serviceTimeRoundVerify.value = `${serviceTimeRoundInput.value} นาที`;
    serviceCountRoundVerify.value = `${serviceCountRoundInput.value - findCountTripDisabled("forward")} รอบ | ${serviceCountRoundInput.value - findCountTripDisabled("backward")} รอบ `;

    if (findCountTripDisabled("forward") > 0 || findCountTripDisabled("backward") > 0) {
        countTripDisabledVerify.classList.add("text-danger");
    }
    countTripDisabledVerify.value = `${findCountTripDisabled("forward")} รอบ | ${findCountTripDisabled("backward")} รอบ`;

    if (countTrip > 0) {
        countTripVerify.classList.add("text-danger");
    }
    countTripVerify.value = `${countTrip} รอบเดินรถ`;

    openFirstModel = true;
    $('#verifyModal').modal('toggle');
}

async function saveData() {
    const classToRemove = ["custom-input-disabled"];
    const modalButton = Array.from(document.querySelectorAll("#modelVerifyFooter > button"));

    const serviceDateVerify = document.querySelector("#serviceDateVerify");
    const serviceRouteVerify = document.querySelector("#serviceRouteVerify");
    const serviceTimeVerify = document.querySelector("#serviceTimeVerify");
    const serviceTimeRoundVerify = document.querySelector("#serviceTimeRoundVerify");
    const serviceCountRoundVerify = document.querySelector("#serviceCountRoundVerify");
    const countTripDisabledVerify = document.querySelector("#countTripDisabledVerify");
    const countTripVerify = document.querySelector("#countTripVerify");

    serviceDateVerify.classList.remove(classToRemove[0]);
    serviceRouteVerify.classList.remove(classToRemove[0]);
    serviceTimeVerify.classList.remove(classToRemove[0]);
    serviceTimeRoundVerify.classList.remove(classToRemove[0]);
    serviceCountRoundVerify.classList.remove(classToRemove[0]);
    countTripDisabledVerify.classList.remove(classToRemove[0]);
    countTripVerify.classList.remove(classToRemove[0]);

    modalButton[0].disabled = true;
    modalButton[1].disabled = true;
    modalButton[1].innerHTML = "<span class='spinner-border spinner-border-sm m-1' role='status' aria-hidden='true'></span> บันทึกข้อมูล";

    const statusSendData = await sendData();
    if (await statusSendData == "re-Send" || await statusSendData == "TypeError: Failed to fetch") {
        serviceDateVerify.classList.add(classToRemove[0]);
        serviceRouteVerify.classList.add(classToRemove[0]);
        serviceTimeVerify.classList.add(classToRemove[0]);
        serviceTimeRoundVerify.classList.add(classToRemove[0]);
        serviceCountRoundVerify.classList.add(classToRemove[0]);
        countTripDisabledVerify.classList.add(classToRemove[0]);
        countTripVerify.classList.add(classToRemove[0]);

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='fas fa-save'></i> บันทึกข้อมูล";
    }
}

async function sendData() {
    const authorizationKey = new Headers();
    const dataPack = new FormData();

    const serviceRouteInput = document.querySelector("select[name='service_route']");

    

    authorizationKey.append("Authorization", getCookie("keyAccount"));

    dataPack.append("serviceRoute", serviceRouteInput.value.trim());
    dataPack.append("countTrip", countTrip);
    dataPack.append("tripTableData", JSON.stringify(tripTableData));

    const returnValue = await new Promise((resolve, reject) => {
        fetch(`${urlAPIServer}/trip_management`, {
                method: 'POST',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = "./trip_management.php";
                        resolve();
                    } else if (value == "re-nameRoute" || value == "re-Send") {
                        resolve("re-Send");
                    } else if (value == "re-Login" || value == "re-Login_KeyAccess") {
                        window.location.href = "TRC_Tracking/pages/access_system/direct_logout_process.php";
                        resolve();
                    }
                });
            })
            .catch((err) => {
                resolve(err);
            });
    });

    return returnValue;
}

function findRouteName(id) {
    let result;

    fullNameRoute.forEach((v, i) => {
        if (v.id == id) {
            result = v.nameRoute;
        }
    });

    return result;
}

function findCountTripDisabled(mode) {
    let dataTable = [];
    let count = 0;

    if (mode == "forward") {
        dataTable = tripTableData.tableForward;
    } else if (mode == "backward") {
        dataTable = tripTableData.tableBackward;
    }

    dataTable.forEach(v => {
        if (v.statusTrip == false) {
            count++;
        }
    });

    return count;
}

function switchRouteMode(mode) {
    const forwardButton = document.querySelector("#switchRouteForward");
    const backwardButton = document.querySelector("#switchRouteBackward");

    if (mode == "forward") {
        forwardButton.classList.replace("btn-outline-primary", "btn-primary");
        backwardButton.classList.replace("btn-primary", "btn-outline-primary");
        goStatus = "forward";
    } else if (mode == "backward") {
        forwardButton.classList.replace("btn-primary", "btn-outline-primary");
        backwardButton.classList.replace("btn-outline-primary", "btn-primary");
        goStatus = "backward";
    }
    
    createTable();
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function closeModal(idModal) {
    $(`${idModal}`).modal('hide');
}