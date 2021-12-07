let dataWidgetObject = [];
let dataTableObject = [];
let countDataPage = 0;
let countDataRow = 0;

(() => {

    async function getAPIData() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => {
            return value.json();
        });
        const urlAPI = await settingFile.urlAPIServer;
        const authorizationKey = new Headers();

        authorizationKey.append("Authorization", getCookie("keyAccount"));

        const data = new Promise((resolve, reject) => {
            fetch(`${urlAPI}/trip_management`, {
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
        const setupResult = objectResponse.setup_page;
        const dataWidgets = objectResponse.dashboard_data;
        const dataTableResult = objectResponse.table_data;

        setValueSetup({
            widgetsData: dataWidgets,
            dataObject: dataTableResult,
            countPage: setupResult.count_page,
            countData: setupResult.count_data
        });
    }

    function setValueSetup({
        widgetsData,
        dataObject,
        countPage,
        countData
    }) {
        dataWidgetObject = widgetsData;
        dataTableObject = dataObject;
        countDataPage = countPage;
        countDataRow = countData;
    }

    function setDisplayWidgetsData() {
        const widgetItem = Array.from(document.querySelectorAll(".dataWidgets"));
        const subTextWidgetItem = Array.from(document.querySelectorAll(".sub-text"));
        const {
            all_route,
            all_trip,
            count_trip_driver,
            count_trip_disabled
        } = dataWidgetObject;

        widgetItem[0].innerHTML = all_route;
        widgetItem[1].innerHTML = all_trip;
        widgetItem[2].innerHTML = count_trip_driver;
        widgetItem[3].innerHTML = count_trip_disabled;

        subTextWidgetItem[2].innerHTML = `(จากรอบเดินรถทั้งหมด ${all_trip} รอบ)`;
        subTextWidgetItem[3].innerHTML = `(จากรอบเดินรถทั้งหมด ${all_trip} รอบ)`;
    }

    function createHeaderTableData() {
        const dataTableF = document.querySelector("#tableDataTripList");

        const tableElm = document.createElement("table");
        tableElm.setAttribute("class", "table text-nowrap highlight_header_table");
        dataTableF.appendChild(tableElm);
        const theadElm = document.createElement("thead");
        tableElm.appendChild(theadElm);
        const trElm = document.createElement("tr");
        theadElm.appendChild(trElm);

        const thText = ["รหัสเส้นทาง", "ชื่อเส้นทางเดินรถ", "ประเภทเส้นทาง", "เวลาให้บริการ", "วันที่รอบให้บริการ (ล่าสุด)", "จำนวนรอบเดินรถ (ระบบ / ข้อมูล)", "รอบเดินรถที่ยกเลิก"];
        const thClass = "text-center";

        for (let i = 0; i < (thText.length + 1); i++) {
            const thElm = document.createElement("th");

            if (i > 0) {
                thElm.setAttribute("class", thClass);
                thElm.appendChild(document.createTextNode(thText[i - 1]));
            }

            trElm.appendChild(thElm);
        }

        const tbodyEml = document.createElement("tbody");
        tbodyEml.setAttribute("id", "dataTableTrip");
        tableElm.appendChild(tbodyEml);

    }

    function createTableData() {

        const tableDataF = document.querySelector("#dataTableTrip");
        let currentPage = parseInt(new URLSearchParams(window.location.search).get("page"));
        const dataTable = dataTableObject;
        let dataTableSorting = [];
        let dataCount = 0;

        if (Number.isNaN(currentPage)) {
            currentPage = 1;
        }

        if (countDataRow == 0 || currentPage > countDataPage) {
            const trElm = document.createElement("tr");
            const tdElm = document.createElement("td");
            trElm.setAttribute("class", "set_tr_not_found");
            tableDataF.appendChild(trElm);
            tdElm.setAttribute("colspan", "7");
            tdElm.setAttribute("class", "text-center text-danger pt-4");
            tdElm.innerHTML += "<b><i class='far fa-times-circle'></i> ยังไม่มีข้อมูลสำหรับแสดงผลในตารางนี้</b>";
            trElm.appendChild(tdElm);
        } else {
            let startIndex = 0;
            let stopIndex = 14;
            let dataLength = dataTable.length;

            if (dataLength < 15) {
                stopIndex = dataLength;
            } else if (dataLength >= 15) {
                stopIndex = 15;
            }

            if (currentPage > 1) {
                startIndex = ((currentPage - 1) * 15);

                if ((currentPage - 1) * 15 <= 15) {
                    stopIndex = dataLength;
                } else {
                    stopIndex = 15;
                }
            }

            setDisplayPaginate(countDataPage);
            dataTableSorting = dataTable;

            if (stopIndex == 0) {
                const trElm = document.createElement("tr");
                const tdElm = document.createElement("td");
                trElm.setAttribute("class", "set_tr_not_found");
                tableDataF.appendChild(trElm);
                tdElm.setAttribute("colspan", "7");
                tdElm.setAttribute("class", "text-center text-danger pt-4");
                tdElm.innerHTML += "<b><i class='far fa-times-circle'></i> ไม่พบข้อมูลจากการค้นหา</b>";
                trElm.appendChild(tdElm);
            } else {
                for (let i = startIndex; i < stopIndex; i++) {
                    const trElm = document.createElement("tr");
                    tableDataF.appendChild(trElm);
                    const keyObjectName = Object.keys(dataTableSorting[i]);

                    for (let j = 0; j < keyObjectName.length; j++) {
                        let tdElm = document.createElement("td");
                        const rawData = dataTableSorting[i];

                        if (keyObjectName[j] === "idRoute") {
                            tdElm.setAttribute("class", "text-center");
                            const buttonElm = document.createElement("button");
                            buttonElm.setAttribute("type", "button");
                            if (rawData.dateLast == "" ||rawData.dateLast == null) {
                                buttonElm.setAttribute("class", "btn btn-outline-success btn-xs");
                                buttonElm.setAttribute("onclick", `addPageLink("${rawData.idRoute}")`);
                                buttonElm.innerHTML += "<i class='far fa-calendar-plus'></i> เพิ่มรอบเดินรถ";
                            } else {
                                buttonElm.setAttribute("class", "btn btn-outline-primary btn-xs");
                                buttonElm.setAttribute("onclick", `profilePageLink("${rawData.idRoute}")`);
                                buttonElm.innerHTML += "<i class='fas fa-search'></i> แสดงรอบเดินรถ";
                            }
                            
                            tdElm.appendChild(buttonElm);
                            trElm.appendChild(tdElm);
                        }

                        if (keyObjectName[j] === "idRoute") {
                            trElm.appendChild(tdElm);
                            tdElm = document.createElement("td");
                            tdElm.setAttribute("class", "text-center");
                            tdElm.appendChild(document.createTextNode(rawData.idRoute));
                        } else if (keyObjectName[j] === "nameStart") {
                            const nameData = `${rawData.nameStart} - ${rawData.nameEnd}`;
                            tdElm.setAttribute("class", "text-center");
                            tdElm.appendChild(document.createTextNode(nameData));
                            j += 1;
                        } else if (keyObjectName[j] === "serviceType") {
                            const typeData = rawData.serviceType;

                            tdElm.setAttribute("class", "text-center");

                            if (typeData == 1) {
                                tdElm.innerHTML = '<i class="fas fa-exchange-alt"></i>';
                            }
                        } else if (keyObjectName[j] === "serviceStartTime") {
                            const timeData = `${rawData.serviceStartTime} น. - ${rawData.serviceEndTime} น.`;
                            tdElm.setAttribute("class", "text-center");
                            tdElm.appendChild(document.createTextNode(timeData));
                            j += 1;
                        } else if (keyObjectName[j] === "dateLast") {
                            if (rawData.dateLast == "" || rawData.dateLast == null) {
                                tdElm.setAttribute("class", "text-center");
                                tdElm.appendChild(document.createTextNode("--/--/----"));
                            } else {
                                const dateData = `${rawData.dateLast.substr(8,2)}/${rawData.dateLast.substr(5,2)}/${rawData.dateLast.substr(0,4)}`;
                                tdElm.setAttribute("class", "text-center");
                                tdElm.appendChild(document.createTextNode(dateData));
                            }
                        } else if (keyObjectName[j] === "trip_unable") {
                            if (rawData.trip_unable == "" || rawData.trip_unable == null) {
                                const tripData = `-- / ${rawData.countRound} รอบ`;
                                tdElm.setAttribute("class", "text-center");
                                tdElm.appendChild(document.createTextNode(tripData));
                            } else {
                                let tripData;

                                if (rawData.serviceType == 1 ) {
                                    tripData = `${rawData.trip_unable} / ${rawData.countRound * 2} (${rawData.countRound}) รอบ`;
                                } else {
                                    tripData = `${rawData.trip_unable} / ${rawData.countRound} รอบ`;
                                }

                                tdElm.setAttribute("class", "text-center");
                                tdElm.appendChild(document.createTextNode(tripData));
                            }
                        } else if (keyObjectName[j] === "trip_disabled") {
                            if (rawData.trip_disabled == "" || rawData.trip_disabled == null) {
                                tdElm.setAttribute("class", "text-center");
                                tdElm.appendChild(document.createTextNode(`-- รอบ`));
                            } else {
                                tdElm.setAttribute("class", "text-center");
                                tdElm.appendChild(document.createTextNode(`${rawData.trip_disabled} รอบ`));
                            }
                            
                            j += 1;
                        }

                        trElm.appendChild(tdElm);
                    }
                }
            }

            setDisplayCountDataRow(dataTableSorting.length, (startIndex + 1), (stopIndex), false);
        }
    }

    function setDisplayCountDataRow(count, startP, stopP, searchCondition) {
        let currentPage = parseInt(new URLSearchParams(window.location.search).get("page"));

        if (Number.isNaN(currentPage)) {
            currentPage = 1;
        }

        if (currentPage <= countDataPage) {
            const displayElm = document.querySelector("#displayDataRow");
            const textF = document.createElement("small");
            let textData = "";
            textF.setAttribute("class", "text-center");
            if (count == 0) {
                textData = "";
            } else if (count <= 15) {
                if (searchCondition == false) {
                    textData = `แสดงข้อมูล ${count} รายการ จากทั้งหมด`;
                }
            } else if (startP != null && stopP != null) {
                if (startP != stopP) {
                    if (searchCondition == false) {
                        textData = `แสดงข้อมูล ${(stopP - startP) + 1} รายการ (${startP}-${stopP}) จากข้อมูลทั้งหมด ${count} รายการ ในหน้านี้`;
                    }
                } else {
                    if (searchCondition == false) {
                        textData = `แสดงข้อมูล ${(stopP - startP) + 1} รายการ จากข้อมูลทั้งหมด ${count} รายการ ในหน้านี้`;
                    }
                }

            }
            textF.appendChild(document.createTextNode(textData));
            displayElm.appendChild(textF);
        }
    }

    function setDisplayPaginate(allPageCount) {
        let currentPage = parseInt(new URLSearchParams(window.location.search).get("page"));
        const displayElm = document.querySelector("#displayPaginateBar");

        if (Number.isNaN(currentPage)) {
            currentPage = 1;
        }

        if (currentPage <= allPageCount) {
            const dataDetailPrevious = ["paginate_button page-item previous", "page-link text-truncate", "ก่อนหน้า"];
            const dataDetailNext = ["paginate_button page-item next", "page-link text-truncate", "ถัดไป"];
            const dataDetailPaginate = ["paginate_button page-item", "page-link"];

            if (allPageCount > 1) {
                let startIndex = 1;
                let renderPageCount = allPageCount <= 4 ? allPageCount : 4;
                let limitRenderPageCount = allPageCount > 4 ? allPageCount - 3 : allPageCount;
                const ulElm = document.querySelector("ul");
                ulElm.setAttribute("class", "pagination pagination-sm m-0 float-right using-custom-font");
                displayElm.appendChild(ulElm);

                if (currentPage >= 3) {
                    startIndex = (currentPage - 1);
                    renderPageCount = (currentPage + 2);
                }

                if (startIndex >= limitRenderPageCount) {
                    startIndex = limitRenderPageCount;
                }

                if (renderPageCount >= allPageCount) {
                    renderPageCount = allPageCount;
                }

                for (let i = startIndex; i <= (renderPageCount + 2); i++) {
                    const liElm = document.createElement("li");
                    const aElm = document.createElement('a');

                    if (i == startIndex) {
                        liElm.setAttribute("class", dataDetailPrevious[0]);
                        aElm.setAttribute("class", dataDetailPrevious[1]);
                        aElm.appendChild(document.createTextNode(dataDetailPrevious[2]));

                        if (currentPage == startIndex) {
                            liElm.classList.add("disabled");
                        } else {
                            aElm.setAttribute("href", setURLParam("page", (currentPage - 1)));
                        }
                    } else if (i == (renderPageCount + 2)) {
                        liElm.setAttribute("class", dataDetailNext[0]);
                        aElm.setAttribute("class", dataDetailNext[1]);
                        aElm.appendChild(document.createTextNode(dataDetailNext[2]));

                        if (currentPage == allPageCount) {
                            liElm.classList.add("disabled");
                        } else {
                            aElm.setAttribute("href", setURLParam("page", (currentPage + 1)));
                        }
                    } else {
                        liElm.setAttribute("class", dataDetailPaginate[0]);
                        aElm.setAttribute("class", dataDetailPaginate[1]);
                        aElm.appendChild(document.createTextNode(i - 1));

                        if (currentPage == (i - 1)) {
                            liElm.classList.add("active");
                        } else {
                            aElm.setAttribute("href", setURLParam("page", (i - 1)));
                        }
                    }

                    liElm.appendChild(aElm);
                    ulElm.appendChild(liElm);
                }

                const liElmDelete = document.querySelector("#displayPaginateBar > ul > li.nav-item");
                liElmDelete.remove();
            }
        }
    }

    async function onRunScript() {
        await getAPIData();
        await setDisplayWidgetsData();
        createHeaderTableData();
        await createTableData();
    }

    onRunScript();

})();

function setURLParam(tag_1, value_1, tag_2, value_2, firstPageCondition) {
    let url = new URL(window.location.href);
    let params = url.searchParams;

    params.set(tag_1, value_1);
    if (tag_2 != null) {
        params.set(tag_2, value_2);
    }

    if (firstPageCondition == true) {
        params.delete("page");
    }

    url.search = params.toString();

    return url.toString();
}

function deleteURLParam(tag_1, tag_2) {
    let url = new URL(window.location.href);
    let params = url.searchParams;

    params.delete(tag_1);
    if (tag_2 != null) {
        params.delete(tag_2);
    }
    url.search = params.toString();

    return url.toString();
}

function profilePageLink(id) {
    window.location.href = `./profile_trip_management.php?idRoute=${id}`;
}

function addPageLink(id) {
    window.location.href = `./add_trip_management.php?idRoute=${id}`;
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}