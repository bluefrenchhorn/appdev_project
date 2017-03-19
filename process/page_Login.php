<?php
	session_start();

	$user=$_POST['user_name'];
	$pass=$_POST['user_pass'];

	$user = stripcslashes($user);
	$pass = stripcslashes($pass);
	$user = mysql_real_escape_string($user);
	$pass = mysql_real_escape_string($pass);

	mysql_connect("localhost","root","");
	mysql_select_db("gamelog");

	$pass = md5($pass);

	$result = mysql_query("select * from players where user_name = '$user' and user_pass = '$pass'") or die("Failed to query database ".mysql_error());
	$row = mysql_fetch_array($result);
	if($row['user_name'] == $user && $row['user_pass'] == $pass  && ("" !== $user || "" !== $pass)){
		$_SESSION['player_id'] = $row['player_No'];
		$_SESSION['user_name'] = $_POST['user_name'];
 		header("Location: ../index.php");
	}
	else{
		printf("Failed to Login");
		header("Location: ../login.php");
	}
?>