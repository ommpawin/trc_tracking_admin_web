<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;
$menu_page_group = "route_management";
$menu_page_name = "add_route_management";

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
    <title>TRC Tracking - เพิ่มเส้นทางเดินรถ</title>
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
                            <h4 class="m-0 text-dark text-header-web text-center">เพิ่มเส้นทางเดินรถ</h4>
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
                                        <form role="form" enctype="multipart/form-data" id="form_add_route_management">
                                            <div class="row">
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลเส้นทางเดินรถ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> รายละเอียด / ข้อมูลประจำเส้นทางเดินรถ (Keyword สำหรับค้นหา)</b> ระบุเพื่อให้ง่ายต่อการค้นหาข้อมูลเส้นทางเดินรถเส้นทางนี้ในระบบ และเป็นข้อความแสดงรายละเอียดของเส้นทางให้แก่ผู้ใช้บริการทราบนอกเหนือจากชื่อเส้นทางเดินรถ</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> สีประจำเส้นทางเดินรถ</b> จะถูกนำไปแสดงเป็นรายละเอียดของเส้นทางให้แก่ผู้ใช้บริการทราบทั้งสีของรถที่ให้บริการและสีของเส้นทางบนแผนที่ <u>หากเส้นทางเดินรถมีมากกว่า 1 สี</u> <b>การใช้สีที่ 2 ประจำเส้นทางเดินรถ</b> จะแสดงพร้อมกับรายละเอียดของเส้นทาง ทั้งสีที่ และสีที่ 2 แต่สีที่ 2 จะไม่แสดงผลบนแผนที่</small>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ชื่อเส้นทางเดินรถ <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <input type="text" class="using-custom-font form-control ml-0 mr-1" name="start_point_service" onfocusout="setNameRouteTag()" placeholder="จุดเริ่มต้นให้บริการ">
                                                            <input type="text" class="using-custom-font form-control ml-1 mr-0" name="end_point_service" onfocusout="setNameRouteTag()" placeholder="จุดสิ้นสุดให้บริการ">
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">รายละเอียด / ข้อมูลประจำเส้นทางเดินรถ (Keyword สำหรับค้นหา) <span class="text-warning text-bold">*</span></label>
                                                        <input type="text" class="using-custom-font form-control" name="route_keyword_detail" placeholder="รายละเอียด / ข้อมูลประจำเส้นทางเดินรถ" max="128">
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" id="route_color_1">
                                                        <label class="custom-form-label mt-1"><b>สีที่ 1</b> ประจำเส้นทางเดินรถ <span class="text-warning text-bold">*</span> <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <input type="text" class="using-custom-font form-control ml-0 mr-1" name="name_color_1" onfocus="setStaticText(this, 'สี')" oninput="setNameColor(this)" onfocusout="clearStaticText(this)" placeholder="ชื่อสีเส้นทางเดินรถ">
                                                            <div class="input-group ml-1 mr-0">
                                                                <input type="text" class="using-custom-font form-control" name="hex_color_picker_1" onfocus="setStaticText(this, '#')" oninput="setHexColor(this, 'preview_color_picker_1')" onfocusout="clearStaticText(this, 'preview_color_picker_1')" maxlength="7" placeholder="Hex Color เส้นทางเดินรถ">
                                                                <input type="color" class="col-2 form-control show-color-picker" name="preview_color_picker_1" oninput="setInputHexColor(this.value, 'hex_color_picker_1')">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-1 pr-md-2 pl-0 pr-0 mb-md-1 mb-2" id="route_color_2">
                                                        <label class="d-flex custom-form-label mt-1"><span><b>สีที่ 2</b> ประจำเส้นทางเดินรถ <span class="text-warning text-bold">*</span></span></label>
                                                        <div class="d-flex">
                                                            <button type="button" class="btn btn-block btn-outline-success using-custom-font" onclick="enableRouteColor()">ใช้สีที่ 2 ประจำเส้นทางเดินรถ</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลค่าบริการเส้นทางเดินรถ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>ค่าบริการโดยสาร และ ค่าบริการส่งพัสดุ ของเส้นทางเดินรถ </b> จะมีข้อมูล ค่าบริการเริ่มต้น - ค่าบริการสูงสุด โดยมีหน่วยเป็น บาท (บ.) และจะถูกนำไปแสดงเป็นรายละเอียดของเส้นทางให้แก่ผู้ใช้บริการทราบอัตราค่าบริการของเส้นทางเดินรถโดยจะแสดงราคาเริ่มต้น - ราคาสูงสุด ที่ผู้ขับสามารถเรียกเก็บได้</small>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ค่าบริการโดยสาร เส้นทางเดินรถ (ค่าบริการเริ่มต้น - ค่าบริการสูงสุด) <span class="text-warning text-bold">*</span> <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <div class="input-group ml-0 mr-2">
                                                                <input type="text" class="using-custom-font form-control" name="pricePassengerLower" oninput="detectDecimal(this)" onfocusout="setDecimal(this, 2);setPrice('pricePassengerLower', 'pricePassengerHigher')" placeholder="ค่าบริการเริ่มต้น (ขั้นต่ำ)">
                                                                <div class="input-group-append">
                                                                    <span class="input-group-text using-custom-font">บ.</span>
                                                                </div>
                                                            </div>
                                                            <h5 class="using-custom-font p-1 m-0">-</h5>
                                                            <div class="input-group ml-2 mr-0">
                                                                <input type="text" class="using-custom-font form-control" name="pricePassengerHigher" oninput="detectDecimal(this)" onfocusout="setDecimal(this, 2);setPrice('pricePassengerLower', 'pricePassengerHigher')" placeholder="ค่าบริการสูงสุด">
                                                                <div class="input-group-append">
                                                                    <span class="input-group-text using-custom-font">บ.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-6 col-12 pl-md-2 pr-md-2 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">ค่าบริการส่งพัสดุ เส้นทางเดินรถ (ค่าบริการเริ่มต้น - ค่าบริการสูงสุด) <span class="text-warning text-bold">*</span> <span class="text-danger text-bold">*</span></label>
                                                        <div class="d-flex">
                                                            <div class="input-group ml-0 mr-2">
                                                                <input type="text" class="using-custom-font form-control" name="priceSuppliesLower" oninput="detectDecimal(this)" onfocusout="setDecimal(this, 2);setPrice('priceSuppliesLower', 'priceSuppliesHigher')" placeholder="ค่าบริการเริ่มต้น (ขั้นต่ำ)">
                                                                <div class="input-group-append">
                                                                    <span class="input-group-text using-custom-font">บ.</span>
                                                                </div>
                                                            </div>
                                                            <h5 class="using-custom-font p-1 m-0">-</h5>
                                                            <div class="input-group ml-2 mr-0">
                                                                <input type="text" class="using-custom-font form-control" name="priceSuppliesHigher" oninput="detectDecimal(this)" onfocusout="setDecimal(this, 2);setPrice('priceSuppliesLower', 'priceSuppliesHigher')" placeholder="ค่าบริการสูงสุด">
                                                                <div class="input-group-append">
                                                                    <span class="input-group-text using-custom-font">บ.</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 mb-3 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูลเวลาและการให้บริการของเส้นทางเดินรถ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>เวลาเริ่มต้นออกให้บริการเส้นทางเดินรถ เวลาสิ้นสุดออกให้บริการเส้นทางเดินรถ และ เวลาที่ใช้ให้บริการเส้นทางเดินรถ (ประมาณ / เฉลี่ย)</b> จะถูกนำไปแสดงเป็นรายละเอียดของเส้นทางให้แก่ผู้ใช้บริการทราบเวลาให้บริการของเส้นทางเดินรถ</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>เวลาออกรอบให้บริการเส้นทางเดินรถ</b> ข้อมูลเวลาการออกให้บริการในแต่ละรอบของเส้นทางเดินรถ ในแต่ละเส้นทางเดินรถมีการให้บริการทุก ๆ กี่นาทีจะออกให้บริการ 1 คัน และจะเป็นข้อมูลสำหรับกำหนด รอบเดินรถต่อวัน</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>จำนวนรอบให้บริการเส้นทางเดินรถ</b> ข้อมูลจำนวนรอบภายใน 1 วัน (รอบต่อวัน) มีการให้บริการจากเส้นทางเดินรถกี่รอบ (1 รอบ = 1 คัน) และจะเป็นข้อมูลสำหรับกำหนด รอบเดินรถต่อวัน</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b>เวลาสิ้นสุดออกให้บริการเส้นทางเดินรถ</b> ข้อมูลเวลาที่คำนวณอัตโนมัติจาก <u>((เวลาออกรอบให้บริการ เส้นทางเดินรถ * จำนวนรอบให้บริการ เส้นทางเดินรถ) + เวลาเริ่มต้นออกให้บริการ เส้นทางเดินรถ)</u></small>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาเริ่มต้นออกให้บริการเส้นทางเดินรถ <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <input type="time" class="text-center using-custom-font form-control" name="service_start_time" onfocusout="calculateServiceEndTime()">
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาฬิกา (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาออกรอบให้บริการเส้นทางเดินรถ <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <input type="text" class="using-custom-font form-control" name="service_time_round" oninput="detectInteger(this, 1440)" onfocusout="calculateServiceEndTime()" maxlength="4" placeholder="เวลาออกรอบให้บริการ">
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาที (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">จำนวนรอบให้บริการเส้นทางเดินรถ <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <input type="text" class="using-custom-font form-control" name="service_count_round" oninput="detectInteger(this, 120)" onfocusout="calculateServiceEndTime()" maxlength="3" placeholder="จำนวนรอบให้บริการ">
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">รอบ</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-3 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาสิ้นสุดออกให้บริการเส้นทางเดินรถ <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <input type="text" class="text-center using-custom-font form-control custom-input-disabled" name="service_end_time" value="--:--" disabled>
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาฬิกา (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="form-group col-md-4 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2">
                                                        <label class="custom-form-label">เวลาที่ใช้ให้บริการเส้นทางเดินรถ (ประมาณ / เฉลี่ย) <span class="text-warning text-bold">*</span>
                                                            <span class="text-danger text-bold">*</span>
                                                        </label>
                                                        <div class="input-group">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text using-custom-font">~</span>
                                                            </div>
                                                            <input type="text" class="using-custom-font form-control" name="service_time_average" oninput="detectInteger(this, 1440)" maxlength="4" placeholder="เวลาที่ใช้ให้บริการเส้นทางเดินรถ">
                                                            <div class="input-group-append">
                                                                <span class="input-group-text using-custom-font">นาที (น.)</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row pl-3 pr-0 w-100">
                                                    <div class="col-12 pl-0 mt-1 mb-2">
                                                        <label class="custom-form-header">ข้อมูล แผนที่ / ตำแหน่ง เส้นทางเดินรถ</label>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> จุดเริ่มต้นให้บริการ (เที่ยวขาไป) จุดสิ้นสุดให้บริการ (เที่ยวขาไป) จุดเริ่มต้นให้บริการ (เที่ยวขากลับ) และจุดสิ้นสุดให้บริการ (เที่ยวขากลับ)</b> ข้อมูลตำแหน่งจุดเริ่มต้น / สิ้นสุดการให้บริการบนแผนที่โลก โดยจะแสดงเป็นจุดและถูกสร้างเป็นเส้นทาง สำหรับแสดงเป็นรายละเอียดของเส้นทางให้แก่ผู้ใช้บริการทราบ</small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> จุดเริ่มต้นให้บริการ (เที่ยวขาไป) <u>จะมีตำแหน่งบนแผนที่เดียวกับ</u> จุดสิ้นสุดให้บริการ (เที่ยวขากลับ)</b> และ <b>จุดเริ่มต้นให้บริการ (เที่ยวขากลับ) <u>จะมีตำแหน่งบนแผนที่เดียวกับ</u> จุดสิ้นสุดให้บริการ (เที่ยวขาไป)</b></small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-warning text-bold">*</span> <b> จุดเบี่ยงเส้นทาง (เที่ยวขาไป) และ จุดเบี่ยงเส้นทาง (เที่ยวขากลับ)</b> คือจุดสำหรับเบี่ยงเส้นทางในแผนที่ หากเส้นทางนั้นไปยังเส้นทางที่ไม่ต้องการ <u>จุดเบี่ยงเส้นทาง</u> จะกำหนดจุดเพื่อเปลี่ยนเส้นทางไปยัง จุดสิ้นสุดให้บริการ เพื่อให้ได้เส้นทางเดินรถของเส้นทางเดินรถ</small>
                                                        <hr class="mt-1 mb-1">
                                                        <small class="text-secondary using-custom-font"> <span class="text-info text-bold">*</span> <b> 1. เริ่มต้นสร้างเส้นทางเดินรถ</b> เลือก Select จุดเริ่มต้น หรือ จุดสิ้นสุด เลื่อนจุดบอกตำแหน่งบนแผนที่เพื่อเลือกตำแหน่งที่ต้องการบนแผนที่ หรือเพิ่มค่า ละติจูด (lon) และ ลองจิจูด (lat) ตำแหน่งบนแผนที่ที่ต้องการกด <b><i class="fas fa-plus"></i> เพิ่มข้อมูล</b></small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-info text-bold">*</span> <b> 2. ตรวจสอบข้อมูล</b> จุดเริ่มต้นให้บริการ และจุดสิ้นสุดให้บริการ ทั้งเที่ยวขาไป และเที่ยวขากลับ โดยในแผนที่จะแสดงหมุดตามสีและความหมาย ดังนี้ <b class="text-success"><i class="fas fa-map-marker-alt"></i> จุดเริ่มต้นเส้นทาง</b>, <b class="text-warning"><i class="text-warning fas fa-map-marker-alt"></i> จุดเบี่ยงเส้นทาง</b>, <b class="text-danger"><i class="text-danger fas fa-map-marker-alt"></i> จุดสิ้นสุดเส้นทาง</b></small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-info text-bold">*</span> <b> 3. เพิ่มจุดเบี่ยงเส้นทาง</b> เลือก Select จุดเบี่ยงขาไป หรือ จุดเบี่ยงขากลับ เลื่อนจุดบอกตำแหน่งบนแผนที่เพื่อเลือกตำแหน่งจุดเบี่ยงเส้นทางที่ต้องการบนแผนที่ หรือเพิ่มค่า ละติจูด (lon) และ ลองจิจูด (lat) จุดเบี่ยงเส้นทางที่ต้องการกด <b><i class="fas fa-plus"></i> เพิ่มข้อมูล</b></small>
                                                        <br>
                                                        <small class="text-secondary using-custom-font"> <span class="text-info text-bold">*</span> <b> 4. ตรวจสอบเส้นทางบนแผนที่</b> ทั้ง เส้นทางเดินรถเที่ยวขาไป และเที่ยวขากลับ หากเส้นทางไม่ถูกต้องสามารถกด <b><i class="fas fa-edit"></i> แก้ไข</b> หรือ <b><i class="far fa-trash-alt"></i> ลบ</b> เพื่อเปลี่ยนแปลง จุดเริ่มต้นให้บริการ และจุดเบี่ยงเส้นทาง</small>
                                                    </div>
                                                    <div class="form-group col-md-12 col-12 pl-md-2 pr-md-1 pl-0 pr-0 mb-md-1 mb-2" >
                                                        <label class="custom-form-label" id="routeMapLabel">เส้นทางเดินรถ <span class="text-info text-bold">*</span></label>
                                                        <div class="col-12 pl-0 pr-0 mb-1">
                                                            <div class="d-md-flex d-block" id="routeMapSelectType">
                                                                <select class="col-md-2 col-12 custom-select bg-primary using-custom-font pl-md-3 pl-2 pr-md-1 pr-0 mb-1" id="createRoutePinType">
                                                                    <option value="0">จุดเริ่มต้น</option>
                                                                    <option value="1">จุดสิ้นสุด</option>
                                                                    <option value="2" disabled>จุดเบี่ยงขาไป</option>
                                                                    <option value="3" disabled>จุดเบี่ยงขากลับ</option>
                                                                </select>
                                                                <div class="col-md col-12 input-group p-0 pl-md-2 pl-0 pr-md-1 pr-0 mb-1">
                                                                    <div class="input-group-prepend">
                                                                        <span class="input-group-text using-custom-font"><span class="d-xl-inline d-none">Latitude : lat</span><span class="d-xl-none">lat</span></span>
                                                                    </div>
                                                                    <input type="text" class="using-custom-font form-control" name="latitudePoint" oninput="detectLocationPoint(this)" onfocusout="setDecimal(this, 6)" max="19" placeholder="ตำแหน่งละติจูด">
                                                                </div>
                                                                <div class="col-md col-12 input-group p-0 pl-0 pr-0 mb-1">
                                                                    <div class="input-group-prepend">
                                                                        <span class="input-group-text using-custom-font"><span class="d-xl-inline d-none">Longitude : lon</span><span class="d-xl-none">lon</span></span>
                                                                    </div>
                                                                    <input type="text" class="using-custom-font form-control" name="longitudePoint" oninput="detectLocationPoint(this)" onfocusout="setDecimal(this, 6)" max="19" placeholder="ตำแหน่งลองจิจูด">
                                                                </div>
                                                                <div class="col-md-2 col-12 input-group p-0 pl-md-2 pl-0 pr-0 mt-md-0 mt-3 mb-1">
                                                                    <button type="button" class="btn btn-block btn-success using-custom-font text-truncate" onclick="setCreateRoute()"><i class="fas fa-plus"></i> เพิ่มข้อมูล</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="container p-0">
                                                            <div class="col-md-12 col-12 input-group border rounded p-1">
                                                                <div id="map" class="map-form-display"></div>
                                                            </div>
                                                            <div class="d-md-flex d-block">
                                                                <div class="col-md-6 col-12 input-group p-0 pr-md-2 pr-0 mt-2">
                                                                    <div class="col-12 d-flex flex-column side-form p-0">
                                                                        <div class="mb-2">
                                                                            <button type="button" class="btn btn-block btn-primary using-custom-font" id="switchFindRouteForward" onclick="switchFindRouteMode('forward')">เส้นทางเดินรถ เที่ยวขาไป</button>
                                                                        </div>
                                                                        <div>
                                                                            <label class="custom-form-label">จุดเริ่มต้นให้บริการ (เที่ยวขาไป) <span class="text-warning text-bold">*</span>
                                                                                <span class="text-info text-bold">*</span> <span class="text-danger text-bold">*</span>
                                                                            </label>
                                                                            <div class="input-group">
                                                                                <input type="text" class="using-custom-font form-control custom-input-disabled" name="start_point_forward" placeholder="ตำแหน่งจุดเริ่มต้นให้บริการ" disabled>
                                                                                <div class="input-group-append">
                                                                                    <button type="button" class="btn btn-warning using-custom-font text-white" id="start_point_forward_edit_btn" onclick="setEditRouteInput(4, '', 'จุดเริ่มต้น', 'start_point_forward', 'end_point_backward')" disabled><i class="fas fa-edit"></i><span class="d-md-inline d-none"> แก้ไข</span></button>
                                                                                </div>
                                                                            </div>
                                                                            <hr class="mb-1">
                                                                        </div>
                                                                        <div class="h-100">
                                                                            <label class="d-flex custom-form-label mt-1"><span>จุดเบี่ยงเส้นทาง (เที่ยวขาไป) <span class="text-warning text-bold">*</span>
                                                                                    <span class="text-info text-bold">*</span>
                                                                                </span>
                                                                                <span class="text-muted ml-auto mr-1" id="count_deviate_forward">(0 จุดเบี่ยง)</span>
                                                                            </label>
                                                                            <div class="h-100 site-form border pt-md-1 pt-0 pb-2 pl-md-2 pl-1 pr-md-3 pr-2" id="deviate_forward">
                                                                            </div>
                                                                        </div>
                                                                        <div class="mt-md-0 mt-md-0 mt-2">
                                                                            <hr class="mb-1 d-md-block d-none">
                                                                            <label class="custom-form-label">จุดสิ้นสุดให้บริการ (เที่ยวขาไป) <span class="text-warning text-bold">*</span>
                                                                                <span class="text-info text-bold">*</span> <span class="text-danger text-bold">*</span>
                                                                            </label>
                                                                            <div class="input-group">
                                                                                <input type="text" class="using-custom-font form-control custom-input-disabled" name="end_point_forward" placeholder="ตำแหน่งจุดสิ้นสุดให้บริการ" disabled>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr class="border-warning d-md-none d-block mt-4 mb-4 ">
                                                                <div class="col-md-6 col-12 input-group p-0 pl-md-2 pl-0 mt-2">
                                                                    <div class="col-12 d-flex flex-column side-form p-0">
                                                                        <div class="mb-2">
                                                                            <button type="button" class="btn btn-block btn-outline-primary using-custom-font" id="switchFindRouteBackward" onclick="switchFindRouteMode('backward')">เส้นทางเดินรถ เที่ยวขากลับ</button>
                                                                        </div>
                                                                        <div>
                                                                            <label class="custom-form-label">จุดเริ่มต้นให้บริการ (เที่ยวขากลับ) <span class="text-warning text-bold">*</span>
                                                                                <span class="text-info text-bold">*</span> <span class="text-danger text-bold">*</span>
                                                                            </label>
                                                                            <div class="input-group">
                                                                                <input type="text" class="using-custom-font form-control custom-input-disabled" name="start_point_backward" placeholder="ตำแหน่งจุดเริ่มต้นให้บริการ" disabled>
                                                                                <div class="input-group-append">
                                                                                    <button type="button" class="btn btn-warning using-custom-font text-white" id="start_point_backward_edit_btn" onclick="setEditRouteInput(5, '', 'จุดสิ้นสุด', 'start_point_backward', 'end_point_forward')" disabled><i class="fas fa-edit"></i><span class="d-md-inline d-none"> แก้ไข</span></button>
                                                                                </div>
                                                                            </div>
                                                                            <hr class="mb-1">
                                                                        </div>
                                                                        <div class="h-100">
                                                                            <label class="d-flex custom-form-label mt-1"><span>จุดเบี่ยงเส้นทาง (เที่ยวขากลับ) <span class="text-warning text-bold">*</span>
                                                                                    <span class="text-info text-bold">*</span>
                                                                                </span>
                                                                                <span class="text-muted ml-auto mr-1" id="count_deviate_backward">(0 จุดเบี่ยง)</span>
                                                                            </label>
                                                                            <div class="h-100 site-form border pt-md-1 pt-0 pb-2 pl-md-2 pl-1 pr-md-3 pr-2" id="deviate_backward">
                                                                            </div>
                                                                        </div>
                                                                        <div class="mt-md-0 mt-md-0 mt-2">
                                                                            <hr class="mb-1 d-md-block d-none">
                                                                            <label class="custom-form-label">จุดสิ้นสุดให้บริการ (เที่ยวขากลับ) <span class="text-warning text-bold">*</span>
                                                                                <span class="text-info text-bold">*</span> <span class="text-danger text-bold">*</span>
                                                                            </label>
                                                                            <div class="input-group">
                                                                                <input type="text" class="using-custom-font form-control custom-input-disabled" name="end_point_backward" placeholder="ตำแหน่งจุดสิ้นสุดให้บริการ" disabled>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
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
                                    <label class="custom-form-label">ชื่อเส้นทางเดินรถ (จุดเริ่มต้น - จุดสิ้นสุด ให้บริการ)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_name_route_service" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">รายละเอียด / ข้อมูลประจำเส้นทางเดินรถ (Keyword สำหรับค้นหา)</label>
                                    <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_route_keyword_detail" disabled>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label" id="title_route_color_verify">สีประจำเส้นทางเดินรถ (สีที่ 1)</label>
                                    <div class="d-sm-flex d-inline" id="route_color_verify">
                                        <div class="input-group">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_name_color_route_1" disabled>
                                            <input type="color" class="col-2 form-control show-color-picker custom-input-disabled" id="verify_preview_color_route_1" disabled>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label"><u>ค่าบริการโดยสาร</u>ของเส้นทางเดินรถ (ค่าบริการเริ่มต้น - สูงสุด)</label>
                                    <div class="d-flex">
                                        <div class="input-group mr-2">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_price_passenger_lower" disabled>
                                            <div class="input-group-append">
                                                <span class="input-group-text using-custom-font">บ.</span>
                                            </div>
                                        </div>
                                        <h5 class="using-custom-font p-1 m-0">-</h5>
                                        <div class="input-group ml-2">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_price_passenger_higher" disabled>
                                            <div class="input-group-append">
                                                <span class="input-group-text using-custom-font">บ.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label"><u>ค่าบริการส่งพัสดุ</u>ของเส้นทางเดินรถ (ค่าบริการเริ่มต้น - สูงสุด)</label>
                                    <div class="d-flex">
                                        <div class="input-group mr-2">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_price_supplies_lower" disabled>
                                            <div class="input-group-append">
                                                <span class="input-group-text using-custom-font">บ.</span>
                                            </div>
                                        </div>
                                        <h5 class="using-custom-font p-1 m-0">-</h5>
                                        <div class="input-group ml-2">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_price_supplies_higher" disabled>
                                            <div class="input-group-append">
                                                <span class="input-group-text using-custom-font">บ.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เวลาให้บริการเส้นทางเดินรถ (เวลาเริ่มต้น - เวลาสิ้นสุด ออกให้บริการ)</label>
                                    <div class="d-flex">
                                        <input type="text" class="form-control text-center using-custom-font custom-input-disabled mr-1" id="verify_service_start_time" value="--:-- น." disabled>
                                        <input type="text" class="form-control text-center using-custom-font custom-input-disabled ml-1" id="verify_service_end_time" value="--:-- น." disabled>
                                    </div>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">ความถี่การให้บริการเส้นทางเดินรถ (เวลาออกรอบ - จำนวนรอบ - เวลาที่ใช้ ให้บริการ)</label>
                                    <div class="d-flex">
                                        <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_service_time_round" value="-- น." disabled>
                                        <input type="text" class="form-control text-center using-custom-font custom-input-disabled ml-1 mr-1" id="verify_service_count_round" value="--- รอบ" disabled>
                                        <input type="text" class="form-control text-center using-custom-font custom-input-disabled" id="verify_service_time_average" value="-- น." disabled>
                                    </div>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">เส้นทางเดินรถ (เที่ยว ขาไป - ขากลับ)</label>
                                    <div class="d-sm-flex d-block">
                                        <div class="d-block mb-sm-0 mb-3 mr-sm-1 mr-0">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled text-danger mb-2" id="verify_data_route_forward" value="ข้อมูลเที่ยวขาไป ยังไม่ถูกเพิ่ม" disabled>
                                            <hr class="d-sm-block d-none">
                                            <button type="button" class="btn btn-block btn-outline-primary using-custom-font mb-1" onclick="setFindRouteDataType('forward', this, 'findRouteBackwardData', 'addRouteForwardData', 'addRouteBackwardData')" id="findRouteForwardData">ค้นหาข้อมูลเส้นทาง</button>
                                            <button type="button" class="btn btn-block btn-success using-custom-font mb-1" onclick="addRouteData('forward', this, 'findRouteForwardData', 'verify_data_route_forward')" id="addRouteForwardData" disabled>เพิ่มข้อมูลเส้นทาง</button>
                                        </div>
                                        <hr class="d-sm-none d-block">
                                        <div class="d-block mt-sm-0 mt-3 ml-sm-1 ml-0">
                                            <input type="text" class="form-control text-center using-custom-font custom-input-disabled text-danger mb-2" id="verify_data_route_backward" value="ข้อมูลเที่ยวขากลับ ยังไม่ถูกเพิ่ม" disabled>
                                            <hr class="d-sm-block d-none">
                                            <button type="button" class="btn btn-block btn-outline-primary using-custom-font mb-1" onclick="setFindRouteDataType('backward', this, 'findRouteForwardData', 'addRouteBackwardData', 'addRouteForwardData')" id="findRouteBackwardData">ค้นหาข้อมูลเส้นทาง</button>
                                            <button type="button" class="btn btn-block btn-success using-custom-font mb-1" onclick="addRouteData('backward', this, 'findRouteBackwardData', 'verify_data_route_backward')" id="addRouteBackwardData" disabled>เพิ่มข้อมูลเส้นทาง</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">สถานะเส้นทางเดินรถ (Service Route Status)</label>
                                    <input type="text" class="form-control text-center text-info using-custom-font custom-input-disabled" id="verify_service_route_status" disabled>
                                </div>
                            </form>
                            <hr>
                            <p class="text-danger pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-circle"></i> โปรดตรวจสอบรายละเอียดข้อมูลต่าง ๆ ของข้อมูลเส้นทางเดินรถก่อน <b><i class="fas fa-save"></i> บันทึกข้อมูล</b> เพื่อลดความผิดพลาดของข้อมูลในระบบ</p>
                            <p class="text-danger pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-circle"></i> การ <b><i class="fas fa-times"></i> ยกเลิก หรือปิดหน้า</b> <i class="far fa-check-circle"></i> ตรวจสอบ</h5> ระบบจะล้างค่าข้อมูล <u>เส้นทางเดินรถ (เที่ยว ขาไป - ขากลับ)</u></p>
                            <p class="text-info pl-2 pr-2 card-verify-warning-text using-custom-font"><i class="fas fa-exclamation-triangle"></i> ข้อมูลเส้นทางเดินรถนี้จะอยู่ในสถานะ <b>ระงับการใช้งานชั่วคราว</b> บัญชีผู้ดูแลระบบหรือบัญชีพนักงานระบบ ต้องเปลี่ยนแปลงสถานะข้อมูลเส้นทางเดินรถก่อนนำไปใช้งานในระบบ</p>
                        </div>
                    </div>
                    <div class="modal-footer" id="modelVerifyFooter">
                        <button type="button" class="btn btn-danger mr-auto using-custom-font" onclick="closeModal('#verifyModal')"><i class="fas fa-times"></i> ยกเลิก</button>
                        <button type="button" class="btn btn-primary using-custom-font" onclick="saveData()" id="saveDataButton" disabled><i class="fas fa-save"></i> บันทึกข้อมูล</button>
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
    <script type="text/javascript" src="https://api.longdo.com/map/?key=bcc49c58c698a579fba84346de800ee1"></script>
    <script type="text/javascript" src="/TRC_Tracking/src/js/route_management/add_route_management.js"></script>
</body>

</html>