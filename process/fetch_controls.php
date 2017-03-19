<?php
session_start();
require("configDatabase.php");

$res = mysqli_query($conn, "SELECT leftkey, duckkey, rightkey, shootkey, jumpkey FROM players WHERE player_No = '{$_SESSION['player_id']}'");

$row = mysqli_fetch_assoc($res);

echo json_encode($row);