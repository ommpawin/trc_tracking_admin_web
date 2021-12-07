<?php
    include "_setting_include.php";
    session_start();
?>

<aside class="main-sidebar sidebar-light-warning elevation-4">
    <!-- Sidebar -->
    <div class="sidebar">
        <!-- Sidebar user panel (optional) -->
        <div class="user-panel pt-1 pb-1 d-flex align-items-center">
            <div class="image">
                <?
                    if ($_SESSION["profileImage"] == "null") {
                        echo "<img src='/TRC_Tracking/assets/image/default_profile_image.jpg' class='img-circle elevation-2' alt='User Image'>";
                    } else {
                        // TODO: Change Img src to Image From API Server
                        echo "<img src='...' class='img-circle elevation-2' alt='User Image'>";
                    }
                ?>
                
            </div>
            <div class="info pl-3">
                <?
                    if ($_SESSION["accessLevel"] == "admin") {
                        echo "<small class='using-custom-font tag-level-access user-at-admin'>บัญชีผู้ดูแลระบบ</small>";
                    }  else if ($_SESSION["accessLevel"] == "staff") {
                        echo "<small class='using-custom-font tag-level-access user-at-staff'>บัญชีพนักงานระบบ</small>";
                    }             
                ?>
                <p class="m-0 tag-user-access using-custom-font"><? echo trim($_SESSION["nameFirst"]) . " " . trim($_SESSION["nameLast"]); ?></p>
            </div>
        </div>

        <!-- Sidebar Menu -->
        <nav class="mt-2">
            <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent nav-legacy" data-widget="treeview" role="menu" data-accordion="false">
                <?
                if ($_SESSION["accessLevel"] == "admin") {
                    echo '<li class="nav-header pl-3 pr-3"><small>ข้อมูลระบบภายใน</small></li>
                    <li class="nav-item has-treeview ' . (($menu_page_group == "internal_account") ? "menu-open" : "") . '">
                        <a class="nav-link ' . (($menu_page_group == "internal_account") ? "active" : "") . '">
                            <i class="nav-icon fas fa-user-circle ' . (($menu_page_group == "internal_account") ? "menu-main-active-color" : "menu-main-unactive-color") . '"></i>
                            <p class="' . (($menu_page_group == "internal_account") ? "menu-main-active-color" : "menu-main-unactive-color") . '">
                                <b>บัญชีผู้ใช้ภายใน</b>
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "internal_account") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/internal_account_management/internal_account.php" class="nav-link ' . (($menu_page_name == "internal_account") ? "active" : "") . '">
                                    <i class="fas fa-address-book nav-icon ' . (($menu_page_name == "internal_account") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "internal_account") ? "menu-sub-active-color" : "") . '">ภาพรวมบัญชีผู้ใช้</p>
                                </a>
                            </li>
                        </ul>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "add_internal_account") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/internal_account_management/add_internal_account.php" class="nav-link ' . (($menu_page_name == "add_internal_account") ? "active" : "") . '">
                                    <i class="fas fa-plus-square nav-icon ' . (($menu_page_name == "add_internal_account") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "add_internal_account") ? "menu-sub-active-color" : "") . '">เพิ่มบัญชีผู้ใช้</p>
                                </a>
                            </li>
                        </ul>
                    </li>';
                }

                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-header pl-3 pr-3"><small>ข้อมูลการให้บริการ / ดำเนินงานระบบ</small></li>';
                }

                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-item has-treeview ' . (($menu_page_group == "route_management") ? "menu-open" : "") . '">
                        <a class="nav-link ' . (($menu_page_group == "route_management") ? "active" : "") . '">
                            <i class="nav-icon fas fa-map-marked ' . (($menu_page_group == "route_management") ? "menu-main-active-color" : "menu-main-unactive-color") . '"></i>
                            <p class="' . (($menu_page_group == "route_management") ? "menu-main-active-color" : "menu-main-unactive-color") . '">
                                <b>จัดการเส้นทางเดินรถ</b>
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "route_management") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/route_management/route_management.php" class="nav-link ' . (($menu_page_name == "route_management") ? "active" : "") . '">
                                    <i class="fas fa-map nav-icon ' . (($menu_page_name == "route_management") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "route_management") ? "menu-sub-active-color" : "") . '">ภาพรวมเส้นทางเดินรถ</p>
                                </a>
                            </li>
                        </ul>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "add_route_management") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/route_management/add_route_management.php" class="nav-link ' . (($menu_page_name == "add_route_management") ? "active" : "") . '">
                                    <i class="fas fa-route nav-icon ' . (($menu_page_name == "add_route_management") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "add_route_management") ? "menu-sub-active-color" : "") . '">เพิ่มเส้นทางเดินรถ</p>
                                </a>
                            </li>
                        </ul>
                    </li>';
                }
                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-item has-treeview ' . (($menu_page_group == "trip_management") ? "menu-open" : "") . '">
                        <a class="nav-link ' . (($menu_page_group == "trip_management") ? "active" : "") . '">
                            <i class="nav-icon far fa-calendar-alt ' . (($menu_page_group == "trip_management") ? "menu-main-active-color" : "menu-main-unactive-color") . '"></i>
                            <p class="' . (($menu_page_group == "trip_management") ? "menu-main-active-color" : "menu-main-unactive-color") . '">
                                <b>จัดการรอบเดินรถ</b>
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "trip_management") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/trip_management/trip_management.php" class="nav-link ' . (($menu_page_name == "trip_management") ? "active" : "") . '">
                                    <i class="fas fa-calendar-week nav-icon ' . (($menu_page_name == "trip_management") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "trip_management") ? "menu-sub-active-color" : "") . '">ภาพรวมรอบเดินรถ</p>
                                </a>
                            </li>
                        </ul>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "add_trip_management") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/trip_management/add_trip_management.php" class="nav-link ' . (($menu_page_name == "add_trip_management") ? "active" : "") . '">
                                    <i class="far fa-calendar-plus nav-icon ' . (($menu_page_name == "add_trip_management") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "add_trip_management") ? "menu-sub-active-color" : "") . '">เพิ่มรอบเดินรถ</p>
                                </a>
                            </li>
                        </ul>
                    </li>';
                }
                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-item has-treeview ' . (($menu_page_group == "driver_account") ? "menu-open" : "") . '">
                        <a class="nav-link ' . (($menu_page_group == "driver_account") ? "active" : "") . '">
                            <i class="nav-icon far fa-address-card ' . (($menu_page_group == "driver_account") ? "menu-main-active-color" : "menu-main-unactive-color") . '"></i>
                            <p class="' . (($menu_page_group == "driver_account") ? "menu-main-active-color" : "menu-main-unactive-color") . '">
                                <b>บัญชีผู้ขับ</b>
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "driver_account") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/driver_account_management/driver_account.php" class="nav-link ' . (($menu_page_name == "driver_account") ? "active" : "") . '">
                                    <i class="far fa-address-book nav-icon ' . (($menu_page_name == "driver_account") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "driver_account") ? "menu-sub-active-color" : "") . '">ภาพรวมบัญชีผู้ขับ</p>
                                </a>
                            </li>
                        </ul>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "add_driver_account") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/driver_account_management/add_driver_account.php" class="nav-link ' . (($menu_page_name == "add_driver_account") ? "active" : "") . '">
                                    <i class="far fa-plus-square nav-icon ' . (($menu_page_name == "add_driver_account") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "add_driver_account") ? "menu-sub-active-color" : "") . '">เพิ่มบัญชีผู้ขับ</p>
                                </a>
                            </li>
                        </ul>
                    </li>';
                }

                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-header pl-3 pr-3"><small>ข้อมูลระบบภายนอก</small></li>';
                }
                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-item has-treeview ' . (($menu_page_group == "external_account") ? "menu-open" : "") . '">
                        <a class="nav-link ' . (($menu_page_group == "external_account") ? "active" : "") . '">
                            <i class="nav-icon far fa-user-circle ' . (($menu_page_group == "external_account") ? "menu-main-active-color" : "menu-main-unactive-color") . '"></i>
                            <p class="' . (($menu_page_group == "external_account") ? "menu-main-active-color" : "menu-main-unactive-color") . '">
                                <b>บัญชีผู้ใช้</b>
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "external_account") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/external_account_management/external_account.php" class="nav-link ' . (($menu_page_name == "external_account") ? "active" : "") . '">
                                    <i class="far fa-address-book nav-icon ' . (($menu_page_name == "external_account") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "external_account") ? "menu-sub-active-color" : "") . '">ภาพรวมบัญชีผู้ใช้</p>
                                </a>
                            </li>
                        </ul>
                    </li>';
                }
                
                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-header pl-3 pr-3"><small>คำร้องเรียน</small></li>';
                }

                if ($_SESSION["accessLevel"] == "admin" || $_SESSION["accessLevel"] == "staff") {
                    echo '<li class="nav-item has-treeview ' . (($menu_page_group == "complaint_management") ? "menu-open" : "") . '">
                        <a class="nav-link ' . (($menu_page_group == "complaint_management") ? "active" : "") . '">
                            <i class="nav-icon fas fa-book ' . (($menu_page_group == "complaint_management") ? "menu-main-active-color" : "menu-main-unactive-color") . '"></i>
                            <p class="' . (($menu_page_group == "complaint_management") ? "menu-main-active-color" : "menu-main-unactive-color") . '">
                                <b>คำร้องเรียน</b>
                                <i class="right fas fa-angle-left"></i>
                            </p>
                        </a>
                        <ul class="nav nav-treeview ' . (($menu_page_name == "complaint_management") ? "menu-sub-active-bg-color" : "") . '">
                            <li class="nav-item">
                                <a href="' . $root_web_path . '/pages/staff_page/complaint_management/complaint_management.php" class="nav-link ' . (($menu_page_name == "complaint_management") ? "active" : "") . '">
                                    <i class="fas fa-book-open nav-icon ' . (($menu_page_name == "complaint_management") ? "menu-sub-active-color" : "") . '"></i>
                                    <p class="' . (($menu_page_name == "complaint_management") ? "menu-sub-active-color" : "") . '">ภาพรวมคำร้องเรียน</p>
                                </a>
                            </li>
                        </ul>
                    </li>';
                }
                ?>

            </ul>
        </nav>
        <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
</aside>