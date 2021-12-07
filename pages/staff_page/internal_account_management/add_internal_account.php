<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;
$menu_page_group = "internal_account";
$menu_page_name = "add_internal_account";

session_start();

if ($_SESSION["idAccount"] == null || $_SESSION["keyAccount"] == null) {
    header("location: /TRC_Tracking/pages/access_system/login.php");
} else if ($_COOKIE["idAccount"] != $_SESSION["idAccount"] || $_COOKIE["keyAccount"] != $_SESSION["keyAccount"] || $_COOKIE["accessLevel"] != $_SESSION["accessLevel"]) {
    header("location:/TRC_Tracking/pages/access_system/direct_logout_process.php");
}
?>

<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>TRC Tracking - เพิ่มบัญชีผู้ใช้ระบบภายใน</title>
    <?include $use_path . "/include/header_link.php"?>
    <link rel="stylesheet" href="<? echo $root_web_path ?>/src/css/data-form-style.css">
</head>

<body class="sidebar-mini layout-fixed sidebar-collapse">
    <div class="wrapper">
        <!-- Navbar -->
        <?include $use_path . "/include/navbar_link.php"?>
        <!-- Main Sidebar Container -->
        <?include $use_path . "/include/sidebar_link.php"?>
        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-10 d-flex justify-content-center justify-content-sm-start">
                            <h4 class="m-0 text-dark text-header-web text-center">เพิ่มบัญชีผู้ใช้ระบบภายใน</h4>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
            <!-- /.content-header -->
            <!-- Main content -->
            <section class="content" id="top_container">
                <div class="container-fluid">
                    <!-- Main row -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body pad table-responsive pl-md-4 pr-md-4 pl-2 pr-2 pt-4">
                                    <div class="container">
                                        <div class="card bg-danger d-none" id="card_danger_input">
                                            <div class="card-bod d-flex flex-row align-items-center pt-4 pb-4 pl-md-4 pr-md-4 pl-2 pr-2">
                                                <i class="fas fa-times-circle card-warning-input mr-4"></i>
                                                <p class="card-tex card-warning-text using-custom-font mb-0"></p>
                                            </div>
                                        </div>
                                        <div class="card bg-warning d-none" id="card_warning_input">
                                            <div class="card-bod d-flex flex-row align-items-center pt-4 pb-4 pl-md-4 pr-md-4 pl-2 pr-2">
                                                <i class="fas fa-exclamation-circle card-warning-input mr-4"></i>
                                                <p class="card-tex card-warning-text using-custom-font mb-0"></p>
                                            </div>
                                        </div>
                                        <form role="form" enctype="multipart/form-data" id="form_add_internal_account">
                                            <div class="row">
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลส่วนตัว</label>
                                                    </div>
                                                    <div class="form-group col-md-2 col-6 pl-md-2 pr-md-1 pl-0 pr-1 mb-md-1 mb-2" id="input_name_titles">
                                                        <label class="custom-form-label">คำนำหน้าชื่อ <span class="text-danger text-bold">*</span></label>
                                                        <select class="using-custom-font form-control">
                                                            <option>นาย</option>
                                                            <option>นางสาว</option>
                                                            <option>นาง</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group col-md-5 col-6 pl-md-1 pr-md-1 pl-1 pr-0 mb-md-1 mb-2" id="input_first_name">
                                                        <label class="custom-form-label">ชื่อ <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="first_name" placeholder="ชื่อ">
                                                    </div>
                                                    <div class="form-group col-md-5 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2" id="input_last_name">
                                                        <label class="custom-form-label">นามสกุล <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="last_name" placeholder="นามสกุล">
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2" id="input_birth_date">
                                                        <label class="custom-form-label">วัน / เดือน / ปีเกิด (พ.ศ) <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <select class="using-custom-font form-control col ml-0 mr-1" id="datepicker_day" onchange="setDatePickerMonth(this.value)">
                                                                <option value="0" selected disabled>วัน</option>
                                                            </select>
                                                            <select class="using-custom-font form-control col ml-1 mr-1" id="datepicker_month" onchange="setDatePickerYear(this.value)" disabled>
                                                                <option value="0" selected disabled>เดือน</option>
                                                            </select>
                                                            <select class="using-custom-font form-control col ml-1 mr-0" id="datepicker_year" onchange="setPasswordInput()" disabled>
                                                                <option value="0" selected disabled>ปี</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลติดต่อ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>อีเมล (Email)</b> ของบัญชีผู้ใช้ที่กรอกจะเป็น <u>อีเมล</u> สำหรับเข้าใช้งานระบบสำหรับผู้ใช้งานบัญชีนี้</small>
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" id="input_email">
                                                        <label class="custom-form-label">อีเมล (Email) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <input type="text" class="using-custom-font form-control" name="email" placeholder="อีเมล">
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-1 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" id="input_phone_number">
                                                        <label class="custom-form-label">เบอร์โทรศัพท์ (Tel.) <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <input type="text" class="using-custom-font form-control" name="phone_number" placeholder="เบอร์โทรศัพท์" maxlength="10" oninput="setPatternPhoneNumber(this)">
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2" id="input_address">
                                                        <label class="custom-form-label">ที่อยู่ </label>
                                                        <input type="text" class="using-custom-font form-control" name="address" placeholder="ที่อยู่">
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลบัญชีผู้ใช้งานระบบ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> รหัสผ่าน (Password)</b> สำหรับผู้ใช้งานบัญชีนี้จะถูกสร้างขึ้นอัจโนมัติ จากการนำ <u>วัน / เดือน / ปีเกิด (พ.ศ)</u> และ <u>เบอร์โทรศัพท์</u> 10 หลักมาสร้างเป็นรหัสผ่านชั่วคราวเพื่อให้ผู้ใช้งานบัญชีนี้เปลี่ยนในภายหลัง</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span>
                                                            <b> ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level)</b> สำหรับผู้ใช้งานบัญชีนี้ จะเป็นส่วนกำหนดการทำงานในส่วนงานของระบบ ในระดับการเข้าถึงส่วนนั้น ๆ</small>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" id="input_password">
                                                        <label class="custom-form-label">รหัสผ่าน (Password) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <input type="text" class="form-control using-custom-font" name="password" placeholder="ไม่มีข้อมูล วัน / เดือน / ปีเกิด (พ.ศ) และ เบอร์โทรศัพท์" disabled>
                                                            <div class="input-group-append">
                                                                <button class="btn btn-secondary using-custom-font" type="button" onclick="generatePasswordInput()">สร้างรหัสผ่าน</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" id="input_access_level">
                                                        <label class="custom-form-label">ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <select class="using-custom-font form-control text-primary" onchange="setAccessLevelOption(this.value)">
                                                            <option value="2" class="text-primary">บัญชีพนักงานระบบ</option>
                                                            <option value="1" class="text-warning">บัญชีผู้ดูแลระบบ</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" id="input_role_ids">
                                                        <label class="custom-form-label">บทบาท (Role) / IDs </label>
                                                        <input type="text" class="using-custom-font form-control" name="email" placeholder="บทบาท / IDs">
                                                    </div>
                                                </div>
                                                <div class="form-group col-12 pl-md-2 pr-md-2 pl-0 pr-0 mt-2 mb-0" id="input_verify">
                                                    <hr>
                                                    <div class="w-100 row d-flex justify-content-center pl-md-0 pr-md-0 pl-5 pr-5 m-0">
                                                        <button type="button" class="col-md-3 col-12 btn btn-success using-custom-font pt-2 pb-2 m-2" onclick="verifyInputForm()"><i class="far fa-check-circle"></i> ตรวจสอบ</button>
                                                    </div>
                                                    <hr>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- /.row (main row) -->
                    </div><!-- /.container-fluid -->
            </section>
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->
        <div class="modal fade" id="verifyModal" tabindex="2" role="dialog" aria-labelledby="verifyModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title using-custom-font"><i class="far fa-check-circle"></i> ตรวจสอบ</h5>
                    </div>
                    <div class="modal-body" id="modalVerifyBody">
                        <div>
                            <form>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">บัญชีผู้ใช้ของ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_name" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">อีเมลบัญชี (Email Account)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_email" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">รหัสผ่านบัญชี (Password Account)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_password" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_access_level" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">สถานะบัญชีผู้ใช้ (Access Status)</label>
                                    <input type="text" class="form-control text-center text-info using-custom-font custom-input-disabled" id="verify_access_status" disabled>
                                </div>
                            </form>
                            <hr>
                            <p class="text-danger pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-circle"></i> โปรดตรวจสอบรายละเอียดข้อมูลต่าง ๆ ของบัญชีผู้ใช้งานนี้ก่อน <b><i class="fas fa-save"></i> บันทึกข้อมูล</b> เพื่อลดความผิดพลาดของข้อมูล หากบันทึกข้อมูลบัญชีผู้ใช้บ้างข้อมูลสามารถ<u>แก้ไขได้จากเจ้าของบัญชีนี้เท่านั้น</u></p>
                            <p class="text-info pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-triangle"></i> บัญชีผู้ใช้นี้จะอยู่ในสถานะ <b>ระงับการใช้งานชั่วคราว</b> บัญชีผู้ดูแลระบบต้องเปลี่ยนสถานะบัญชีนี้ก่อนนำบัญชีนี้เข้าสู่ระบบ </p>
                        </div>
                    </div>
                    <div class="modal-footer" id="modelVerifyFooter">
                        <button type="button" class="btn btn-danger mr-auto using-custom-font" onclick="closeModal('#verifyModal')"><i class="fas fa-times"></i> ยกเลิก</button>
                        <button type="button" class="btn btn-primary using-custom-font" onclick="saveData()"><i class="fas fa-save"></i> บันทึกข้อมูล</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- LogOut Modal -->
        <? include $use_path . "/include/modal_logout.php" ?>
        <!-- Footer -->
        <? include $use_path . "/include/footer_link.php"?>
        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->
    <?include $use_path . "/include/script_link.php"?>
    <script src="https://cdn.jsdelivr.net/npm/blueimp-md5@2.18.0/js/md5.min.js"></script>
    <script type="text/javascript"  src="/TRC_Tracking/src/js/internal_account/add_internal_account.js"></script>
</body>

</html>