let urlAPIServer;
let serviceDate = [];
let tripTableData = [];
let useIdRoute;
let goStatus = "forward";
let tripTableForward = [];
let tripTableBackward = [];

(() => {
    async function getURLServer() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => {
            return value.json();
        });
        urlAPIServer = settingFile.urlAPIServer;
    }

    async function getURLParams() {
        const idRoute = new URLSearchParams(window.location.search).get("idRoute");
        if (idRoute == null) {
            window.location.href = "./trip_management.php";
        } else {
            useIdRoute = await idRoute;
            await getAPIData();
        }
    }

    async function getAPIData() {
        const authorizationKey = new Headers();

        authorizationKey.append("Authorization", getCookie("keyAccount"));

        const data = new Promise((resolve, reject) => {
            fetch(`${urlAPIServer}/profile_trip_management?idRoute=${useIdRoute}`, {
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

        tripTableForward = objectResponse.tripTableForward;

        if (objectResponse.tripTableBackward != null) {
            tripTableBackward = objectResponse.tripTableBackward;
        } 
        

        await setDateTimeInput(objectResponse.serviceDate);
        await setFullNameRoute(objectResponse.nameRoute);
        await setServiceRoute(objectResponse);
        await createTableTrip();
    }

    function setDateTimeInput(data) {
            const monthTitle = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            const dayInput = document.querySelector("#datepicker_day");
            const monthInput = document.querySelector("#datepicker_month");
            const yearInput = document.querySelector("#datepicker_year");
            const dateValue = [data.substr(8, 2), data.substr(5, 2), data.substr(0, 4)];
    
            serviceDate = dateValue;
            dayInput.value = parseInt(dateValue[0]);
            monthInput.value = `${monthTitle[parseInt(dateValue[1])]} (${parseInt(dateValue[1])})`;
            yearInput.value = dateValue[2];
        }
    

    async function setFullNameRoute(nameRoute) {
        const nameRouteInput = document.querySelector("input[name='service_route']");
    
        nameRouteInput.value = nameRoute;
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

    }

    async function onRunScript() {
        await getURLServer();
        await getURLParams();
    }

    onRunScript();

})();

async function createTableTrip() {
    const tableBody = document.querySelector("#tableBody");
    const countDisabledDisplay = document.querySelector("#countDisabledDisplay");
    let countDisabled = findCountDisabled(tripTableForward, tripTableBackward);

    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    let dataTable;

    if (goStatus == "forward") {
        dataTable = tripTableForward;
    } else if (goStatus == "backward") {
        dataTable = tripTableBackward;
    }

    dataTable.forEach((v, i) => {
        const trElm = document.createElement("tr");

        if (goStatus == "forward") {
            trElm.setAttribute("name", `trNo_F_${i}`);
        } else if (goStatus == "backward") {
            trElm.setAttribute("name", `trNo_B_${i}`);
        }

        const tdNumber = document.createElement("td");
        const tdIdTrip = document.createElement("td");
        const tdTimeTrip = document.createElement("td");
        const tdActionTrip = document.createElement("td");
        const butActionTable = document.createElement("button");

        tdNumber.setAttribute("class", "text-center");
        tdNumber.appendChild(document.createTextNode(i + 1));
        tdIdTrip.appendChild(document.createTextNode(v.idTrip));
        tdTimeTrip.appendChild(document.createTextNode(v.serviceTime));

        tdActionTrip.setAttribute("class", "text-center");
        butActionTable.type = "button";
        
        if (v.tripStatus == 1) {
            butActionTable.setAttribute("class", "btn btn-success btn-xs");
            butActionTable.setAttribute("onclick", `statusPageLink(${useIdRoute}, '${v.idTrip}')`);
            butActionTable.appendChild(document.createTextNode("แสดงสถานะรอบเดินรถ"));
        } else {
            trElm.setAttribute("class", "bg-disabled");
            butActionTable.disabled = true;
            butActionTable.setAttribute("class", "btn btn-danger btn-xs");
            butActionTable.appendChild(document.createTextNode("รอบเดินรถถูกยกเลิก"));
        }

        tdActionTrip.appendChild(butActionTable);
        trElm.appendChild(tdNumber);
        trElm.appendChild(tdIdTrip);
        trElm.appendChild(tdTimeTrip);
        trElm.appendChild(tdActionTrip);

        tableBody.appendChild(trElm);
    });

    if (await countDisabled > 0) {
        countDisabledDisplay.innerHTML = '';
        countDisabledDisplay.appendChild(document.createTextNode(`(รอบเดินรถที่ยกเลิกจำนวน ${await countDisabled} รอบ)`));
    }
}

function statusPageLink(idRoute, idTrip) {
    window.location.href = `./status_trip.php?idRoute=${idRoute}&idTrip=${idTrip}`;
}

async function findCountDisabled(dataForward, dataBackward) {
    let countDisabled = 0;

    await dataForward.forEach(v => {
        if (v.tripStatus == 0) {
            countDisabled++;
        }
    });

    if (dataBackward != null) {
        await dataBackward.forEach(v => {
            if (v.tripStatus == 0) {
                countDisabled++;
            }
        });
    }

    return await countDisabled;
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
    
    createTableTrip();
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}