let userIdAccount;
let urlAPIServer;

(() => {

    async function getURLParams() {
        const idAccount = new URLSearchParams(window.location.search).get("idAccount");
        if (idAccount == null) {
            window.location.href = "./internal_account.php";
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
            fetch(`${urlAPIServer}/profile_internal_account?idAccount=${userIdAccount}`, {
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
            profileImage: objectResponse.profileImage,
            name: `${objectResponse.nameTitle}${objectResponse.nameFirst} ${objectResponse.nameLast}`,
            email: objectResponse.email,
            phoneNumber: objectResponse.phoneNumber,
            accessLevel: objectResponse.accessLevel,
            accessStatus: objectResponse.accessStatus,
            day: objectResponse.dayBirth,
            month: objectResponse.monthBirth,
            year: objectResponse.yearBirth,
            address: objectResponse.address,
            passwordStatus: objectResponse.passwordStatus,
            roleIDs: objectResponse.roleIDs
        });
    }

    function setValueDisplay({
        profileImage,
        name,
        email,
        phoneNumber,
        accessLevel,
        accessStatus,
        day,
        month,
        year,
        address,
        passwordStatus,
        roleIDs
    }) {
        const profileImageDisplay = document.querySelector("#profile_image");
        const nameDisplay = document.querySelector("#name");
        const emailDisplay = document.querySelector("#email");
        const phoneNumberDisplay = document.querySelector("#phoneNumber");
        const statusBadgeDisplay = document.querySelector("#status_badge");
        const dateBirthDisplay = document.querySelector("#dateBirth");
        const ageDisplay = document.querySelector("#age");
        const addressDisplay = document.querySelector("#address");
        const accessLevelInput = document.querySelector("input[name='access_level']");
        const accessStatusInput = document.querySelector("input[name='access_status']");
        const passwordStatusInput = document.querySelector("input[name='password_status']");
        const roleIDsInput = document.querySelector("input[name='role_ids']");
        const footerContent = document.querySelector("#footerContent");

        const urlProfileImageDefault = "/TRC_Tracking/assets/image/default_profile_image.jpg";
        const badgeAccessLevel = document.createElement("span");
        const badgeAccessStatus = document.createElement("span");

        if (profileImage == "" || profileImage == null) {
            profileImageDisplay.src = urlProfileImageDefault;
        } else {
            profileImageDisplay.src = profileImage;
        }

        nameDisplay.appendChild(document.createTextNode(name));
        emailDisplay.appendChild(document.createTextNode(email));
        phoneNumberDisplay.appendChild(document.createTextNode(`${phoneNumber.substring(0, 3)}-${phoneNumber.substring(3, 6)}-${phoneNumber.substring(6, 10)}`));


        badgeAccessLevel.setAttribute("class", "badge p-1 mr-2");
        if (accessLevel == "admin") {
            badgeAccessLevel.classList.add("custom-badge-admin");
            badgeAccessLevel.appendChild(document.createTextNode("ผู้ดูแลระบบ"));
        } else if (accessLevel == "staff") {
            badgeAccessLevel.classList.add("custom-badge-staff");
            badgeAccessLevel.appendChild(document.createTextNode("พนักงานระบบ"));
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

        dateBirthDisplay.appendChild(document.createTextNode(setTHDateBirth(day, month, year)));
        ageDisplay.appendChild(document.createTextNode(calculateBirthAge(day, month, year)));
        addressDisplay.appendChild(document.createTextNode(address == "" ? "-" : address));

        if (accessLevel == "admin") {
            accessLevelInput.value = "บัญชีผู้ดูแลระบบ";
            accessLevelInput.classList.add("text-warning");
        } else if (accessLevel == "staff") {
            accessLevelInput.value = "บัญชีพนักงานระบบ";
            accessLevelInput.classList.add("text-primary");
        }

        if (accessStatus == "online") {
            accessStatusInput.value = "ใช้งาน";
            accessStatusInput.classList.add("text-success");
        } else if (accessStatus == "investigate") {
            accessStatusInput.value = "ระงับการใช้งานชั่วคราว";
            accessStatusInput.classList.add("text-info");
        } else if (accessStatus == "offline") {
            const buttonElm = document.createElement("button");
            buttonElm.setAttribute("class", "col-md-3 col-12 btn btn-danger using-custom-font pt-2 pb-2 m-2");
            buttonElm.setAttribute("onclick", "deleteAccount()");
            buttonElm.type = "button";
            buttonElm.innerHTML = '<i class="far fa-trash-alt"></i> ลบข้อมูล';
            footerContent.insertBefore(buttonElm, footerContent.firstChild);

            accessStatusInput.value = "ยกเลิกการใช้งาน";
            accessStatusInput.classList.add("text-danger");
        }

        if (passwordStatus == false) {
            passwordStatusInput.value = "สร้างโดยระบบ";
            passwordStatusInput.classList.add("text-primary");
        } else if (passwordStatus == true) {
            passwordStatusInput.value = "เปลี่ยนแปลงโดยผู้ใช้บัญชี";
            passwordStatusInput.classList.add("text-success");
        }

        roleIDsInput.value = roleIDs == "" ? "-" : roleIDs;

    }

    async function onRunScript() {
        await getURLParams();
    }

    onRunScript();

})();

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
    window.location.href = `./edit_internal_account.php?idAccount=${userIdAccount}`;
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
        fetch(`${urlAPIServer}/profile_internal_account?idAccount=${userIdAccount}`, {
                method: 'DELETE',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = "./internal_account.php";
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