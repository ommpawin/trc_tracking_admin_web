const labelSearchInputElm = document.querySelector("#inputSearchTableServiceRoute");
const labelFilterInputElm = document.querySelector("#inputFilterTableServiceRoute");
let dataWidgetObject = [];
let dataTableObject = [];
let dataSearchTableObject = [];
let dataSearchTableCount = 0;
let dataSearchPageCount = 0;
let countDataPage = 0;
let countDataRow = 0;

(() => {

    async function getAPIData() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => { return value.json(); });
        const urlAPI = await settingFile.urlAPIServer;
        const authorizationKey = new Headers();

        authorizationKey.append("Authorization", getCookie("keyAccount"));

        const data = new Promise((resolve, reject) => {
                fetch(`${urlAPI}/route_management`, {
                    method: 'GET',
                    headers: authorizationKey
                })
                .then((response) => {
                    if(response.status == 226) {
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
            count_route_drivers,
            online_route,
            investigate_route,
            offline_route
        } = dataWidgetObject;

        widgetItem[0].innerHTML = all_route;
        widgetItem[1].innerHTML = count_route_drivers;
        widgetItem[2].innerHTML = online_route;
        widgetItem[3].innerHTML = `${investigate_route} / ${offline_route}`;

        subTextWidgetItem[2].innerHTML = `(จากสถานะ ${all_route} เส้นทางเดินรถทั้งหมด)`;
        subTextWidgetItem[3].innerHTML = `(จากสถานะ ${all_route} เส้นทางเดินรถทั้งหมด)`;
    }

    function setSearchDataContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchButElm = document.querySelector("#searchButton");
        const searchTypeElm = Array.from(document.querySelectorAll("#searchTableServiceRoute > option"));
        const clearDataButElm = document.createElement("button");
        const modelFooter = document.querySelector("#modelSearchFooter");
        const searchTag = urlParams.get("searchTag");
        const searchValue = urlParams.get("searchValue");

        if (searchTag != null && searchValue != null) {
            if (searchTag != null) {
                searchButElm.classList.remove("btn-outline-secondary");
                searchButElm.classList.add("btn-secondary");
            }

            searchTypeElm.forEach((v, i) => {
                if (searchTypeElm[i].value == searchTag) {
                    searchTypeElm[i].selected = true;
                }
            });

            searchTablePickInput(`${searchTag}`);
            if (searchTag == "idRoute" ||
                searchTag == "nameRoute" ||
                searchTag == "keywordRoute" ||
                searchTag == "nameColor_1" ||
                searchTag == "nameColor_2" ||
                searchTag == "pricePassengerBetween" ||
                searchTag == "priceSuppliesBetween" ||
                searchTag == "serviceTimeBetween" ||
                searchTag == "serviceTimeRound" ||
                searchTag == "serviceCountRound" ||
                searchTag == "serviceTimeAverage"
            ) {
                const inputData = document.querySelector("input[name='InputSearchTableServiceRoute']");

                inputData.value = searchValue;
            } else if (searchTag == "hexColor_1" || searchTag == "hexColor_2") {
                const inputData = document.querySelector("input[name='InputSearchTableServiceRoute']");
                const colorPreview = document.querySelector("input[name='HexColorPreview']");

                inputData.value = searchValue;
                colorPreview.value = searchValue;
            } else if (searchTag == "pricePassenger" || searchTag == "priceSupplies") {
                const inputData = Array.from(document.querySelectorAll("input[name='InputSearchTableServiceRoute']"));
                const searchData = searchValue.split("-");
                const priceLower = searchData[0];
                const priceHigher = searchData[1];

                if (priceHigher < priceLower && priceLower != "**" && priceHigher != "**" || priceLower > priceHigher && priceLower != "**" && priceHigher != "**" || priceLower == priceHigher && priceLower != "**" && priceHigher != "**") {
                    searchClearData();
                } else {
                    if (searchData[0] != "**") {
                        inputData[0].value = priceLower;
                    }

                    if (searchData[1] != "**") {
                        inputData[1].value = priceHigher;
                    }
                }
            } else if (searchTag == "serviceTime") {
                const inputData = Array.from(document.querySelectorAll("input[name='InputSearchTableServiceRoute']"));
                const searchData = searchValue.split("-");
                const timeStart = searchData[0];
                const timeEnd = searchData[1];

                if (timeEnd < timeStart && timeStart != "**" && timeEnd != "**" || timeStart > timeEnd && timeStart != "**" && timeEnd != "**" || timeStart == timeEnd && timeStart != "**" && timeEnd != "**") {
                    searchClearData();
                } else {
                    if (searchData[0] != "**") {
                        inputData[0].value = timeStart;
                    }

                    if (searchData[1] != "**") {
                        inputData[1].value = timeEnd;
                    }
                }
            } else if (searchTag == "routeStatus") {
                const inputData = Array.from(document.querySelectorAll("select[name='InputSearchTableServiceRoute'] > option"));

                inputData.forEach((v, i) => {
                    if (inputData[i].value == searchValue) {
                        inputData[i].selected = true;
                    }
                });
            }

            clearDataButElm.setAttribute("type", "button");
            clearDataButElm.setAttribute("class", "btn btn-outline-danger mr-auto using-custom-font");
            clearDataButElm.setAttribute("onclick", "searchClearData()");
            clearDataButElm.innerHTML = "<i class='fas fa-window-close'></i> ล้างค่า";
            modelFooter.insertBefore(clearDataButElm, modelFooter.childNodes[0]);
        }
    }

    function setFilterDataContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterButElm = document.querySelector("#filterButton");
        const filterTypeElm = Array.from(document.querySelectorAll("#filterTableServiceRoute > option"));
        const clearDataButElm = document.createElement("button");
        const modelFooter = document.querySelector("#modelFilterFooter");
        const filterTag = urlParams.get("filterTag");
        const filterValue = urlParams.get("filterValue");

        if (filterTag != null && filterValue != null) {
            if (filterTag != null) {
                filterButElm.classList.remove("btn-outline-secondary");
                filterButElm.classList.add("btn-secondary");
            }

            filterTypeElm.forEach((v, i) => {
                if (filterTypeElm[i].value == filterTag) {
                    filterTypeElm[i].selected = true;
                }
            });

            filterTablePickInput(`${filterTag}`);
            const filterInputElm = Array.from(document.querySelectorAll('#inputFilterTable > option'));

            filterInputElm.forEach((v, i) => {
                if (filterInputElm[i].value == filterValue) {
                    filterInputElm[i].selected = true;
                }
            });

            clearDataButElm.setAttribute("type", "button");
            clearDataButElm.setAttribute("class", "btn btn-outline-danger mr-auto using-custom-font");
            clearDataButElm.setAttribute("onclick", "filterClearData()");
            clearDataButElm.innerHTML = "<i class='fas fa-window-close'></i> ล้างค่า";
            modelFooter.insertBefore(clearDataButElm, modelFooter.childNodes[0]);
        }
    }

    function createHeaderTableData() {
        const dataTableF = document.querySelector("#tableDataServiceRouteList");

        const tableElm = document.createElement("table");
        tableElm.setAttribute("class", "table text-nowrap highlight_header_table");
        dataTableF.appendChild(tableElm);
        const theadElm = document.createElement("thead");
        tableElm.appendChild(theadElm);
        const trElm = document.createElement("tr");
        theadElm.appendChild(trElm);

        const thText = ["รหัสเส้นทาง", "ชื่อเส้นทางเดินรถ", "สีประเส้นทาง", "ค่าบริการโดยสาร", "ค่าบริการส่งพัสดุ", "เวลาให้บริการ", "เวลาออกรอบ", "จำนวนรอบ", "เวลาเฉลี่ยให้บริการ", "สถานะเส้นทาง"];
        const thClass = "text-center font-weight-normal";

        for (let i = 0; i < (thText.length + 1); i++) {
            const thElm = document.createElement("th");

            if (i > 0) {
                if (i > 9) {
                    thElm.setAttribute("class", thClass);
                    thElm.appendChild(document.createTextNode(thText[i - 1]));
                } else {
                    if (i == 1 || i == 2 || i == 3) {
                        thElm.setAttribute("class", "text-center");
                    }
                    thElm.appendChild(document.createTextNode(thText[i - 1]));
                }
            }

            trElm.appendChild(thElm);
        }

        const tbodyEml = document.createElement("tbody");
        tbodyEml.setAttribute("id", "dataTableServiceRoute");
        tableElm.appendChild(tbodyEml);

    }

    function createTableData() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTag = urlParams.get("searchTag");
        const searchValue = urlParams.get("searchValue");
        const filterTag = urlParams.get("filterTag");
        const filterValue = urlParams.get("filterValue");

        const tableDataF = document.querySelector("#dataTableServiceRoute");
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
            tdElm.setAttribute("colspan", "11");
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

            if (searchTag != null) {
                let searchResult = [];

                dataTable.forEach((v, i) => {
                    const dataObj = dataTable[i];

                    if (searchTag == "idRoute" || searchTag == "serviceTimeRound" || searchTag == "serviceCountRound" || searchTag == "serviceTimeAverage") {
                        let rawValue;

                        if (searchTag == "idRoute") {
                            rawValue = dataObj.idRoute;
                        } else if (searchTag == "serviceTimeRound") {
                            rawValue = dataObj.serviceTimeRound;
                        } else if (searchTag == "serviceCountRound") {
                            rawValue = dataObj.serviceCountRound;
                        } else if (searchTag == "serviceTimeAverage") {
                            rawValue = dataObj.serviceTimeAverage;
                        }

                        if (rawValue == searchValue) {
                            searchResult.push(dataObj);
                        }
                    } else if (searchTag == "nameRoute" || searchTag == "keywordRoute" || searchTag == "nameColor_1" || searchTag == "nameColor_2" || searchTag == "hexColor_1" || searchTag == "hexColor_2") {
                        let rawValue;

                        if (searchTag == "nameRoute") {
                            rawValue = `${dataObj.nameStart} ${dataObj.nameEnd}`;
                        } else if (searchTag == "keywordRoute") {
                            rawValue = `${dataObj.keywordRoute}`;
                        } else if (searchTag == "nameColor_1") {
                            rawValue = `${dataObj.nameColor_1}`;
                        } else if (searchTag == "nameColor_2") {
                            rawValue = `${dataObj.nameColor_2}`;
                        } else if (searchTag == "hexColor_1") {
                            rawValue = `${dataObj.hexColor_1}`;
                        } else if (searchTag == "hexColor_2") {
                            rawValue = `${dataObj.hexColor_2}`;
                        }

                        if (rawValue.includes(searchValue)) {
                            searchResult.push(dataObj);
                        }
                    } else if (searchTag == "pricePassenger" || searchTag == "priceSupplies") {
                        const price = searchValue.split("-");

                        if (price[0] != "**" && price[1] == "**") {
                            if (searchTag == "pricePassenger") {
                                if (dataObj.pricePassengerLower == price[0]) {
                                    searchResult.push(dataObj);
                                }
                            } else if (searchTag == "priceSupplies") {
                                if (dataObj.priceSuppliesLower == price[0]) {
                                    searchResult.push(dataObj);
                                }
                            }
                        } else if (price[0] == "**" && price[1] != "**") {
                            if (searchTag == "pricePassenger") {
                                if (dataObj.pricePassengerHigher == price[1]) {
                                    searchResult.push(dataObj);
                                }
                            } else if (searchTag == "priceSupplies") {
                                if (dataObj.priceSuppliesHigher == price[1]) {
                                    searchResult.push(dataObj);
                                }
                            }
                        } else {
                            if (searchTag == "pricePassenger") {
                                if (dataObj.pricePassengerLower == price[0] && dataObj.pricePassengerHigher == price[1]) {
                                    searchResult.push(dataObj);
                                }
                            } else if (searchTag == "priceSupplies") {
                                if (dataObj.priceSuppliesLower == price[0] && dataObj.priceSuppliesHigher == price[1]) {
                                    searchResult.push(dataObj);
                                }
                            }
                        }
                    } else if (searchTag == "pricePassengerBetween" || searchTag == "priceSuppliesBetween") {
                        if (searchTag == "pricePassengerBetween") {
                            if (searchValue >= dataObj.pricePassengerLower && searchValue <= dataObj.pricePassengerHigher) {
                                searchResult.push(dataObj);
                            }
                        } else if (searchTag == "priceSuppliesBetween") {
                            if (searchValue >= dataObj.priceSuppliesLower && searchValue <= dataObj.priceSuppliesHigher) {
                                searchResult.push(dataObj);
                            }
                        }
                    } else if (searchTag == "serviceTime") {
                        const time = searchValue.split("-");

                        if (time[0] != "**" && time[1] == "**") {
                            if (dataObj.serviceStartTime == time[0]) {
                                searchResult.push(dataObj);
                            }
                        } else if (time[0] == "**" && time[1]) {
                            if (dataObj.serviceEndTime == time[1]) {
                                searchResult.push(dataObj);
                            }
                        } else {
                            if (dataObj.serviceStartTime == time[0] && dataObj.serviceEndTime == time[1]) {
                                searchResult.push(dataObj);
                            }
                        }
                    } else if (searchTag == "serviceTimeBetween") {
                        if (searchValue >= dataObj.serviceStartTime && searchValue <= dataObj.serviceEndTime) {
                            searchResult.push(dataObj);
                        }
                    } else if (searchTag == "routeStatus") {
                        if (dataObj.routeStatus == searchValue) {
                            searchResult.push(dataObj);
                        }
                    }
                });

                dataTableSorting = searchResult;
                stopIndex = searchResult.length;
                setDisplayPaginate(Math.ceil(dataTableSorting.length / 15));
            } else {
                setDisplayPaginate(countDataPage);
            }

            if (filterTag != null) {
                if (searchTag == null) {
                    dataTableSorting = dataTable;
                }

                dataTableSorting.sort((a, b) => {
                    if (filterValue == 1) {
                        if (filterTag == "nameRoute") {
                            const aValue = `${a.nameStart}${a.nameEnd}`;
                            const bValue = `${b.nameStart}${b.nameEnd}`;

                            return aValue.localeCompare(bValue, 'th');
                        } else if (filterTag == "nameColor_1" || filterTag == "nameColor_2") {
                            let aValue, bValue;

                            if (filterTag == "nameColor_1") {
                                aValue = a.nameColor_1;
                                bValue = b.nameColor_1;
                            } else if (filterTag == "nameColor_2") {
                                aValue = a.nameColor_2;
                                bValue = b.nameColor_2;
                            } else if (filterTag == "serviceStartTime") {
                                aValue = a.serviceStartTime;
                                bValue = b.serviceStartTime;
                            }

                            return bValue.localeCompare(aValue, 'th');
                        } else if (filterTag == "idRoute" || filterTag == "pricePassengerLower" || filterTag == "pricePassengerHigher" || filterTag == "priceSuppliesLower" || filterTag == "priceSuppliesHigher" || filterTag == "serviceTimeRound" || filterTag == "serviceCountRound" || filterTag == "serviceTimeAverage" || filterTag == "countRouteDrivers") {
                            let aValue, bValue;

                            if (filterTag == "idRoute") {
                                aValue = a.idRoute;
                                bValue = b.idRoute;
                            } else if (filterTag == "pricePassengerLower") {
                                aValue = a.pricePassengerLower;
                                bValue = b.pricePassengerLower;
                            } else if (filterTag == "pricePassengerHigher") {
                                aValue = a.pricePassengerHigher;
                                bValue = b.pricePassengerHigher;
                            } else if (filterTag == "priceSuppliesLower") {
                                aValue = a.priceSuppliesLower;
                                bValue = b.priceSuppliesLower;
                            } else if (filterTag == "priceSuppliesHigher") {
                                aValue = a.priceSuppliesHigher;
                                bValue = b.priceSuppliesHigher;
                            } else if (filterTag == "serviceTimeRound") {
                                aValue = a.serviceTimeRound;
                                bValue = b.serviceTimeRound;
                            } else if (filterTag == "serviceCountRound") {
                                aValue = a.serviceCountRound;
                                bValue = b.serviceCountRound;
                            } else if (filterTag == "serviceTimeAverage") {
                                aValue = a.serviceTimeAverage;
                                bValue = b.serviceTimeAverage;
                            } else if (filterTag == "countRouteDrivers") {
                                aValue = a.countRouteDrivers;
                                bValue = b.countRouteDrivers;
                            }

                            return aValue - bValue;
                        } else if (filterTag == "serviceStartTime" || filterTag == "serviceEndTime" || filterTag == "routeStatus") {
                            let aValue, bValue;

                            if (filterTag == "serviceStartTime") {
                                aValue = a.serviceStartTime;
                                bValue = b.serviceStartTime;
                            } else if (filterTag == "serviceEndTime") {
                                aValue = a.serviceEndTime;
                                bValue = b.serviceEndTime;
                            } else if (filterTag == "routeStatus") {
                                aValue = a.routeStatus;
                                bValue = b.routeStatus;
                            }

                            return aValue.localeCompare(bValue, 'en');
                        }
                    } else if (filterValue == 2) {
                        if (filterTag == "nameRoute") {
                            const aValue = `${a.nameStart}${a.nameEnd}`;
                            const bValue = `${b.nameStart}${b.nameEnd}`;

                            return bValue.localeCompare(aValue, 'th');
                        } else if (filterTag == "nameColor_1" || filterTag == "nameColor_2") {
                            let aValue, bValue;

                            if (filterTag == "nameColor_1") {
                                aValue = a.nameColor_1;
                                bValue = b.nameColor_1;
                            } else if (filterTag == "nameColor_2") {
                                aValue = a.nameColor_2;
                                bValue = b.nameColor_2;
                            } else if (filterTag == "serviceStartTime") {
                                aValue = a.serviceStartTime;
                                bValue = b.serviceStartTime;
                            }

                            return aValue.localeCompare(bValue, 'th');
                        } else if (filterTag == "idRoute" || filterTag == "pricePassengerLower" || filterTag == "pricePassengerHigher" || filterTag == "priceSuppliesLower" || filterTag == "priceSuppliesHigher" || filterTag == "serviceTimeRound" || filterTag == "serviceCountRound" || filterTag == "serviceTimeAverage" || filterTag == "countRouteDrivers") {
                            let aValue, bValue;

                            if (filterTag == "idRoute") {
                                aValue = a.idRoute;
                                bValue = b.idRoute;
                            } else if (filterTag == "pricePassengerLower") {
                                aValue = a.pricePassengerLower;
                                bValue = b.pricePassengerLower;
                            } else if (filterTag == "pricePassengerHigher") {
                                aValue = a.pricePassengerHigher;
                                bValue = b.pricePassengerHigher;
                            } else if (filterTag == "priceSuppliesLower") {
                                aValue = a.priceSuppliesLower;
                                bValue = b.priceSuppliesLower;
                            } else if (filterTag == "priceSuppliesHigher") {
                                aValue = a.priceSuppliesHigher;
                                bValue = b.priceSuppliesHigher;
                            } else if (filterTag == "serviceTimeRound") {
                                aValue = a.serviceTimeRound;
                                bValue = b.serviceTimeRound;
                            } else if (filterTag == "serviceCountRound") {
                                aValue = a.serviceCountRound;
                                bValue = b.serviceCountRound;
                            } else if (filterTag == "serviceTimeAverage") {
                                aValue = a.serviceTimeAverage;
                                bValue = b.serviceTimeAverage;
                            } else if (filterTag == "countRouteDrivers") {
                                aValue = a.countRouteDrivers;
                                bValue = b.countRouteDrivers;
                            }

                            return bValue - aValue;
                        } else if (filterTag == "serviceStartTime" || filterTag == "serviceEndTime" || filterTag == "routeStatus") {
                            let aValue, bValue;

                            if (filterTag == "serviceStartTime") {
                                aValue = a.serviceStartTime;
                                bValue = b.serviceStartTime;
                            } else if (filterTag == "serviceEndTime") {
                                aValue = a.serviceEndTime;
                                bValue = b.serviceEndTime;
                            } else if (filterTag == "routeStatus") {
                                aValue = a.routeStatus;
                                bValue = b.routeStatus;
                            }

                            return bValue.localeCompare(aValue, 'en');
                        }
                    }
                });
            } else if (searchTag == null && filterTag == null) {
                dataTableSorting = dataTable;
            }

            if (stopIndex == 0) {
                const trElm = document.createElement("tr");
                const tdElm = document.createElement("td");
                trElm.setAttribute("class", "set_tr_not_found");
                tableDataF.appendChild(trElm);
                tdElm.setAttribute("colspan", "11");
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
                            buttonElm.setAttribute("class", "btn btn-outline-primary btn-xs");
                            buttonElm.setAttribute("onclick", `profilePageLink("${rawData.idRoute}")`);
                            buttonElm.innerHTML += "<i class='fas fa-search'></i> แสดงข้อมูลนี้";
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
                            tdElm.appendChild(document.createTextNode(nameData));
                            j += 2;
                        } else if (keyObjectName[j] === "nameColor_1") {
                            const {
                                nameColor_1,
                                hexColor_1,
                                nameColor_2,
                                hexColor_2
                            } = rawData;
                            if (nameColor_2 == "" && hexColor_2 == "") {
                                tdElm.innerHTML = `${nameColor_1} (<span style="background-color: ${hexColor_1};">${hexColor_1}</span>)`;
                            } else {
                                tdElm.innerHTML = `${nameColor_1} (<span style="background-color: ${hexColor_1};">${hexColor_1}</span>), ${nameColor_2} (<span style="background-color: ${hexColor_2};">${hexColor_2}</span>)`;
                            }
                            j += 3;
                        } else if (keyObjectName[j] === "pricePassengerLower") {
                            const priceData = `${rawData.pricePassengerLower.toFixed(2)} บ. - ${rawData.pricePassengerHigher.toFixed(2)} บ.`;
                            tdElm.appendChild(document.createTextNode(priceData));
                            j += 1;
                        } else if (keyObjectName[j] === "priceSuppliesLower") {
                            const priceData = `${rawData.priceSuppliesLower.toFixed(2)} บ. - ${rawData.priceSuppliesHigher.toFixed(2)} บ.`;
                            tdElm.appendChild(document.createTextNode(priceData));
                            j += 1;
                        } else if (keyObjectName[j] === "serviceStartTime") {
                            const timeData = `${rawData.serviceStartTime}น. - ${rawData.serviceEndTime}น.`;
                            tdElm.appendChild(document.createTextNode(timeData));
                            j += 1;
                        } else if (keyObjectName[j] === "serviceTimeRound") {
                            const data = `${rawData.serviceTimeRound} น.`;
                            tdElm.setAttribute("class", "text-center");
                            tdElm.appendChild(document.createTextNode(data));
                        } else if (keyObjectName[j] === "serviceCountRound") {
                            const data = `${rawData.serviceCountRound} รอบ`;
                            tdElm.setAttribute("class", "text-center");
                            tdElm.appendChild(document.createTextNode(data));
                        } else if (keyObjectName[j] === "serviceTimeAverage") {
                            const data = `${rawData.serviceTimeAverage} น.`;
                            tdElm.setAttribute("class", "text-center");
                            tdElm.appendChild(document.createTextNode(data));
                        } else if (keyObjectName[j] === "routeStatus") {
                            tdElm.setAttribute("class", "text-center");
                            const statusData = rawData.routeStatus;
                            const spanElm = document.createElement("span");

                            if (statusData === "online") {
                                spanElm.setAttribute("class", "badge custom-badge-online p-1");
                                spanElm.innerHTML += "ให้บริการ";
                            } else if (statusData === "investigate") {
                                spanElm.setAttribute("class", "badge custom-badge-investigate p-1");
                                spanElm.innerHTML += "ระงับการให้บริการชั่วคราว";
                            } else if (statusData === "offline") {
                                spanElm.setAttribute("class", "badge custom-badge-offline p-1");
                                spanElm.innerHTML += "ยกเลิกการให้บริการ";
                            }
                            tdElm.appendChild(spanElm);
                            j += 1;
                        }

                        trElm.appendChild(tdElm);
                    }
                }
            }

            setDisplayCountDataRow(dataTableSorting.length, (startIndex + 1), (stopIndex), searchTag == null ? false : true);
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
                } else {
                    textData = `แสดงข้อมูล ${count} รายการ จากการค้นหารายการ`;
                }
            } else if (startP != null && stopP != null) {
                if (startP != stopP) {
                    if (searchCondition == false) {
                        textData = `แสดงข้อมูล ${(stopP - startP) + 1} รายการ (${startP}-${stopP}) จากข้อมูลทั้งหมด ${count} รายการ ในหน้านี้`;
                    } else {
                        textData = `แสดงข้อมูล ${(stopP - startP) + 1} รายการ (${startP}-${stopP}) จากการค้นหารายการ ในหน้านี้`;
                    }
                } else {
                    if (searchCondition == false) {
                        textData = `แสดงข้อมูล ${(stopP - startP) + 1} รายการ จากข้อมูลทั้งหมด ${count} รายการ ในหน้านี้`;
                    } else {
                        textData = `แสดงข้อมูล ${(stopP - startP) + 1} รายการ จากการค้นหารายการ ในหน้านี้`;
                    }
                }

            }
            textF.appendChild(document.createTextNode(textData));
            displayElm.appendChild(textF);
        }
    }

    function setDisplayPaginate(allPageCount) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTag = urlParams.get("searchTag");
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
        setSearchDataContent();
        setFilterDataContent();
        createHeaderTableData();
        await setDisplayWidgetsData();
        await createTableData();
    }

    onRunScript();

    $(document).keypress(
        function (event) {
            if (event.which == '13') {
                event.preventDefault();
            }
        });

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

function setStaticText(element, text) {
    if (element.value == "" || element.value == "สี") {
        element.value = text;
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

function clearStaticText(element, previewElement) {
    if (element.value == "" || element.value == "สี") {
        element.value = "";
    } else if (element.value == "#") {
        document.querySelector(`input[name='${previewElement}']`).value = "#000000";
        element.value = "";
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

function searchTablePickInput(value) {
    const idElm = "inputSearchTable";
    const childElm = document.querySelector(`#${idElm}`);
    const searchInputDangerText = document.querySelector("#inputSearchTableServiceRoute > small");
    searchInputDangerText.innerHTML = "";
    labelSearchInputElm.removeChild(childElm);

    if (value === "idRoute" || value === "nameRoute" || value === "keywordRoute") {
        const inputT = document.createElement("input");
        inputT.setAttribute("type", "text");
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");


        if (value === "idRoute") {
            inputT.setAttribute("oninput", "detectInteger(this)");
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก รหัสเส้นทาง");
        } else if (value === "nameRoute") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก ชื่อเส้นทาง");
        } else if (value === "keywordRoute") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก รายละเอียด / ข้อมูลประจำเส้นทาง");
        }

        labelSearchInputElm.appendChild(inputT);
    } else if (value === "nameColor_1" || value === "nameColor_2") {
        const inputT = document.createElement("input");
        inputT.setAttribute("type", "text");
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
        inputT.setAttribute("onfocus", "setStaticText(this, 'สี')");
        inputT.setAttribute("oninput", "setNameColor(this)");
        inputT.setAttribute("onfocusout", "clearStaticText(this)");

        if (value === "nameColor_1") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก ชื่อสีที่ 1");
        } else if (value === "nameColor_2") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก ชื่อสีที่ 2");
        }

        labelSearchInputElm.appendChild(inputT);
    } else if (value === "hexColor_1" || value === "hexColor_2") {
        const divGroup = document.createElement("div");
        const inputT = document.createElement("input");
        const inputC = document.createElement("input");
        divGroup.setAttribute("id", idElm);
        divGroup.setAttribute("class", "input-group");
        inputT.setAttribute("type", "text");
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("class", "form-control using-custom-font");
        inputT.setAttribute("maxlength", 7);
        inputT.setAttribute("onfocus", "setStaticText(this, '#')");
        inputT.setAttribute("oninput", "setHexColor(this, 'HexColorPreview')");
        inputT.setAttribute("onfocusout", "clearStaticText(this, 'HexColorPreview')");
        inputC.setAttribute("type", "color");
        inputC.setAttribute("name", "HexColorPreview");
        inputC.setAttribute("class", "col-sm-1 col-2 form-control show-color-picker");
        inputC.setAttribute("oninput", "setInputHexColor(this.value, 'InputSearchTableServiceRoute')");

        if (value === "hexColor_1") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก รหัสสี (Hex Color) ที่ 1");
        } else if (value === "hexColor_2") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก รหัสสี (Hex Color) ที่ 2");
        }

        divGroup.append(inputT);
        divGroup.append(inputC);
        labelSearchInputElm.appendChild(divGroup);
    } else if (value === "pricePassenger" || value === "priceSupplies") {
        const divGroup = document.createElement("div");
        const inputG_1 = document.createElement("div");
        const inputG_2 = document.createElement("div");
        const innerG_1 = document.createElement("div");
        const innerG_2 = document.createElement("div");
        const spanT_1 = document.createElement("span");
        const spanT_2 = document.createElement("span");
        const inputT_1 = document.createElement("input");
        const inputT_2 = document.createElement("input");
        const h5Elm = document.createElement("h5");
        divGroup.setAttribute("id", idElm);
        divGroup.setAttribute("class", "row");

        h5Elm.setAttribute("class", "using-custom-font p-1 m-0");
        h5Elm.appendChild(document.createTextNode("-"));

        inputG_1.setAttribute("class", "input-group col");
        inputT_1.setAttribute("type", "text");
        inputT_1.setAttribute("name", "InputSearchTableServiceRoute");
        inputT_1.setAttribute("class", "form-control using-custom-font");
        inputT_1.setAttribute("oninput", "detectDecimal(this)");
        inputT_1.setAttribute("onfocusout", "setDecimal(this, 2)");
        inputT_1.setAttribute("placeholder", "ค่าบริการต่ำสุด");
        innerG_1.setAttribute("class", "input-group-append");
        spanT_1.setAttribute("class", "input-group-text using-custom-font");
        spanT_1.appendChild(document.createTextNode("บ."));
        inputG_2.setAttribute("class", "input-group col");
        inputT_2.setAttribute("type", "text");
        inputT_2.setAttribute("name", "InputSearchTableServiceRoute");
        inputT_2.setAttribute("class", "form-control using-custom-font");
        inputT_2.setAttribute("oninput", "detectDecimal(this)");
        inputT_2.setAttribute("onfocusout", "setDecimal(this, 2)");
        inputT_2.setAttribute("placeholder", "ค่าบริการสูงสุด");
        innerG_2.setAttribute("class", "input-group-append");
        spanT_2.setAttribute("class", "input-group-text using-custom-font");
        spanT_2.appendChild(document.createTextNode("บ."));

        innerG_1.appendChild(spanT_1);
        inputG_1.appendChild(inputT_1);
        inputG_1.appendChild(innerG_1);
        divGroup.appendChild(inputG_1);
        divGroup.appendChild(h5Elm);
        innerG_2.appendChild(spanT_2);
        inputG_2.appendChild(inputT_2);
        inputG_2.appendChild(innerG_2);
        divGroup.appendChild(inputG_2);
        labelSearchInputElm.appendChild(divGroup);
    } else if (value === "pricePassengerBetween" || value === "priceSuppliesBetween") {
        const divGroup = document.createElement("div");
        const innerG = document.createElement("div");
        const spanT = document.createElement("span");
        const inputT = document.createElement("input");

        divGroup.setAttribute("id", idElm);
        divGroup.setAttribute("class", "input-group");
        inputT.setAttribute("type", "text");
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("class", "form-control using-custom-font");
        inputT.setAttribute("oninput", "detectDecimal(this)");
        inputT.setAttribute("onfocusout", "setDecimal(this, 2)");
        innerG.setAttribute("class", "input-group-append");
        spanT.setAttribute("class", "input-group-text using-custom-font");
        spanT.appendChild(document.createTextNode("บ."));

        if (value === "pricePassengerBetween") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก ค่าบริการโดยสารระหว่างต่ำสุดและสูงสุด");
        } else if (value === "priceSuppliesBetween") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก ค่าบริการส่งพัสดุระหว่างต่ำสุดและสูงสุด");
        }

        innerG.appendChild(spanT);
        divGroup.appendChild(inputT);
        divGroup.appendChild(innerG);
        labelSearchInputElm.appendChild(divGroup);
    } else if (value === "serviceTime") {
        const divGroup = document.createElement("div");
        const inputG_1 = document.createElement("div");
        const inputG_2 = document.createElement("div");
        const innerG_1 = document.createElement("div");
        const innerG_2 = document.createElement("div");
        const spanT_1 = document.createElement("span");
        const spanT_2 = document.createElement("span");
        const inputT_1 = document.createElement("input");
        const inputT_2 = document.createElement("input");
        const h5Elm = document.createElement("h5");
        divGroup.setAttribute("id", idElm);
        divGroup.setAttribute("class", "row");

        h5Elm.setAttribute("class", "using-custom-font p-1 m-0");
        h5Elm.appendChild(document.createTextNode("-"));

        inputG_1.setAttribute("class", "input-group col");
        inputT_1.setAttribute("type", "time");
        inputT_1.setAttribute("name", "InputSearchTableServiceRoute");
        inputT_1.setAttribute("class", "form-control using-custom-font");
        inputT_1.setAttribute("placeholder", "ค่าบริการต่ำสุด");
        innerG_1.setAttribute("class", "input-group-append");
        spanT_1.setAttribute("class", "input-group-text using-custom-font");
        spanT_1.innerHTML = "<span class='d-sm-block d-none'>นาฬิกา</span><span class='d-sm-none d-block'>น.</span>";
        inputG_2.setAttribute("class", "input-group col");
        inputT_2.setAttribute("type", "time");
        inputT_2.setAttribute("name", "InputSearchTableServiceRoute");
        inputT_2.setAttribute("class", "form-control using-custom-font");
        inputT_2.setAttribute("placeholder", "ค่าบริการสูงสุด");
        innerG_2.setAttribute("class", "input-group-append");
        spanT_2.setAttribute("class", "input-group-text using-custom-font");
        spanT_2.innerHTML = "<span class='d-sm-block d-none'>นาฬิกา</span><span class='d-sm-none d-block'>น.</span>";

        innerG_1.appendChild(spanT_1);
        inputG_1.appendChild(inputT_1);
        inputG_1.appendChild(innerG_1);
        divGroup.appendChild(inputG_1);
        divGroup.appendChild(h5Elm);
        innerG_2.appendChild(spanT_2);
        inputG_2.appendChild(inputT_2);
        inputG_2.appendChild(innerG_2);
        divGroup.appendChild(inputG_2);
        labelSearchInputElm.appendChild(divGroup);
    } else if (value === "serviceTimeBetween") {
        const divGroup = document.createElement("div");
        const innerG = document.createElement("div");
        const spanT = document.createElement("span");
        const inputT = document.createElement("input");

        divGroup.setAttribute("id", idElm);
        divGroup.setAttribute("class", "input-group");
        inputT.setAttribute("type", "time");
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("class", "form-control using-custom-font text-center");
        innerG.setAttribute("class", "input-group-append");
        spanT.setAttribute("class", "input-group-text using-custom-font");
        spanT.appendChild(document.createTextNode("นาฬิกา"));

        innerG.appendChild(spanT);
        divGroup.appendChild(inputT);
        divGroup.appendChild(innerG);
        labelSearchInputElm.appendChild(divGroup);
    } else if (value === "serviceTimeRound" || value === "serviceCountRound" || value === "serviceTimeAverage") {
        const divGroup = document.createElement("div");
        const innerG = document.createElement("div");
        const spanT = document.createElement("span");
        const inputT = document.createElement("input");

        divGroup.setAttribute("id", idElm);
        divGroup.setAttribute("class", "input-group");
        inputT.setAttribute("type", "text");
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("class", "form-control using-custom-font");
        innerG.setAttribute("class", "input-group-append");
        spanT.setAttribute("class", "input-group-text using-custom-font");

        if (value === "serviceTimeRound") {
            inputT.setAttribute("oninput", "detectInteger(this, 1440)");
            inputT.setAttribute("maxlength", 4);
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก เวลาออกรอบ");
            spanT.appendChild(document.createTextNode("นาที"));
        } else if (value === "serviceCountRound") {
            inputT.setAttribute("oninput", "detectInteger(this, 120)");
            inputT.setAttribute("maxlength", 3);
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก จำนวนรอบ");
            spanT.appendChild(document.createTextNode("รอบ"));
        } else if (value === "serviceTimeAverage") {
            inputT.setAttribute("oninput", "detectInteger(this, 1440)");
            inputT.setAttribute("maxlength", 4);
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก เวลาเฉลี่ยให้บริการ");
            spanT.appendChild(document.createTextNode("นาที"));
        }

        innerG.appendChild(spanT);
        divGroup.appendChild(inputT);
        divGroup.appendChild(innerG);
        labelSearchInputElm.appendChild(divGroup);
    } else if (value === "routeStatus") {
        const inputT = document.createElement("select");
        const statusData = ["online", "investigate", "offline"];
        const statusName = ["ให้บริการ", "ระงับการให้บริการชั่วคราว", "ยกเลิกการให้บริการ"];
        inputT.setAttribute("name", "InputSearchTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
        labelSearchInputElm.appendChild(inputT);

        for (let i = 0; i < statusData.length; i++) {
            const selectOption = document.createElement("option");
            selectOption.value = statusData[i];
            selectOption.text = `สถานะ ${statusName[i]}`;
            inputT.appendChild(selectOption);
        }
    }
}

function filterTablePickInput(value) {
    const idElm = "inputFilterTable";
    const childElm = document.querySelector(`#${idElm}`);
    labelFilterInputElm.removeChild(childElm);

    let inputT = '';
    let optionInput = [];

    if (value === "nameRoute" || value == "nameColor_1" || value == "nameColor_2") {
        inputT = document.createElement("select");
        optionInput = ["ก-ฮ (น้อย-มาก)", "ฮ-ก (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "pricePassengerLower" || value == "pricePassengerHigher" || value == "priceSuppliesLower" || value == "priceSuppliesHigher") {
        inputT = document.createElement("select");
        optionInput = ["ค่าบริการต่ำสุด-ค่าบริการสูงสุด (น้อย-มาก)", "ค่าบริการสูงสุด-ค่าบริการต่ำสุด (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "serviceStartTime" || value == "serviceEndTime") {
        inputT = document.createElement("select");
        optionInput = ["เวลา 00:00น.-23:59น. (น้อย-มาก)", "เวลา 23:59น.-00:00น. (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "idRoute" || value == "serviceTimeRound" || value == "serviceCountRound" || value == "serviceTimeAverage") {
        inputT = document.createElement("select");
        optionInput = ["1-9 (น้อย-มาก)", "9-1 (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "routeStatus") {
        inputT = document.createElement("select");
        optionInput = ["สถานะบัญชีผู้ใช้ต่ำสุด-สูงสุด (น้อย-มาก)", "สถานะบัญชีผู้ใช้สูงสุด-ต่ำสุด (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "countRouteDrivers") {
        inputT = document.createElement("select");
        optionInput = ["0-9 (น้อย-มาก)", "9-0 (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableServiceRoute");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    }

    labelFilterInputElm.appendChild(inputT);

    if (value == "serviceStartTime" || value == "serviceEndTime") {
        for (let i = 0; i < optionInput.length; i++) {
            const selectOption = document.createElement("option");
            selectOption.value = i + 1;
            selectOption.text = `เรียงข้อมูลจาก${optionInput[i]}`;
            inputT.appendChild(selectOption);
        }
    } else {
        for (let i = 0; i < optionInput.length; i++) {
            const selectOption = document.createElement("option");
            selectOption.value = i + 1;
            selectOption.text = `เรียงข้อมูลจาก ${optionInput[i]}`;
            inputT.appendChild(selectOption);
        }
    }
}

function searchData() {
    const searchTag = document.querySelector("#searchTableServiceRoute").value;
    const searchInput = Array.from(document.querySelectorAll("input[name='InputSearchTableServiceRoute']"));
    const searchInputDangerText = document.querySelector("#inputSearchTableServiceRoute > small");

    if (searchTag == "idRoute" || searchTag == "keywordRoute" || searchTag == "serviceTimeRound" || searchTag == "serviceCountRound" || searchTag == "serviceTimeAverage") {
        if (searchInput[0].value.length < 1) {
            searchInput[0].classList.add("border-danger");
            if (searchTag == "idRoute") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย รหัสเส้นทาง ควรมีข้อมูลอย่างน้อย 1 หลัก";
            } else if (searchTag == "keywordRoute") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย รายละเอียด / ข้อมูลประจำเส้นทาง ควรมีข้อมูลอย่างน้อย 1 หลัก";
            } else if (searchTag == "serviceTimeRound") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย เวลาออกรอบ ควรมีข้อมูลอย่างน้อย 1 หลัก";
            } else if (searchTag == "serviceCountRound") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย จำนวนรอบ ควรมีข้อมูลอย่างน้อย 1 หลัก";
            } else if (searchTag == "serviceTimeAverage") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย เวลาเฉลี่ยให้บริการ ควรมีข้อมูลอย่างน้อย 1 หลัก";
            }
        } else {
            $('#searchModal').modal('hide');
            location.href = setURLParam("searchTag", searchTag, "searchValue", searchInput[0].value, true);
        }
    } else if (searchTag == "nameRoute") {
        if (searchInput[0].value.length < 3) {
            searchInput[0].classList.add("border-danger");
            searchInputDangerText.innerHTML = "การค้นหาด้วย ชื่อเส้นทาง ควรมีข้อมูลอย่างน้อย 3 หลัก";
        } else {
            $('#searchModal').modal('hide');
            location.href = setURLParam("searchTag", searchTag, "searchValue", searchInput[0].value, true);
        }
    } else if (searchTag == "nameColor_1" || searchTag == "nameColor_2") {
        if (searchInput[0].value.length < 5) {
            searchInput[0].classList.add("border-danger");
            searchInputDangerText.innerHTML = "การค้นหาด้วย ชื่อสี ควรมีข้อมูลอย่างน้อย 5 หลัก";
        } else {
            $('#searchModal').modal('hide');
            location.href = setURLParam("searchTag", searchTag, "searchValue", searchInput[0].value, true);
        }
    } else if (searchTag == "hexColor_1" || searchTag == "hexColor_2") {
        if (searchInput[0].value.length < 4) {
            searchInput[0].classList.add("border-danger");
            searchInputDangerText.innerHTML = "การค้นหาด้วย รหัสสี (Hex Color) ควรมีข้อมูลอย่างน้อย 4 หลัก";
        } else {
            $('#searchModal').modal('hide');
            location.href = setURLParam("searchTag", searchTag, "searchValue", searchInput[0].value, true);
        }
    } else if (searchTag == "pricePassenger" || searchTag == "priceSupplies") {
        if (searchInput[0].value == "" && searchInput[1].value == "") {
            searchInput[0].classList.add("border-danger");
            searchInput[1].classList.add("border-danger");
            searchInputDangerText.innerHTML = "การค้นหาด้วย ค่าบริการ (เริ่มต้น-สูงสุด) ควรมีข้อมูลที่จะค้นหาอย่างน้อย 1 ช่อง";
        } else {
            const priceLower = searchInput[0].value == "" ? "**" : searchInput[0].value;
            const priceHigher = searchInput[1].value == "" ? "**" : searchInput[1].value;

            if (priceHigher < priceLower && priceLower != "**" && priceHigher != "**" || priceLower > priceHigher && priceLower != "**" && priceHigher != "**" || priceLower == priceHigher && priceLower != "**" && priceHigher != "**") {
                searchInput[0].classList.add("border-danger");
                searchInput[1].classList.add("border-danger");
                searchInputDangerText.innerHTML = "การค้นหาด้วย ค่าบริการ (เริ่มต้น-สูงสุด) มีรูปแบบข้อมูลค่าบริการไม่ถูกต้อง";
            } else {
                $('#searchModal').modal('hide');
                location.href = setURLParam("searchTag", searchTag, "searchValue", `${priceLower}-${priceHigher}`, true);
            }
        }
    } else if (searchTag == "pricePassengerBetween" || searchTag == "priceSuppliesBetween") {
        if (searchInput[0].value.length < 1) {
            searchInput[0].classList.add("border-danger");
            if (searchTag == "pricePassengerBetween") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย ค่าบริการโดยสารระหว่างต่ำสุดและสูงสุด ควรมีข้อมูลอย่างน้อย 1 หลัก";
            } else if (searchTag == "priceSuppliesBetween") {
                searchInputDangerText.innerHTML = "การค้นหาด้วย ค่าบริการส่งพัสดุระหว่างต่ำสุดและสูงสุด ควรมีข้อมูลอย่างน้อย 1 หลัก";
            }
        } else {
            $('#searchModal').modal('hide');
            location.href = setURLParam("searchTag", searchTag, "searchValue", searchInput[0].value, true);
        }
    } else if (searchTag == "serviceTime") {
        if (searchInput[0].value == "" && searchInput[1].value == "") {
            searchInput[0].classList.add("border-danger");
            searchInput[1].classList.add("border-danger");
            searchInputDangerText.innerHTML = "การค้นหาด้วย เวลาให้บริการ (เริ่มต้น-สิ้นสุด) ควรมีข้อมูลที่จะค้นหาอย่างน้อย 1 ช่อง";
        } else {
            const timeStart = searchInput[0].value == "" ? "**" : searchInput[0].value;
            const timeEnd = searchInput[1].value == "" ? "**" : searchInput[1].value;

            if (timeEnd < timeStart && timeStart != "**" && timeEnd != "**" || timeStart > timeEnd && timeStart != "**" && timeEnd != "**" || timeStart == timeEnd && timeStart != "**" && timeEnd != "**") {
                searchInput[0].classList.add("border-danger");
                searchInput[1].classList.add("border-danger");
                searchInputDangerText.innerHTML = "การค้นหาด้วย เวลาให้บริการ (เริ่มต้น-สิ้นสุด) มีรูปแบบข้อมูลค่าบริการไม่ถูกต้อง";
            } else {
                $('#searchModal').modal('hide');
                location.href = setURLParam("searchTag", searchTag, "searchValue", `${timeStart}-${timeEnd}`, true);
            }
        }
    } else if (searchTag == "serviceTimeBetween") {
        if (searchInput[0].value == "") {
            searchInput[0].classList.add("border-danger");
            searchInputDangerText.innerHTML = "การค้นหาด้วย เวลาให้บริการระหว่างเริ่มต้นและสิ้นสุดให้บริการ ควรมีข้อมูลที่จะค้นหา";
        } else {
            $('#searchModal').modal('hide');
            location.href = setURLParam("searchTag", searchTag, "searchValue", searchInput[0].value, true);
        }
    } else if (searchTag == "routeStatus") {
        const searchSelect = document.querySelector("select[name='InputSearchTableServiceRoute']");
        $('#filterModal').modal('hide');
        location.href = setURLParam("searchTag", searchTag, "searchValue", searchSelect.value, true);
    }

}

function searchClearData() {
    $('#searchModal').modal('hide');
    location.href = deleteURLParam("searchTag", "searchValue");
}

function filterData() {
    const filterTag = document.querySelector("#filterTableServiceRoute").value;
    const filterValue = document.querySelector("#inputFilterTable").value;

    $('#filterModal').modal('hide');
    location.href = setURLParam("filterTag", filterTag, "filterValue", filterValue);
}

function filterClearData() {
    $('#filterModal').modal('hide');
    location.href = deleteURLParam("filterTag", "filterValue");
}

function profilePageLink(id) {
    window.location.href = `./profile_route_management.php?idRoute=${id}`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}