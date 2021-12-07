let urlAPIServer;

document.querySelector("#form_login_system").addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        verifyInputForm();
    }
});

(() => {

    async function getURLServer() {
        const settingFile = await fetch("/TRC_Tracking/src/js/_setting.json").then((value) => {
            return value.json();
        });
        urlAPIServer = settingFile.urlAPIServer;
    }

    async function onRunScript() {
        await getURLServer();
    }

    onRunScript();

})();

async function verifyInputForm() {
    const emailInput = document.querySelector("#loginEmailInput > input");
    const emailText = document.querySelector("#loginEmailInput > small");
    const passwordInput = document.querySelector("#loginPasswordInput > input");
    const passwordText = document.querySelector("#loginPasswordInput > small");
    const buttonSignIn = document.querySelector("#singInButton");
    const modalWarningText = document.querySelector("#bodyLoginStatusModal");
    const pTag = document.createElement("p");
    const valid_input = ["is-invalid"];

    emailInput.classList.remove(valid_input[0]);
    passwordInput.classList.remove(valid_input[0]);
    emailText.innerHTML = "";
    passwordText.innerHTML = "";

    if (emailInput.value.trim() == "") {
        emailInput.classList.add(valid_input[0]);
        emailText.innerHTML = "ไม่มีข้อมูลในช่อง อีเมล (Email) ของคุณ";
    } else {
        const reCheck = /\S+@\S+\.\S+/;
        if (!reCheck.test(emailInput.value)) {
            emailInput.classList.add(valid_input[0]);
            emailText.innerHTML = "รูปแบบ อีเมล (Email) ของคุณไม่ถูกต้อง";
        } else {
            if (passwordInput.value.trim() == "") {
                passwordInput.classList.add(valid_input[0]);
                passwordText.innerHTML = "ไม่มีข้อมูลในช่อง รหัสผ่าน (Password) ของคุณ";
            } else {
                emailInput.disabled = true;
                passwordInput.disabled = true;
                buttonSignIn.disabled = true;
                buttonSignIn.innerHTML = "<span class='spinner-border spinner-border-sm m-1' role='status' aria-hidden='true'></span> เข้าสู่ระบบ";

                const statusSignInSystem = await signInSystem();

                if (statusSignInSystem == "re-Email") {
                    emailInput.disabled = false;
                    passwordInput.disabled = false;
                    buttonSignIn.disabled = false;
                    buttonSignIn.innerHTML = "<i class='fas fa-sign-in-alt'></i> เข้าสู่ระบบ";
                    emailInput.classList.add(valid_input[0]);
                    emailText.innerHTML = "ไม่พบ อีเมล (Email) ของคุณในระบบ";
                    passwordInput.value = "";
                } else if (statusSignInSystem == "re-Password") {
                    emailInput.disabled = false;
                    passwordInput.disabled = false;
                    buttonSignIn.disabled = false;
                    buttonSignIn.innerHTML = "<i class='fas fa-sign-in-alt'></i> เข้าสู่ระบบ";
                    passwordInput.classList.add(valid_input[0]);
                    passwordText.innerHTML = "รหัสผ่าน (Password) ของคุณไม่ถูกต้อง";
                } else if (statusSignInSystem == "re-Send" || statusSignInSystem == "TypeError: Failed to fetch") {
                    emailInput.disabled = false;
                    passwordInput.disabled = false;
                    buttonSignIn.disabled = false;
                    buttonSignIn.innerHTML = "<i class='fas fa-sign-in-alt'></i> เข้าสู่ระบบ";
                } else {
                    pTag.innerHTML = "";
                    modalWarningText.innerHTML = "";

                    if (statusSignInSystem.accessStatus == "online") {
                        
                        window.location.href = `./login_process.php?idAccount=${statusSignInSystem.idAccount}&keyAccount=${statusSignInSystem.keyAccount}&profileImage=${statusSignInSystem.profileImage}&nameTitle=${statusSignInSystem.nameTitle}&nameFirst=${statusSignInSystem.nameFirst}&nameLast=${statusSignInSystem.nameLast}&accessLevel=${statusSignInSystem.accessLevel}`;
                    } else if (statusSignInSystem.accessStatus == "investigate") {
                        pTag.setAttribute("class", "using-custom-font text-center pl-2 pr-2 mt-3 mb-3");
                        pTag.innerHTML = `บัญชีผู้ใช้ของคุณ อีเมล (Email) : ${emailInput.value} ถูก <span class="text-info">ระงับการใช้งานชั่วคราว</span> โปรดติดต่อผู้ดูแลระบบเพื่อเปลี่ยนแปลงสถานะบัญชีผู้ใช้งานของคุณ และลงชื่อเข้าใช้งานอีกครั้ง`;
                        modalWarningText.appendChild(pTag);
                        $('#loginStatusModal').modal('toggle');

                        emailInput.disabled = false;
                        passwordInput.disabled = false;
                        buttonSignIn.disabled = false;
                        buttonSignIn.innerHTML = "<i class='fas fa-sign-in-alt'></i> เข้าสู่ระบบ";
                        passwordInput.value = "";
                    } else if (statusSignInSystem.accessStatus == "offline") {
                        pTag.setAttribute("class", "using-custom-font text-center pl-2 pr-2 mt-3 mb-3");
                        pTag.innerHTML = `บัญชีผู้ใช้ของคุณ อีเมล (Email) : ${emailInput.value} ถูก <span class="text-danger">ยกเลิกการใช้งาน</span> จากระบบ`;
                        modalWarningText.appendChild(pTag);
                        $('#loginStatusModal').modal('toggle');

                        emailInput.disabled = false;
                        passwordInput.disabled = false;
                        buttonSignIn.disabled = false;
                        buttonSignIn.innerHTML = "<i class='fas fa-sign-in-alt'></i> เข้าสู่ระบบ";
                        emailInput.value = "";
                        passwordInput.value = "";
                    }
                }
            }
        }
    }
}

async function signInSystem() {
    let dataPack = new FormData();
    const emailInput = document.querySelector("#loginEmailInput > input");
    const passwordInput = document.querySelector("#loginPasswordInput > input");

    dataPack.append("email", emailInput.value);
    dataPack.append("password", passwordEncryption(passwordInput.value));

    const returnValue = await new Promise((resolve, reject) => {
        fetch(`${urlAPIServer}/userLogin?user_type=internal_account`, {
                method: 'POST',
                body: dataPack
            })
            .then(async (response) => {
                const responseStatus = await response.status;

                if (responseStatus == 200) {
                    resolve(await response.json());
                } else if (responseStatus == 206 || responseStatus == 500) {
                    resolve(await response.text());
                }
            })
            .catch((error) => {
                resolve(error);
            });
    });

    return returnValue;
}

function passwordEncryption(password) {
    return md5(password.split("").reverse().join(""));
}

function acceptLoginStatus() {
    $('#loginStatusModal').modal('hide');
}