<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;
$menu_page_group = "driver_account";
$menu_page_name = "add_driver_account";

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
    <title>TRC Tracking - เพิ่มบัญชีผู้ขับ</title>
    <?include $use_path . "/include/header_link.php"?>
    <link rel="stylesheet" href="<?echo $root_web_path ?>/src/css/data-form-style.css">
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
                            <h4 class="m-0 text-dark text-header-web text-center">เพิ่มบัญชีผู้ขับ</h4>
                        </div>
                        <div class="col-sm-2 d-flex align-items-center justify-content-center justify-content-md-end mt-3 m-md-0">
                            <p class="m-0 text-danger text-right text-sub-header-web"><i class="fas fa-sync-alt"></i> โหลดหน้านี้ใหม่เพื่ออัปเดทข้อมูล</p>
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
                                        <form role="form" enctype="multipart/form-data" id="form_add_driver_account">
                                            <div class="row">
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลส่วนตัวผู้ขับ</label>
                                                    </div>
                                                    <div class="form-group col-md-2 col-6 pl-md-2 pr-md-1 pl-0 pr-1 mb-md-1 mb-2">
                                                        <label class="custom-form-label">คำนำหน้าชื่อ <span class="text-danger text-bold">*</span></label>
                                                        <select class="using-custom-font form-control" name="title_name">
                                                            <option>นาย</option>
                                                            <option>นางสาว</option>
                                                            <option>นาง</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group col-md-5 col-6 pl-md-1 pr-md-1 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ชื่อ <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="first_name" placeholder="ชื่อ">
                                                    </div>
                                                    <div class="form-group col-md-5 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">นามสกุล <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="last_name" placeholder="นามสกุล">
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">วัน / เดือน / ปีเกิด (พ.ศ) <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <select class="using-custom-font form-control col ml-0 mr-1" id="datepicker_day" onchange="setDatePickerMonth(this.value)">
                                                                <option value="0" selected disabled>วัน</option>
                                                            </select>
                                                            <select class="using-custom-font form-control col ml-1 mr-1" id="datepicker_month" onchange="setDatePickerYear(this.value)" disabled>
                                                                <option value="0" selected disabled>เดือน</option>
                                                            </select>
                                                            <select class="using-custom-font form-control col ml-1 mr-0" id="datepicker_year" onchange="setAgeInput()" disabled>
                                                                <option value="0" selected disabled>ปี</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-2 col-3 pl-md-1 pr-md-1 pl-0 pr-1 mb-md-1 mb-2">
                                                        <label class="custom-form-label">อายุ <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control custom-input-disabled" name="age" placeholder="อายุ" disabled>
                                                    </div>
                                                    <div class="form-group col-md-4 col-9 pl-md-1 pr-md-2 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เลขประจำตัวประชาชน <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="identification_number" placeholder="เลขประจำตัวประชาชน" maxlength="13" oninput="setPatternIdentificationNumber(this)">
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลติดต่อ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>เบอร์โทรศัพท์ (Tel.)</b> ของผู้ขับ (บัญชีผู้ขับ) จะถูกใช้เป็น <b>รหัสบัญชีผู้ขับ</b> ทุกครั้ง สำหรับเข้าใช้งานระบบ TRC Transit (สำหรับผู้ขับ) และหากมีการเปลี่ยนแปลงเบอร์โทรศัพท์ระบบจะทำการเปลี่ยน <b>รหัสบัญชีผู้ขับ</b> อัตโนมัติทุกครั้ง</small>
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เบอร์โทรศัพท์ (Tel.) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <input type="text" class="using-custom-font form-control" name="phone_number" placeholder="เบอร์โทรศัพท์" maxlength="10" oninput="setPatternPhoneNumber(this)">
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ที่อยู่ (บ้านเลขที่, อาคาร, ซอย, ถนน) <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="address" placeholder="ที่อยู่" maxlength="128">
                                                    </div>
                                                    <div class="form-group col-md-2 col-6 pl-md-1 pr-md-2 pl-0 pr-1 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ตำบล <span class="text-muted">(ถ้ามี)</span> </label>
                                                        <input type="text" class="using-custom-font form-control" name="address_sub_district" placeholder="ตำบล" maxlength="64" oninput="setThaiInput(this)">
                                                    </div>
                                                    <div class="form-group col-md-4 col-6 pl-md-2 pr-md-2 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">อำเภอ / เขต <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="address_district" placeholder="อำเภอ / เขต" maxlength="64" oninput="setThaiInput(this)">
                                                    </div>
                                                    <div class="form-group col-md-4 col-6 pl-md-1 pr-md-2 pl-0 pr-1 mb-md-1 mb-2">
                                                        <label class="custom-form-label">จังหวัด <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="address_province" placeholder="จังหวัด" maxlength="64" oninput="setThaiInput(this)">
                                                    </div>
                                                    <div class="form-group col-md-4 col-6 pl-md-1 pr-md-2 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รหัสไปรษณีย์ <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="address_post_code" placeholder="รหัสไปรษณีย์" maxlength="5" oninput="setIntegerInput(this)">
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">เอกสารยื่นยันการใ้หบริการผู้ขับ</label>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ข้อมูลใบอนุญาตขับรถ <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <input type="text" class="using-custom-font form-control text-center col ml-0 mr-1" name="license_first" maxlength="1" placeholder="ตัวเลขนำหน้า" maxlength="1" oninput="setIntegerInput(this);setLicenseDriverInput()">
                                                            <select class="using-custom-font form-control col ml-0 mr-1" name="license_province" onchange="setLicenseDriverInput()">
                                                                <option value="*">-</option>
                                                            </select>
                                                            <input type="text" class="using-custom-font form-control text-center col ml-0 mr-1" name="license_center" maxlength="5" placeholder="ตัวเลข 5 หลัก" maxlength="5" oninput="setIntegerInput(this);setLicenseDriverInput()">
                                                            <h5 class="using-custom-font p-1 m-0 mt-1" style="font-weight: 400">/</h5>
                                                            <input type="text" class="using-custom-font form-control text-center col ml-1 mr-md-1 mr-0" name="license_end" maxlength="2" placeholder="ตัวเลข 2 หลัก" maxlength="2" oninput="setIntegerInput(this);setLicenseDriverInput()">
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เลขที่ใบอนุญาตขับรถ <span class="text-danger text-bold">*</span></label> <!-- //TODO: fix here -->
                                                        <div class="input-group">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text using-custom-font"><span class="d-md-inline d-none">ใบอนุญาตขับรถเลขที่</span><span class="d-md-none d-inline">เลขที่</span></span>
                                                            </div>
                                                            <input type="text" class="using-custom-font form-control" name="license_driver" placeholder="ยังไม่มีข้อมูลเลขที่ใบอนุญาตขับรถ" disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลบัญชีผู้ขับในระบบ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> รหัสบัญชีผู้ขับ</b> ของผู้ขับจะถูกสร้างขึ้นจาก <u>เบอร์โทรศัพท์</u> หากเบอร์โทรศัพท์มีการเปลี่ยนแปลงในภายหลัง รหัสบัญชีผู้ขับ จะถูกเปลี่ยนไปตามเบอร์โทรศัพท์ที่มีการเปลี่ยนแปง และผู้ขับจะกรอก <b>รหัสบัญชีผู้ขับ</b> สำหรับเข้าใช้งานระบบ</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> รหัสผ่าน (Password)</b> สำหรับผู้ใช้งานบัญชีนี้จะถูกสร้างขึ้นอัจโนมัติจากระบบ เพื่อเป็นรหัสผ่านชั่วคราวในการเข้าใช้งานระบบแก่ผู้ขับ และสามารถเปลี่ยนแปลงภายหลังได้หากผู้ขับเกิดปัญหากับบัญชีหรือการใช้งาน</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span>
                                                            <b> ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level)</b> สำหรับผู้ใช้งานบัญชีนี้ จะเป็นส่วนกำหนดการทำงานในส่วนงานของระบบ ในระดับการเข้าถึงส่วนนั้น ๆ</small>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รหัสบัญชีผู้ขับ <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <input type="text" class="using-custom-font form-control" name="driver_id_account" placeholder="ยังไม่มีข้อมูลเบอร์โทรศัพท์" disabled>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รหัสผ่าน (Password) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <input type="text" class="form-control using-custom-font" name="password" placeholder="รหัสผ่าน" disabled>
                                                            <div class="input-group-append">
                                                                <button class="btn btn-primary using-custom-font" type="button" onclick="generatePasswordInput(this)">สร้างรหัสผ่าน</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เส้นทางเดินรถที่ให้บริการ <span class="text-danger text-bold">*</span></label>
                                                        <select class="using-custom-font form-control" name="service_route">
                                                            <option value="*">-</option>
                                                        </select>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <select class="using-custom-font form-control text-info" name="access_level">
                                                            <option value="3" class="text-info">บัญชีผู้ขับ</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลบัญชีรถผู้ขับ</label>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ยี่ห้อรถผู้ขับ (ภาษาไทย) <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="car_brand_TH" placeholder="ยี่ห้อรถผู้ขับ ภาษาไทย" maxlength="64" oninput="setThaiInput(this)">
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-1 pr-md-1 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ยี่ห้อรถผู้ขับ (ภาษาอังกฤษ)</label>
                                                        <input type="text" class="using-custom-font form-control" name="car_brand_EN" placeholder="ยี่ห้อรถผู้ขับ ภาษาอังกฤษ" maxlength="64" oninput="setEnglishInput(this)">
                                                    </div>
                                                    <div class="form-group col-md-3 col-6 pl-md-1 pr-md-1 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รุ่น (Model) <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="car_model" placeholder="รุ่น" maxlength="64">
                                                    </div>
                                                    <div class="form-group col-md-3 col-6 pl-md-0 pr-md-2 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รุ่นปี / โฉม <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="car_year" placeholder="รุ่นปี / โฉม" maxlength="8">
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-1 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ทะเบียนรถ <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <input type="text" class="using-custom-font form-control col-8 ml-0 mr-1" name="car_license_plate_number" placeholder="ทะเบียนรถ" maxlength="8" oninput="setLicensePlate(this)">
                                                            <select class="using-custom-font form-control col ml-0 mr-1" name="car_license_plate_province">
                                                                <option value="*" class="text-info">-</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-4 col-6 pl-md-1 pr-md-1 pl-1 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">หมายเลขข้างรถ <span class="text-muted">(ถ้ามี)</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="car_side_license" placeholder="หมายเลขข้างรถ" maxlength="10" oninput="setLicensePlate(this)">
                                                    </div>
                                                    <div class="form-group col-md-4 col-6 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2" id="input_access_level">
                                                        <label class="custom-form-label">ประเภทการให้บริการ <span class="text-danger text-bold">*</span></label>
                                                        <select class="using-custom-font form-control" name="service_type">
                                                            <option value="1">เส้นทาง มีจุดเริ่มต้นและสิ้นสุดให้บริการ จุดเดียวกัน</option>
                                                        </select>
                                                    </div>
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
                                    <label class="custom-form-label">บัญชีผู้ขับของ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_name" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เลขประจำตัวประชาชน</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_identification_number" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เลขที่ใบอนุญาตขับรถ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_license_driver" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">รหัสบัญชีผู้ขับ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_driver_id_account" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">รหัสผ่าน (Password)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_password" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เส้นทางเดินรถที่ให้บริการ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_service_route" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_access_level" disabled>
                                </div>
                                <hr>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">ยี่ห้อรถผู้ขับ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_car_brand" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">ทะเบียนรถ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_car_license_plate" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">ประเภทการให้บริการ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_service_type" disabled>
                                </div>
                                <hr>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">สถานะบัญชีผู้ใช้ (Access Status)</label>
                                    <input type="text" class="form-control text-center text-info using-custom-font custom-input-disabled" id="verify_access_status" disabled>
                                </div>
                            </form>
                            <hr>
                            <p class="text-danger pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-circle"></i> โปรดตรวจสอบรายละเอียดข้อมูลต่าง ๆ ของบัญชีผู้ใช้งานนี้ก่อน <b><i class="fas fa-save"></i> บันทึกข้อมูล</b> เพื่อลดความผิดพลาดของข้อมูลในระบบ</u></p>
                            <p class="text-info pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-triangle"></i> บัญชีผู้ขับนี้จะอยู่ในสถานะ <b>ระงับการใช้งานชั่วคราว</b> บัญชีผู้ดูแลระบบหรือบัญชีพนักงานระบบ ต้องเปลี่ยนแปลงสถานะข้อมูลบัญชีผู้ขับนี้ก่อนผู้ขับนำบัญชีนี้เข้าสู่ระบบ ของผู้ขับ</p>
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
        <?include $use_path . "/include/modal_logout.php"?>
        <!-- Footer -->
        <?include $use_path . "/include/footer_link.php"?>
        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->
    <?include $use_path . "/include/script_link.php"?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous"></script>
    <script type="text/javascript" src="/TRC_Tracking/src/js/driver_account/add_driver_account.js"></script>
</body>

</html>