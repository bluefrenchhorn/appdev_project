<?php
session_start();
require("configDatabase.php");

$res = mysqli_query($conn, "UPDATE players SET leftkey = '{$_POST['left']}', duckkey = '{$_POST['duck']}', rightkey = '{$_POST['right']}', shootkey = '{$_POST['shoot']}', jumpkey = '{$_POST['jump']}' WHERE player_No = '{$_SESSION['player_id']}'");