<html>
	<head>
		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<link rel="stylesheet" type="text/css" href="css/background.css">
		<link rel="stylesheet" type="text/css" href="css/divattb.css">
		<link rel="stylesheet" type="text/css" href="css/baseStyle.css">
		<script src="js/jquery.js"></script>
  		<script src="js/bootstrap.js"></script>
	</head>
	<body>
		<?php 
			if(isSet($_GET['flag'])){
				if($_GET['flag'] == 1){
					echo "User inserted successfully";
				}else{
					echo "User not inserted due to error";
				}
			}
		?>
		<p align="right"><img style="width:31em;height:4em;" src="pics/PA.png"></p>
		<div class="mydiv">
			<div class="box container-fluid">
				<nav class="navbar navbar-default">
				  <div class="container-fluid text-center">
				    <ul class="nav navbar-nav text-center">
				      <li><a href="#" id="login">Login</a></li>
				      <li><a href="#" id="register">Register</a></li>
				    </ul>
				  </div>
				</nav>
				<div class="inpt">
					<form action="process/page_Login.php" method="POST">
						<div class="Login text-center">
							<div class='form-group'>
								<input class="form-control" type="text" placeholder="Username" name="user_name">
							</div>
							<div class='form-group'>
								<input class="form-control" type="password" placeholder="Password" name="user_pass">
							</div>
							<input type="submit" class="btn btn-success">
						</div>
					</form>
					<form action="process/page_Register.php" method="POST">
						<div class="Register hidden text-center">
							<div class='form-group'>
								<input class="form-control" type="text" placeholder="Username" name="user_name">
							</div>
							<div class='form-group'>
								<input class="form-control" type="password" placeholder="Password" name="user_pass">
							</div>
							<input type="submit" class="btn btn-success">
						</div>
					</form>
				</div>
			</div>
		</div>
	</body>
</html>
<script src="jquery.js"></script>
<script>
	$(document).ready(function(){
		$("#login").addClass("active");
		$(".mydiv").hide();
		$(".mydiv").fadeIn(800);

	 	$("#register").click(function() {
	 		$("#login").removeClass("active");
	 		$("#register").addClass("active");
	 		$(".Register").hide();
	 		$(".Register").removeClass("hidden");
	 		$("#mydiv").animate({
	      		height : '18em'
        	},"slow");
	 		$(".Register").fadeIn();
	 		$(".Login").addClass("hidden");
	 	});
	 	$("#login").click(function() {
	 		$("#register").removeClass("active");
	 		$("#login").addClass("active");
	 		$(".Login").hide();
	 		$(".Register").addClass("hidden");
	 		$(".Login").fadeIn();
	 		$(".Login").removeClass("hidden");

	 	});

	});
</script>