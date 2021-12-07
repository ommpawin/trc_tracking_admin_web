function showNavLinkButton() {
    const divFHideElm = document.querySelector("#navBarLink");
    const ulElm = document.createElement("ul");
    const liElm = document.createElement("li");
    const aElm = document.createElement("a");

    ulElm.setAttribute("class", "navbar-nav");
    liElm.setAttribute("class", "nav-item");
    aElm.setAttribute("class", "nav-link text-white");
    aElm.setAttribute("data-widget", "pushmenu");
    aElm.setAttribute("role", "button");
    aElm.innerHTML = "<i class='fas fa-bars'></i>";
    liElm.appendChild(aElm);
    ulElm.appendChild(liElm);

    divFHideElm.insertBefore(ulElm, divFHideElm.childNodes[0]);
}

async function getAPIData() {
    const data = new Promise((resolve) => {
        fetch("/TRC_Tracking/test/json/route_management.json")
            .then((response) => {
                resolve(response.json());
            });
    });

    extractJSONData(await data);
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