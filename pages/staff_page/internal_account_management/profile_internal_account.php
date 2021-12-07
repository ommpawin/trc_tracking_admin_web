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
} else if ($_SESSION["idAccount"] == $_GET["idAccount"]) {
    header("location:/TRC_Tracking/pages/staff_page/internal_account_management/internal_account.php");
}
?>

<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>TRC Tracking - แสดงข้อมูลบัญชีผู้ใช้ระบบภายใน</title>
    <?include $use_path . "/include/header_link.php"?>
    <link rel="stylesheet" href="<?echo $root_web_path ?>/src/css/data-show-profile-style.css">
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
                            <h4 class="m-0 text-dark text-header-web text-center">แสดงข้อมูลบัญชีผู้ใช้ระบบภายใน</h4>
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
                                        <div class="row p-md-2 p-4 mb-3">
                                            <div class="col-md-6 col-12 d-flex justify-content-center align-items-center">
                                                <img class="img-circle elevation-3 using-profile-image" id="profile_image">
                                            </div>
                                            <div class="col-md-6 col-12 d-flex justify-content-center align-items-center mt-md-0 mt-4">
                                                <div class="w-100">
                                                    <p class="text-md-left text-center profile-main-content-name mb-2" id="name"></p>
                                                    <p class="text-md-left text-center profile-main-content-email mb-0" id="email"></p>
                                                    <p class="text-md-left text-center profile-main-content-phone-number mb-3" id="phoneNumber"></p>
                                                    <div class="d-flex justify-content-md-start justify-content-center" id="status_badge"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row d-flex justify-content-center">
                                            <div class="col-12">
                                                <hr>
                                            </div>
                                            <div class="row col-md-10 col-12">
                                                <div class="w-100 d-md-flex d-block pl-2 pr-2 mb-1">
                                                    <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-2 mb-2"> วัน / เดือน / ปีเกิด พ.ศ. (ค.ศ)</p>
                                                    <p class="profile-main-text d-md-flex d-none align-items-center mt-2 mb-2 mr-3"> :</p>
                                                    <p class="col-md-6 col-12 profile-sub-text d-flex align-items-center mt-2 mb-2 ml-md-0 ml-2" id="dateBirth"></p>
                                                </div>
                                                <div class="w-100 d-md-flex d-block pl-2 pr-2 mt-1 mb-1">
                                                    <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-2 mb-2"> อายุ</p>
                                                    <p class="profile-main-text d-md-flex d-none align-items-center mt-2 mb-2 mr-3"> :</p>
                                                    <p class="col-md-6 col-12 profile-sub-text d-flex align-items-center mt-2 mb-2 ml-md-0 ml-2" id="age"></p>
                                                </div>
                                                <div class="w-100 d-md-flex d-block pl-2 pr-2 mt-1 mb-1">
                                                    <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-2 mb-2"> ที่อยู่</p>
                                                    <p class="profile-main-text d-md-flex d-none align-items-center mt-2 mb-2 mr-3"> :</p>
                                                    <p class="col-md-6 col-12 profile-sub-text d-flex align-items-center mt-2 mb-2 ml-md-0 ml-2" id="address"></p>
                                                </div>
                                                <div class="w-100 mt-1 mb-1">
                                                    <hr>
                                                </div>
                                                <form class="w-100">
                                                    <div class="w-100 d-md-flex d-block pl-2 pr-2 mt-1 mb-2">
                                                        <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-1 mb-2"> ระดับการเข้าถึงบัญชีผู้ใช้ (Access Level)</p>
                                                        <p class="profile-main-text d-md-flex d-none align-items-center mt-1 mb-2 mr-3"> :</p>
                                                        <input type="text" class="col-md-6 col-12 custom-input-disabled form-control mt-1 mb-1" name="access_level" value="-" disabled>
                                                    </div>
                                                    <div class="w-100 d-md-flex d-block pl-2 pr-2 mt-2 mb-2">
                                                        <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-1 mb-2"> สถานะบัญชีผู้ใช้ (Access Status)</p>
                                                        <p class="profile-main-text d-md-flex d-none align-items-center mt-1 mb-2 mr-3"> :</p>
                                                        <input type="text" class="col-md-6 col-12 custom-input-disabled form-control mt-1 mb-1" name="access_status" value="-" disabled>
                                                    </div>
                                                    <div class="w-100 d-md-flex d-block pl-2 pr-2 mt-2 mb-2">
                                                        <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-1 mb-2"> สถานะรหัสผ่านบัญชีผู้ใช้ (User Password Status)</p>
                                                        <p class="profile-main-text d-md-flex d-none align-items-center mt-1 mb-2 mr-3"> :</p>
                                                        <input type="text" class="col-md-6 col-12 custom-input-disabled form-control mt-1 mb-1" name="password_status" value="-" disabled>
                                                    </div>
                                                    <div class="w-100 d-md-flex d-block pl-2 pr-2 mt-2 mb-2">
                                                        <p class="col-md-6 col-12 profile-main-text d-flex align-items-center mt-1 mb-2"> บทบาท (Role) / IDs</p>
                                                        <p class="profile-main-text d-md-flex d-none align-items-center mt-1 mb-2 mr-3"> :</p>
                                                        <input type="text" class="col-md-6 col-12 custom-input-disabled form-control mt-1 mb-1" name="role_ids" value="-" disabled>
                                                    </div>
                                                    <div class="w-100 mt-2 mb-2">
                                                        <hr>
                                                    </div>
                                                    <div class="w-100 row d-flex justify-content-center pl-md-0 pr-md-0 pl-5 pr-5 m-0" id="footerContent">
                                                        <button type="button" class="col-md-3 col-12 btn btn-warning text-white using-custom-font pt-2 pb-2 m-2" onclick="editPageLink()"><i class="far fa-edit"></i> แก้ไขข้อมูล</button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div class="col-12">
                                                <hr>
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
        <div class="modal fade" id="deleteData" tabindex="2" role="dialog" aria-labelledby="deleteDataTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content" id="modalContentDeleteData">
                    <div class="modal-header">
                        <h5 class="modal-title using-custom-font"> ลบรายการบัญชีผู้ใช้</h5>
                    </div>
                    <div class="modal-body" id="modalBodyDeleteData">
                        <div>
                            <form>
                                <div class="form-group mb-1">
                                    <label class="custom-form-label">รหัสผ่านบัญชีผู้ดูแล (คุณ) ที่จะลบข้อมูล</label>
                                    <input type="password" class="form-control using-custom-font" id="passwordUserAccess">
                                    <small class="text-danger using-custom-font" id="passwordUserAccessText"></small>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer" id="modelDeleteDataFooter">
                        <button type="button" class="btn btn-danger mr-auto using-custom-font" onclick="closeModal('#deleteData')"><i class="fas fa-times"></i> ยกเลิก</button>
                        <button type="button" class="btn btn-outline-danger using-custom-font" onclick="saveDeleteData()"><i class="far fa-trash-alt"></i> ลบข้อมูล</button>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js" integrity="sha512-qTXRIMyZIFb8iQcfjXWCO8+M5Tbc38Qi5WzdPOYZHIlZpzBHG3L3by84BBBOiRGiEb7KKtAOAs5qYdUiZiQNNQ==" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/blueimp-md5@2.18.0/js/md5.min.js"></script>
    <script type="text/javascript" src="/TRC_Tracking/src/js/internal_account/profile_internal_account.js"></script>
</body>

</html>