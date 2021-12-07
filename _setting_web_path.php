<?php
$json_file = json_decode(file_get_contents("./src/js/_setting.json"), true);

$root_web_path = "/TRC_Tracking";
$urlAPIServer = $json_file["urlAPIServer"];
?>