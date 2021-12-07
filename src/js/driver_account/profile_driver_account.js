let userIdAccount;
let useIdRoute;
let urlAPIServer;
let idRoute;

(() => {
    async function getURLParams() {
        const idAccount = new URLSearchParams(window.location.search).get("idAccount");
        if (idAccount == null) {
            window.location.href = "./driver_account.php";
        } else {
            userIdAccount = await idAccount;
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
            fetch(`${urlAPIServer}/profile_driver_account?idAccount=${userIdAccount}`, {
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
        idRoute = objectResponse.serviceRoute;

        setValueDisplay({
            name: `${objectResponse.nameTitle}${objectResponse.nameFirst} ${objectResponse.nameLast}`,
            phoneNumber: objectResponse.phoneNumber,
            accessLevel: objectResponse.accessLevel,
            accessStatus: objectResponse.accessStatus,
            idRoute: objectResponse.serviceRoute,
            nameRoute: objectResponse.nameRoute,
            typeRoute: objectResponse.serviceType,
            nameColor_1: objectResponse.nameColor_1,
            nameColor_2: objectResponse.nameColor_2,
            hexColor_1: objectResponse.hexColor_1,
            hexColor_2: objectResponse.hexColor_2,
            driverIdAccount: objectResponse.driverIdAccount,
            password: objectResponse.password,
            day: objectResponse.dayBirth,
            month: objectResponse.monthBirth,
            year: objectResponse.yearBirth,
            identificationNumber: objectResponse.identificationNumber,
            address: objectResponse.address,
            subDistrict: objectResponse.subDistrict,
            district: objectResponse.district,
            province: objectResponse.province,
            postCode: objectResponse.postCode,
            licenseFirst: objectResponse.licenseFirst,
            licenseProvince: objectResponse.licenseProvince,
            licenseCenter: objectResponse.licenseCenter,
            licenseEnd: objectResponse.licenseEnd,
        });
    }

    function setValueDisplay({
        name,
        phoneNumber,
        accessLevel,
        accessStatus,
        idRoute,
        nameRoute,
        typeRoute,
        nameColor_1,
        nameColor_2,
        hexColor_1,
        hexColor_2,
        driverIdAccount,
        password,
        day,
        month,
        year,
        identificationNumber,
        address,
        subDistrict,
        district,
        province,
        postCode,
        licenseFirst,
        licenseProvince,
        licenseCenter,
        licenseEnd,
    }) {
        const nameDisplay = document.querySelector("#name");
        const phoneNumberDisplay = document.querySelector("#phoneNumber");
        const statusBadgeDisplay = document.querySelector("#status_badge");
        const idRouteDisplay = document.querySelector("#idRoute");
        const nameRouteDisplay = document.querySelector("#nameRoute");
        const typeRouteDisplay = document.querySelector("#typeRoute");
        const colorRouteDisplay = document.querySelector("#colorRoute");
        const driverIdAccountDisplay = document.querySelector("input[name='driver_id_account']");
        const passwordDisplay = document.querySelector("input[name='password']");
        const dateBirthDisplay = document.querySelector("#dateBirth");
        const ageDisplay = document.querySelector("#age");
        const identificationNumberDisplay = document.querySelector("#identificationNumber");
        const addressDisplay = document.querySelector("#address");
        const licenseDriverDisplay = document.querySelector("#license_driver");
        const accessLevelInput = document.querySelector("input[name='access_level']");
        const accessStatusInput = document.querySelector("input[name='access_status']");
        const footerContent = document.querySelector("#footerContent");

        const badgeAccessLevel = document.createElement("span");
        const badgeAccessStatus = document.createElement("span");

        useIdRoute = idRoute;

        nameDisplay.appendChild(document.createTextNode(name));
        phoneNumberDisplay.appendChild(document.createTextNode(`${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, 10)}`));

        badgeAccessLevel.setAttribute("class", "badge p-1 mr-2");
        if (accessLevel == "driver") {
            badgeAccessLevel.classList.add("custom-badge-driver");
            badgeAccessLevel.appendChild(document.createTextNode("ผู้ขับ"));
        }

        badgeAccessStatus.setAttribute("class", "badge p-1");
        if (accessStatus == "online") {
            badgeAccessStatus.classList.add("custom-badge-online");
            badgeAccessStatus.appendChild(document.createTextNode("ใช้งาน"));
        } else if (accessStatus == "investigate") {
            badgeAccessStatus.classList.add("custom-badge-investigate");
            badgeAccessStatus.appendChild(document.createTextNode("ระงับการใช้งานชั่วคราว"));
        } else if (accessStatus == "offline") {
            badgeAccessStatus.classList.add("custom-badge-offline");
            badgeAccessStatus.appendChild(document.createTextNode("ยกเลิกการใช้งาน"));
        }

        statusBadgeDisplay.appendChild(badgeAccessLevel);
        statusBadgeDisplay.appendChild(badgeAccessStatus);

        idRouteDisplay.appendChild(document.createTextNode(`รหัสเส้นทาง : ${idRoute}`));
        nameRouteDisplay.appendChild(document.createTextNode(nameRoute));

        if (typeRoute == "1") {
            typeRouteDisplay.appendChild(document.createTextNode("เส้นทาง มีจุดเริ่มต้นและสิ้นสุดให้บริการ จุดเดียวกัน"));
        }

        if (nameColor_2 != "" && hexColor_2 != "") {
            colorRouteDisplay.innerHTML = `${nameColor_1} (<span style="background-color: ${hexColor_1};">${hexColor_1}</span>), ${nameColor_2} (<span style="background-color: ${hexColor_2};">${hexColor_2}</span>)`;
        } else {
            colorRouteDisplay.innerHTML = `${nameColor_1} (<span style="background-color: ${hexColor_1};">${hexColor_1}</span>)`;
        }

        driverIdAccountDisplay.value = driverIdAccount;
        passwordDisplay.value = password;

        dateBirthDisplay.appendChild(document.createTextNode(setTHDateBirth(day, month, year)));
        ageDisplay.appendChild(document.createTextNode(calculateBirthAge(day, month, year)));
        identificationNumberDisplay.appendChild(document.createTextNode(`${identificationNumber.substring(0, 1)}-${identificationNumber.substring(1, 5)}-${identificationNumber.substring(5, 10)}-${identificationNumber.substring(10, 12)}-${identificationNumber.substring(12, 13)}`));
        addressDisplay.appendChild(document.createTextNode(`${address} | ${subDistrict == "" ? "" : "ต." + subDistrict} อ.${district} จ.${province} (${postCode})`));
        licenseDriverDisplay.appendChild(document.createTextNode(`${licenseFirst}${licenseProvince}${licenseCenter}/${licenseEnd}`));

        if (accessLevel == "driver") {
            accessLevelInput.value = "บัญชีผู้ขับ";
            accessLevelInput.classList.add("text-info");
        }

        if (accessStatus == "online") {
            accessStatusInput.value = "ใช้งาน";
            accessStatusInput.classList.add("text-success");
        } else if (accessStatus == "investigate") {
            accessStatusInput.value = "ระงับการใช้งานชั่วคราว";
            accessStatusInput.classList.add("text-info");
        } else if (accessStatus == "offline") {
            if (getCookie("accessLevel") == "admin") {
                const buttonElm = document.createElement("button");
                buttonElm.setAttribute("class", "col-md-3 col-12 btn btn-danger using-custom-font pt-2 pb-2 m-2");
                buttonElm.setAttribute("onclick", "deleteAccount()");
                buttonElm.type = "button";
                buttonElm.innerHTML = '<i class="far fa-trash-alt"></i> ลบข้อมูล';
                footerContent.insertBefore(buttonElm, footerContent.firstChild);
            }

            accessStatusInput.value = "ยกเลิกการใช้งาน";
            accessStatusInput.classList.add("text-danger");
        }
    }

    async function onRunScript() {
        await getURLParams();
    }

    onRunScript();

})();

function linkToRoute() {
    window.location.href = `../route_management/profile_route_management.php?idRoute=${idRoute}`;
}

function showUserPassword(element) {
    const passwordInput = document.querySelector("input[name='password']");

    if (passwordInput.type == "password") {
        passwordInput.type = "text";
        passwordInput.classList.add("custom-input-disabled");
        element.classList.replace("btn-success", "btn-warning");
        element.innerHTML = "ซ่อนรหัสผ่าน";
    } else {
        passwordInput.type = "password";
        passwordInput.classList.remove("custom-input-disabled");
        element.classList.replace("btn-warning", "btn-success");
        element.innerHTML = "แสดงรหัสผ่าน";
    }
}

function setTHDateBirth(day, month, year) {
    const monthName = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฏาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    return `${parseInt(day)} ${monthName[(parseInt(month) - 1)]} พ.ศ. ${parseInt(year)} (${(parseInt(year) - 543)})`;
}

function calculateBirthAge(day, month, year) {
    const dateBirth = new Date(`${(year - 543)}-${month}-${day}`);
    const diff = moment(dateBirth).diff(moment(), 'milliseconds');
    const years = Math.abs(moment.duration(diff).years());
    const months = Math.abs(moment.duration(diff).months());
    const days = Math.abs(moment.duration(diff).days());
    let result = "";

    if (months < 1 || days == 0) {
        result = `${years} ปี / น้อยกว่า 1 เดือน`;
    } else if (months >= 1) {
        result = `${years} ปี / ${months} เดือน`;
    }

    return result;
}

function editPageLink() {
    window.location.href = `./edit_driver_account.php?idAccount=${userIdAccount}`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteAccount() {
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
        fetch(`${urlAPIServer}/profile_driver_account?idAccount=${userIdAccount}&idRoute=${useIdRoute}`, {
                method: 'DELETE',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = "./driver_account.php";
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