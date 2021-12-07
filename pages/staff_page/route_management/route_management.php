<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;
$menu_page_group = "route_management";
$menu_page_name = "route_management";

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
    <title>TRC Tracking - ภาพรวมเส้นทางเดินรถ</title>
    <?include $use_path . "/include/header_link.php"?>
    <link rel="stylesheet" href="<?echo $root_web_path ?>/src/css/data-dashboard-style.css">
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
                            <h4 class="m-0 text-dark text-header-web text-center">ภาพรวมเส้นทางเดินรถ</h4>
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
            <section class="content">
                <div class="container-fluid">
                    <!-- Main Widgets -->
                    <div class="row">
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-secondary">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-globe-asia"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center text-white pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนเส้นทางเดินรถทั้งหมด</div>
                                        <div class="sub-text"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-info">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-road"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนเส้นทางเดินรถที่มีผู้ขับ</div>
                                        <div class="sub-text">(เส้นทางเดินรถที่ลงทะเบียนกับผู้ขับ)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-success">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-directions"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนเส้นทางเดินรถที่ให้บริการ</div>
                                        <div class="sub-text">(จากสถานะ 0 เส้นทางเดินรถทั้งหมด)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-danger">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-ban"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">- / -</h2>
                                        <div class="main-text">จำนวนเส้นทางเดินรถที่ถูกระงับ / ยกเลิก</div>
                                        <div class="sub-text">(จากสถานะ 0 เส้นทางเดินรถทั้งหมด)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Main row -->
                    <div class="row mt-4">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <div class="row justify-content-center mb-2 mb-md-0">
                                        <div class="col-sm-12 col-md-6 d-flex align-items-center justify-content-center justify-content-md-start p-o">
                                            <h3 class="card-title using-custom-font mt-2 mb-2">
                                                <b>รายการเส้นทางเดินรถ</b>
                                            </h3>
                                        </div>
                                        <div class="col-sm-12 d-md-none d-inline">
                                            <hr>
                                        </div>
                                        <div class="col-sm-12 col-md-6 row d-flex flex-md-row-reverse align-items-center justify-content-md-start justify-content-end p-0">
                                            <div class="col-sm-6 col-md-3 mt-md-0 mt-2">
                                                <a href="./add_route_management.php">
                                                    <button type="button" class="btn btn-block btn-primary text-nowrap text-truncate using-custom-font">
                                                        <i class="fas fa-plus-square"></i> เพิ่มข้อมูล </button>
                                                </a>
                                            </div>
                                            <div class="col-sm-6 col-md-3 mt-md-0 mt-2">
                                                <button type="button" id="searchButton" class="btn btn-block btn-outline-secondary text-nowrap text-truncate using-custom-font" data-toggle="modal" data-target="#searchModal">
                                                    <i class="fas fa-search"></i> ค้นหารายการ </button>
                                            </div>
                                            <div class="col-sm-6 col-md-3 mt-md-0 mt-2">
                                                <button type="button" id="filterButton" class="btn btn-block btn-outline-secondary text-nowrap text-truncate using-custom-font" data-toggle="modal" data-target="#filterModal">
                                                    <i class="fas fa-filter"></i> จัดเรียงข้อมูล </button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /.card-header -->
                                    <!-- /.card-body -->
                                </div>
                                <div class="card-body pad table-responsive pt-1 pt-md-4" id="tableDataServiceRouteList">
                                    <!-- JavaScript Render !! -->
                                </div>
                                <div class="col-sm-12 d-flex justify-content-center mt-3 mb-2">
                                    <small class="text-info text-sub-header-web">เลื่อนซ้ายขวาเพื่อดูตารางข้อมูลทั้งหมด <i class="fas fa-arrows-alt-h"></i></small>
                                </div>
                                <div class="card-footer">
                                    <div class="row pt-2 pb-2">
                                        <div class="col-sm-12 col-md-5 d-flex justify-content-center justify-content-md-start">
                                            <div class="dataTables_info using-custom-font text-center" id="displayDataRow" role="status" aria-live="polite">
                                                <!-- JavaScript Render !! -->
                                            </div>
                                        </div>
                                        <div class="col-sm-12 col-md-7 d-flex m-2 mt-3 m-md-0 justify-content-center justify-content-md-end">
                                            <div class="dataTables_paginate" id="displayPaginateBar">
                                                <!-- JavaScript Render !! -->
                                            </div>
                                        </div>
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
        <!-- Search Modal -->
        <div class="modal fade" id="searchModal" tabindex="-1" role="dialog" aria-labelledby="searchModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title using-custom-font"><i class="fas fa-search"></i> ค้นหารายการ</h5>
                        <button type="button" class="close text-danger" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form role="form">
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label font-weight-normal using-custom-font">ค้นหาข้อมูลจาก</label>
                                <div class="col-sm-9">
                                    <select id="searchTableServiceRoute" class="form-control using-custom-font" onchange="searchTablePickInput(this.value)">
                                        <option value="idRoute">รหัสเส้นทาง</option>
                                        <option value="nameRoute">ชื่อเส้นทาง</option>
                                        <option value="keywordRoute">รายละเอียด / ข้อมูลประจำเส้นทาง (Keyword เส้นทาง)</option>
                                        <option value="nameColor_1">ชื่อสีที่ 1</option>
                                        <option value="nameColor_2">ชื่อสีที่ 2</option>
                                        <option value="hexColor_1">รหัสสี (Hex Color) ที่ 1</option>
                                        <option value="hexColor_2">รหัสสี (Hex Color) ที่ 2</option>
                                        <option value="pricePassenger">ค่าบริการโดยสาร (ค่าบริการเริ่มต้น-สูงสุด)</option>
                                        <option value="pricePassengerBetween">ค่าบริการโดยสารระหว่างต่ำสุดและสูงสุด</option>
                                        <option value="priceSupplies">ค่าบริการส่งพัสดุ (ค่าบริการเริ่มต้น-สูงสุด)</option>
                                        <option value="priceSuppliesBetween">ค่าบริการส่งพัสดุระหว่างต่ำสุดและสูงสุด</option>
                                        <option value="serviceTime">เวลาให้บริการ (เวลาเริ่มต้น-สิ้นสุดให้บริการ)</option>
                                        <option value="serviceTimeBetween">เวลาให้บริการระหว่างเริ่มต้นและสิ้นสุดให้บริการ</option>
                                        <option value="serviceTimeRound">เวลาออกรอบ</option>
                                        <option value="serviceCountRound">จำนวนรอบ</option>
                                        <option value="serviceTimeAverage">เวลาเฉลี่ยให้บริการ</option>
                                        <option value="routeStatus">สถานะเส้นทาง</option>
                                    </select>
                                </div>
                                <div class="col-12 mt-3" id="inputSearchTableServiceRoute">
                                    <small class="text-danger using-custom-font "></small>
                                    <input type="text" name="InputSearchTableServiceRoute" id="inputSearchTable" class="form-control using-custom-font" oninput="detectInteger(this)" placeholder="ค้นหาข้อมูลจาก รหัสเส้นทาง">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer" id="modelSearchFooter">
                        <button type="button" class="btn btn-primary using-custom-font" onclick="searchData()"><i class="fas fa-search"></i> ค้นหารายการ</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="filterModal" tabindex="-1" role="dialog" aria-labelledby="filterModalTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title using-custom-font"><i class="fas fa-filter"></i> จัดเรียงรายการ</h5>
                        <button type="button" class="close text-danger" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form role="form">
                            <div class="form-group row">
                                <label class="col-sm-3 col-form-label font-weight-normal using-custom-font">เรียงข้อมูลจาก</label>
                                <div class="col-sm-9">
                                    <select id="filterTableServiceRoute" class="form-control using-custom-font" onChange="filterTablePickInput(this.value)">
                                        <option value="idRoute">รหัสเส้นทาง</option>
                                        <option value="nameRoute">ชื่อเส้นทาง</option>
                                        <option value="nameColor_1">ชื่อสีที่ 1</option>
                                        <option value="nameColor_2">ชื่อสีที่ 2</option>
                                        <option value="pricePassengerLower">ค่าบริการโดยสารเริ่มต้น</option>
                                        <option value="pricePassengerHigher">ค่าบริการโดยสารสูงสุด</option>
                                        <option value="priceSuppliesLower">ค่าบริการส่งพัสดุเริ่มต้น</option>
                                        <option value="priceSuppliesHigher">ค่าบริการส่งพัสดุสูงสุด</option>
                                        <option value="serviceStartTime">เวลาเริ่มต้นให้บริการ</option>
                                        <option value="serviceEndTime">เวลาสิ้นสุดให้บริการ</option>
                                        <option value="serviceTimeRound">เวลาออกรอบ</option>
                                        <option value="serviceCountRound">จำนวนรอบ</option>
                                        <option value="serviceTimeAverage">เวลาเฉลี่ยให้บริการ</option>
                                        <option value="routeStatus">สถานะเส้นทาง</option>
                                        <option value="countRouteDrivers">จำนวนผู้ขับ</option>
                                    </select>
                                </div>
                                <div class="col-12 mt-3" id="inputFilterTableServiceRoute">
                                    <select name="InputFilterTableServiceRoute" class="form-control using-custom-font" id="inputFilterTable">
                                        <option value="1">เรียงข้อมูลจาก ก-ฮ (น้อย-มาก)</option>
                                        <option value="2">เรียงข้อมูลจาก ฮ-ก (มาก-น้อย)</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer" id="modelFilterFooter">
                        <button type="button" class="btn btn-primary using-custom-font" onclick="filterData()"><i class="fas fa-filter"></i> เรียงข้อมูล</button>
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
    <script type="text/javascript" src="/TRC_Tracking/src/js/route_management/route_management.js"></script>
</body>

</html>