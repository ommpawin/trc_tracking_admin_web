let useIdRoute;
let urlAPIServer;
let pageLock = false;
let useRouteColor_2 = false;
let setRouteColor_2 = [];
let setNameRoute = [];
let onEditMode = false;
let markerPoint = 0;
let mapRouteLocation = {
    "start_point": {
        "lon": "",
        "lat": ""
    },
    "end_point": {
        "lon": "",
        "lat": ""
    },
    "deviate_forward": [],
    "deviate_backward": []
};
let mapDisplayType = "forward";
let editDeviateRouteIndex = -1;
let routeDataMaster = [
    [],
    []
];
var map = new longdo.Map({
    placeholder: document.querySelector("#map"),
    ui: longdo.UiComponent.Mobile,
});

document.querySelector("#form_edit_route_management").addEventListener("change", () => {
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

    async function getURLParams() {
        const idRoute = new URLSearchParams(window.location.search).get("idRoute");
        if (idRoute == null) {
            window.location.href = "./route_management.php";
        } else {
            useIdRoute = await idRoute;
            await getAPIData();
        }

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
            nameRouteStartPoint: objectResponse.nameStart,
            nameRouteEndPoint: objectResponse.nameEnd,
            keywordRoute: objectResponse.keywordRoute,
            nameColor_1: objectResponse.nameColor_1,
            hexColor_1: objectResponse.hexColor_1,
            pricePassengerLower: objectResponse.pricePassengerLower,
            pricePassengerHigher: objectResponse.pricePassengerHigher,
            priceSuppliesLower: objectResponse.priceSuppliesLower,
            priceSuppliesHigher: objectResponse.priceSuppliesHigher,
            timeStart: objectResponse.serviceStartTime,
            timeRound: objectResponse.serviceTimeRound,
            countRound: objectResponse.serviceCountRound,
            timeEnd: objectResponse.serviceEndTime,
            timeAverage: objectResponse.serviceTimeAverage,
            routeStatus: objectResponse.routeStatus
        });

        setColorValue({
            nameColor_2: objectResponse.nameColor_2,
            hexColor_2: objectResponse.hexColor_2
        });

        setMapValue({
            routeLocation: JSON.parse(objectResponse.dataRouteLocation)
        });
    }

    function setValueDisplay({
        nameRouteStartPoint,
        nameRouteEndPoint,
        keywordRoute,
        nameColor_1,
        hexColor_1,
        pricePassengerLower,
        pricePassengerHigher,
        priceSuppliesLower,
        priceSuppliesHigher,
        timeStart,
        timeRound,
        countRound,
        timeEnd,
        timeAverage,
        routeStatus
    }) {
        const nameRouteStartInput = document.querySelector("input[name='start_point_service']");
        const nameRouteEndInput = document.querySelector("input[name='end_point_service']");
        const keywordRouteInput = document.querySelector("input[name='route_keyword_detail']");
        const nameColor_1_Input = document.querySelector("input[name='name_color_1']");
        const hexColor_1_Input = document.querySelector("input[name='hex_color_picker_1']");
        const hexColor_1_Preview = document.querySelector("input[name='preview_color_picker_1']");
        const pricePassengerLowerInput = document.querySelector("input[name='pricePassengerLower']");
        const pricePassengerHigherInput = document.querySelector("input[name='pricePassengerHigher']");
        const priceSuppliesLowerInput = document.querySelector("input[name='priceSuppliesLower']");
        const priceSuppliesHigherInput = document.querySelector("input[name='priceSuppliesHigher']");
        const serviceStartTimeInput = document.querySelector("input[name='service_start_time']");
        const serviceTimeRoundInput = document.querySelector("input[name='service_time_round']");
        const serviceCountRoundInput = document.querySelector("input[name='service_count_round']");
        const serviceEndTimeInput = document.querySelector("input[name='service_end_time']");
        const serviceTimeAverageInput = document.querySelector("input[name='service_time_average']");
        const routeStatusSelect = document.querySelector("select[name='route_status']");


        nameRouteStartInput.value = nameRouteStartPoint;
        nameRouteStartInput.placeholder = nameRouteStartPoint;
        nameRouteEndInput.value = nameRouteEndPoint;
        nameRouteEndInput.placeholder = nameRouteEndPoint;

        if (keywordRoute == "") {
            keywordRouteInput.value = "-";
        } else {
            keywordRouteInput.value = keywordRoute;
            keywordRouteInput.placeholder = keywordRoute;
        }

        nameColor_1_Input.value = nameColor_1;
        nameColor_1_Input.placeholder = nameColor_1;
        hexColor_1_Input.value = hexColor_1;
        hexColor_1_Input.placeholder = hexColor_1;
        hexColor_1_Preview.value = hexColor_1;

        pricePassengerLowerInput.value = pricePassengerLower.toFixed(2);
        pricePassengerLowerInput.placeholder = pricePassengerLower.toFixed(2);
        pricePassengerHigherInput.value = pricePassengerHigher.toFixed(2);
        pricePassengerHigherInput.placeholder = pricePassengerHigher.toFixed(2);
        priceSuppliesLowerInput.value = priceSuppliesLower.toFixed(2);
        priceSuppliesLowerInput.placeholder = priceSuppliesLower.toFixed(2);
        priceSuppliesHigherInput.value = priceSuppliesHigher.toFixed(2);
        priceSuppliesHigherInput.placeholder = priceSuppliesHigher.toFixed(2);

        serviceStartTimeInput.value = timeStart;
        serviceTimeRoundInput.value = timeRound;
        serviceTimeRoundInput.placeholder = timeRound;
        serviceCountRoundInput.value = countRound;
        serviceCountRoundInput.placeholder = countRound;
        serviceEndTimeInput.value = timeEnd;
        serviceTimeAverageInput.value = timeAverage;
        serviceTimeAverageInput.placeholder = timeAverage;

        if (routeStatus == "online") {
            routeStatusSelect.value = "3";
            routeStatusSelect.classList.add("text-success");
        } else if (routeStatus == "investigate") {
            routeStatusSelect.value = "2";
            routeStatusSelect.classList.add("text-info");
        } else if (routeStatus == "offline") {
            routeStatusSelect.value = "1";
            routeStatusSelect.classList.add("text-danger");
        }

        setNameRouteTag();
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
        map.Layers.add(longdo.Layers.TRAFFIC);
    }

    async function onRunScript() {
        getMapAPI();
        await getURLParams();
    }

    onRunScript();

})();

map.Event.bind("drag", () => {
    document.querySelector("input[name='latitudePoint']").classList.remove("is-invalid");
    document.querySelector("input[name='longitudePoint']").classList.remove("is-invalid");
});

map.Event.bind("drop", () => {
    const latPointInput = document.querySelector("input[name='latitudePoint']");
    const lonPointInput = document.querySelector("input[name='longitudePoint']");
    let location = map.location();
    pageLock = true;
    latPointInput.value = location.lat;
    lonPointInput.value = location.lon;
});

function setColorValue({
    nameColor_2,
    hexColor_2
}) {
    if (nameColor_2 != "" && hexColor_2 != "") {
        enableRouteColor();

        const nameColor_2_Input = document.querySelector("input[name='name_color_2']");
        const hexColor_2_Input = document.querySelector("input[name='hex_color_picker_2']");
        const hexColor_2_Preview = document.querySelector("input[name='preview_color_picker_2']");

        nameColor_2_Input.value = nameColor_2;
        nameColor_2_Input.placeholder = nameColor_2;
        hexColor_2_Input.value = hexColor_2;
        hexColor_2_Input.placeholder = hexColor_2;
        hexColor_2_Preview.value = hexColor_2;

        setRouteColor_2[0] = nameColor_2;
        setRouteColor_2[1] = hexColor_2;
    }
}

async function setMapValue({
    routeLocation
}) {
    markerPoint = routeLocation[0].deviate_forward.length + routeLocation[0].deviate_backward.length + 2;
    mapRouteLocation = routeLocation[0];

    findRouteLocation();
    setRouteInput();
}

function setNameRouteTag() {
    const startPoint = document.querySelector("input[name='start_point_service']").value.trim();
    const endPoint = document.querySelector("input[name='end_point_service']").value.trim();
    const nameRouteTag = document.querySelector("#routeMapLabel");

    if (startPoint != "" && endPoint != "") {
        nameRouteTag.innerHTML = `เส้นทางเดินรถ (${startPoint} - ${endPoint}) <span class='text-info text-bold'>*</span>`;
    } else {
        nameRouteTag.innerHTML = "เส้นทางเดินรถ <span class='text-info text-bold'>*</span>";
    }
}

function setStaticText(element, text) {
    if (element.value == "" || element.value == "สี") {
        element.value = text;
    }
}

function clearStaticText(element, previewElement) {
    if (element.value == "" || element.value == "สี") {
        element.value = "";
    } else if (element.value == "#") {
        document.querySelector(`input[name='${previewElement}']`).value = "#000000";
        element.value = "";
    }
}

function setNameColor(element) {
    const regex = /^[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]+$/g;

    if (element.value.charAt(0) != "ส" && element.value.charAt(1) != "ั") {
        element.value = "สี";
    } else if (element.value.length < 3) {
        element.value = "สี";
    } else if (element.value.length > 2) {
        if (regex.test(element.value) == false) {
            element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
        } else {
            element.value = element.value.toUpperCase().trim();
        }
    }
}

function setHexColor(element, previewElement) {
    const regex = /^#[a-fA-F0-9]*?$/g;

    if (element.value.charAt(0) != "#") {
        element.value = "#";
    } else if (element.value.length < 2) {
        element.value = "#";
    } else if (element.value.length > 1) {
        if (regex.test(element.value) == false) {
            element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
        } else {
            element.value = element.value.toUpperCase().trim();
            if (element.value.length > 6) {
                document.querySelector(`input[name='${previewElement}']`).value = element.value;
            } else {
                document.querySelector(`input[name='${previewElement}']`).value = "#000000";
            }
        }
    }
}

function setInputHexColor(value, element) {
    document.querySelector(`input[name='${element}']`).value = value.toUpperCase();
}

function enableRouteColor() {
    const labelElm = document.querySelector("#route_color_2 > label");
    const divElm = document.querySelector("#route_color_2 > div.d-flex");

    const aTagLink = document.createElement("a");
    aTagLink.setAttribute("class", "text-danger a-tag-button ml-auto");
    aTagLink.setAttribute("onclick", "unableRouteColor()");
    aTagLink.innerHTML = "<u>ยกเลิกใช้สีที่ 2</u>";
    labelElm.appendChild(aTagLink);

    while (divElm.firstChild) {
        divElm.removeChild(divElm.lastChild);
    }

    const inputNameColorElm = document.createElement("input");
    inputNameColorElm.setAttribute("class", "using-custom-font form-control ml-0 mr-1");
    inputNameColorElm.setAttribute("onfocus", "setStaticText(this, 'สี')");
    inputNameColorElm.setAttribute("oninput", "setNameColor(this)");
    inputNameColorElm.setAttribute("onfocusout", "clearStaticText(this)");
    inputNameColorElm.type = "text";
    inputNameColorElm.name = "name_color_2";

    if (setRouteColor_2 != "") {
        inputNameColorElm.value = setRouteColor_2[0];
        inputNameColorElm.placeholder = setRouteColor_2[0];
    } else {
        inputNameColorElm.placeholder = "ชื่อสีเส้นทางเดินรถ";
    }

    divElm.appendChild(inputNameColorElm);

    useRouteColor_2 = true;

    const divInputGroupElm = document.createElement("div");
    divInputGroupElm.setAttribute("class", "input-group ml-1 mr-0");

    const inputHexColorCode = document.createElement("input");
    inputHexColorCode.setAttribute("class", "using-custom-font form-control");
    inputHexColorCode.setAttribute("onfocus", "setStaticText(this, '#')");
    inputHexColorCode.setAttribute("oninput", "setHexColor(this, 'preview_color_picker_2')");
    inputHexColorCode.setAttribute("onfocusout", "clearStaticText(this, 'preview_color_picker_2')");
    inputHexColorCode.type = "text";
    inputHexColorCode.name = "hex_color_picker_2";
    inputHexColorCode.maxLength = 7;

    if (setRouteColor_2 != "") {
        inputHexColorCode.value = setRouteColor_2[1];
        inputHexColorCode.placeholder = setRouteColor_2[1];
    } else {
        inputHexColorCode.placeholder = "Hex Color เส้นทางเดินรถ";
    }

    divInputGroupElm.appendChild(inputHexColorCode);

    const inputHexColorPreview = document.createElement("input");
    inputHexColorPreview.setAttribute("class", "col-2 form-control show-color-picker");
    inputHexColorPreview.setAttribute("oninput", "setInputHexColor(this.value, 'hex_color_picker_2')");
    inputHexColorPreview.type = "color";
    inputHexColorPreview.name = "preview_color_picker_2";

    if (setRouteColor_2 != "") {
        inputHexColorPreview.value = setRouteColor_2[1];
    }

    divInputGroupElm.appendChild(inputHexColorPreview);

    divElm.appendChild(divInputGroupElm);
}

function unableRouteColor() {
    const labelElm = document.querySelector("#route_color_2 > label");
    const divElm = document.querySelector("#route_color_2 > div.d-flex");

    useRouteColor_2 = false;

    labelElm.removeChild(labelElm.childNodes[1]);
    while (divElm.firstChild) {
        divElm.removeChild(divElm.lastChild);
    }

    const buttonELm = document.createElement("button");
    buttonELm.setAttribute("class", "btn btn-block btn-outline-success using-custom-font");
    buttonELm.setAttribute("onclick", "enableRouteColor()");
    buttonELm.type = "button";
    buttonELm.appendChild(document.createTextNode("ใช้สีที่ 2 ประจำเส้นทางเดินรถ"));
    divElm.appendChild(buttonELm);
    
    setPageLock();
}

function detectInteger(element, max) {
    const regex = /^[0-9]*?$/g;

    if (element.value.charAt(0) == "0") {
        element.value = "";
    } else {
        if (regex.test(element.value) == false) {
            element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
        } else {
            element.value = element.value.toUpperCase().trim();
            if (element.value > max) {
                element.classList.add("is-invalid");
            } else {
                element.classList.remove("is-invalid");
            }
        }
    }
}

function detectDecimal(element) {
    const regex = /^([0-9]+(\.?[0-9]?[0-9]?)?)$/g;

    if (element.value.charAt(0) == "0" || element.value.charAt(0) == ".") {
        element.value = "";
    } else {
        if (regex.test(element.value) == false) {
            element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
        } else {
            element.value = element.value.trim();
        }
    }
}

function setDecimal(element, digit) {
    if (element.name == "latitudePoint" || element.name == "longitudePoint") {
        if (element.value != "" && element.value.length < 10) {
            element.value = parseFloat(element.value).toFixed(digit);
        }
    } else {
        if (element.value != "") {
            element.value = parseFloat(element.value).toFixed(digit);
        }
    }
}

function setPrice(nameInputLow, nameInputHigh) {
    const inputLow = document.querySelector(`input[name="${nameInputLow}"]`);
    const inputHigh = document.querySelector(`input[name="${nameInputHigh}"]`);

    inputLow.classList.remove("is-invalid");
    inputHigh.classList.remove("is-invalid");

    if (parseFloat(inputLow.value) >= parseFloat(inputHigh.value) && inputHigh.value != "") {
        inputLow.classList.add("is-invalid");
    }

    if (parseFloat(inputHigh.value) <= parseFloat(inputLow.value) && inputLow.value != "") {
        inputHigh.classList.add("is-invalid");
    }
}

function calculateServiceEndTime() {
    const serviceStartTime = document.querySelector("input[name='service_start_time']");
    const serviceTimeRound = document.querySelector("input[name='service_time_round']");
    const serviceCountRound = document.querySelector("input[name='service_count_round']");
    const serviceEndTime = document.querySelector("input[name='service_end_time']");

    if (serviceStartTime.value != "" && serviceTimeRound.value != "" && serviceCountRound.value != "") {
        serviceEndTime.value = moment(serviceStartTime.value, "HH:mm").add(serviceTimeRound.value * serviceCountRound.value, "minutes").format("HH:mm");
    } else {
        serviceEndTime.value = "--:--";
    }
}

function detectLocationPoint(element) {
    const regex = /^\-?[0-9\.]*?$/g;

    element.classList.remove("is-invalid");

    if (element.value.charAt(0) == "0" || element.value.charAt(0) == ".") {
        element.value = "";
    } else {
        if (regex.test(element.value) == false) {
            element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
        } else {
            element.value = element.value.trim();
        }
    }
}

function setLocationInput() {
    const lonPointInput = document.querySelector("input[name='latitudePoint']");
    const latPointInput = document.querySelector("input[name='longitudePoint']");
    let location = map.location();
    lonPointInput.value = location.lon;
    latPointInput.value = location.lat;
}

function setCreateRoute() {
    const pinType = document.querySelector("#createRoutePinType");
    const pinOption = Array.from(document.querySelector("#createRoutePinType"));
    const latitudePointInput = document.querySelector("input[name='latitudePoint']");
    const longitudePointInput = document.querySelector("input[name='longitudePoint']");
    let marker;

    latitudePointInput.classList.remove("is-invalid");
    longitudePointInput.classList.remove("is-invalid");

    if (latitudePointInput.value != "" && longitudePointInput.value != "") {
        if (pinType.value == "2" || pinType.value == "3") {
            if (pinType.value == "2" && markerPoint > 1) {
                mapRouteLocation.deviate_forward.push({
                    "lat": latitudePointInput.value,
                    "lon": longitudePointInput.value
                });
                markerPoint++;
                setPageLock();
            } else if (pinType.value == "3" && markerPoint > 1) {
                mapRouteLocation.deviate_backward.push({
                    "lat": latitudePointInput.value,
                    "lon": longitudePointInput.value
                });
                markerPoint++;
                setPageLock();
            }
        } else if (pinType.value == "4" || pinType.value == "5") {
            if (pinType.value == "4") {
                mapRouteLocation.start_point.lat = latitudePointInput.value;
                mapRouteLocation.start_point.lon = longitudePointInput.value;
                cancelEditRouteInput("start_point_forward", "end_point_backward");
                setPageLock();
            } else if (pinType.value == "5") {
                mapRouteLocation.end_point.lat = latitudePointInput.value;
                mapRouteLocation.end_point.lon = longitudePointInput.value;
                cancelEditRouteInput("start_point_backward", "end_point_forward");
                setPageLock();
            }

            map.Overlays.remove(marker);
            map.Route.clear();
        } else if (pinType.value == "6" || pinType.value == "7") {
            if (pinType.value == "6") {
                if (editDeviateRouteIndex != -1) {
                    mapRouteLocation.deviate_forward[editDeviateRouteIndex].lat = latitudePointInput.value;
                    mapRouteLocation.deviate_forward[editDeviateRouteIndex].lon = longitudePointInput.value;
                    cancelEditRouteInput(`deviate_forward_${parseInt(editDeviateRouteIndex) + 1}`, "");
                    editDeviateRouteIndex = -1;
                    setPageLock();
                }
            } else if (pinType.value == "7") {
                if (editDeviateRouteIndex != -1) {
                    mapRouteLocation.deviate_backward[editDeviateRouteIndex].lat = latitudePointInput.value;
                    mapRouteLocation.deviate_backward[editDeviateRouteIndex].lon = longitudePointInput.value;
                    cancelEditRouteInput(`deviate_backward_${parseInt(editDeviateRouteIndex) + 1}`, "");
                    editDeviateRouteIndex = -1;
                    setPageLock();
                }
            }

            map.Overlays.remove(marker);
            map.Route.clear();
        }

        findRouteLocation();
        setRouteInput();
    } else {
        if (latitudePointInput.value == "") {
            latitudePointInput.classList.add("is-invalid");
        }
        if (longitudePointInput.value == "") {
            longitudePointInput.classList.add("is-invalid");
        }
    }

}

function switchFindRouteMode(routeMode) {
    const pinType = document.querySelector("#createRoutePinType");
    const buttonForward = document.querySelector("#switchFindRouteForward");
    const buttonBackward = document.querySelector("#switchFindRouteBackward");
    const classUsing = ["btn-primary", "btn-outline-primary"];

    if (mapDisplayType != routeMode) {
        mapDisplayType = routeMode;

        buttonForward.classList.remove(classUsing[0], classUsing[1]);
        buttonBackward.classList.remove(classUsing[0], classUsing[1]);

        if (routeMode == "forward") {
            buttonForward.classList.add(classUsing[0]);
            buttonBackward.classList.add(classUsing[1]);

            if (mapRouteLocation.start_point.lat != "" && mapRouteLocation.start_point.lon != "" && markerPoint > 1) {
                pinType.value = "2";
            }

        } else if (routeMode == "backward") {
            buttonForward.classList.add(classUsing[1]);
            buttonBackward.classList.add(classUsing[0]);

            if (mapRouteLocation.end_point.lat != "" && mapRouteLocation.end_point.lon != "" && markerPoint > 1) {
                pinType.value = "3";
            }
        }

        findRouteLocation();
    }
}

function findRouteLocation() {
    const dataRoute = mapRouteLocation;

    if (markerPoint > 1) {
        map.Overlays.clear();
        map.Route.clear();
    }

    if (mapDisplayType == "forward") {
        if (dataRoute.start_point.lat != "" && dataRoute.start_point.lon != "") {
            marker = mapMarker({
                lat: dataRoute.start_point.lat,
                lon: dataRoute.start_point.lon
            }, "Start_Service");
            map.Route.insert(0, marker);
            map.Overlays.add(marker);
        }

        if (dataRoute.end_point.lat != "" && dataRoute.end_point.lon != "") {
            marker = mapMarker({
                lat: dataRoute.end_point.lat,
                lon: dataRoute.end_point.lon
            }, "End_Service");
            map.Route.insert(map.Route.list().length, marker);
            map.Overlays.add(marker);
        }

        if (dataRoute.deviate_forward.length > 0) {
            dataRoute.deviate_forward.forEach((data) => {
                marker = mapMarker({
                    lat: data.lat,
                    lon: data.lon
                }, "Deviate");
                map.Route.insert(map.Route.list().length - 1, marker);
                map.Overlays.add(marker);
            });
            map.Route.auto(true);
        } else {
            map.Route.auto(true);
        }
    } else if (mapDisplayType == "backward") {
        if (dataRoute.end_point.lat != "" && dataRoute.end_point.lon != "") {
            marker = mapMarker({
                lat: dataRoute.end_point.lat,
                lon: dataRoute.end_point.lon
            }, "Start_Service");
            map.Route.insert(0, marker);
            map.Overlays.add(marker);
        }

        if (dataRoute.start_point.lat != "" && dataRoute.start_point.lon != "") {
            marker = mapMarker({
                lat: dataRoute.start_point.lat,
                lon: dataRoute.start_point.lon
            }, "End_Service");
            map.Route.insert(map.Route.list().length, marker);
            map.Overlays.add(marker);
        }

        if (dataRoute.deviate_backward.length > 0) {
            dataRoute.deviate_backward.forEach((data) => {
                marker = mapMarker({
                    lat: data.lat,
                    lon: data.lon
                }, "Deviate");
                map.Route.insert(map.Route.list().length - 1, marker);
                map.Overlays.add(marker);
            });
            map.Route.auto(true);
        } else {
            map.Route.auto(true);
        }
    }
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

function setRouteInput(condition) {
    const startPointForwardTag = document.querySelector("input[name='start_point_forward']");
    const startPointEditBtn = document.querySelector("#start_point_forward_edit_btn");
    const deviatePointForward = document.querySelector("#deviate_forward");
    const deviateCountForward = document.querySelector("#count_deviate_forward");
    const endPointForwardTag = document.querySelector("input[name='end_point_forward']");
    const startPointBackwardTag = document.querySelector("input[name='start_point_backward']");
    const endPointEditBtn = document.querySelector("#start_point_backward_edit_btn");
    const deviatePointBackward = document.querySelector("#deviate_backward");
    const deviateCountBackward = document.querySelector("#count_deviate_backward");
    const endPointBackwardTag = document.querySelector("input[name='end_point_backward']");
    const dataRoute = mapRouteLocation;

    function deviateInput(array, latValue, lonValue, pinId, pinText, nameInput) {
        const mainDevElm = document.createElement("div");
        const devDeleteBtn = document.createElement("div");
        const deleteBtn = document.createElement("button");
        const deviateInput = document.createElement("input");
        const devEditBtn = document.createElement("div");
        const editBtn = document.createElement("button");

        mainDevElm.setAttribute("class", "input-group pt-1");
        devDeleteBtn.setAttribute("class", "input-group-prepend");
        deleteBtn.type = "button";
        deleteBtn.innerHTML = "<i class='far fa-trash-alt'></i>";
        deleteBtn.setAttribute("class", "btn btn-outline-warning");
        deleteBtn.setAttribute("onclick", `deleteRouteInput("${pinId}", "${array}")`);
        deviateInput.type = "text";
        deviateInput.disabled = true;
        deviateInput.value = `จุดที่ ${array + 1} = [ lat: ${latValue}, lon: ${lonValue} ]`;
        deviateInput.name = `${nameInput}_${array + 1}`;
        deviateInput.setAttribute("class", "border-warning using-custom-font form-control custom-input-disabled");
        devEditBtn.setAttribute("class", "input-group-append");
        editBtn.type = "button";
        editBtn.innerHTML = "<i class='fas fa-edit'></i><span class='d-md-inline d-none'> แก้ไข</span>";
        editBtn.setAttribute("class", "btn btn-warning using-custom-font text-white");
        editBtn.setAttribute("onclick", `setEditRouteInput("${pinId}", "${array}", "${pinText}", "${nameInput}_${array + 1}", "")`);

        devDeleteBtn.appendChild(deleteBtn);
        mainDevElm.appendChild(devDeleteBtn);
        mainDevElm.appendChild(deviateInput);
        devEditBtn.appendChild(editBtn);
        mainDevElm.appendChild(devEditBtn);

        return mainDevElm;
    }

    if (dataRoute.start_point.lat != "" && dataRoute.start_point.lon != "") {
        startPointForwardTag.value = `[ lat: ${dataRoute.start_point.lat}, lon: ${dataRoute.start_point.lon} ]`;
        endPointBackwardTag.value = `[ lat: ${dataRoute.start_point.lat}, lon: ${dataRoute.start_point.lon} ]`;
        startPointEditBtn.disabled = false;
    }

    if (dataRoute.end_point.lat != "" && dataRoute.end_point.lon != "") {
        startPointBackwardTag.value = `[ lat: ${dataRoute.end_point.lat}, lon: ${dataRoute.end_point.lon} ]`;
        endPointForwardTag.value = `[ lat: ${dataRoute.end_point.lat}, lon: ${dataRoute.end_point.lon} ]`;
        endPointEditBtn.disabled = false;
    }

    if (dataRoute.deviate_forward.length > 0 || condition == "DeviatePoint-Reset") {
        deviatePointForward.innerHTML = "";

        dataRoute.deviate_forward.forEach((value, index) => {
            deviatePointForward.appendChild(deviateInput(index, value.lat, value.lon, "6", "จุดเบี่ยงขาไป", "deviate_forward"));
        });

        deviateCountForward.innerHTML = `(${dataRoute.deviate_forward.length} จุดเบี่ยง)`;
    }

    if (dataRoute.deviate_backward.length > 0 || condition == "DeviatePoint-Reset") {
        deviatePointBackward.innerHTML = "";

        dataRoute.deviate_backward.forEach((value, index) => {
            deviatePointBackward.appendChild(deviateInput(index, value.lat, value.lon, "7", "จุดเบี่ยงขากลับ", "deviate_backward"));
        });

        deviateCountBackward.innerHTML = `(${dataRoute.deviate_backward.length} จุดเบี่ยง)`;
    }
}

function setEditRouteInput(pinId, pinIndex, pinText, nameInput, subNameInput) {
    if (onEditMode == false) {
        const pinType = document.querySelector("#createRoutePinType");
        const routeMapSelect = document.querySelector("#routeMapSelectType");
        const lonPointInput = document.querySelector("input[name='latitudePoint']");
        const latPointInput = document.querySelector("input[name='longitudePoint']");
        const cancelBtn = document.createElement("button");
        const editPinTypeSelect = document.createElement("select");
        const editPinTypeOption = document.createElement("option");
        const inputDisplayElm = document.querySelector(`input[name='${nameInput}']`);
        const subInputDisplayElm = document.querySelector(`input[name='${subNameInput}']`);
        const dataRoute = mapRouteLocation;

        document.querySelector("#createRoutePinType").remove();

        cancelBtn.type = "button";
        cancelBtn.innerHTML = "<i class='fas fa-times'></i><span class='d-md-none d-inline'> ยกเลิกการแก้ไข</span>";
        cancelBtn.setAttribute("class", "col-md-auto col-12 btn btn-danger using-custom-font text-truncate mb-1 ml-0 mr-1");

        editPinTypeSelect.setAttribute("class", "col-md-2 col-12 custom-select bg-warning using-custom-font set-bg-warning-text-white pl-md-3 pl-2 pr-md-1 pr-0 mb-1");
        editPinTypeSelect.setAttribute("id", "createRoutePinType");
        editPinTypeOption.value = pinId;

        if (pinId == "4" || pinId == "5") {
            cancelBtn.setAttribute("onclick", `cancelEditRouteInput("${nameInput}", "${subNameInput}")`);
            editPinTypeOption.text = pinText;
        } else if (pinId == "6" || pinId == "7") {
            cancelBtn.setAttribute("onclick", `cancelEditRouteInput("${nameInput}", "")`);
            editPinTypeOption.text = `${pinText}ที่ ${parseInt(pinIndex) + 1}`;
        }

        editPinTypeSelect.appendChild(editPinTypeOption);

        routeMapSelect.insertBefore(editPinTypeSelect, routeMapSelect.firstChild);
        routeMapSelect.insertBefore(cancelBtn, routeMapSelect.firstChild);

        inputDisplayElm.classList.add("text-warning");
        inputDisplayElm.value = "กำลังแก้ไขข้อมูลนี้...";

        if (subNameInput != "") {
            subInputDisplayElm.classList.add("text-warning");
            subInputDisplayElm.value = "กำลังแก้ไขข้อมูลนี้...";
        }

        if (pinId == "4") {
            map.location({
                lon: dataRoute.start_point.lon,
                lat: dataRoute.start_point.lat
            }, true);
            lonPointInput.value = dataRoute.start_point.lon;
            latPointInput.value = dataRoute.start_point.lat;
        } else if (pinId == "5") {
            map.location({
                lon: dataRoute.end_point.lon,
                lat: dataRoute.end_point.lat
            }, true);
            lonPointInput.value = dataRoute.end_point.lon;
            latPointInput.value = dataRoute.end_point.lat;
        } else if (pinId == "6") {
            map.location({
                lon: dataRoute.deviate_forward[pinIndex].lon,
                lat: dataRoute.deviate_forward[pinIndex].lat
            }, true);
            lonPointInput.value = dataRoute.deviate_forward[pinIndex].lon;
            latPointInput.value = dataRoute.deviate_forward[pinIndex].lat;
            editDeviateRouteIndex = pinIndex;
            pinType.value = "2";
        } else if (pinId == "7") {
            map.location({
                lon: dataRoute.deviate_backward[pinIndex].lon,
                lat: dataRoute.deviate_backward[pinIndex].lat
            }, true);
            lonPointInput.value = dataRoute.deviate_backward[pinIndex].lon;
            latPointInput.value = dataRoute.deviate_backward[pinIndex].lat;
            editDeviateRouteIndex = pinIndex;
            pinType.value = "3";
        }

        onEditMode = true;
    }
}

function cancelEditRouteInput(nameInput, subNameInput) {
    const routeMapSelect = document.querySelector("#routeMapSelectType");
    const lonPointInput = document.querySelector("input[name='latitudePoint']");
    const latPointInput = document.querySelector("input[name='longitudePoint']");
    const inputDisplayElm = document.querySelector(`input[name='${nameInput}']`);
    const subInputDisplayElm = document.querySelector(`input[name='${subNameInput}']`);

    const pinTypeSelect = document.createElement("select");
    const dataRoute = mapRouteLocation;
    const pinType = ["จุดเริ่มต้น", "จุดสิ้นสุด", "จุดเบี่ยงขาไป", "จุดเบี่ยงขากลับ"];

    routeMapSelect.removeChild(routeMapSelect.childNodes[0]);
    routeMapSelect.removeChild(routeMapSelect.childNodes[0]);

    pinTypeSelect.setAttribute("class", "col-md-2 col-12 custom-select bg-primary using-custom-font pl-md-3 pl-2 pr-md-1 pr-0 mb-1");
    pinTypeSelect.setAttribute("id", "createRoutePinType");
    pinType.forEach((value, index) => {
        const pinTypeOption = document.createElement("option");
        pinTypeOption.value = index;
        pinTypeOption.text = value;

        if (index == "0" && dataRoute.start_point.lat != "" && dataRoute.start_point.lon != "" || index == "1" && dataRoute.end_point.lat != "" && dataRoute.end_point.lon != "") {
            pinTypeOption.disabled = true;
        }

        pinTypeSelect.appendChild(pinTypeOption);
    });

    routeMapSelect.insertBefore(pinTypeSelect, routeMapSelect.firstChild);

    inputDisplayElm.classList.remove("text-warning");

    if (subNameInput != "") {
        subInputDisplayElm.classList.remove("text-warning");
    }

    lonPointInput.value = "";
    latPointInput.value = "";
    setRouteInput();

    onEditMode = false;
}

function deleteRouteInput(pinType, pinIndex) {
    const pinTypeSelect = document.querySelector("#createRoutePinType");

    if (pinType == "6") {
        mapRouteLocation.deviate_forward.splice(pinIndex, 1);
        pinTypeSelect.value = "2";
    } else if (pinType == "7") {
        mapRouteLocation.deviate_backward.splice(pinIndex, 1);
        pinTypeSelect.value = "3";
    }

    map.Overlays.remove(marker);
    map.Route.clear();
    setPageLock();
    findRouteLocation();
    setRouteInput("DeviatePoint-Reset");
}

function setAccessStatusOption(value) {
    const inputF = document.querySelector("select[name='route_status']");
    const optionSelect = Array.from(document.querySelectorAll("select[name='route_status'] > option"));

    inputF.classList.remove("text-success", "text-info", "text-danger");

    if (value == "online" || value == "3") {
        inputF.classList.add("text-success");
        optionSelect[0].selected = true;
    } else if (value == "investigate" || value == "2") {
        inputF.classList.add("text-info");
        optionSelect[1].selected = true;
    } else if (value == "offline" || value == "1") {
        inputF.classList.add("text-danger");
        optionSelect[2].selected = true;
    }
}

async function verifyInputForm() {
    const cardDanger = document.querySelector("#card_danger_input");
    const cardDangerText = document.querySelector("#card_danger_input > div > p");
    const cardWarning = document.querySelector("#card_warning_input");
    const cardWarningText = document.querySelector("#card_warning_input > div > p");
    const nameStartServiceInput = document.querySelector("input[name='start_point_service']");
    const nameEndServiceInput = document.querySelector("input[name='end_point_service']");
    const routeKeywordDetailInput = document.querySelector("input[name='route_keyword_detail']");
    const nameColor_1_Input = document.querySelector("input[name='name_color_1']");
    const hexColor_1_Input = document.querySelector("input[name='hex_color_picker_1']");
    const nameColor_2_Input = useRouteColor_2 == true ? document.querySelector("input[name='name_color_2']") : "";
    const hexColor_2_Input = useRouteColor_2 == true ? document.querySelector("input[name='hex_color_picker_2']") : "";
    const pricePassengerLowerInput = document.querySelector("input[name='pricePassengerLower']");
    const pricePassengerHigherInput = document.querySelector("input[name='pricePassengerHigher']");
    const priceSuppliesLowerInput = document.querySelector("input[name='priceSuppliesLower']");
    const priceSuppliesHigherInput = document.querySelector("input[name='priceSuppliesHigher']");
    const serviceStartTimeInput = document.querySelector("input[name='service_start_time']");
    const serviceEndTimeInput = document.querySelector("input[name='service_end_time']");
    const serviceTimeRoundInput = document.querySelector("input[name='service_time_round']");
    const serviceCountRoundInput = document.querySelector("input[name='service_count_round']");
    const serviceTimeAverageInput = document.querySelector("input[name='service_time_average']");
    const startPointForwardInput = document.querySelector("input[name='start_point_forward']");
    const endPointForwardInput = document.querySelector("input[name='end_point_forward']");
    const startPointBackwardInput = document.querySelector("input[name='start_point_backward']");
    const endPointBackwardInput = document.querySelector("input[name='end_point_backward']");
    const routeStatusInput = document.querySelector("select[name='route_status']");
    const nameRouteServiceVerify = document.querySelector("#verify_name_route_service");
    const routeKeywordDetailVerify = document.querySelector("#verify_route_keyword_detail");
    const titleRouteColorVerify = document.querySelector("#title_route_color_verify");
    const tabRouteColorVerify = document.querySelector("#route_color_verify");
    const nameColorRoute_1_Verify = document.querySelector("#verify_name_color_route_1");
    const previewColorRoute_1_Verify = document.querySelector("#verify_preview_color_route_1");
    const pricePassengerLowerVerify = document.querySelector("#verify_price_passenger_lower");
    const pricePassengerHigherVerify = document.querySelector("#verify_price_passenger_higher");
    const priceSuppliesLowerVerify = document.querySelector("#verify_price_supplies_lower");
    const priceSuppliesHigherVerify = document.querySelector("#verify_price_supplies_higher");
    const serviceStartTimeVerify = document.querySelector("#verify_service_start_time");
    const serviceEndTimeVerify = document.querySelector("#verify_service_end_time");
    const serviceTimeRoundVerify = document.querySelector("#verify_service_time_round");
    const serviceCountRoundVerify = document.querySelector("#verify_service_count_round");
    const serviceTimeAverageVerify = document.querySelector("#verify_service_time_average");
    const serviceRouteStatusVerify = document.querySelector("#verify_service_route_status");

    const classAdd = ["is-invalid", "border-danger", "border-warning"];
    let onUnCheckInput = [];
    let onCheck = true;

    cardDanger.classList.replace("d-block", "d-none");
    cardWarning.classList.replace("d-block", "d-none");

    if (useRouteColor_2 == true) {
        nameColor_2_Input.classList.remove(classAdd[0]);
        hexColor_2_Input.classList.remove(classAdd[1]);
    }

    nameStartServiceInput.classList.remove(classAdd[0]);
    nameEndServiceInput.classList.remove(classAdd[0]);
    nameStartServiceInput.classList.remove(classAdd[2]);
    nameEndServiceInput.classList.remove(classAdd[2]);
    nameColor_1_Input.classList.remove(classAdd[0]);
    hexColor_1_Input.classList.remove(classAdd[1]);

    pricePassengerLowerInput.classList.remove(classAdd[0]);
    pricePassengerHigherInput.classList.remove(classAdd[0]);
    priceSuppliesLowerInput.classList.remove(classAdd[0]);
    priceSuppliesHigherInput.classList.remove(classAdd[0]);
    serviceStartTimeInput.classList.remove(classAdd[0]);
    serviceEndTimeInput.classList.remove(classAdd[0]);
    serviceTimeRoundInput.classList.remove(classAdd[0]);
    serviceCountRoundInput.classList.remove(classAdd[0]);
    serviceTimeAverageInput.classList.remove(classAdd[0]);
    startPointForwardInput.classList.remove(classAdd[0]);
    endPointForwardInput.classList.remove(classAdd[0]);
    startPointBackwardInput.classList.remove(classAdd[0]);
    endPointBackwardInput.classList.remove(classAdd[0]);

    if (nameStartServiceInput.value.trim() == "") {
        nameStartServiceInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ชื่อจุดเริ่มต้นให้บริการ");
        onCheck = false;
    }

    if (nameEndServiceInput.value.trim() == "") {
        nameEndServiceInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ชื่อจุดสิ้นสุดให้บริการ");
        onCheck = false;
    }

    if (nameColor_1_Input.value.trim() == "" || nameColor_1_Input.value.trim() == "สี") {
        nameColor_1_Input.classList.add(classAdd[0]);
        onUnCheckInput.push("สีเส้นทางเดินรถ สีที่ 1");
        onCheck = false;
    }

    if (hexColor_1_Input.value.trim() == "" || hexColor_1_Input.value.trim() == "#") {
        hexColor_1_Input.classList.add(classAdd[1]);
        onUnCheckInput.push("Hex Color เส้นทางเดินรถ ที่ 1");
        onCheck = false;
    } else {
        const reCheck = /^#[0-9a-f]{3,6}$/i;
        if (!reCheck.test(hexColor_1_Input.value)) {
            hexColor_1_Input.classList.add(classAdd[1]);
            onUnCheckInput.push("รูปแบบ Hex Color เส้นทางเดินรถ ที่ 1 ไม่ถูกต้อง");
            onCheck = false;
        }
    }

    if (useRouteColor_2 == true) {
        if (nameColor_2_Input.value.trim() == "" || nameColor_2_Input.value.trim() == "สี") {
            nameColor_2_Input.classList.add(classAdd[0]);
            onUnCheckInput.push("สีเส้นทางเดินรถ สีที่ 2");
            onCheck = false;
        }

        if (hexColor_2_Input.value.trim() == "" || hexColor_2_Input.value.trim() == "#") {
            hexColor_2_Input.classList.add(classAdd[1]);
            onUnCheckInput.push("Hex Color เส้นทางเดินรถ ที่ 2");
            onCheck = false;
        } else {
            const reCheck = /^#[0-9a-f]{3,6}$/i;
            if (!reCheck.test(hexColor_2_Input.value)) {
                hexColor_2_Input.classList.add(classAdd[1]);
                onUnCheckInput.push("รูปแบบ Hex Color เส้นทางเดินรถ ที่ 2 ไม่ถูกต้อง");
                onCheck = false;
            }
        }
    }

    if (pricePassengerLowerInput.value.trim() == "" || parseFloat(pricePassengerLowerInput.value) >= parseFloat(pricePassengerHigherInput.value)) {
        pricePassengerLowerInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ค่าบริการโดยสาร เริ่มต้น");
        onCheck = false;
    }

    if (pricePassengerHigherInput.value.trim() == "" || parseFloat(pricePassengerHigherInput.value) <= parseFloat(pricePassengerLowerInput.value)) {
        pricePassengerHigherInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ค่าบริการโดยสาร สูงสุด");
        onCheck = false;
    }

    if (priceSuppliesLowerInput.value.trim() == "" || parseFloat(priceSuppliesLowerInput.value) >= parseFloat(priceSuppliesHigherInput.value)) {
        priceSuppliesLowerInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ค่าบริการส่งพัสดุ เริ่มต้น");
        onCheck = false;
    }

    if (priceSuppliesHigherInput.value.trim() == "" || parseFloat(priceSuppliesHigherInput.value) <= parseFloat(priceSuppliesLowerInput.value)) {
        priceSuppliesHigherInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ค่าบริการส่งพัสดุ สูงสุด");
        onCheck = false;
    }

    if (serviceStartTimeInput.value == "") {
        serviceStartTimeInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เวลาเริ่มต้นออกให้บริการ");
        onCheck = false;
    }

    if (serviceTimeRoundInput.value == "") {
        serviceTimeRoundInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เวลาออกรอบให้บริการ");
        onCheck = false;
    }

    if (serviceCountRoundInput.value == "") {
        serviceCountRoundInput.classList.add(classAdd[0]);
        onUnCheckInput.push("จำนวนรอบให้บริการ");
        onCheck = false;
    }

    if (serviceEndTimeInput.value == "--:--") {
        serviceEndTimeInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เวลาสิ้นสุดออกให้บริการ");
        onCheck = false;
    }

    if (serviceTimeAverageInput.value == "") {
        serviceTimeAverageInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เวลาที่ใช้ให้บริการ");
        onCheck = false;
    }

    if (startPointForwardInput.value.trim() == "") {
        startPointForwardInput.classList.add(classAdd[0]);
        endPointBackwardInput.classList.add(classAdd[0]);
        onUnCheckInput.push("จุดเริ่มต้นให้บริการ (ขาไป) และจุดสิ้นสุดให้บริการ (ขากลับ)");
        onCheck = false;
    }

    if (startPointBackwardInput.value.trim() == "") {
        startPointBackwardInput.classList.add(classAdd[0]);
        endPointForwardInput.classList.add(classAdd[0]);
        onUnCheckInput.push("จุดเริ่มต้นให้บริการ (ขากลับ) และจุดสิ้นสุดให้บริการ (ขาไป)");
        onCheck = false;
    }

    if (onCheck == false) {
        cardDanger.classList.replace("d-none", "d-block");
        cardDangerText.innerHTML = `โปรดตรวจสอบข้อมูลในช่อง กรอกข้อมูล ดังนี้ <b>${onUnCheckInput.join(", ")}</b> ก่อนกดปุ่ม <i class="far fa-check-circle"></i> ตรวจสอบ อีกครั้ง`;
        document.querySelector("#top_container").scrollIntoView();
    } else {
        let onCheckValidate = true;
        let onUnCheckValidate = [];
        let dataPack = new FormData();

        dataPack.append("data", `{"idRoute": "${useIdRoute}", "nameStart": "${nameStartServiceInput.value.trim()}", "nameEnd": "${nameEndServiceInput.value.trim()}"}`);
        const conditionSetData = await new Promise((resolve, reject) => {
            fetch(`${urlAPIServer}/check_duplicate_set_data?condition=nameRoute`, {
                    method: 'POST',
                    body: dataPack
                })
                .then((response) => {
                    response.text().then((value) => {
                        if (value == "false") {
                            onCheckValidate = true;
                            resolve();
                        } else {
                            resolve(true);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        });

        if (conditionSetData) {
            await new Promise((resolve, reject) => {
                fetch(`${urlAPIServer}/check_duplicate_data?condition=nameRoute`, {
                        method: 'POST',
                        body: dataPack
                    })
                    .then((response) => {
                        response.text().then((value) => {
                            if (value == "false") {
                                onCheckValidate = false;
                                nameStartServiceInput.classList.add(classAdd[2]);
                                nameEndServiceInput.classList.add(classAdd[2]);
                                onUnCheckValidate.push(`ชื่อเส้นทางเดินรถ : ${nameStartServiceInput.value.trim()} - ${nameEndServiceInput.value.trim()}`);
                                resolve();
                            } else {
                                onCheckValidate = true;
                                resolve();
                            }
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        reject();
                    });
            });
        }

        if (await !onCheckValidate) {
            cardWarning.classList.replace("d-none", "d-block");
            cardWarningText.innerHTML = `ข้อมูลในช่องกรอกข้อมูลเหล่านี้ <b>${onUnCheckValidate.join(", ")}</b> ไม่พร้อมให้ใช้งานในระบบ โปรดตรวจสอบและเปลี่ยนแปลงข้อมูลอีกครั้ง ก่อนกดปุ่ม <i class="far fa-check-circle"></i> ตรวจสอบ อีกครั้ง`;
            document.querySelector("#top_container").scrollIntoView();
        } else {
            nameRouteServiceVerify.value = `${nameStartServiceInput.value.trim()} - ${nameEndServiceInput.value.trim()}`;
            if (routeKeywordDetailInput.value == "") {
                routeKeywordDetailVerify.classList.add("text-danger");
                routeKeywordDetailVerify.value = "-";
            } else {
                if (routeKeywordDetailVerify.classList.contains("text-danger")) {
                    routeKeywordDetailVerify.classList.remove("text-danger");
                }
                routeKeywordDetailVerify.value = routeKeywordDetailInput.value.trim();
            }
            nameColorRoute_1_Verify.value = `${nameColor_1_Input.value.trim()} (${hexColor_1_Input.value.trim().toUpperCase()})`;
            previewColorRoute_1_Verify.value = hexColor_1_Input.value.trim().toUpperCase();

            if (useRouteColor_2 == true) {
                const divMain = document.createElement("div");
                const nameInput = document.createElement("input");
                const colorInput = document.createElement("input");


                titleRouteColorVerify.innerHTML = "สีประจำเส้นทางเดินรถ (สีที่ 1 - สีที่ 2)";
                divMain.setAttribute("class", "input-group mt-sm-0 mt-2 ml-sm-2 ml-0");
                divMain.setAttribute("id", "verify_color_route_2");
                nameInput.type = "text";
                nameInput.disabled = true;
                nameInput.setAttribute("class", "form-control using-custom-font custom-input-disabled");
                nameInput.setAttribute("id", "verify_name_color_route_2");
                colorInput.type = "color";
                colorInput.disabled = true;
                colorInput.setAttribute("class", "col-2 form-control show-color-picker custom-input-disabled");
                colorInput.setAttribute("id", "verify_preview_color_route_2");

                divMain.appendChild(nameInput);
                divMain.appendChild(colorInput);
                tabRouteColorVerify.appendChild(divMain);

                document.querySelector("#verify_name_color_route_2").value = `${nameColor_2_Input.value.trim()} (${hexColor_2_Input.value.trim().toUpperCase()})`;
                document.querySelector("#verify_preview_color_route_2").value = hexColor_2_Input.value.trim().toUpperCase();
            }

            pricePassengerLowerVerify.value = pricePassengerLowerInput.value.trim();
            pricePassengerHigherVerify.value = pricePassengerHigherInput.value.trim();
            priceSuppliesLowerVerify.value = priceSuppliesLowerInput.value.trim();
            priceSuppliesHigherVerify.value = priceSuppliesHigherInput.value.trim();
            serviceStartTimeVerify.value = `${serviceStartTimeInput.value} น.`;
            serviceEndTimeVerify.value = `${serviceEndTimeInput.value} น.`;
            serviceTimeRoundVerify.value = `${serviceTimeRoundInput.value} น.`;
            serviceCountRoundVerify.value = `${serviceCountRoundInput.value} รอบ`;
            serviceTimeAverageVerify.value = `${serviceTimeAverageInput.value} น.`;

            if (routeStatusInput.value == "1") {
                serviceRouteStatusVerify.classList.add("text-danger");
                serviceRouteStatusVerify.value = "ยกเลิกการให้บริการ";
            } else if (routeStatusInput.value == "2") {
                serviceRouteStatusVerify.classList.add("text-info");
                serviceRouteStatusVerify.value = "ระงับการให้บริการชั่วคราว";
            } else if (routeStatusInput.value == "3") {
                serviceRouteStatusVerify.classList.add("text-success");
                serviceRouteStatusVerify.value = "ให้บริการ";
            }

            $('#verifyModal').modal('toggle');
        }
    }
}

function setFindRouteDataType(routeMode, element, subButton, addButton, subAddButton) {
    const subButtonElm = document.querySelector(`#${subButton}`);
    const addButtonElm = document.querySelector(`#${addButton}`);
    const subAddButtonElm = document.querySelector(`#${subAddButton}`);

    element.classList.replace("btn-outline-primary", "btn-primary");

    if (routeMode == "forward" && routeDataMaster[0].length < 1 || routeMode == "backward" && routeDataMaster[1].length < 1) {
        subButtonElm.classList.replace("btn-primary", "btn-outline-primary");
        addButtonElm.disabled = false;
        subAddButtonElm.disabled = true;
    }

    switchFindRouteMode(routeMode);
}

function addRouteData(routeMode, element, selectElement, textStatusElement) {
    const selectButtonElm = document.querySelector(`#${selectElement}`);
    const textStatusElm = document.querySelector(`#${textStatusElement}`);

    if (routeMode == "forward") {
        routeDataMaster[0].push(map.Route.exportRouteLine().location());
        textStatusElm.classList.replace("text-danger", "text-success");
        textStatusElm.value = "เพิ่มข้อมูลเที่ยวขาไป สำเร็จ";
        selectButtonElm.disabled = true;
        element.disabled = true;

        if (routeDataMaster[1].length < 1) {
            setFindRouteDataType('backward', document.querySelector("#findRouteBackwardData"), 'findRouteForwardData', 'addRouteBackwardData', 'addRouteForwardData');
        } else {
            selectButtonElm.classList.replace("btn-primary", "btn-outline-primary");
        }
    } else if (routeMode == "backward") {
        routeDataMaster[1].push(map.Route.exportRouteLine().location());
        textStatusElm.classList.replace("text-danger", "text-success");
        textStatusElm.value = "เพิ่มข้อมูลเที่ยวขากลับ สำเร็จ";
        selectButtonElm.disabled = true;
        element.disabled = true;

        if (routeDataMaster[0].length < 1) {
            setFindRouteDataType('forward', document.querySelector("#findRouteForwardData"), 'findRouteBackwardData', 'addRouteForwardData', 'addRouteBackwardData');
        } else {
            selectButtonElm.classList.replace("btn-primary", "btn-outline-primary");
        }
    }

    if (routeDataMaster[0].length > 0 && routeDataMaster[1].length > 0) {
        document.querySelector("#saveDataButton").disabled = false;
    }
}

function saveData() {
    $("#verifyModal").modal('hide');
    $("#saveChangeData").modal('toggle');
}

async function saveChangeData() {
    const modalButton = Array.from(document.querySelectorAll("#modelSaveChangeDataFooter > button"));
    const passwordInput = document.querySelector("#passwordUserAccess");
    const passwordInputText = document.querySelector("#passwordUserAccessText");

    passwordInput.classList.remove("is-invalid");
    passwordInput.disabled = true;
    passwordInputText.innerHTML = "";

    modalButton[0].disabled = true;
    modalButton[1].disabled = true;
    modalButton[1].innerHTML = "<span class='spinner-border spinner-border-sm m-1' role='status' aria-hidden='true'></span> บันทึกข้อมูล";

    const statusSendData = await sendData();
    if (await statusSendData == "re-Send" || await statusSendData == "TypeError: Failed to fetch") {
        passwordInput.disabled = false;

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='fas fa-save'></i> บันทึกข้อมูล";
    } else if (await statusSendData == "invalid-Password") {
        passwordInput.disabled = false;
        passwordInput.classList.add("is-invalid");
        passwordInputText.innerHTML = "รหัสผ่านรหัสผ่านบัญชีของคุณไม่ถูกต้อง โปรดสอบอกีครั้งก่อนกดปุ่ม <i class='fas fa-save'></i> บันทึกข้อมูล อีกครั้ง";

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='fas fa-save'></i> บันทึกข้อมูล";
    }
}

async function sendData() {
    const authorizationKey = new Headers();
    const dataPack = new FormData();
    const passwordUserAccess = document.querySelector("#passwordUserAccess");
    const nameStartServiceInput = document.querySelector("input[name='start_point_service']");
    const nameEndServiceInput = document.querySelector("input[name='end_point_service']");
    const routeKeywordDetailInput = document.querySelector("input[name='route_keyword_detail']");
    const nameColor_1_Input = document.querySelector("input[name='name_color_1']");
    const hexColor_1_Input = document.querySelector("input[name='hex_color_picker_1']");
    const pricePassengerLowerInput = document.querySelector("input[name='pricePassengerLower']");
    const pricePassengerHigherInput = document.querySelector("input[name='pricePassengerHigher']");
    const priceSuppliesLowerInput = document.querySelector("input[name='priceSuppliesLower']");
    const priceSuppliesHigherInput = document.querySelector("input[name='priceSuppliesHigher']");
    const serviceStartTimeInput = document.querySelector("input[name='service_start_time']");
    const serviceEndTimeInput = document.querySelector("input[name='service_end_time']");
    const serviceTimeRoundInput = document.querySelector("input[name='service_time_round']");
    const serviceCountRoundInput = document.querySelector("input[name='service_count_round']");
    const serviceTimeAverageInput = document.querySelector("input[name='service_time_average']");
    const routeStatusInput = document.querySelector("select[name='route_status']");

    authorizationKey.append("Authorization", getCookie("keyAccount"));

    dataPack.append("passwordUserAccess", passwordEncryption(passwordUserAccess.value));
    dataPack.append("changeNameStartService", nameStartServiceInput.value);
    dataPack.append("changeNameEndService", nameEndServiceInput.value);
    dataPack.append("changeRouteKeywordDetail", routeKeywordDetailInput.value == "-" ? "" :routeKeywordDetailInput.value);
    dataPack.append("changeNameColor_1", nameColor_1_Input.value);
    dataPack.append("changeHexColor_1", hexColor_1_Input.value);
    dataPack.append("changePricePassengerLower", pricePassengerLowerInput.value);
    dataPack.append("changePricePassengerHigher", pricePassengerHigherInput.value);
    dataPack.append("changePriceSuppliesLower", priceSuppliesLowerInput.value);
    dataPack.append("changePriceSuppliesHigher", priceSuppliesHigherInput.value);
    dataPack.append("changeServiceStartTime", serviceStartTimeInput.value);
    dataPack.append("changeServiceEndTime", serviceEndTimeInput.value);
    dataPack.append("changeServiceTimeRound", serviceTimeRoundInput.value);
    dataPack.append("changeServiceCountRound", serviceCountRoundInput.value);
    dataPack.append("changeServiceTimeAverage", serviceTimeAverageInput.value);
    dataPack.append("changeDataRouteLocation", JSON.stringify(mapRouteLocation));
    dataPack.append("changeRouteStatus", routeStatusInput.value);

    if (routeDataMaster[0].length > 0) {
        dataPack.append("changeDataRouteForward", JSON.stringify(routeDataMaster[0][0]));
    }

    if (routeDataMaster[1].length > 0) {
        dataPack.append("changeDataRouteBackward", JSON.stringify(routeDataMaster[1][0]));
    }

    if (useRouteColor_2 == true) {
        dataPack.append("changeNameColor_2", document.querySelector("input[name='name_color_2']").value.trim());
        dataPack.append("changeHexColor_2", document.querySelector("input[name='hex_color_picker_2']").value.trim());
    } else {
        dataPack.append("changeNameColor_2", "");
        dataPack.append("changeHexColor_2", "");
    }

    const returnValue = await new Promise((resolve) => {
        fetch(`${urlAPIServer}/profile_route_management?idRoute=${useIdRoute}`, {
                method: 'PUT',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = `./profile_route_management.php?idRoute=${useIdRoute}`;
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function resetFindRouteDataType() {
    function setElement(textStatus, findRouteButton, addRouteButton) {
        const textStatusElm = document.querySelector(`#${textStatus}`);
        const findButtonElm = document.querySelector(`#${findRouteButton}`);
        textStatusElm.classList.replace("text-success", "text-danger");
        textStatusElm.value = "ข้อมูลเที่ยวขาไป ยังไม่ถูกเพิ่ม";
        if (findButtonElm.classList.contains("btn-primary")) {
            findButtonElm.classList.replace("btn-primary", "btn-outline-primary");
        }
        findButtonElm.disabled = false;
        document.querySelector(`#${addRouteButton}`).disabled = true;
    }

    setElement("verify_data_route_forward", "findRouteForwardData", "addRouteForwardData");
    setElement("verify_data_route_backward", "findRouteBackwardData", "addRouteBackwardData");
    document.querySelector("#saveDataButton").disabled = true;
    routeDataMaster = [
        [],
        []
    ];
}

function closeModal(idModal) {
    $(`${idModal}`).modal('hide');

    resetFindRouteDataType();
    if (useRouteColor_2 == true) {
        document.querySelector("#verify_color_route_2").remove();
    }
}

function passwordEncryption(password) {
    return md5(password.split("").reverse().join(""));
}