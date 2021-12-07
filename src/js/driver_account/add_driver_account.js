let urlAPIServer;
let pageLock = false;
let shortNameProvince = [];
let fullNameRoute = [];

document.querySelector("#form_add_driver_account").addEventListener("change", () => {
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

    async function getAPIData() {
        const authorizationKey = new Headers();

        authorizationKey.append("Authorization", getCookie("keyAccount"));

        const data = new Promise((resolve, reject) => {
            fetch(`${urlAPIServer}/add_driver_account`, {
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
                    if (err == "TypeError: Failed to fetch") {
                        window.location.href = "/TRC_Tracking/pages/staff_page/driver_account_management/driver_account.php";
                    }
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
        shortNameProvince = await objectResponse.shortNameProvince;
        fullNameRoute = await objectResponse.serviceNameRoute;

        await setShortNameProvince();
        await setFullNameRoute();
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

    function setShortNameProvince() {
        const licenseProvinceInput = document.querySelector("select[name='license_province']");
        const licensePlateProvinceInput = document.querySelector("select[name='car_license_plate_province']");

        while (licenseProvinceInput.firstChild) {
            licenseProvinceInput.removeChild(licenseProvinceInput.lastChild);
            licensePlateProvinceInput.removeChild(licensePlateProvinceInput.lastChild);
        }

        shortNameProvince.forEach((v) => {
            const optionF = document.createElement("option");
            optionF.text = v;

            licenseProvinceInput.appendChild(optionF);
        });

        shortNameProvince.forEach((v) => {
            const optionF = document.createElement("option");
            optionF.text = v;

            licensePlateProvinceInput.appendChild(optionF);
        });

    }

    function setFullNameRoute() {
        const nameRouteInput = document.querySelector("select[name='service_route']");

        while (nameRouteInput.firstChild) {
            nameRouteInput.removeChild(nameRouteInput.lastChild);
        }

        fullNameRoute.forEach((v) => {
            const optionF = document.createElement("option");
            optionF.value = v.id;
            optionF.text = v.nameRoute;

            nameRouteInput.appendChild(optionF);
        });
    }

    async function onRunScript() {
        setDatePickerDay();
        await getURLServer();
        await getAPIData();
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

        setAgeInput();
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

        setAgeInput();
    }
}

function setAgeInput() {
    const dayInput = document.querySelector("#datepicker_day");
    const monthInput = document.querySelector("#datepicker_month");
    const yearInput = document.querySelector("#datepicker_year");

    if (dayInput.value != "0" && monthInput.value != "0" && yearInput.value != "0") {
        const dateBirth = new Date(`${(yearInput.value - 543)}-${monthInput.value}-${dayInput.value}`);
        const diff = moment(dateBirth).diff(moment(), 'milliseconds');
        const years = Math.abs(moment.duration(diff).years());
        const ageInput = document.querySelector("input[name='age']");

        ageInput.value = `${years} ปี`;
    }
}

function setPatternIdentificationNumber(element) {
    element.value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if (element.value.length == 13) {
        const isSetValue = element.value;
        if (isSetValue.length == 13) {
            element.value = `${isSetValue.substring(0, 1)}-${isSetValue.substring(1, 5)}-${isSetValue.substring(5, 10)}-${isSetValue.substring(10, 12)}-${isSetValue.substring(12, 13)}`;
        }
    }
}

function setPatternPhoneNumber(element) {
    element.value = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if (element.value.length == 10) {
        const isSetValue = element.value;
        if (isSetValue.length == 10) {
            element.value = `${isSetValue.substring(0, 3)}-${isSetValue.substring(3, 6)}-${isSetValue.substring(6, 10)}`;
            setIdAccountInput(true, element.value);
        }
    } else {
        setIdAccountInput(false);
    }
}

function setThaiInput(element) {
    const regex = /^[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]+$/g;

    if (regex.test(element.value) == false) {
        element.value = element.value.substr(0, element.value.length - 1);
    } else {
        element.value = element.value.trim();
    }

}

function setEnglishInput(element) {
    const regex = /^[a-z]+[a-z]*$/i;

    if (regex.test(element.value) == false) {
        element.value = element.value.substr(0, element.value.length - 1);
    } else {
        element.value = element.value.trim();
    }
}

function setIntegerInput(element) {
    const regex = /^[0-9]*?$/g;

    if (regex.test(element.value) == false) {
        element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
    } else {
        element.value = element.value.toUpperCase().trim();
    }
}

function setLicensePlate(element) {
    const regex = /^[0-9\-]*?$/g;

    if (regex.test(element.value) == false) {
        element.value = element.value.toUpperCase().substr(0, element.value.length - 1);
    } else {
        element.value = element.value.toUpperCase().trim();
    }
}

function setLicenseDriverInput() {
    const licenseFirstInput = document.querySelector("input[name='license_first']");
    const licenseProvinceInput = document.querySelector("select[name='license_province']");
    const licenseCenterInput = document.querySelector("input[name='license_center']");
    const licenseEndInput = document.querySelector("input[name='license_end']");
    const licenseDriverInput = document.querySelector("input[name='license_driver']");

    licenseDriverInput.classList.remove("custom-input-disabled");

    if (licenseFirstInput.value.trim() != "" && licenseProvinceInput.value != "*" && licenseCenterInput.value.trim() != "" && licenseEndInput.value.trim() != "") {
        licenseDriverInput.value = `${licenseFirstInput.value.trim()}${licenseProvinceInput.value}${licenseCenterInput.value.trim()}/${licenseEndInput.value.trim()}`;
        licenseDriverInput.classList.add("custom-input-disabled");
    } else {
        licenseDriverInput.value = "";
    }
}

function setIdAccountInput(condition, value) {
    const driverIdAccount = document.querySelector("input[name='driver_id_account']");

    driverIdAccount.classList.remove("custom-input-disabled");

    if (condition) {
        driverIdAccount.value = value.replace(/-/g, "");
        driverIdAccount.classList.add("custom-input-disabled");
    } else {
        driverIdAccount.value = "";
    }
}

function generatePasswordInput(element) {
    const passwordInput = document.querySelector("input[name='password']");

    function generatePassword() {
        const codeLength = 12;
        let results = "";
        const characters = "0123456789";
        const charactersLength = characters.length;

        for (var i = 0; i < codeLength; i++) {
            results += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return results;
    }

    passwordInput.classList.add("custom-input-disabled");
    passwordInput.value = generatePassword();
    element.classList.replace("btn-primary", "btn-secondary");
    element.disabled = true;
    pageLock = true;
}

async function verifyInputForm() {
    const cardDanger = document.querySelector("#card_danger_input");
    const cardDangerText = document.querySelector("#card_danger_input > div > p");
    const cardWarning = document.querySelector("#card_warning_input");
    const cardWarningText = document.querySelector("#card_warning_input > div > p");

    const nameTInput = document.querySelector("select[name='title_name']");
    const nameFInput = document.querySelector("input[name='first_name']");
    const nameLInput = document.querySelector("input[name='last_name']");
    const ageInput = document.querySelector("input[name='age']");
    const identificationNumberInput = document.querySelector("input[name='identification_number']");
    const licenseDriverInput = document.querySelector("input[name='license_driver']");
    const driverIdAccountInput = document.querySelector("input[name='driver_id_account']");
    const passwordInput = document.querySelector("input[name='password']");
    const serviceRouteInput = document.querySelector("select[name='service_route']");
    const accessLevelInput = document.querySelector("select[name='access_level']");
    const carBrandTHInput = document.querySelector("input[name='car_brand_TH']");
    const carLicensePlateNumberInput = document.querySelector("input[name='car_license_plate_number']");
    const carLicensePlateProvinceInput = document.querySelector("select[name='car_license_plate_province']");
    const serviceTypeInput = document.querySelector("select[name='service_type']");

    const dayInput = document.querySelector("#datepicker_day");
    const monthInput = document.querySelector("#datepicker_month");
    const yearInput = document.querySelector("#datepicker_year");
    const phoneNumberInput = document.querySelector("input[name='phone_number']");
    const addressInput = document.querySelector("input[name='address']");
    const districtInput = document.querySelector("input[name='address_district']");
    const provinceInput = document.querySelector("input[name='address_province']");
    const postCodeInput = document.querySelector("input[name='address_post_code']");
    const licenseFirstInput = document.querySelector("input[name='license_first']");
    const licenseProvinceInput = document.querySelector("select[name='license_province']");
    const licenseCenterInput = document.querySelector("input[name='license_center']");
    const licenseEndInput = document.querySelector("input[name='license_end']");
    const carModelInput = document.querySelector("input[name='car_model']");
    const carYearInput = document.querySelector("input[name='car_year']");

    const carBrandENInput = document.querySelector("input[name='car_brand_EN']");
    const carSideLicenseInput = document.querySelector("input[name='car_side_license']");

    const nameVerify = document.querySelector("#verify_name");
    const identificationNumberVerify = document.querySelector("#verify_identification_number");
    const licenseDriverVerify = document.querySelector("#verify_license_driver");
    const driverIdAccountVerify = document.querySelector("#verify_driver_id_account");
    const passwordVerify = document.querySelector("#verify_password");
    const serviceRouteVerify = document.querySelector("#verify_service_route");
    const accessLevelVerify = document.querySelector("#verify_access_level");
    const carBrandVerify = document.querySelector("#verify_car_brand");
    const carLicensePlateVerify = document.querySelector("#verify_car_license_plate");
    const serviceTypeVerify = document.querySelector("#verify_service_type");
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
    ageInput.classList.remove(classAdd[0]);
    identificationNumberInput.classList.remove(classAdd[0]);
    phoneNumberInput.classList.remove(classAdd[0]);
    addressInput.classList.remove(classAdd[0]);
    districtInput.classList.remove(classAdd[0]);
    provinceInput.classList.remove(classAdd[0]);
    postCodeInput.classList.remove(classAdd[0]);
    licenseFirstInput.classList.remove(classAdd[0]);
    licenseProvinceInput.classList.remove(classAdd[1]);
    licenseCenterInput.classList.remove(classAdd[0]);
    licenseEndInput.classList.remove(classAdd[0]);
    licenseDriverInput.classList.remove(classAdd[1]);
    driverIdAccountInput.classList.remove(classAdd[1]);
    passwordInput.classList.remove(classAdd[1]);
    serviceRouteInput.classList.remove(classAdd[1]);
    accessLevelInput.classList.remove(classAdd[1]);
    carBrandTHInput.classList.remove(classAdd[0]);
    carModelInput.classList.remove(classAdd[0]);
    carYearInput.classList.remove(classAdd[0]);
    carLicensePlateNumberInput.classList.remove(classAdd[1]);
    carLicensePlateProvinceInput.classList.remove(classAdd[1]);
    serviceTypeInput.classList.remove(classAdd[1]);

    nameTInput.classList.remove(classAdd[2]);
    nameFInput.classList.remove(classAdd[2]);
    nameLInput.classList.remove(classAdd[2]);
    identificationNumberInput.classList.remove(classAdd[2]);
    phoneNumberInput.classList.remove(classAdd[2]);
    driverIdAccountInput.classList.remove(classAdd[2]);

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

    if (ageInput.value.trim() == "") {
        ageInput.classList.add(classAdd[0]);
        onUnCheckInput.push("อายุ");
        onCheck = false;
    }

    if (identificationNumberInput.value.trim() == "") {
        identificationNumberInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เลขประจำตัวประชาชน");
        onCheck = false;
    } else {
        if (identificationNumberInput.value.trim().length <= 16) {
            identificationNumberInput.classList.add(classAdd[0]);
            onUnCheckInput.push("เลขประจำตัวประชาชน มีรูปแบบไม่ถูกต้อง");
            onCheck = false;
        }
    }

    if (phoneNumberInput.value.trim() == "") {
        phoneNumberInput.classList.add(classAdd[0]);
        onUnCheckInput.push("เบอร์โทรศัพท์ (Tel.)");
        onCheck = false;
    } else {
        if (phoneNumberInput.value.trim().length <= 11) {
            phoneNumberInput.classList.add(classAdd[0]);
            onUnCheckInput.push("เบอร์โทรศัพท์ (Tel.) รหัสไปรษณีย์");
            onCheck = false;
        }
    }

    if (addressInput.value.trim() == "") {
        addressInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ที่อยู่");
        onCheck = false;
    } else {
        if (addressInput.value.trim().length <= 2) {
            addressInput.classList.add(classAdd[0]);
            onUnCheckInput.push("ที่อยู่ ควรมีข้อมูลอย่างน้อย 3 ตัวอักษร");
            onCheck = false;
        }
    }

    if (districtInput.value.trim() == "") {
        districtInput.classList.add(classAdd[0]);
        onUnCheckInput.push("อำเภอ / เขต");
        onCheck = false;
    } else {
        if (districtInput.value.trim().length <= 2) {
            districtInput.classList.add(classAdd[0]);
            onUnCheckInput.push("อำเภอ / เขต ควรมีข้อมูลอย่างน้อย 3 ตัวอักษร");
            onCheck = false;
        }
    }

    if (provinceInput.value.trim() == "") {
        provinceInput.classList.add(classAdd[0]);
        onUnCheckInput.push("จังหวัด");
        onCheck = false;
    } else {
        if (provinceInput.value.trim().length <= 2) {
            provinceInput.classList.add(classAdd[0]);
            onUnCheckInput.push("จังหวัด ควรมีข้อมูลอย่างน้อย 3 ตัวอักษร");
            onCheck = false;
        }
    }

    if (postCodeInput.value.trim() == "") {
        postCodeInput.classList.add(classAdd[0]);
        onUnCheckInput.push("รหัสไปรษณีย์");
        onCheck = false;
    } else {
        if (postCodeInput.value.trim().length <= 4) {
            postCodeInput.classList.add(classAdd[0]);
            onUnCheckInput.push("รหัสไปรษณีย์ มีรูปแบบไม่ถูกต้อง");
            onCheck = false;
        }
    }

    if (licenseDriverInput.value.trim() == "") {
        licenseFirstInput.classList.add(classAdd[0]);
        licenseProvinceInput.classList.add(classAdd[1]);
        licenseCenterInput.classList.add(classAdd[0]);
        licenseEndInput.classList.add(classAdd[0]);
        licenseDriverInput.classList.add(classAdd[1]);
        onUnCheckInput.push("ข้อมูล / เลขที่ใบอนุญาตขับรถ");
        onCheck = false;
    }

    if (driverIdAccountInput.value.trim() == "") {
        driverIdAccountInput.classList.add(classAdd[1]);
        onUnCheckInput.push("รหัสบัญชีผู้ขับ");
        onCheck = false;
    }

    if (passwordInput.value.trim() == "") {
        passwordInput.classList.add(classAdd[1]);
        onUnCheckInput.push("รหัสผ่าน (Password)");
        onCheck = false;
    }

    if (serviceRouteInput.value == "*") {
        serviceRouteInput.classList.add(classAdd[1]);
        onUnCheckInput.push("เส้นทางเดินรถที่ให้บริการ");
        onCheck = false;
    }

    if (accessLevelInput.value == "0") {
        accessLevelInput.classList.add(classAdd[1]);
        onUnCheckInput.push("ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level)");
        onCheck = false;
    }

    if (carBrandTHInput.value.trim() == "") {
        carBrandTHInput.classList.add(classAdd[0]);
        onUnCheckInput.push("ยี่ห้อรถผู้ขับ (ภาษาไทย)");
        onCheck = false;
    } else {
        if (carBrandTHInput.value.trim().length <= 2) {
            carBrandTHInput.classList.add(classAdd[0]);
            onUnCheckInput.push("ยี่ห้อรถผู้ขับ (ภาษาไทย) ควรมีข้อมูลอย่างน้อย 3 ตัวอักษร");
            onCheck = false;
        }
    }

    if (carModelInput.value.trim() == "") {
        carModelInput.classList.add(classAdd[0]);
        onUnCheckInput.push("รุ่น (Model)");
        onCheck = false;
    } else {
        if (carModelInput.value.trim().length <= 2) {
            carModelInput.classList.add(classAdd[0]);
            onUnCheckInput.push("รุ่น (Model) ควรมีข้อมูลอย่างน้อย 3 ตัวอักษร");
            onCheck = false;
        }
    }

    if (carYearInput.value.trim() == "") {
        carYearInput.classList.add(classAdd[0]);
        onUnCheckInput.push("รุ่นปี / โฉม");
        onCheck = false;
    } else {
        if (carYearInput.value.trim().length <= 1) {
            carYearInput.classList.add(classAdd[0]);
            onUnCheckInput.push("รุ่นปี / โฉม ควรมีข้อมูลอย่างน้อย 2 ตัวอักษร");
            onCheck = false;
        }
    }

    if (carLicensePlateNumberInput.value.trim() == "" || carLicensePlateProvinceInput.value == "*") {
        carLicensePlateNumberInput.classList.add(classAdd[1]);
        carLicensePlateProvinceInput.classList.add(classAdd[1]);
        onUnCheckInput.push("ทะเบียนรถ");
        onCheck = false;
    } else {
        if (carLicensePlateNumberInput.value.trim().length <= 6) {
            carLicensePlateNumberInput.classList.add(classAdd[1]);
            carLicensePlateProvinceInput.classList.add(classAdd[1]);
            onUnCheckInput.push("ทะเบียนรถ ควรมีข้อมูลอย่างน้อย 7 ตัวอักษร");
            onCheck = false;
        }
    }

    if (serviceTypeInput.value == "*") {
        serviceTypeInput.classList.add(classAdd[1]);
        onUnCheckInput.push("ประเภทการให้บริการ");
        onCheck = false;
    }

    if (onCheck == false) {
        cardDanger.classList.replace("d-none", "d-block");
        cardDangerText.innerHTML = `โปรดตรวจสอบข้อมูลในช่อง กรอกข้อมูล ดังนี้ <b>${onUnCheckInput.join(", ")}</b> ก่อนกดปุ่ม <i class="far fa-check-circle"></i> ตรวจสอบ อีกครั้ง`;
        document.querySelector("#top_container").scrollIntoView();
    } else {
        let onCheckValidate = [];
        let onUnCheckValidate = [];

        await new Promise((resolve, reject) => {
            let dataPack = new FormData();
            dataPack.append("data", `{"nameTitle": "${nameTInput.value}", "nameFirst": "${nameFInput.value.trim()}", "nameLast": "${nameLInput.value.trim()}"}`);
            fetch(`${urlAPIServer}/check_duplicate_data?condition=nameDriver`, {
                    method: 'POST',
                    body: dataPack
                })
                .then((response) => {
                    response.text().then((value) => {
                        if (value == "false") {
                            onCheckValidate[0] = false;
                            nameTInput.classList.add(classAdd[2]);
                            nameFInput.classList.add(classAdd[2]);
                            nameLInput.classList.add(classAdd[2]);
                            onUnCheckValidate.push(`ชื่อ-สกุล : ${nameTInput.value}${nameFInput.value.trim()} ${nameLInput.value.trim()}"`);
                            resolve();
                        } else {
                            onCheckValidate[0] = true;
                            resolve();
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        });

        await new Promise((resolve, reject) => {
            let dataPack = new FormData();
            dataPack.append("data", identificationNumberInput.value.trim().replace(/-/g, ""));
            fetch(`${urlAPIServer}/check_duplicate_data?condition=identificationNumber`, {
                    method: 'POST',
                    body: dataPack
                })
                .then((response) => {
                    response.text().then((value) => {
                        if (value == "false") {
                            onCheckValidate[1] = false;
                            identificationNumberInput.classList.add(classAdd[2]);
                            onUnCheckValidate.push(`เลขประจำตัวประชาชน : ${identificationNumberInput.value.trim()}`);
                            resolve();
                        } else {
                            onCheckValidate[1] = true;
                            resolve();
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        });

        await new Promise((resolve, reject) => {
            let dataPack = new FormData();
            dataPack.append("data", phoneNumberInput.value.trim().replace(/-/g, ""));
            fetch(`${urlAPIServer}/check_duplicate_data?condition=phoneNumber`, {
                    method: 'POST',
                    body: dataPack
                })
                .then((response) => {
                    response.text().then((value) => {
                        if (value == "false") {
                            onCheckValidate[2] = false;
                            phoneNumberInput.classList.add(classAdd[2]);
                            driverIdAccountInput.classList.add(classAdd[2]);
                            onUnCheckValidate.push(`เบอร์โทรศัพท์ (Tel.) และรหัสบัญชีผู้ขับ : ${phoneNumberInput.value.trim()}`);
                            resolve();
                        } else {
                            onCheckValidate[2] = true;
                            resolve();
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                });
        });

        if (await onCheckValidate[0] == false || onCheckValidate[1] == false || onCheckValidate[2] == false) {
            cardWarning.classList.replace("d-none", "d-block");
            cardWarningText.innerHTML = `ข้อมูลในช่องกรอกข้อมูลเหล่านี้ <b>${onUnCheckValidate.join(", ")}</b> ไม่พร้อมให้ใช้งานในระบบ โปรดตรวจสอบและเปลี่ยนแปลงข้อมูลอีกครั้ง ก่อนกดปุ่ม <i class="far fa-check-circle"></i> ตรวจสอบ อีกครั้ง`;
            document.querySelector("#top_container").scrollIntoView();
        } else if (await onCheckValidate[0] == true || onCheckValidate[1] == true || onCheckValidate[2] == true) {
            nameVerify.value = `${nameTInput.value}${nameFInput.value} ${nameLInput.value}`;
            identificationNumberVerify.value = identificationNumberInput.value;
            licenseDriverVerify.value = licenseDriverInput.value;
            driverIdAccountVerify.value = driverIdAccountInput.value;
            passwordVerify.value = passwordInput.value;
            serviceRouteVerify.value = findRouteName(serviceRouteInput.value);
            accessLevelVerify.classList.add("text-info");
            accessLevelVerify.value = "บัญชีผู้ขับ";
            carBrandVerify.value = `${carBrandTHInput.value}${carBrandENInput.value.trim() == "" ? "" : " (" + carBrandENInput.value.trim() + ")"} - ${carModelInput.value.trim()} (${carYearInput.value.trim()}) ${carSideLicenseInput.value.trim() == "" ? "" : "| " + carSideLicenseInput.value.trim()}`;
            carLicensePlateVerify.value = `${carLicensePlateNumberInput.value} ${carLicensePlateProvinceInput.value}`;
            serviceTypeVerify.value = "เส้นทาง มีจุดเริ่มต้นและสิ้นสุดให้บริการ จุดเดียวกัน";
            accessStatusVerify.value = "ระงับการใช้งานชั่วคราว";
            $('#verifyModal').modal('toggle');
        }
    }

}

async function saveData() {
    const classToRemove = ["custom-input-disabled"];
    const modalButton = Array.from(document.querySelectorAll("#modelVerifyFooter > button"));
    const nameVerify = document.querySelector("#verify_name");
    const identificationNumberVerify = document.querySelector("#verify_identification_number");
    const licenseDriverVerify = document.querySelector("#verify_license_driver");
    const driverIdAccountVerify = document.querySelector("#verify_driver_id_account");
    const passwordVerify = document.querySelector("#verify_password");
    const serviceRouteVerify = document.querySelector("#verify_service_route");
    const accessLevelVerify = document.querySelector("#verify_access_level");
    const carBrandVerify = document.querySelector("#verify_car_brand");
    const carLicensePlateVerify = document.querySelector("#verify_car_license_plate");
    const serviceTypeVerify = document.querySelector("#verify_service_type");
    const accessStatusVerify = document.querySelector("#verify_access_status");

    nameVerify.classList.remove(classToRemove[0]);
    identificationNumberVerify.classList.remove(classToRemove[0]);
    licenseDriverVerify.classList.remove(classToRemove[0]);
    driverIdAccountVerify.classList.remove(classToRemove[0]);
    passwordVerify.classList.remove(classToRemove[0]);
    serviceRouteVerify.classList.remove(classToRemove[0]);
    accessLevelVerify.classList.remove(classToRemove[0]);
    carBrandVerify.classList.remove(classToRemove[0]);
    carLicensePlateVerify.classList.remove(classToRemove[0]);
    serviceTypeVerify.classList.remove(classToRemove[0]);
    accessStatusVerify.classList.remove(classToRemove[0]);

    modalButton[0].disabled = true;
    modalButton[1].disabled = true;
    modalButton[1].innerHTML = "<span class='spinner-border spinner-border-sm m-1' role='status' aria-hidden='true'></span> บันทึกข้อมูล";

    const statusSendData = await sendData();
    if (await statusSendData == "re-Send" || await statusSendData == "TypeError: Failed to fetch") {
        nameVerify.classList.add(classToRemove[0]);
        identificationNumberVerify.classList.add(classToRemove[0]);
        licenseDriverVerify.classList.add(classToRemove[0]);
        driverIdAccountVerify.classList.add(classToRemove[0]);
        passwordVerify.classList.add(classToRemove[0]);
        serviceRouteVerify.classList.add(classToRemove[0]);
        accessLevelVerify.classList.add(classToRemove[0]);
        carBrandVerify.classList.add(classToRemove[0]);
        carLicensePlateVerify.classList.add(classToRemove[0]);
        serviceTypeVerify.classList.add(classToRemove[0]);
        accessStatusVerify.classList.add(classToRemove[0]);

        modalButton[0].disabled = false;
        modalButton[1].disabled = false;
        modalButton[1].innerHTML = "<i class='fas fa-save'></i> บันทึกข้อมูล";
    }
}

async function sendData() {
    const authorizationKey = new Headers();
    const dataPack = new FormData();
    const nameTInput = document.querySelector("select[name='title_name']");
    const nameFInput = document.querySelector("input[name='first_name']");
    const nameLInput = document.querySelector("input[name='last_name']");

    const identificationNumberInput = document.querySelector("input[name='identification_number']");
    const driverIdAccountInput = document.querySelector("input[name='driver_id_account']");
    const passwordInput = document.querySelector("input[name='password']");
    const serviceRouteInput = document.querySelector("select[name='service_route']");
    const carBrandTHInput = document.querySelector("input[name='car_brand_TH']");
    const carLicensePlateNumberInput = document.querySelector("input[name='car_license_plate_number']");
    const carLicensePlateProvinceInput = document.querySelector("select[name='car_license_plate_province']");

    const dayInput = document.querySelector("#datepicker_day");
    const monthInput = document.querySelector("#datepicker_month");
    const yearInput = document.querySelector("#datepicker_year");
    const phoneNumberInput = document.querySelector("input[name='phone_number']");
    const addressInput = document.querySelector("input[name='address']");
    const subDistrictInput = document.querySelector("input[name='address_sub_district']");
    const districtInput = document.querySelector("input[name='address_district']");
    const provinceInput = document.querySelector("input[name='address_province']");
    const postCodeInput = document.querySelector("input[name='address_post_code']");
    const licenseFirstInput = document.querySelector("input[name='license_first']");
    const licenseProvinceInput = document.querySelector("select[name='license_province']");
    const licenseCenterInput = document.querySelector("input[name='license_center']");
    const licenseEndInput = document.querySelector("input[name='license_end']");
    const carModelInput = document.querySelector("input[name='car_model']");
    const carYearInput = document.querySelector("input[name='car_year']");

    const carBrandENInput = document.querySelector("input[name='car_brand_EN']");
    const carSideLicenseInput = document.querySelector("input[name='car_side_license']");

    authorizationKey.append("Authorization", getCookie("keyAccount"));

    dataPack.append("nameTitles", nameTInput.value.trim());
    dataPack.append("nameFirst", nameFInput.value.trim());
    dataPack.append("nameLast", nameLInput.value.trim());
    dataPack.append("dayBirth", parseInt(dayInput.value));
    dataPack.append("monthBirth", parseInt(monthInput.value));
    dataPack.append("yearBirth", yearInput.value);
    dataPack.append("identificationNumber", identificationNumberInput.value.replace(/-/g, ""));
    dataPack.append("phoneNumber", phoneNumberInput.value.replace(/-/g, ""));
    dataPack.append("address", addressInput.value.trim());
    dataPack.append("subDistrict", subDistrictInput.value.trim());
    dataPack.append("district", districtInput.value.trim());
    dataPack.append("province", provinceInput.value.trim());
    dataPack.append("postCode", postCodeInput.value.trim());
    dataPack.append("licenseFirst", licenseFirstInput.value);
    dataPack.append("licenseProvince", licenseProvinceInput.value);
    dataPack.append("licenseCenter", licenseCenterInput.value);
    dataPack.append("licenseEnd", licenseEndInput.value);
    dataPack.append("driverIdAccount", driverIdAccountInput.value);
    dataPack.append("password", passwordInput.value);
    dataPack.append("serviceRoute", serviceRouteInput.value);
    dataPack.append("carBrandTH", carBrandTHInput.value.trim());
    dataPack.append("carBrandEN", carBrandENInput.value.trim());
    dataPack.append("carModel", carModelInput.value.trim());
    dataPack.append("carYear", carYearInput.value.trim());
    dataPack.append("carLicensePlateNumber", carLicensePlateNumberInput.value.trim());
    dataPack.append("carLicensePlateProvince", carLicensePlateProvinceInput.value);
    dataPack.append("carSideLicense", carSideLicenseInput.value.trim());

    const returnValue = await new Promise((resolve, reject) => {
        fetch(`${urlAPIServer}/driver_account`, {
                method: 'POST',
                headers: authorizationKey,
                body: dataPack
            })
            .then((response) => {
                response.text().then((value) => {
                    if (value == "successful") {
                        pageLock = false;
                        window.location.href = "./driver_account.php";
                        resolve();
                    } else if (value == "re-nameDriver" || value == "re-identificationNumber" || value == "re-phoneNumber" || value == "re-Send") {
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

function findRouteName(id) {
    let result;

    fullNameRoute.forEach((v, i) => {
        if (v.id == id) {
            result = v.nameRoute;
        }
    });

    return result;
}

function closeModal(idModal) {
    $(`${idModal}`).modal('hide');
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}