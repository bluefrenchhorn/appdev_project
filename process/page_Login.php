<?php
	session_start();

	$user=$_POST['user_name'];
	$pass=$_POST['user_pass'];

	$user = stripcslashes($user);
	$pass = stripcslashes($pass);

	require("configDatabase.php");

	$pass = md5($pass);

	$result = mysqli_query($conn, "select * from players where user_name = '$user' and user_pass = '$pass'") or die("Failed to query database ".mysql_error());
	$row = mysqli_fetch_assoc($result);
	if($row['user_name'] == $user && $row['user_pass'] == $pass  && ("" !== $user || "" !== $pass)){
		$_SESSION['player_id'] = $row['player_No'];
		$_SESSION['user_name'] = $_POST['user_name'];
 		header("Location: ../index.php");
 		die();
	}
	else{
		printf("Failed to Login");
	//	header("Location: ../login.php");
	}
?>