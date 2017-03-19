<?php
	session_start();
	session_destroy();

	if(isset($_SESSION['user_name'])){
 		header("Location: index.php");
 	}
?>