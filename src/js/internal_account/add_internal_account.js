let urlAPIServer;
let generatePasswordLock = false;
let pageLock = false;

document.querySelector("#form_add_internal_account").addEventListener("change", () => {
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

    function setDatePickerDay() {
        const inputF = document.querySelector("#datepicker_day");
        const dayCount = 31;

        for (let i = 1; i <= dayCount; i++) {
            const selectOption = document.createElement("option");
            if (i < 10) {
                selectOption.value = `0${i}`;
            } else {
                selectOption.value = i;
            }
            selectOption.text = i;
            inputF.appendChild(selectOption);
        }
    }

    async function onRunScript() {
        await getURLServer();
        setDatePickerDay();
        setPasswordInput();
    }

    onRunScript();

})();

function setDatePickerMonth(value) {
    const inputF = document.querySelector("#datepicker_month");
    const optionF = Array.from(document.querySelectorAll("#datepicker_month > option"));
    const monthRef = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const monthTitle = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    if (value != 0) {
        inputF.disabled = false;

        if (optionF.length > 1) {
            optionF.forEach((v, i) => {
                if (optionF[i].value > 0) {
                    inputF.removeChild(optionF[i]);
                }
            });
        }

        if (value == 31) {
            const monthTitleRemove = ["ก.พ.", "เม.ย.", "มิ.ย.", "ก.ย.", "พ.ย."];
            monthTitleRemove.forEach((v) => {
                monthTitle.splice(monthTitle.indexOf(v), 1);
            });
        } else if (value == 30) {
            const monthTitleRemove = "ก.พ.";
            monthTitle.splice(monthTitle.indexOf(monthTitleRemove), 1);
        }

        monthTitle.forEach((v) => {
            const selectOption = document.createElement("option");
            const monthNumber = monthRef.indexOf(v) + 1;
            if (monthNumber < 10) {
                selectOption.value = `0${monthNumber}`;
            } else {
                selectOption.value = monthNumber;
            }
            selectOption.text = `${v} (${monthNumber})`;
            inputF.appendChild(selectOption);
        });
    }
}

function setDatePickerYear(monthValue) {
    const inputF = document.querySelector("#datepicker_year");
    const optionF = Array.from(document.querySelectorAll("#datepicker_year > option"));
    const yearIndex = [2470, (new Date().getFullYear() + 543)];
    const dayValue = document.querySelector("#datepicker_day").value;

    if (monthValue != 0) {
        inputF.disabled = false;

        if (dayValue == 29 && monthValue == 02) {
            let leapYear = yearIndex[1];
            let leapYearStart = 0;

            while (leapYear > yearIndex[0]) {
                const selectOption = document.createElement("option");

                if (leapYearStart == 0) {
                    if (((leapYear % 4 == 0) && (leapYear % 100 != 0)) || (leapYear % 400 == 0)) {
                        leapYearStart = leapYear;
                    } else {
                        leapYear--;
                    }
                }

                selectOption.value = leapYear;
                selectOption.text = leapYear;
                inputF.appendChild(selectOption);
                leapYear -= 4;
            }
        } else {
            for (let i = yearIndex[1]; i >= yearIndex[0]; i--) {
                const selectOption = document.createElement("option");
                selectOption.value = i;
                selectOption.text = i;
                inputF.appendChild(selectOption);
            }
        }
    }
}

function setPatternPhoneNumber(element) {
    element.value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if (element.value.length == 10) {
        const isSetValue = element.value;
        if (isSetValue.length == 10) {
            element.value = `${isSetValue.substring(0, 3)}-${isSetValue.substring(3, 6)}-${isSetValue.substring(6, 10)}`;
        }
    }

    setPasswordInput();
}

function setPasswordInput() {
    const inputF = document.querySelector("#input_password > div.input-group > input");
    const buttonF = document.querySelector("#input_password > div.input-group > div.input-group-append > button");
    const dayValue = document.querySelector("#datepicker_day").value;
    const monthValue = document.querySelector("#datepicker_month").value;
    const yearValue = document.querySelector("#datepicker_year").value;
    const phoneNumberValue = document.querySelector("#input_phone_number > input").value;

    inputF.classList.remove("text-right", "custom-input-disabled");
    buttonF.disabled = true;
    buttonF.classList.replace("btn-primary", "btn-secondary");

    if (yearValue == 0 && phoneNumberValue.length == 0) {
        inputF.placeholder = "ไม่มีข้อมูล วัน / เดือน / ปีเกิด (พ.ศ) และ เบอร์โทรศัพท์";
    } else if (yearValue == 0 && phoneNumberValue.length < 10) {
        inputF.placeholder = "ไม่มีข้อมูล วัน / เดือน / ปีเกิด (พ.ศ) และข้อมูล เบอร์โทรศัพท์ ไม่ครบ";
    } else if (yearValue == 0) {
        inputF.placeholder = "ไม่มีข้อมูล วัน / เดือน / ปีเกิด (พ.ศ)";
    } else if (phoneNumberValue == "") {
        inputF.placeholder = "ไม่มีข้อมูล เบอร์โทรศัพท์";
    } else if (phoneNumberValue.length < 10) {
        inputF.placeholder = "ข้อมูล เบอร์โทรศัพท์ ไม่ครบ";
    } else {
        inputF.classList.add("text-right", "custom-input-disabled");
        inputF.placeholder = "กดเพื่อปุ่ม สร้างรหัสผ่าน เพื่อสร้างรหัสผ่านอัตโนมัติ →";
        buttonF.disabled = false;
        buttonF.classList.replace("btn-secondary", "btn-primary");
    }
}

function generatePasswordInput() {
    const inputF = document.querySelector("#input_password > div.input-group > input");
    const buttonF = document.querySelector("#input_password > div.input-group > div.input-group-append > button");
    const dayInput = document.querySelector("#datepicker_day");
    const monthInput = document.querySelector("#datepicker_month");
    const yearInput = document.querySelector("#datepicker_year");
    const phoneNumberInput = document.querySelector("#input_phone_number > input");

    if (generatePasswordLock == false) {
        buttonF.classList.replace("btn-primary", "btn-warning");
        buttonF.classList.add("text-white");
        buttonF.innerHTML = "เปลี่ยนแปลงข้อมูล";
        dayInput.disabled = true;
        monthInput.disabled = true;
        yearInput.disabled = true;
        phoneNumberInput.disabled = true;
        inputF.classList.replace("text-right", "text-center");
        inputF.value = `${parseInt(dayInput.value)}${parseInt(monthInput.value)}${parseInt(yearInput.value)}_${phoneNumberInput.value.replace(/-/g,"")}`;
        generatePasswordLock = true;
    } else {
        buttonF.classList.replace("btn-warning", "btn-primary");
        buttonF.classList.remove("text-white");
        buttonF.innerHTML = "สร้างรหัสผ่าน";
        dayInput.disabled = false;
        monthInput.disabled = false;
        yearInput.disabled = false;
        phoneNumberInput.disabled = false;
        inputF.classList.replace("text-center", "text-right");
        inputF.value = "";
        generatePasswordLock = false;
    }
}

function setAccessLevelOption(value) {
    const inputF = document.querySelector("#input_access_level > select");

    if (value == 1) {
        inputF.classList.replace("text-primary", "text-warning");
    } else if (value == 2) {
        inputF.classList.replace("text-warning", "text-primary");
    }
}

async function verifyInputForm() {
    const cardDanger = document.querySelector("#card_danger_input");
    const cardDangerText = document.querySelector("#card_danger_input > div > p");
    const cardWarning = document.querySelector("#card_warning_input");
    const cardWarningText = document.querySelector("#card_warning_input > div > p");
    const nameTInput = document.querySelector("#input_name_titles > select");
    const nameFInput = document.querySelector("#input_first_name > input");
    const nameLInput = document.querySelector("#input_last_name > input");
    const dayInput = document.querySelector("#datepicker_day");
    const monthInput = document.querySelector("#datepicker_month");
    const yearInput = document.querySelector("#datepicker_year");
    const emailInput = document.querySelector("#input_email > input");
    const phoneNumberInput = document.querySelector("#input_phone_number > input");
    const passwordInput = document.querySelector("#input_password > div.input-group > input");
    const accessLevelInput = document.querySelector("#input_access_level > select");
    const nameVerify = document.querySelector("#verify_name");
    const emailVerify = document.querySelector("#verify_email");
    const passwordVerify = document.querySelector("#verify_password");
    const accessLevelVerify = document.querySelector("#verify_access_level");
    const accessStatusVerify = document.querySelector("#verify_access_status");
    const classAdd = ["is-invalid", "border-danger", "border-warning"];
    let onUnCheckInput = [];
    let onCheck = true;

    cardDanger.classList.replace("d-block", "d-none");
    cardWarning.classList.replace("d-block", "d-none");
    nameFInput.classList.remove(classAdd[0]);
    nameLInput.classList.remove(classAdd[0]);
    dayInput.classList.remove(classAdd[1]);
    monthInput.classList.remove(classAdd[1]);
    yearInput.classList.remove(classAdd[1]);
    emailInput.classList.remove(classAdd[0]);
    emailInput.classList.remove(classAdd[2]);
    phoneNumberInput.classList.remove(classAdd[0]);
    passwordInput.classList.remove(classAdd[1]);

    if (nameFInput.value.trim() == "") {
        nameFInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ชื่อ");
        onCheck = false;
    }

    if (nameLInput.value.trim() == "") {
        nameLInput.classList.add(classAdd[0]);
        onUnCheckInput.push("นามสกุล");
        onCheck = false;
    }

    if (dayInput.value == "0") {
        dayInput.classList.add(classAdd[1]);
        onUnCheckInput.push("วัน");
        onCheck = false;
    }

    if (monthInput.value == "0") {
        monthInput.classList.add(classAdd[1]);
        onUnCheckInput.push("เดือน");
        onCheck = false;
    }

    if (yearInput.value == "0") {
        yearInput.classList.add(classAdd[1]);
        onUnCheckInput.push("ปีเกิด (พ.ศ)");
        onCheck = false;
    }

    if (emailInput.value.trim() == "") {
        emailInput.classList.add(classAdd[0]);
        onUnCheckInput.push("อีเมล (Email)");
        onCheck = false;
    } else {
        const reCheck = /\S+@\S+\.\S+/;
        if (!reCheck.test(emailInput.value)) {
            emailInput.classList.add(classAdd[0]);
            onUnCheckInput.push("อีเมล (Email) มีรูปแบบไม่ถูกต้อง");
            onCheck = false;
        }
    }

    if (phoneNumberInput.value.trim() == "") {
        phoneNumberInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เบอร์โทรศัพท์ (Tel.)");
        onCheck = false;
    } else {
        if (phoneNumberInput.value.trim() <= 11) {
            phoneNumberInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เบอร์โทรศัพท์ (Tel.) มีรูปแบบไม่ถูกต้อง");
        onCheck = false;
        }
    }

    if (passwordInput.value.trim() == "") {
        passwordInput.classList.add(classAdd[1]);
        onUnCheckInput.push("รหัสผ่าน (Password)");
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

        dataPack.append("data", emailInput.value);
        await new Promise((resolve, reject) => {
            fetch(`${urlAPIServer}/check_duplicate_data?condition=email&table_data=internal_account`, {
                    method: 'POST',
                    body: dataPack
                })
                .then((response) => {
                    response.text().then((value) => {
                        if (value == "false") {
                            onCheckValidate = false;
                            emailInput.classList.add(classAdd[2]);
                            onUnCheckValidate.push(`อีเมล (Email) : ${emailInput.value}`);
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

        if (await !onCheckValidate) {
            cardWarning.classList.replace("d-none", "d-block");
            cardWarningText.innerHTML = `ข้อมูลในช่องกรอกข้อมูลเหล่านี้ <b>${onUnCheckValidate.join(", ")}</b> ไม่พร้อมให้ใช้งานในระบบ โปรดตรวจสอบและเปลี่ยนแปลงข้อมูลอีกครั้ง ก่อนกดปุ่ม <i class="far fa-check-circle"></i> ตรวจสอบ อีกครั้ง`;
            document.querySelector("#top_container").scrollIntoView();
        } else {
            let accessLevelTitleTH = "";
            let accessLevelClass = "";

            if (accessLevelInput.value == 1) {
                accessLevelTitleTH = "บัญชีผู้ดูแลระบบ";
                accessLevelClass = "text-warning";
            } else if (accessLevelInput.value == 2) {
                accessLevelTitleTH = "บัญชีพนักงานระบบ";
                accessLevelClass = "text-primary";
            }

            accessLevelVerify.classList.remove("text-warning", "text-primary");

            nameVerify.value = `${nameTInput.value}${nameFInput.value} ${nameLInput.value}`;
            emailVerify.value = emailInput.value;
            passwordVerify.value = passwordInput.value;
            accessLevelVerify.classList.add(accessLevelClass);
            accessLevelVerify.value = accessLevelTitleTH;
            accessStatusVerify.value = "ระงับการใช้งานชั่วคราว";
            $('#verifyModal').modal('toggle');
        }
    }

}

async function saveData() {
    const classToRemove = ["custom-input-disabled"];
    const modalButton = Array.from(document.querySelectorAll("#modelVerifyFooter > button"));
    const nameVerify = document.querySelector("#verify_name");
    const emailVerify = document.querySelector("#verify_email");
    const passwordVerify = document.querySelector("#verify_password");
    const accessLevelVerify = document.querySelector("#verify_access_level");
    const accessStatusVerify = document.querySelector("#verify_access_status");

    nameVerify.classList.remove(classToRemove[0]);
    emailVerify.classList.remove(classToRemove[0]);
    passwordVerify.classList.remove(classToRemove[0]);
    accessLevelVerify.classList.remove(classToRemove[0]);
    accessStatusVerify.classList.remove(classToRemove[0]);

    modalButton[0].disabled = true;
    modalButton[1].disabled = true;
    modalButton[1].innerHTML = "<span class='spinner-border spinner-border-sm m-1' role='status' aria-hidden='true'></span> บันทึกข้อมูล";

    const statusSendData = await sendData();
    if (await statusSendData == "re-Send" || await statusSendData == "TypeError: Failed to fetch") {
        nameVerify.classList.add(classToRemove[0]);
        emailVerify.classList.add(classToRemove[0]);
        passwordVerify.classList.add(classToRemove[0]);
        accessLevelVerify.classList.add(classToRemove[0]);
        accessStatusVerify.classList.add(classToRemove[0]);

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='fas fa-save'></i> บันทึกข้อมูล";
    }
}


async function sendData() {
    const authorizationKey = new Headers();
    const dataPack = new FormData();
    const nameTInput = document.querySelector("#input_name_titles > select");
    const nameFInput = document.querySelector("#input_first_name > input");
    const nameLInput = document.querySelector("#input_last_name > input");
    const dayInput = document.querySelector("#datepicker_day");
    const monthInput = document.querySelector("#datepicker_month");
    const yearInput = document.querySelector("#datepicker_year");
    const emailInput = document.querySelector("#input_email > input");
    const phoneNumberInput = document.querySelector("#input_phone_number > input");
    const address = document.querySelector("#input_address > input");
    const passwordInput = document.querySelector("#input_password > div.input-group > input");
    const accessLevelInput = document.querySelector("#input_access_level > select");
    const roleIDsInput = document.querySelector("#input_role_ids > input");

    authorizationKey.append("Authorization", getCookie("keyAccount"));

    dataPack.append("nameTitles", nameTInput.value);
    dataPack.append("nameFirst", nameFInput.value);
    dataPack.append("nameLast", nameLInput.value);
    dataPack.append("dayBirth", dayInput.value);
    dataPack.append("monthBirth", monthInput.value);
    dataPack.append("yearBirth", yearInput.value);
    dataPack.append("email", emailInput.value);
    dataPack.append("phoneNumber", phoneNumberInput.value.replace(/-/g, ""));
    dataPack.append("password", passwordEncryption(passwordInput.value));
    dataPack.append("address", address.value);
    dataPack.append("accessLevel", accessLevelInput.value);
    dataPack.append("roleIDs", roleIDsInput.value);

    const returnValue = await new Promise((resolve, reject) => {
        fetch(`${urlAPIServer}/internal_account`, {
                method: 'POST',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = "./internal_account.php";
                        resolve();
                    } else if (value == "re-Email" || value == "re-Send") {
                        resolve("re-Send");
                    } else if (value == "re-Login" || value == "re-Login_KeyAccess") {
                        window.location.href = "TRC_Tracking/pages/access_system/direct_logout_process.php";
                        resolve();
                    }
                });
            })
            .catch((err) => {
                resolve(err);
            });
    });

    return returnValue;
}

function passwordEncryption(password) {
    return md5(password.split("").reverse().join(""));
}

function closeModal(idModal) {
    $(`${idModal}`).modal('hide');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}