<?php 
    session_start();

    $_SESSION["idAccount"] = $_GET["idAccount"];
    $_SESSION["keyAccount"] = $_GET["keyAccount"];
    $_SESSION["profileImage"] = $_GET["profileImage"];
    $_SESSION["nameTitle"] = $_GET["nameTitle"];
    $_SESSION["nameFirst"] = $_GET["nameFirst"];
    $_SESSION["nameLast"] = $_GET["nameLast"];
    $_SESSION["accessLevel"] = $_GET["accessLevel"];

    setcookie("idAccount", $_GET["idAccount"], 0, "/TRC_Tracking");
    setcookie("keyAccount", $_GET["keyAccount"], 0, "/TRC_Tracking");
    setcookie("accessLevel", $_GET["accessLevel"], 0, "/TRC_Tracking");

    header("location: /TRC_Tracking/pages/staff_page/trip_management/trip_management.php");
?>