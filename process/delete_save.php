<?php
require('configDatabase.php');

$query = mysqli_query($conn, "DELETE FROM saves WHERE save_id = '{$_POST['save_id']}'");

