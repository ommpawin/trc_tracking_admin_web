let urlAPIServer;
let pageLock = false;
let useRouteColor_2 = false;
let markerPoint = 0;
var map = new longdo.Map({
    placeholder: document.querySelector("#map"),
    ui: longdo.UiComponent.Mobile,
});

document.querySelector("#form_add_route_management").addEventListener("change", () => {
    pageLock = true;
});

window.addEventListener("beforeunload", (event) => {
    if (pageLock) {
        event.returnValue = "คุณมีการเปลี่ยนแปลงฟอร์มที่ยังไม่เสร็จสมบูรณ์ !";
    }
});

(() => {

    async function getURLServer() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => {
            return value.json();
        });
        urlAPIServer = settingFile.urlAPIServer;
    }

    async function getMapAPI() {
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
        await getURLServer();

    }

    onRunScript();

})();

map.Event.bind("drop", () => {
    const latPointInput = document.querySelector("input[name='latitudePoint']");
    const lonPointInput = document.querySelector("input[name='longitudePoint']");
    let location = map.location();
    pageLock = true;
    latPointInput.value = location.lat;
    lonPointInput.value = location.lon;
});

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
    inputNameColorElm.name = "..";
    inputNameColorElm.placeholder = "ชื่อสีเส้นทางเดินรถ";
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
    inputHexColorCode.placeholder = "Hex Color เส้นทางเดินรถ";
    inputHexColorCode.maxLength = 7;
    divInputGroupElm.appendChild(inputHexColorCode);

    const inputHexColorPreview = document.createElement("input");
    inputHexColorPreview.setAttribute("class", "col-2 form-control show-color-picker");
    inputHexColorPreview.setAttribute("oninput", "setInputHexColor(this.value, 'hex_color_picker_2')");
    inputHexColorPreview.type = "color";
    inputHexColorPreview.name = "preview_color_picker_2";
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
    element.value = parseFloat(element.value).toFixed(digit);
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

async function setCreateRoute() {
    const pinType = document.querySelector("#createRoutePinType");
    const pinOption = Array.from(document.querySelector("#createRoutePinType"));
    const latitudePointInput = document.querySelector("input[name='latitudePoint']");
    const longitudePointInput = document.querySelector("input[name='longitudePoint']");
    const startPointForwardTag = document.querySelector("input[name='start_point_forward']");
    const deviatePointForward = Array.from(document.querySelector("#deviate_forward"));
    const endPointForwardTag = document.querySelector("input[name='end_point_forward']");
    const startPointBackwardTag = document.querySelector("input[name='start_point_backward']");
    const deviatePointBackward = Array.from(document.querySelector("#deviate_backward"));
    const endPointBackwardTag = document.querySelector("input[name='end_point_backward']");
    let marker;

    latitudePointInput.classList.remove("is-invalid");
    longitudePointInput.classList.remove("is-invalid");

    if (latitudePointInput.value != "" && longitudePointInput.value != "") {
        if (pinType.value == "0" || pinType.value == "1") {
            marker = new longdo.Marker({
                lat: latitudePointInput.value,
                lon: longitudePointInput.value,
            });

            if (pinType.value == "0") {
                map.Route.add(marker);
                map.Overlays.add(marker);
                markerPoint++;
            } else if (pinType.value == "1") {
                map.Route.add(marker);
                map.Overlays.add(marker);
                markerPoint++;
            }

            if (markerPoint >= 2) {
                await map.Route.search();
                // const polyline = await new map.Route.exportRouteLine();
                const polyline_2 = new longdo.Polyline([{
                        lon: 99,
                        lat: 14
                    },
                    {
                        lon: 100,
                        lat: 15
                    }
                ], {
                    title: 'Dashline',
                    detail: '-',
                    label: 'Dashline',
                    lineWidth: 4,
                    lineColor: 'rgba(255, 0, 0, 0.8)',
                    lineStyle: longdo.LineStyle.Dashed, // if set an object with longdo.LineStyle.Dashed, the object will be dashed line.
                    pointer: true // show pointer when move mouse over the line
                });

                // map.Overlays.add(polyline_2);

                // for (let i = 0; i <= 10; i++) {
                //     map.Overlays.add(map.Route.guide()[0].path[i]);
                // }

                // console.log(map.Route.guide());
                // var routeData = await new Promise((resolve, reject) => {
                //     resolve(map.Route.guide()[0].path[0].location());
                // });
                console.log(map.Route.exportRouteLine());
        
                

                // map.Overlays.add(map.Route.exportRouteLine());
            }
        }
    } else {
        if (latitudePointInput.value == "") {
            latitudePointInput.classList.add("is-invalid");
        }
        if (longitudePointInput.value == "") {
            longitudePointInput.classList.add("is-invalid");
        }
    }

}