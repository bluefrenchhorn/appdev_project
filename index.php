<?php
	session_start();


 	if(isset($_SESSION['user_name'])){
 		echo "<p style='color:white;'>Welcome ".$_SESSION['user_name']." </p>";
 	}else{
 		header("Location: login.php");
 	}

?>

<html>
	<head>
		<?php
			require("linkExternal.php");
		?>
		<style type="text/css">
			.table-inverse {
				color: #fff;
			}
			.table-inverse > tbody > tr > td, .table-inverse > tbody > tr > th {
				border-top: 0px;
			}
		</style>
	</head>
	<style>
		
	</style>
	<body>

		<div class="mydiv">
			<div class="box container-fluid">
				<div class="text-center">
					<button style="width:16em; height:8em;" type="button" class="btn btn-default" data-toggle="modal" data-target="#NG_MOD">NEW GAME</button>
					<button style="width:16em; height:8em;" type="button" class="btn btn-default" data-toggle="modal" data-target="#LG_MOD" id="load-btn">LOAD GAME</button>
					<button style="width:16em; height:8em;" type="button" class="btn btn-default" data-toggle="modal" data-target="#ST_MOD">STORY</button>
					<button style="width:16em; height:8em;" type="button" class="btn btn-default" data-toggle="modal" data-target="#settings_MOD" id="settings-btn">SETTINGS</button>
					<button style="width:16em; height:8em;" type="button" class="btn btn-default" data-toggle="modal" data-target="#signOut_MOD">SIGN OUT</button>
				</div>
			</div>
		</div>
		<!-- START OF MODALS -->

					<div class="modal fade" id="NG_MOD" role="dialog">
					    <div class="modal-dialog">
					    
					      <!-- Modal content-->
					      <div class="modal-content">
					        <div class="modal-header">
					          <button type="button" class="close" data-dismiss="modal">&times;</button>
					          <h4 class="modal-title">Do you want to start a new game?</h4>
					        </div>
					        <div class="modal-footer">
					          <form action="game/index.html" method="get" class='form-inline'>
					          	<button type="submit" class="btn btn-default">Start</button>
					          	<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					          </form>
					          
					        </div>
					      </div>
					      
					    </div>
				  	</div>

				  	<div class="modal fade" id="LG_MOD" role="dialog">
					    <div class="modal-dialog">
					    
					      <!-- Modal content-->
					      <div class="modal-content">
					        <div class="modal-header">
					          <button type="button" class="close" data-dismiss="modal">&times;</button>
					          <h4 class="modal-title">Saves</h4>
					        </div>
					        <div class="modal-body">
					          	<table id="saves-table" class='table table-inverse'>
					          		<thead>
						          		<tr>
						          			<th>Date & Time</th>
						          			<th>Level</th>
						          			<th class='col-sm-4'>Options</th>
						          		</tr>
						          	</thead>
					          		<tbody>
					          			
					          		</tbody>
					          	</table>
					        </div>
					        <div class="modal-footer">
					          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					        </div>
					      </div>
					      
					    </div>
				  	</div>

				  	<div class="modal fade" id="ST_MOD" role="dialog">
					    <div class="modal-dialog">
					    
					      <!-- Modal content-->
					      <div class="modal-content">
					        <div class="modal-header">
					          <button type="button" class="close" data-dismiss="modal">&times;</button>
					          <h4 class="modal-title">Story</h4>
					        </div>
					        <div class="modal-body">
					          <p style="font-size: 1.3em;">It is the year 2020, the secret U.S Military base
								was developing a an artificial intelligence robot to take over the world. This was known as Project Omega.
								During the final stages of testing. The first weapon had developed an understanding of human conscience. Upon discovering its purpose as a weapon to enslave, the weapon had escaped the facility and destroyed all internal network systems that could lead to it.
								<br><br>

								As this happend all so suddenly, the Head Military Chief of the U.S had coded this case as Project Alpha.
								<br><br>
								Now upon discovering the U.S mass producing robots to enslave humanity, Weapon Alpha must annihilate the lab where he was once built in and protect the world.</p>
					        </div>
					        <div class="modal-footer">
					          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					        </div>
					      </div>
					      
					    </div>
				  	</div>

				  	<div class="modal fade" id="settings_MOD" role="dialog">
					    <div class="modal-dialog">
					    
					      <!-- Modal content-->
					      <div class="modal-content">
					        <div class="modal-header">
					          <button type="button" class="close" data-dismiss="modal">&times;</button>
					          <h4 class="modal-title">Controls</h4>
					        </div>
					        <div class="modal-body">
					        	<div class='row'>
					        		<form class='col-xs-6 col-xs-offset-3'>
					        			<div class='form-group'>
					        				<label>Left</label>
						        			<input type="text" name="" class='form-control' id="leftkey">
					        			</div>
						        		<div class='form-group'>
							        		<label>Duck</label>
							        		<input type="text" name="" class='form-control' id="duckkey">
							        	</div>
							        	<div class='form-group'>
							        		<label>Right</label>
							        		<input type="text" name="" class='form-control'id="rightkey">
							        	</div>
							        	<div class='form-group'>
							        		<label>Jump</label>
							        		<input type="text" name="" class='form-control'id="jumpkey">
							        	</div>
							        	<div class='form-group'>
							        		<label>Shoot</label>
							        		<input type="text" name="" class='form-control'id="shootkey">
							        	</div>
							        	<div class='form-group'>
							        		<button class='btn btn-success' type='button' id='control-submit'>
							        			Save changes
							        		</button>

							        	</div>
						        	</form>
					        	</div>
				
					        </div>
					        <div class="modal-footer">
					          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					        </div>
					      </div>
					      
					    </div>
				  	</div>

				  	<div class="modal fade" id="signOut_MOD" role="dialog">
					    <div class="modal-dialog">
					    
					      <!-- Modal content-->
					      <div class="modal-content">
					        <div class="modal-header">
					          <button type="button" class="close" data-dismiss="modal">&times;</button>
					          <h4 class="modal-title">Are you sure you want to Sign Out?</h4>
					        </div>
					        <div class="modal-footer">
						        <a href="logout.php"><button type="submit" class="btn btn-default">Sign Out</button></a>
						          <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
					        </div>
					      </div>
					      
					    </div>
				  	</div>
					<!-- END OF MODALS -->
	</body>
</html>
<script>
	$( document ).ready(function(){
		$(".mydiv").hide();
		$(".mydiv").fadeIn(800);
	});

	$('#load-btn').on('click', function(){
		$("#saves-table > tbody").html('');
		$.ajax({
			url: 'process/saves.php',
			method: 'post',
			data: {
				player_id: 1
			},
			dataType: 'json',
			success: function(data){
				for(var i = 0; i < data.length; i++) {
					$("#saves-table > tbody").append("<tr><td>"+data[i].date_saved+"</td><td>Level "+data[i].level+"</td><td><button class='btn btn-warning'>Load</button> <button class='btn btn-danger'>Delete</button></td></tr>");
				}
				
					
			},
		});
	});

	$('#settings-btn').on('click', function(){
		$.ajax({
			url: 'process/fetch_controls.php',
			dataType: 'json',
			success: function(data){
				console.log(data);
				$("#leftkey").val(data.leftkey);
				$("#rightkey").val(data.rightkey);
				$("#duckkey").val(data.duckkey);
				$("#shootkey").val(data.shootkey);
				$("#jumpkey").val(data.jumpkey);
			},
		});
	});

	$('#control-submit').on('click', function(){
		$.ajax({
			url: 'process/set_controls.php',
			method: 'post',
			data: {
				left: $("#leftkey").val(),
				duck: $("#duckkey").val(),
				right: $("#rightkey").val(),
				shoot: $("#shootkey").val(),
				jump: $("#jumpkey").val()
			},
			success: function(data){
				$("#settings_MOD").modal('hide');
			},
		});
	});
</script>

