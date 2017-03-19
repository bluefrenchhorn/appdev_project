<?php
require("configDatabase.php");

$result = mysqli_query($conn, "SELECT date_saved, level FROM saves WHERE player_id = '{$_POST['player_id']}'");

$set = [];

while($row = mysqli_fetch_assoc($result)) {
	$set[] = $row;
}

echo json_encode($set);