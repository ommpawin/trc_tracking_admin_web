<?php
include "../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;

session_start();

if ($_SESSION["idAccount"] != null || $_SESSION["keyAccount"] != null) {
    header("location: /TRC_Tracking/pages/staff_page/trip_management/trip_management.php");
} 

?>
<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>TRC Tracking - เข้าสู่ระบบ (บัญชีผู้ใช้ภายใน)</title>
    <?include $use_path . "/include/header_link.php"?>
    <link rel="stylesheet" href="<?echo $root_web_path ?>/src/css/login-form-style.css">
</head>

<body class="custom-login-page" cz-shortcut-listen="true">
    <div class="header-logo-system d-flex justify-content-center shadow-sm">
        <a class="nav-link d-inline-flex p-0" href="#">
            <img src="/TRC_Tracking/file/images/TRC_Tracking_White.png" class="image-brand-set margin-image-brand" alt="TRC Tracking Logo">
        </a>
    </div>
    <div class="h-100 w-100 row d-flex align-content-center justify-content-center ">
        <!-- <div class="col-6">
        </div> -->
        <div class="col-xl-6 col-12 p-md-5 p-3 my-auto">
            <div class="card mb-0">
                <div class="card-body">
                    <div class="container">
                        <form role="form" enctype="multipart/form-data" id="form_login_system">
                            <div class="row">
                                <div class="col-12 d-flex justify-content-center p-0 pl-md-5 pr-md-5 mt-4 mb-1">
                                    <label class="custom-card-header text-center">เข้าสู่ระบบ (บัญชีผู้ใช้ภายใน)</label>
                                </div>
                                <div class="col-12 mb-3">
                                    <hr>
                                </div>
                                <div class="form-group col-12 pl-md-5 pr-md-5 pl-0 pr-0 mb-md-2 mb-2" id="loginEmailInput">
                                    <label class="custom-form-label">อีเมลบัญชีผู้ใช้ (Email Account)</label>
                                    <input type="email" class="using-custom-font form-control custom-input-disabled" name="" placeholder="อีเมลบัญชีผู้ใช้">
                                    <small class="using-custom-font text-danger"></small>
                                </div>
                                <div class="form-group col-12 pl-md-5 pr-md-5 pl-0 pr-0 mb-md-2 mb-3" id="loginPasswordInput">
                                    <label class="custom-form-label">รหัสผ่านบัญชีผู้ใช้ (Password Account)</label>
                                    <input type="password" class="using-custom-font form-control custom-input-disabled" name="" placeholder="รหัสผ่านบัญชีผู้ใช้">
                                    <small class="using-custom-font text-danger"></small>
                                </div>
                                <div class="form-group col-12 pl-md-5 pr-md-5 pl-0 pr-0 m-0 mt-3 mb-4">
                                    <div class="w-100 row d-flex justify-content-center m-0">
                                        <button type="button" class="col-xl-4 col-12 btn btn-primary using-custom-font pt-2 pb-2 m-2" onclick="verifyInputForm()" id="singInButton"><i class="fas fa-sign-in-alt"></i> เข้าสู่ระบบ</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="w-100">
        <!-- Footer -->
        <?include $use_path . "/include/footer_link_un_margin.php"?>
    </div>
    <!-- Login Status Modal -->
    <div class="modal fade" id="loginStatusModal" tabindex="-1" role="dialog" aria-labelledby="loginStatusModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-danger text-center font-weight-norma using-custom-font mx-auto"><i class="fas fa-exclamation-circle"></i> พบปัญหาการเข้าสู่ระบบ</h5>
                    </div>
                    <div class="modal-body">
                        <div id="bodyLoginStatusModal">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-warning text-white using-custom-font mx-auto" onclick="acceptLoginStatus()">ตกลง</button>
                    </div>
                </div>
            </div>
        </div>
    <!-- ./wrapper -->
    <?include $use_path . "/include/script_link.php"?>
    <script src="https://cdn.jsdelivr.net/npm/blueimp-md5@2.18.0/js/md5.min.js"></script>
    <script src="/TRC_Tracking/src/js/access_system/login.js"></script>
</body>

</html>