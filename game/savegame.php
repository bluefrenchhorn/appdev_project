<?php
session_start();
require("../process/configDatabase.php");

date_default_timezone_set('Asia/Taipei');
$date = date('Y-m-d');
$time = date('H:i:s');

$query = mysqli_query($conn, "INSERT INTO saves(player_id, date_saved, time_saved, level, checkpoint, lives, shield, burst) VALUES('{$_SESSION['player_id']}', '{$date}', '{$time}', {$_POST['level']}, {$_POST['checkpoint']}, {$_POST['lives']}, FALSE, FALSE)");