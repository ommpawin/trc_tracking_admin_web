<?php 
    include "_setting_include.php";
    session_start();
?>

<nav class="main-header navbar navbar-expand navbar-light navbar-warning" id="navBarLink">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link text-white" data-widget="pushmenu" role="button"><i class="fas fa-bars"></i></a>
        </li>
    </ul>

    <!-- Center navbar -->
    <ul class="navbar-nav mx-auto">
        <li class="nav-item">
            <a class="nav-link pt-0 pb-0 pl-0 pr-0 d-flex align-items-center" href="#">
                <img src="/TRC_Tracking/file/images/TRC_Tracking_White.png" class="image-brand-set" alt="TRC Tracking Logo">
            </a>
        </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav">
        <!-- Notifications Dropdown Menu -->
        <li class="nav-item d-flex user-tag-card dropdown">
            <a class="nav-link pt-0 pb-0 pl-0 pr-0 d-flex align-items-center" data-toggle="dropdown" href="">
                <?
                    if ($_SESSION["profileImage"] == "null") {
                        echo "<img src='/TRC_Tracking/assets/image/default_profile_image.jpg' class='img-circle image-small-size-set' alt='User Image'>";
                    } else {
                        // TODO: Change Img src to Image From API Server
                        echo "<img src='...' class='img-circle image-small-size-set' alt='User Image'>";
                    }
                ?>
                
                <div class="flex-column align-items-center pr-2 d-none d-md-flex">
                    <?
                        if ($_SESSION["accessLevel"] == "admin") {
                            echo "<p class='user-at-admin using-custom-font my-auto'>" . trim($_SESSION["nameFirst"]) . " " . trim($_SESSION["nameLast"]) . " <i class='fas fa-angle-down pl-1 pr-1'></i></p>";
                        }  else if ($_SESSION["accessLevel"] == "staff") {
                            echo "<p class='user-at-staff using-custom-font my-auto'>" . trim($_SESSION["nameFirst"]) . " " . trim($_SESSION["nameLast"]) . " <i class='fas fa-angle-down pl-1 pr-1'></i></p>";
                        }             
                    ?>
                </div>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right using-custom-font">
                <button class="dropdown-item dropdown-item-list-color bg-disabled border-0 d-flex flex-row text-info" disabled>
                    <div class="box-icon-20 mr-2">
                        <i class="fas fa-user-edit text-low-opacity"></i>
                    </div>
                    <p class="text-icon align-self-center text-low-opacity">แก้ไขบัญชีผู้ใช้ (ส่วนตัว)</p>
                </button>
                <div class="dropdown-divider"></div>
                <button onclick="openLogoutModal()" class="dropdown-item dropdown-item-list-color d-flex flex-row text-danger">
                    <div class="box-icon-20 mr-2">
                        <i class="fas fa-sign-out-alt"></i>
                    </div>
                    <p class="text-icon align-self-center">ออกจากระบบ</p>
                </button>
                <div class="dropdown-divider"></div>
            </div>
        </li>
    </ul>
</nav>