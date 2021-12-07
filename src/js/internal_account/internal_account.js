const labelSearchInputElm = document.querySelector("#inputSearchTableInternalAccount");
const labelFilterInputElm = document.querySelector("#inputFilterTableInternalAccount");
let startSearchYearBE = new Date().getFullYear(),
    endSearchYearBE = 1900;
let searchNameTitle = [];
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
                fetch(`${urlAPI}/internal_account`, {
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
            startYearBE: setupResult.start_yearBE,
            endYearBE: setupResult.end_yearBE,
            nameTitle: setupResult.nameTitle,
            widgetsData: dataWidgets,
            dataObject: dataTableResult,
            countPage: setupResult.count_page,
            countData: setupResult.count_data
        });
    }

    function setValueSetup({
        startYearBE,
        endYearBE,
        nameTitle,
        widgetsData,
        dataObject,
        countPage,
        countData
    }) {
        startSearchYearBE = startYearBE;
        endSearchYearBE = endYearBE;
        searchNameTitle = nameTitle;
        dataWidgetObject = widgetsData;
        dataTableObject = dataObject;
        countDataPage = countPage;
        countDataRow = countData;
    }

    function setDisplayWidgetsData() {
        const widgetItem = Array.from(document.querySelectorAll(".dataWidgets"));
        const subTextWidgetItem = Array.from(document.querySelectorAll(".sub-text"));
        const {
            admin_account,
            staff_account,
            online_account,
            investigate_account,
            offline_account
        } = dataWidgetObject;

        widgetItem[0].innerHTML = admin_account;
        widgetItem[1].innerHTML = staff_account;
        widgetItem[2].innerHTML = online_account;
        widgetItem[3].innerHTML = `${investigate_account} / ${offline_account}`;

        subTextWidgetItem[2].innerHTML = `(จากสถานะ ${admin_account + staff_account} บัญชีผู้ใช้ทั้งหมด)`;
        subTextWidgetItem[3].innerHTML = `(จากสถานะ ${admin_account + staff_account} บัญชีผู้ใช้ทั้งหมด)`;
    }

    function setSearchDataContent() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchButElm = document.querySelector("#searchButton");
        const searchTypeElm = Array.from(document.querySelectorAll("#searchTableInternalAccount > option"));
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

            searchTableInternalAccountPickInput(`${searchTag}`);
            if (searchTag == "name" || searchTag == "phoneNumber" || searchTag == "email") {
                const inputData = document.querySelector("input[name='InputSearchTableInternalAccount']");
                if (searchTag == "phoneNumber") {
                    if (searchValue.length == 10) {
                        inputData.value = `${searchValue.substring(0, 3)}-${searchValue.substring(3, 6)}-${searchValue.substring(6, 10)}`;
                    } else {
                        inputData.value = searchValue;
                    }
                } else {
                    inputData.value = searchValue;
                }
            } else if (searchTag == "dateOfBirthBE") {
                const inputDataOption_Day = Array.from(document.querySelectorAll("#InputSearchTableInternalAccount_Day > option"));
                const inputDataOption_Month = Array.from(document.querySelectorAll("#InputSearchTableInternalAccount_Month > option"));
                const inputDataOption_Year = Array.from(document.querySelectorAll("#InputSearchTableInternalAccount_Year > option"));
                const inputResult = [searchValue.substring(0, 2), searchValue.substring(3, 5), searchValue.substring(6)];

                inputDataOption_Day.forEach((v, i) => {
                    if (inputDataOption_Day[i].value == inputResult[0]) {
                        inputDataOption_Day[i].selected = true;
                    }
                });

                inputDataOption_Month.forEach((v, i) => {
                    if (inputDataOption_Month[i].value == inputResult[1]) {
                        inputDataOption_Month[i].selected = true;
                    }
                });

                inputDataOption_Year.forEach((v, i) => {
                    if (inputDataOption_Year[i].value == inputResult[2]) {
                        inputDataOption_Year[i].selected = true;
                    }
                });
            } else if (searchTag == "accessLevel" || searchTag == "accessStatus") {
                const inputData = Array.from(document.querySelectorAll("select[name='InputSearchTableInternalAccount'] > option"));

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
        const filterTypeElm = Array.from(document.querySelectorAll("#filterTableInternalAccount > option"));
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

            filterTableInternalAccountPickInput(`${filterTag}`);
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
        const dataTableF = document.querySelector("#tableDataInternalAccount");

        const tableElm = document.createElement("table");
        tableElm.setAttribute("class", "table text-nowrap highlight_header_table");
        dataTableF.appendChild(tableElm);
        const theadElm = document.createElement("thead");
        tableElm.appendChild(theadElm);
        const trElm = document.createElement("tr");
        theadElm.appendChild(trElm);

        const thText = ["ชื่อ-สกุล", "วัน เดือน ปีเกิด (พ.ศ.)", "เบอร์โทรศัพท์", "อีเมล", "ระดับการเข้าถึงบัญชีผู้ใช้", "สถานะบัญชีผู้ใช้"];
        const thClass = "text-center font-weight-normal";

        for (let i = 0; i < (thText.length + 1); i++) {
            const thElm = document.createElement("th");

            if (i > 0) {
                if (i > 4) {
                    thElm.setAttribute("class", thClass);
                    thElm.appendChild(document.createTextNode(thText[i - 1]));
                } else {
                    thElm.appendChild(document.createTextNode(thText[i - 1]));
                }
            }

            trElm.appendChild(thElm);
        }

        const tbodyEml = document.createElement("tbody");
        tbodyEml.setAttribute("id", "dataTableInternalAccount");
        tableElm.appendChild(tbodyEml);

    }

    function createTableData() {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTag = urlParams.get("searchTag");
        const searchValue = urlParams.get("searchValue");
        const filterTag = urlParams.get("filterTag");
        const filterValue = urlParams.get("filterValue");

        const tableDataF = document.querySelector("#dataTableInternalAccount");
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

            if (searchTag != null) {
                let searchResult = [];
                const breakValue = searchTag == "dateOfBirthBE" ? `${searchValue.substring(0,2)}-${searchValue.substring(3,5)}-${searchValue.substring(6)}` : null;

                if (breakValue == "**-**-****") {
                    searchResult = dataTable;
                } else {
                    dataTable.forEach((v, i) => {
                        const dataObj = dataTable[i];

                        if (searchTag == "name") {
                            if (searchNameTitle.indexOf(searchValue) > -1) {
                                const nameValue = dataObj.nameTitle;
                                if (nameValue === searchValue) {
                                    searchResult.push(dataObj);
                                }
                            } else {
                                const nameValue = `${dataObj.nameTitle}${dataObj.nameFirst} ${dataObj.nameLast}`;
                                if (nameValue.includes(searchValue)) {
                                    searchResult.push(dataObj);
                                }
                            }
                        } else if (searchTag == "dateOfBirthBE") {
                            const dayDateValue = searchValue.substring(0, 2);
                            const monthDateValue = searchValue.substring(3, 5);
                            const yearDateValue = searchValue.substring(6);

                            if (dayDateValue != "**" && monthDateValue != "**" && yearDateValue != "****") {
                                if (String(dataObj.dayBirth).includes(parseInt(dayDateValue)) == true && String(dataObj.monthBirth).includes(parseInt(monthDateValue)) == true && String(dataObj.yearBirth).includes(parseInt(yearDateValue)) == true) {
                                    searchResult.push(dataObj);
                                }
                            } else if (monthDateValue == "**" && yearDateValue == "****") {
                                if (String(dataObj.dayBirth).includes(parseInt(dayDateValue))) {
                                    searchResult.push(dataObj);
                                }
                            } else if (dayDateValue == "**" && yearDateValue == "****") {
                                if (String(dataObj.monthBirth).includes(parseInt(monthDateValue))) {
                                    searchResult.push(dataObj);
                                }
                            } else if (dayDateValue == "**" && monthDateValue == "**") {
                                if (String(dataObj.yearBirth).includes(parseInt(yearDateValue))) {
                                    searchResult.push(dataObj);
                                }
                            } else if (dayDateValue == "**") {
                                if (String(dataObj.monthBirth).includes(parseInt(monthDateValue)) == true && String(dataObj.yearBirth).includes(parseInt(yearDateValue)) == true) {
                                    searchResult.push(dataObj);
                                }
                            } else if (monthDateValue == "**") {
                                if (String(dataObj.dayBirth).includes(parseInt(dayDateValue)) == true && String(dataObj.yearBirth).includes(parseInt(yearDateValue)) == true) {
                                    searchResult.push(dataObj);
                                }
                            } else if (yearDateValue == "****") {
                                if (String(dataObj.dayBirth).includes(parseInt(dayDateValue)) == true && String(dataObj.monthBirth).includes(parseInt(monthDateValue)) == true) {
                                    searchResult.push(dataObj);
                                }
                            }
                        } else if (searchTag == "phoneNumber" || searchTag == "email" || searchTag == "accessLevel" || searchTag == "accessStatus") {
                            if (dataObj[`${searchTag}`].includes(searchValue)) {
                                searchResult.push(dataObj);
                            }
                        }
                    });
                }

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
                        if (filterTag == "name") {
                            const aValue = `${a.nameFirst}${a.nameLast}`;
                            const bValue = `${b.nameFirst}${b.nameLast}`;

                            return aValue.localeCompare(bValue, 'th');
                        } else if (filterTag == "nameTitle") {
                            return a[`${filterTag}`].localeCompare(b[`${filterTag}`], 'th');
                        } else if (filterTag == "dayBirth" || filterTag == "monthBirth" || filterTag == "yearBirth") {
                            return a[`${filterTag}`] - b[`${filterTag}`];
                        } else if (filterTag == "dateOfBirthBE") {
                            const aValue = Date.parse(`${a.yearBirth}-${a.monthBirth}-${a.dayBirth}`).toString();
                            const bValue = Date.parse(`${b.yearBirth}-${b.monthBirth}-${b.dayBirth}`).toString();

                            return aValue - bValue;
                        } else if (filterTag == "phoneNumber") {
                            const aValue = a.phoneNumber.substring(1);
                            const bValue = b.phoneNumber.substring(1);

                            return aValue - bValue;
                        } else if (filterTag == "email" || filterTag == "accessStatus") {
                            return a[`${filterTag}`].localeCompare(b[`${filterTag}`], 'en');
                        } else if (filterTag == "accessLevel") {
                            return b[`${filterTag}`].localeCompare(a[`${filterTag}`], 'en');
                        }
                    } else if (filterValue == 2) {
                        if (filterTag == "name") {
                            const bValue = `${b.nameFirst}${b.nameLast}`;
                            const aValue = `${a.nameFirst}${a.nameLast}`;

                            return bValue.localeCompare(aValue, 'th');
                        } else if (filterTag == "nameTitle") {
                            return b[`${filterTag}`].localeCompare(a[`${filterTag}`], 'th');
                        } else if (filterTag == "dayBirth" || filterTag == "monthBirth" || filterTag == "yearBirth") {
                            return b[`${filterTag}`] - a[`${filterTag}`];
                        } else if (filterTag == "dateOfBirthBE") {
                            const bValue = Date.parse(`${b.yearBirth}-${b.monthBirth}-${b.dayBirth}`).toString();
                            const aValue = Date.parse(`${a.yearBirth}-${a.monthBirth}-${a.dayBirth}`).toString();

                            return bValue - aValue;
                        } else if (filterTag == "phoneNumber") {
                            const bValue = b.phoneNumber.substring(1);
                            const aValue = a.phoneNumber.substring(1);

                            return bValue - aValue;
                        } else if (filterTag == "email" || filterTag == "accessStatus") {
                            return b[`${filterTag}`].localeCompare(a[`${filterTag}`], 'en');
                        } else if (filterTag == "accessLevel") {
                            return a[`${filterTag}`].localeCompare(b[`${filterTag}`], 'en');
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
                        const tdElm = document.createElement("td");
                        const rawData = dataTableSorting[i];

                        if (keyObjectName[j] === "idAccount") {
                            tdElm.setAttribute("class", "text-center");
                            const buttonElm = document.createElement("button");
                            buttonElm.setAttribute("type", "button");
                            buttonElm.setAttribute("class", "btn btn-outline-primary btn-xs");
                            buttonElm.setAttribute("onclick", `profilePageLink("${rawData.idAccount}")`);
                            buttonElm.innerHTML += "<i class='fas fa-search'></i> แสดงข้อมูลบัญชี";
                            tdElm.appendChild(buttonElm);
                        } else if (keyObjectName[j] === "nameTitle") {
                            const nameData = `${rawData.nameTitle}${rawData.nameFirst} ${rawData.nameLast}`;
                            tdElm.appendChild(document.createTextNode(nameData));
                            j += 2;
                        } else if (keyObjectName[j] === "dayBirth") {
                            const monthName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
                            const dateData = `${parseInt(rawData.dayBirth)} ${monthName[(rawData.monthBirth) - 1]} ${rawData.yearBirth}`;
                            tdElm.appendChild(document.createTextNode(dateData));
                            j += 2;
                        } else if (keyObjectName[j] === "phoneNumber") {
                            const phoneNumber = rawData.phoneNumber;
                            const phoneData = `${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, 10)}`;
                            tdElm.appendChild(document.createTextNode(phoneData));
                        } else if (keyObjectName[j] === "email") {
                            const emailData = rawData.email;
                            tdElm.appendChild(document.createTextNode(emailData));
                        } else if (keyObjectName[j] === "accessLevel") {
                            tdElm.setAttribute("class", "text-center");
                            const levelData = rawData.accessLevel;
                            const spanElm = document.createElement("span");

                            if (levelData === "admin") {
                                spanElm.setAttribute("class", "badge custom-badge-admin p-1");
                                spanElm.innerHTML += "ผู้ดูแลระบบ";
                            } else if (levelData === "staff") {
                                spanElm.setAttribute("class", "badge custom-badge-staff p-1");
                                spanElm.innerHTML += "พนักงานระบบ";
                            }

                            tdElm.appendChild(spanElm);
                        } else if (keyObjectName[j] === "accessStatus") {
                            tdElm.setAttribute("class", "text-center");
                            const statusData = rawData.accessStatus;
                            const spanElm = document.createElement("span");

                            if (statusData === "online") {
                                spanElm.setAttribute("class", "badge custom-badge-online p-1");
                                spanElm.innerHTML += "ใช้งาน";
                            } else if (statusData === "investigate") {
                                spanElm.setAttribute("class", "badge custom-badge-investigate p-1");
                                spanElm.innerHTML += "ระงับการใช้งานชั่วคราว";
                            } else if (statusData === "offline") {
                                spanElm.setAttribute("class", "badge custom-badge-offline p-1");
                                spanElm.innerHTML += "ยกเลิกการใช้งาน";
                            }
                            tdElm.appendChild(spanElm);
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

function setPatternPhoneNumber(value) {
    const inputT = document.querySelector("#inputSearchTable");
    inputT.value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if (value.length == 10) {
        const isSetValue = inputT.value;
        if (isSetValue.length == 10) {
            inputT.value = `${isSetValue.substring(0, 3)}-${isSetValue.substring(3, 6)}-${isSetValue.substring(6, 10)}`;
        }
    }
}

function searchTableInternalAccountPickInput(value) {
    const idElm = "inputSearchTable";
    const childElm = document.querySelector(`#${idElm}`);
    const searchInputDangerText = document.querySelector("#inputSearchTableInternalAccount > small");
    searchInputDangerText.innerHTML = "";
    labelSearchInputElm.removeChild(childElm);

    if (value === "name" || value === "phoneNumber" || value === "email") {
        const inputT = document.createElement("input");
        inputT.setAttribute("type", "text");
        inputT.setAttribute("name", "InputSearchTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
        if (value === "name") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก ชื่อ-สกุล หรือคำนำหน้าชื่อ");
        } else if (value === "phoneNumber") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก เบอร์โทรศัพท์");
            inputT.setAttribute("maxlength", 10);
            inputT.setAttribute("oninput", "setPatternPhoneNumber(this.value)");
        } else if (value === "email") {
            inputT.setAttribute("placeholder", "ค้นหาข้อมูลจาก อีเมล (Email @)");
        }

        labelSearchInputElm.appendChild(inputT);
    } else if (value === "dateOfBirthBE") {
        const inputF = document.createElement("div");
        const inputT_1 = document.createElement("select");
        const dayCount = 31;
        const firstDatOption = "ทุกช่วงวัน";
        const inputT_2 = document.createElement("select");
        const monthName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const firstMonthOption = "ทุกช่วงเดือน";
        const inputT_3 = document.createElement("select");
        const firstYearOption = "ทุกช่วงปี";

        inputF.setAttribute("class", "row");
        inputF.setAttribute("id", idElm);
        labelSearchInputElm.appendChild(inputF);

        inputT_1.setAttribute("name", "InputSearchTableInternalAccount");
        inputT_1.setAttribute("id", "InputSearchTableInternalAccount_Day");
        inputT_1.setAttribute("class", "form-control col using-custom-font ml-2");
        inputF.appendChild(inputT_1);

        for (let i = 0; i <= dayCount; i++) {
            const selectOption = document.createElement("option");
            if (i == 0) {
                selectOption.value = "**";
                selectOption.text = firstDatOption;
            } else {
                if (i < 10) {
                    selectOption.value = "0" + i;
                } else {
                    selectOption.value = i;
                }

                selectOption.text = `วันที่ ${i}`;
            }
            inputT_1.appendChild(selectOption);
        }

        inputT_2.setAttribute("name", "InputSearchTableInternalAccount");
        inputT_2.setAttribute("id", "InputSearchTableInternalAccount_Month");
        inputT_2.setAttribute("class", "form-control col using-custom-font ml-1 mr-1");
        inputF.appendChild(inputT_2);

        for (let i = -1; i < monthName.length; i++) {
            const selectOption = document.createElement("option");
            if (i == -1) {
                selectOption.value = "**";
                selectOption.text = firstMonthOption;
            } else {
                if ((i + 1) < 10) {
                    selectOption.value = "0" + (i + 1);
                } else {
                    selectOption.value = i + 1;
                }

                selectOption.text = `เดือน${monthName[i]} - (${i+1})`;
            }
            inputT_2.appendChild(selectOption);
        }

        inputT_3.setAttribute("name", "InputSearchTableInternalAccount");
        inputT_3.setAttribute("id", "InputSearchTableInternalAccount_Year");
        inputT_3.setAttribute("class", "form-control col using-custom-font mr-2");
        inputF.appendChild(inputT_3);

        for (let i = (startSearchYearBE + 1); i >= endSearchYearBE; i--) {
            const selectOption = document.createElement("option");
            if (i == (startSearchYearBE + 1)) {
                selectOption.value = "****";
                selectOption.text = firstYearOption;
            } else {
                selectOption.value = i;
                selectOption.text = `ปี พ.ศ. ${i}`;
            }
            inputT_3.appendChild(selectOption);
        }
    } else if (value === "accessLevel") {
        const inputT = document.createElement("select");
        const levelData = ["admin", "staff"];
        const levelName = ["ผู้ดูแลระบบ", "พนักงานระบบ"];
        inputT.setAttribute("name", "InputSearchTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
        labelSearchInputElm.appendChild(inputT);

        for (let i = 0; i < levelData.length; i++) {
            const selectOption = document.createElement("option");
            selectOption.value = levelData[i];
            selectOption.text = `บัญชี ${levelName[i]}`;
            inputT.appendChild(selectOption);
        }
    } else if (value === "accessStatus") {
        const inputT = document.createElement("select");
        const statusData = ["online", "investigate", "offline"];
        const statusName = ["ใช้งาน", "ระงับการใช้งานชั่วคราว", "ยกเลิกการใช้งาน"];
        inputT.setAttribute("name", "InputSearchTableInternalAccount");
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

function filterTableInternalAccountPickInput(value) {
    const idElm = "inputFilterTable";
    const childElm = document.querySelector(`#${idElm}`);
    labelFilterInputElm.removeChild(childElm);

    let inputT = '';
    let optionInput = [];

    if (value === "name" || value == "nameTitle") {
        inputT = document.createElement("select");
        optionInput = ["ก-ฮ (น้อย-มาก)", "ฮ-ก (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value === "email") {
        inputT = document.createElement("select");
        optionInput = ["A-Z (น้อย-มาก)", "Z-A (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "dayBirth" || value == "yearBirth") {
        inputT = document.createElement("select");
        optionInput = ["1-9 (น้อย-มาก)", "9-1 (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "phoneNumber") {
        inputT = document.createElement("select");
        optionInput = ["0-9 (น้อย-มาก)", "9-0 (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "monthBirth") {
        inputT = document.createElement("select");
        optionInput = ["เดือนมกราคม-เดือนธันวาคม (น้อย-มาก)", "เดือนธันวาคม-เดือนมกราคม (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "dateOfBirthBE") {
        inputT = document.createElement("select");
        optionInput = ["วันที่ 1 มกราคม-วันที่ 30 ธันวาคม (น้อย-มาก)", "วันที่ 30 ธันวาคม-วันที่ 1 มกราคม (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "accessLevel") {
        inputT = document.createElement("select");
        optionInput = ["ระดับบัญชีผู้ใช้ต่ำสุด-สูงสุด (น้อย-มาก)", "ระดับบัญชีผู้ใช้สูงสุด-ต่ำสุด (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    } else if (value == "accessStatus") {
        inputT = document.createElement("select");
        optionInput = ["สถานะบัญชีผู้ใช้ต่ำสุด-สูงสุด (น้อย-มาก)", "สถานะบัญชีผู้ใช้สูงสุด-ต่ำสุด (มาก-น้อย)"];
        inputT.setAttribute("name", "InputFilterTableInternalAccount");
        inputT.setAttribute("id", idElm);
        inputT.setAttribute("class", "form-control using-custom-font");
    }

    labelFilterInputElm.appendChild(inputT);

    if (value == "monthBirth" || value == "dateOfBirthBE") {
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
    const searchTag = document.querySelector("#searchTableInternalAccount").value;
    const searchInput = document.querySelector("input[name='InputSearchTableInternalAccount']");
    const searchInputDangerText = document.querySelector("#inputSearchTableInternalAccount > small");
    let searchValue = '';

    if (searchTag == "name" || searchTag == "phoneNumber" || searchTag == "email") {
        searchValue = searchInput.value;

        if (searchTag == "phoneNumber") {
            if (searchValue.length < 2) {
                searchInput.classList.add("border-danger");
                searchInputDangerText.innerHTML = "การค้นหาด้วย เบอร์โทรศัพท์ ควรมีข้อมูลอย่างน้อย 2 หลัก";
            } else {
                $('#searchModal').modal('hide');
                location.href = setURLParam("searchTag", searchTag, "searchValue", searchValue.replace(/-/g, ''), true);
            }
        } else {
            if (searchValue.length < 3) {
                searchInput.classList.add("border-danger");
                if (searchTag == "name") {
                    searchInputDangerText.innerHTML = "การค้นหาด้วย ชื่อ-สกุล หรือคำนำหน้า ควรมีข้อมูลอย่างน้อย 3 หลัก";
                } else if (searchTag == "email") {
                    searchInputDangerText.innerHTML = "การค้นหาด้วย อีเมล ควรมีข้อมูลอย่างน้อย 3 หลัก";
                }
            } else {
                $('#searchModal').modal('hide');
                location.href = setURLParam("searchTag", searchTag, "searchValue", searchValue, true);
            }
        }
    } else if (searchTag == "dateOfBirthBE") {
        const searchDateInput = [document.querySelector("#InputSearchTableInternalAccount_Day").value, document.querySelector("#InputSearchTableInternalAccount_Month").value, document.querySelector("#InputSearchTableInternalAccount_Year").value];
        $('#searchModal').modal('hide');
        location.href = setURLParam("searchTag", searchTag, "searchValue", `${searchDateInput[0]}-${searchDateInput[1]}-${searchDateInput[2]}`, true);
    } else if (searchTag == "accessLevel" || searchTag == "accessStatus") {
        const searchSelect = document.querySelector("select[name='InputSearchTableInternalAccount']");
        $('#filterModal').modal('hide');
        location.href = setURLParam("searchTag", searchTag, "searchValue", searchSelect.value, true);
    }
}

function searchClearData() {
    $('#searchModal').modal('hide');
    location.href = deleteURLParam("searchTag", "searchValue");
}

function filterData() {
    const filterTag = document.querySelector("#filterTableInternalAccount").value;
    const filterValue = document.querySelector("#inputFilterTable").value;

    $('#filterModal').modal('hide');
    location.href = setURLParam("filterTag", filterTag, "filterValue", filterValue);
}

function filterClearData() {
    $('#filterModal').modal('hide');
    location.href = deleteURLParam("filterTag", "filterValue");
}

function profilePageLink(idAccount) {
    window.location.href = `./profile_internal_account.php?idAccount=${idAccount}`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}