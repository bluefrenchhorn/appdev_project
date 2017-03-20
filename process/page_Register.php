<?php
	require("configDatabase.php"); 
	$success = array(
		'success' => 0
	);
	if(isset($_POST['user_name'])){
		$query = mysqli_query($conn, "SELECT * FROM players WHERE user_name = '{$_POST['user_name']}'");

		if (mysqli_num_rows($query) > 0) {
			$success['success'] = 1; // username taken
		} else {

			$query = "INSERT INTO players (user_name, user_pass, leftkey, rightkey, duckkey, jumpkey, shootkey)
			VALUES('".$_POST['user_name']."', '".md5($_POST['user_pass'])."', 'A', 'D', 'S', 'J', 'K');";
			$result = $conn->query($query);
			if ($result == false) {
				$success['success'] = 2; // error inserting user
			}
		}
	} else {
		$success['success'] = 3;
	}
	echo json_encode($success);