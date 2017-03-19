<?php
	if(isset($_POST)){
		require("configDatabase.php"); 
		$query = "INSERT INTO players (user_name, user_pass, leftkey, rightkey, duckkey, jumpkey, shootkey)
		VALUES('".$_POST['user_name']."', '".md5($_POST['user_pass'])."', 'A', 'D', 'S', 'J', 'K');";
		if ( ($result = $conn->query($query))===false )
		{
		  printf("Invalid query: %s\nWhole query: %s\n", $conn->error, $query);
		  /*
		  header("Location: ../index.php?flag=0");
		  die();
		  */
		}else{
		  
	      header("Location: ../index.php?flag=1");
		  die();
		}
	}
?>