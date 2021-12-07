<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;
$menu_page_group = "trip_management";
$menu_page_name = "trip_management";

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
    <title>TRC Tracking - เพิ่มรอบเดินรถ</title>
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
                            <h4 class="m-0 text-dark text-header-web text-center">เพิ่มรอบเดินรถ</h4>
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
                                        <form role="form" enctype="multipart/form-data" id="form_add_trip_management">
                                            <div class="row">
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลเส้นทางเดินรถ</label>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">วัน / เดือน / ปี (พ.ศ) ที่ให้บริการ </label>
                                                        <div class="d-flex">
                                                            <input type="text" class="using-custom-font form-control custom-input-disabled col ml-0 mr-1" id="datepicker_day" value="วัน" disabled>
                                                            <input type="text" class="using-custom-font form-control custom-input-disabled col ml-1 mr-1" id="datepicker_month" value="เดือน" disabled>
                                                            <input type="text" class="using-custom-font form-control custom-input-disabled col ml-1 mr-0" id="datepicker_year" value="ปี" disabled>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รายการเส้นทางเดินรถ <span class="text-danger text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control custom-input-disabled" name="service_route" value="-" disabled>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาเริ่มต้นออกให้บริการ </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control " name="service_start_time" value="--:--" disabled>
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาฬิกา (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาสิ้นสุดออกให้บริการ </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control " name="service_end_time" value="--:--" disabled>
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาฬิกา (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาออกรอบให้บริการ </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control " name="service_time_round" value="0" disabled>
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาที (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">จำนวนรอบให้บริการ </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control " name="service_count_round" value="0" disabled>
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">รอบ</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาที่ใช้ให้บริการ (ประมาณ / เฉลี่ย) </label>
                                                        <div class="input-group">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text using-custom-font">~</span>
                                                            </div>
                                                            <input type="text" class="text-center using-custom-font form-control " name="service_time_average" value="0" disabled>
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาที (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ค่าบริการโดยสาร (ต่ำสุด - สูงสุด) </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control " name="price_passenger" value="0 บ. - 0 บ." disabled>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ค่าบริการส่งพัสดุ (ต่ำสุด - สูงสุด) </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control " name="price_supplies" value="0 บ. - 0 บ." disabled>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header text-sm-left text-center">ตารางเส้นทางเดินรถ <span id="countDisabledDisplay" class="text-danger"></span></label>
                                                    </div>
                                                    <div class="form-group col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-3 mb-2">
                                                        <div class="col-md-8 col-12 d-md-flex d-block mx-auto">
                                                            <button type="button" class="btn btn-block btn-primary using-custom-font m-0 mr-md-2 mr-0 mb-md-0 mb-2" id="switchRouteForward" onclick="switchRouteMode('forward')" >รอบเดินรถ เที่ยวขาไป</button>
                                                            <button type="button" class="btn btn-block btn-outline-primary using-custom-font m-0 ml-md-2 ml-0 mb-md-0 mb-2" id="switchRouteBackward" onclick="switchRouteMode('backward')" >รอบเดินรถ เที่ยวขากลับ</button>
                                                        </div>
                                                    </div>
                                                    <div class="w-100 d-flex justify-content-center align-content-center">
                                                        <div class="card-body pad table-responsive col-md-9 col-12 p-1">
                                                            <hr class="m-0">
                                                            <table class="table text-nowrap using-custom-font table-bordered">
                                                                <thead>
                                                                    <tr>
                                                                        <th style="width: 15px">ลำดับ</th>
                                                                        <th style="width: 30%">รหัสเส้นทางเดินรถ</th>
                                                                        <th style="width: 30%">เวลาให้บริการ</th>
                                                                        <th></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody id="tableBody">
                                                                    <tr name="trNo_0" class="bg-disabled">
                                                                        <td colspan="4" class="text-center text-danger"><i class="far fa-times-circle"></i> รายการเส้นทางเดินรถยังไม่ถูกต้อง</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    <div class="col-sm-12 d-flex d-md-none d-sm-flex justify-content-center mt-3 mb-2">
                                                        <small class="text-info text-sub-header-web">เลื่อนซ้ายขวาเพื่อดูตารางข้อมูลทั้งหมด <i class="fas fa-arrows-alt-h"></i></small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group col-12 pl-md-2 pr-md-2 pl-0 pr-0 mt-2 mb-0" id="input_verify">
                                                <!-- <hr>
                                                <div class="w-100 row d-flex justify-content-center pl-md-0 pr-md-0 pl-5 pr-5 m-0">
                                                    <button type="button" class="col-md-3 col-12 btn btn-success using-custom-font pt-2 pb-2 m-2" onclick="verifyInputForm()" disabled><i class="far fa-check-circle"></i> ตรวจสอบ</button>
                                                </div> -->
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
                                    <label class="custom-form-label">วัน / เดือน / ปี (พ.ศ) ที่ให้บริการ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="serviceDateVerify" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เส้นทางเดินรถ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="serviceRouteVerify" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เวลาให้บริการ (เวลา เริ่มต้น - สิ้นสุด ให้บริการ)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="serviceTimeVerify" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เวลาออกรอบให้บริการ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="serviceTimeRoundVerify" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">จำนวนรอบให้บริการ</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="serviceCountRoundVerify" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">จำนวนรอบให้บริการที่ยกเลิก (จากรอบเดินรถทั้งหมด)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="countTripDisabledVerify" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">จำนวนรอบให้บริการที่มีอยู่ในระบบ (รอบเดินรถเก่า)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="countTripVerify" disabled>
                                </div>
                                <hr>
                            </form>
                            <hr>
                            <div id="modelWaningFooter">
                                <p class="text-danger pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-circle"></i> โปรดตรวจสอบรายละเอียดข้อมูลต่าง ๆ ของรอบเดินรถก่อน <b><i class="fas fa-save"></i> บันทึกข้อมูล</b> หากเกิดข้อผิดพลาดเกี่ยวกับข้อมูล รอบเดินรถ จะไม่สามารถแก้ไขภายหลังได้ และเพื่อลดความผิดพลาดของข้อมูลในระบบ</u></p>
                            </div>
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
    <script type="text/javascript" src="/TRC_Tracking/src/js/trip_management/profile_trip_management.js"></script>
</body>

</html>