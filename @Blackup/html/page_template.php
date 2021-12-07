<?php
include "../../../_setting_web_path.php";
$root_path = $_SERVER['DOCUMENT_ROOT'] . $root_web_path;
$menu_page_group = "";
$menu_page_name = "";

?>

<!DOCTYPE html>
<html lang="th">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>TRC Tracking - </title>
    <?include $root_path . "/include/header_link.php"?>
</head>

<body class="sidebar-mini layout-fixed sidebar-collapse">
    <div class="wrapper">

        <!-- Navbar -->
        <?include $root_path . "/include/navbar_link.php"?>

        <!-- Main Sidebar Container -->
        <?include $root_path . "/include/sidebar_link.php"?>

        <!-- Content Wrapper. Contains page content -->
        <div class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">
                    <div class="row mb-2">
                        <div class="col-sm-10 d-flex justify-content-center justify-content-sm-start">
                            <h4 class="m-0 text-dark text-header-web text-center"></h4>
                        </div>
                    </div>
                    <hr>
                </div>
            </div>
            <!-- /.content-header -->


            <!-- Main content -->
            <section class="content">
                <div class="container-fluid">
                    <!-- Main row -->
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    
                                </div>
                                <div class="card-body pad table-responsive pt-1 pt-md-4">

                                </div>
                                <div class="card-footer">
                                    
                                </div>
                            </div>
                        </div>
                        <!-- /.row (main row) -->
                    </div><!-- /.container-fluid -->
            </section>
            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->

        <!-- Footer -->
        <?include $root_path . "/include/footer_link.php"?>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->
    </div>
    <!-- ./wrapper -->

    <?include $root_path . "/include/script_link.php"?>

    <script src="/TRC_Tracking/src/js/.."></script>

</body>

</html>