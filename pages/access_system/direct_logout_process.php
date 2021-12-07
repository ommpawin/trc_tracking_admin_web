<?php
    session_start();

    setcookie("idAccount", "", -1, "/TRC_Tracking");
    setcookie("keyAccount", "", -1, "/TRC_Tracking");
    setcookie("accessLevel", "", -1, "/TRC_Tracking");

    session_destroy();
    
    header("location: /TRC_Tracking/pages/access_system/login.php");
?>

