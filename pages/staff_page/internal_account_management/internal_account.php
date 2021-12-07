<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$use_path = $root_path;
$menu_page_group = "internal_account";
$menu_page_name = "internal_account";

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
    <title>TRC Tracking - ภาพรวมบัญชีผู้ใช้ระบบภายใน</title>
    <?include $use_path . "/include/header_link.php"?>
    <link rel="stylesheet" href="<?echo $root_web_path ?>/src/css/data-dashboard-style.css">
</head>

<body class="sidebar-mini layout-fixed sidebar-collapse">
    <div class="wrapper">
        <!-- Navbar -->
        <?php include $use_path . "/include/navbar_link.php"?>
        <!-- Main Sidebar Container -->
        <?php include $use_path . "/include/sidebar_link.php"?>
        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-10 d-flex justify-content-center justify-content-sm-start">
                            <h4 class="m-0 text-dark text-header-web text-center">ภาพรวมบัญชีผู้ใช้ระบบภายใน</h4>
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
                            <div class="container-fluid h-100 custom-widget-box bg-warning">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center text-white pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนบัญชีผู้ดูแลระบบ</div>
                                        <div class="sub-text">(รวมบัญชีผู้ใช้ของคุณ)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-primary">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-user-friends"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนบัญชีพนักงานระบบ</div>
                                        <div class="sub-text"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-success">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">-</h2>
                                        <div class="main-text">จำนวนบัญชีผู้ใช้ที่ใช้งาน</div>
                                        <div class="sub-text">(จากสถานะ 0 บัญชีผู้ใช้ทั้งหมด)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 col-6 mt-md-0 mt-2">
                            <div class="container-fluid h-100 custom-widget-box bg-danger">
                                <div class="pt-4 pb-4 pl-3 pr-3">
                                    <div class="d-xl-block d-none widget-icon">
                                        <i class="fas fa-user-slash"></i>
                                    </div>
                                    <div class="widget-content text-xl-left text-center pb-1">
                                        <h2 class="dataWidgets">- / -</h2>
                                        <div class="main-text">จำนวนบัญชีผู้ใช้ที่ถูกระงับ / ยกเลิก</div>
                                        <div class="sub-text">(จากสถานะ 0 บัญชีผู้ใช้ทั้งหมด)</div>
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
                                                <b>รายการบัญชีผู้ใช้ระบบภายใน</b>
                                            </h3>
                                        </div>
                                        <div class="col-sm-12 d-md-none d-inline">
                                            <hr>
                                        </div>
                                        <div class="col-sm-12 col-md-6 row d-flex flex-md-row-reverse align-items-center justify-content-md-start justify-content-end p-0">
                                            <div class="col-sm-6 col-md-3 mt-md-0 mt-2">
                                                <a href="./add_internal_account.php">
                                                    <button type="button" class="btn btn-block btn-primary text-nowrap text-truncate using-custom-font">
                                                        <i class="fas fa-plus-square"></i> เพิ่มบัญชีผู้ใช้ </button>
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
                                <div class="card-body pad table-responsive pt-1 pt-md-4" id="tableDataInternalAccount">
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
                                    <select id="searchTableInternalAccount" class="form-control using-custom-font" onchange="searchTableInternalAccountPickInput(this.value)">
                                        <option value="name">ชื่อ-สกุล หรือคำนำหน้าชื่อ</option>
                                        <option value="dateOfBirthBE">วัน เดือน ปีเกิด (พ.ศ.)</option>
                                        <option value="phoneNumber">เบอร์โทรศัพท์</option>
                                        <option value="email">อีเมล</option>
                                        <option value="accessLevel">ระดับการเข้าถึงบัญชีผู้ใช้</option>
                                        <option value="accessStatus">สถานะบัญชีผู้ใช้</option>
                                    </select>
                                </div>
                                <div class="col-12 mt-3" id="inputSearchTableInternalAccount">
                                    <small class="text-danger using-custom-font "></small>
                                    <input type="text" name="InputSearchTableInternalAccount" id="inputSearchTable" class="form-control using-custom-font" placeholder="ค้นหาข้อมูลจาก ชื่อ-สกุล หรือคำนำหน้าชื่อ">
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
                                    <select id="filterTableInternalAccount" class="form-control using-custom-font" onChange="filterTableInternalAccountPickInput(this.value)">
                                        <option value="name">ชื่อ-สกุล</option>
                                        <option value="nameTitle">คำนำหน้าชื่อ</option>
                                        <option value="dayBirth">วันเกิด</option>
                                        <option value="monthBirth">เดือนเกิด</option>
                                        <option value="yearBirth">ปีเกิด (พ.ศ.)</option>
                                        <option value="dateOfBirthBE">วัน เดือน ปีเกิด (พ.ศ.)</option>
                                        <option value="phoneNumber">เบอร์โทรศัพท์ (ถัดจากเลข 0)</option>
                                        <option value="email">อีเมล</option>
                                        <option value="accessLevel">ระดับการเข้าถึงบัญชีผู้ใช้</option>
                                        <option value="accessStatus">สถานะบัญชีผู้ใช้</option>
                                    </select>
                                </div>
                                <div class="col-12 mt-3" id="inputFilterTableInternalAccount">
                                    <select name="InputFilterTableInternalAccount" class="form-control using-custom-font" id="inputFilterTable">
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
    <script type="text/javascript" src="/TRC_Tracking/src/js/internal_account/internal_account.js"></script>
</body>

</html>