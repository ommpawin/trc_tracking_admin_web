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
    <title>TRC Tracking - ภาพรวมรอบเดินรถ</title>
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
                            <h4 class="m-0 text-dark text-header-web text-center">ภาพรวมรอบเดินรถ</h4>
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
                            <div class="container-fluid h-100 custom-widget-box bg-success">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-calendar-alt"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนรอบเดินรถทั้งหมด</div>
                                        <div class="sub-text"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-primary">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-address-card"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนรอบเดินรถที่มีผู้ขับ</div>
                                        <div class="sub-text">(จากรอบเดินรถทั้งหมด 0 รอบ)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-danger">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-calendar-times"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนรอบเดินรถที่ยกเลิก</div>
                                        <div class="sub-text">(จากรอบเดินรถทั้งหมด 0 รอบ)</div>
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
                                                <b>รายการรอบเดินรถ</b>
                                            </h3>
                                        </div>
                                        <div class="col-sm-12 d-md-none d-inline">
                                            <hr>
                                        </div>
                                        <div class="col-sm-12 col-md-6 row d-flex flex-md-row-reverse align-items-center justify-content-md-start justify-content-end p-0">
                                            <div class="col-sm-6 col-md-3 mt-md-0 mt-2">
                                                <a href="./add_trip_management.php">
                                                    <button type="button" class="btn btn-block btn-primary text-nowrap text-truncate using-custom-font">
                                                        <i class="fas fa-plus-square"></i> เพิ่มรอบเดินรถ </button>
                                                </a>
                                            </div>
                                            <div class="col-sm-6 col-md-3 mt-md-0 mt-2">
                                                <a href="../route_management/add_route_management.php">
                                                    <button type="button" class="btn btn-block btn-success text-nowrap text-truncate using-custom-font">
                                                        <i class="far fa-plus-square"></i> เพิ่มเส้นทางเดินรถ </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /.card-header -->
                                    <!-- /.card-body -->
                                </div>
                                <div class="card-body pad table-responsive pt-1 pt-md-4" id="tableDataTripList">
                                    <!-- JavaScript Render !! -->
                                </div>
                                <div class="col-sm-12 d-flex d-md-none d-sm-flex justify-content-center mt-3 mb-2">
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
    <script type="text/javascript" src="/TRC_Tracking/src/js/trip_management/trip_management.js"></script>
</body>

</html>