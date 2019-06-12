<?php
# Required format for date is YYYY-MM-DD
$currDate= $path . $_GET['date'];

if(empty($currDate)){
	$currDate = date('Y-m-d');
}

$currFolder = "images/" . $currDate . "/";

$ruta_completa = $currFolder ."/". $ImageNom;

$img_names = glob($currFolder. "*.png");

header('Content-type: application/json');
echo json_encode($img_names);
?>