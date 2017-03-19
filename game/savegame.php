<?php
session_start();
require("../process/configDatabase.php");

date_default_timezone_set('Asia/Taipei');
$date = date('Y-m-d');
$time = date('H:i:s');

if (!isset($_POST['save_id'])) {
	// new save
	$query = mysqli_query($conn, "INSERT INTO saves(player_id, date_saved, time_saved, level, checkpoint, lives, shield, burst) VALUES('{$_SESSION['player_id']}', '{$date}', '{$time}', {$_POST['level']}, {$_POST['checkpoint']}, {$_POST['lives']}, FALSE, FALSE)");
} else {
	$query = mysqli_query($conn, "UPDATE saves SET date_saved = '{$date}', time_saved = '{$time}', level = {$_POST['level']}, checkpoint = {$_POST['checkpoint']}, lives = {$_POST['lives']}, shield = FALSE, burst = FALSE WHERE save_id = {$_POST['save_id']}");
}