<?php
	session_start();

	$user=$_POST['user_name'];
	$pass=$_POST['user_pass'];

	$user = stripcslashes($user);
	$pass = stripcslashes($pass);

	require("configDatabase.php");

	$success = array(
		'success' => 0
	);

	$pass = md5($pass);

	$result = mysqli_query($conn, "select * from players where user_name = '$user' and user_pass = '$pass'");

	if ($result == false) {
		$success['success'] = 2; // failed to log in
	} else if (mysqli_num_rows($result) != 1) {
		$success['success'] = 1; // incorrect username or password
	} else {
		//successful login
		$row = mysqli_fetch_assoc($result);
		$_SESSION['player_id'] = $row['player_No'];
		$_SESSION['user_name'] = $row['user_name'];
	}

	echo json_encode($success);