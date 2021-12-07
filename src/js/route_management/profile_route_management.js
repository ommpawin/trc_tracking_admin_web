let useIdRoute;
let urlAPIServer;
var map = new longdo.Map({
    placeholder: document.querySelector("#map"),
    ui: longdo.UiComponent.Mobile,
});

(() => {

    async function getURLParams() {
        const idRoute = new URLSearchParams(window.location.search).get("idRoute");
        if (idRoute == null) {
            window.location.href = "./route_management.php";
        } else {
            useIdRoute = await idRoute;
            await getAPIData();
        }
    }

    async function getMapAPI() {
        map.Route.placeholder(document.getElementById('route'));
        map.location({
            lon: 98.98567378520966,
            lat: 18.78887063696252
        }, true);
        map.zoom(13, true);
        map.Ui.Geolocation.visible(false);
        map.Ui.LayerSelector.visible(false);
        map.Ui.Fullscreen.visible(false);
        map.Ui.Mouse.enableWheel(false);
        map.Ui.Zoombar.visible(false);
        map.Ui.Crosshair.visible(false);
    }


    async function getAPIData() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => {
            return value.json();
        });
        urlAPIServer = await settingFile.urlAPIServer;
        const authorizationKey = new Headers();

        authorizationKey.append("Authorization", getCookie("keyAccount"));

        const data = new Promise((resolve, reject) => {
            fetch(`${urlAPIServer}/profile_route_management?idRoute=${useIdRoute}`, {
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
            extractJSONData(await data);
        }
    }

    async function extractJSONData(jsonData) {
        const objectResponse = await jsonData;

        setValueDisplay({
            idRoute: objectResponse.idRoute,
            nameRoute: `${objectResponse.nameStart} - ${objectResponse.nameEnd}`,
            typeRoute: objectResponse.typeRoute,
            detailRoute: objectResponse.keywordRoute,
            nameColor_1: objectResponse.nameColor_1,
            nameColor_2: objectResponse.nameColor_2,
            hexColor_1: objectResponse.hexColor_1,
            hexColor_2: objectResponse.hexColor_2,
            timeStart: objectResponse.serviceStartTime,
            timeEnd: objectResponse.serviceEndTime,
            timeRound: objectResponse.serviceTimeRound,
            countRound: objectResponse.serviceCountRound,
            timeAverage: objectResponse.serviceTimeAverage,
            pricePassengerLower: objectResponse.pricePassengerLower,
            pricePassengerHigher: objectResponse.pricePassengerHigher,
            priceSuppliesLower: objectResponse.priceSuppliesLower,
            priceSuppliesHigher: objectResponse.priceSuppliesHigher,
            countDriver: objectResponse.countRouteDrivers,
            routeStatus: objectResponse.routeStatus
        });

        setMapRouteLine({
            routeLocation: JSON.parse(objectResponse.dataRouteLocation),
            routeForwardLine: JSON.parse(objectResponse.dataRouteForward),
            routeBackwardLine: JSON.parse(objectResponse.dataRouteBackward)
        });
    }

    function setValueDisplay({
        idRoute,
        nameRoute,
        typeRoute,
        detailRoute,
        nameColor_1,
        nameColor_2,
        hexColor_1,
        hexColor_2,
        timeStart,
        timeEnd,
        timeRound,
        countRound,
        timeAverage,
        pricePassengerLower,
        pricePassengerHigher,
        priceSuppliesLower,
        priceSuppliesHigher,
        countDriver,
        routeStatus
    }) {
        const idRouteDisplay = document.querySelector("#idRoute");
        const nameRouteDisplay = document.querySelector("#nameRoute");
        const detailRouteDisplay = document.querySelector("#detailRoute");
        const typeRouteDisplay = document.querySelector("#typeRoute");
        const colorRouteDisplay = document.querySelector("#colorRoute");
        const serviceTimeDisplay = document.querySelector("#serviceTime");
        const timeRoundDisplay = document.querySelector("#timeRound");
        const countRoundDisplay = document.querySelector("#countRound");
        const timeAverageDisplay = document.querySelector("#timeAverage");
        const pricePassengerDisplay = document.querySelector("#pricePassenger");
        const priceSuppliesDisplay = document.querySelector("#priceSupplies");
        const countDriverDisplay = document.querySelector("#countDriver");
        const routeStatusInput = document.querySelector("input[name='routeStatus']");
        const footerContent = document.querySelector("#footerContent");

        idRouteDisplay.appendChild(document.createTextNode(`รหัสเส้นทาง : ${idRoute}`));
        nameRouteDisplay.appendChild(document.createTextNode(nameRoute));
        detailRouteDisplay.appendChild(document.createTextNode(detailRoute));

        if (typeRoute == "1") {
            typeRouteDisplay.appendChild(document.createTextNode("เส้นทาง มีจุดเริ่มต้นและสิ้นสุดให้บริการ จุดเดียวกัน"));
        }

        if (nameColor_2 != "" && hexColor_2 != "") {
            colorRouteDisplay.innerHTML = `${nameColor_1} (<span style="background-color: ${hexColor_1};">${hexColor_1}</span>), ${nameColor_2} (<span style="background-color: ${hexColor_2};">${hexColor_2}</span>)`;
        } else {
            colorRouteDisplay.innerHTML = `${nameColor_1} (<span style="background-color: ${hexColor_1};">${hexColor_1}</span>)`;
        }

        serviceTimeDisplay.appendChild(document.createTextNode(`${timeStart} นาฬิกา - ${timeEnd} นาฬิกา`));
        timeRoundDisplay.appendChild(document.createTextNode(`${timeRound} นาที`));
        countRoundDisplay.appendChild(document.createTextNode(`${countRound} รอบ`));
        timeAverageDisplay.appendChild(document.createTextNode(`~ ${timeAverage} นาที`));
        pricePassengerDisplay.appendChild(document.createTextNode(`${pricePassengerLower.toFixed(2)} บาท - ${pricePassengerHigher.toFixed(2)} บาท`));
        priceSuppliesDisplay.appendChild(document.createTextNode(`${priceSuppliesLower.toFixed(2)} บาท - ${priceSuppliesHigher.toFixed(2)} บาท`));
        countDriverDisplay.appendChild(document.createTextNode(`${countDriver} คน`));

        if (routeStatus == "online") {
            routeStatusInput.value = "ให้บริการ";
            routeStatusInput.classList.add("text-success");
        } else if (routeStatus == "investigate") {
            routeStatusInput.value = "ระงับการให้บริการชั่วคราว";
            routeStatusInput.classList.add("text-info");
        } else if (routeStatus == "offline") {
            if (getCookie("accessLevel") == "admin") {
                const buttonElm = document.createElement("button");
                buttonElm.setAttribute("class", "col-md-3 col-12 btn btn-danger using-custom-font pt-2 pb-2 m-2");
                buttonElm.setAttribute("onclick", "deleteRoute()");
                buttonElm.type = "button";
                buttonElm.innerHTML = '<i class="far fa-trash-alt"></i> ลบข้อมูล';
                footerContent.insertBefore(buttonElm, footerContent.firstChild);
            }

            routeStatusInput.value = "ยกเลิกการให้บริการ";
            routeStatusInput.classList.add("text-danger");
        }
    }

    async function onRunScript() {
        await getURLParams();
        await getMapAPI();
    }

    onRunScript();

})();

async function setMapRouteLine({
    routeLocation,
    routeForwardLine,
    routeBackwardLine
}) {
    startMarker = mapMarker({
        lat: routeLocation[0].start_point.lat,
        lon: routeLocation[0].start_point.lon
    }, "Start_Service");
    endMarker = mapMarker({
        lat: routeLocation[0].end_point.lat,
        lon: routeLocation[0].end_point.lon
    }, "End_Service");
    forwardLine = new longdo.Polyline(routeForwardLine, {
        lineWidth: 2,
        lineColor: 'rgba(2, 199, 81, 0.6)',
    });
    backwardLine = new longdo.Polyline(routeBackwardLine, {
        lineWidth: 2,
        lineColor: 'rgba(255, 53, 72, 0.6)',
    });

    map.Overlays.add(backwardLine);
    map.Overlays.add(forwardLine);
    map.Overlays.add(endMarker);
    map.Overlays.add(startMarker);
}

function mapMarker({
    lat,
    lon
}, image) {
    return new longdo.Marker({
        lat,
        lon
    }, {
        icon: {
            url: `/TRC_Tracking/assets/image/Map_Pin_Type/${image}.png`
        }
    });
}

function editPageLink() {
    window.location.href = `./edit_route_management.php?idRoute=${useIdRoute}`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteRoute() {
    $("#deleteData").modal('toggle');
}

async function saveDeleteData() {
    const modalButton = Array.from(document.querySelectorAll("#modelDeleteDataFooter > button"));
    const passwordInput = document.querySelector("#passwordUserAccess");
    const passwordInputText = document.querySelector("#passwordUserAccessText");

    passwordInput.classList.remove("is-invalid");
    passwordInput.disabled = true;
    passwordInputText.innerHTML = "";

    modalButton[0].disabled = true;
    modalButton[1].disabled = true;
    modalButton[1].innerHTML = "<span class='spinner-border spinner-border-sm m-1' role='status' aria-hidden='true'></span> ลบข้อมูล";

    const statusSendData = await sendData();
    if (await statusSendData == "re-Send" || await statusSendData == "TypeError: Failed to fetch") {
        passwordInput.disabled = false;

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='far fa-trash-alt'></i> ลบข้อมูล";
    } else if (await statusSendData == "invalid-Password") {
        passwordInput.disabled = false;
        passwordInput.classList.add("is-invalid");
        passwordInputText.innerHTML = "รหัสผ่านรหัสผ่านบัญชีผู้ดูแลของคุณไม่ถูกต้อง โปรดสอบอกีครั้งก่อนกดปุ่ม <i class='far fa-trash-alt'></i> ลบข้อมูล อีกครั้ง";

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='far fa-trash-alt'></i> ลบข้อมูล";
    }
}

async function sendData() {
    const authorizationKey = new Headers();
    const dataPack = new FormData();
    const passwordUserAccess = document.querySelector("#passwordUserAccess");

    authorizationKey.append("Authorization", getCookie("keyAccount"));

    dataPack.append("passwordUserAccess", passwordEncryption(passwordUserAccess.value));

    const returnValue = await new Promise((resolve) => {
        fetch(`${urlAPIServer}/profile_route_management?idRoute=${useIdRoute}`, {
                method: 'DELETE',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = "./route_management.php";
                        resolve();
                    } else if (value == "re-Send_Password") {
                        resolve("invalid-Password");
                    } else if (value == "re-Send") {
                        resolve("re-Send");
                    } else if (value == "re-Login" || value == "re-Login_KeyAccess") {
                        window.location.href = "/TRC_Tracking/pages/access_system/direct_logout_process.php";
                        resolve();
                    }
                });
            })
            .catch((err) => {
                resolve(err);
            });
    });

    return await returnValue;
}

function passwordEncryption(password) {
    return md5(password.split("").reverse().join(""));
}

function closeModal(value) {
    $(`${value}`).modal('hide');
}