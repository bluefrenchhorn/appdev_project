<?php 

session_start();
require('../process/configDatabase.php');

$query = mysqli_query($conn, "SELECT * FROM players WHERE player_No = {$_SESSION['player_id']}");
$row = mysqli_fetch_assoc($query);

$leftkey = $row['leftkey'];
$rightkey = $row['rightkey'];
$duckkey = $row['duckkey'];
$jumpkey = $row['jumpkey'];
$shootkey = $row['shootkey'];

$stage = 1;
$checkpoint = 0;
$lives = 3;

if (isset($_POST['save_id'])) {

	$query = mysqli_query($conn, "SELECT * FROM saves WHERE save_id = {$_POST['save_id']}");

	$row = mysqli_fetch_assoc($query);
	$stage = $row['level'];
	$checkpoint = $row['checkpoint'];
	$lives = $row['lives'];	
}

?>



<!DOCTYPE html>
<html>
<head>
	<title></title>
	<style type="text/css">
		body {
			padding: 0;
			margin: 0;
			background-color: #121212;
		}
	</style>
</head>

<body>

</body>
</html>
<script type="text/javascript" src="../js/jquery.js"></script>
<script type="text/javascript" src="js/phaser.js"></script>
<script type="text/javascript" src="js/boot.js"></script>
<script type="text/javascript" src="js/preload.js"></script>
<script type="text/javascript" src="js/classes.js"></script>
<script type="text/javascript" src="js/stage1.js"></script>
<script type="text/javascript" src="js/stage2.js"></script>
<script type="text/javascript" src="js/stage3.js"></script>
<script type="text/javascript">
var SideScroller = SideScroller || {};

SideScroller.setTileCollision = function(mapLayer, idxOrArray, dirs) {
    var mFunc; // tile index matching function
    if (idxOrArray.length) {
        // if idxOrArray is an array, use a function with a loop
        mFunc = function(inp) {
            for (var i = 0; i < idxOrArray.length; i++) {
                if (idxOrArray[i] === inp) {
                    return true;
                }
            }
            return false;
        };
    } else {
        // if idxOrArray is a single number, use a simple function
        mFunc = function(inp) {
            return inp === idxOrArray;
        };
    }
 
    // get the 2-dimensional tiles array for this layer
    var d = mapLayer.map.layers[mapLayer.index].data;
     
    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            var t = d[i][j];
            if (mFunc(t.index)) {
                 
                t.collideUp = dirs.top;
                t.collideDown = dirs.bottom;
                t.collideLeft = dirs.left;
                t.collideRight = dirs.right;
                 
                t.faceTop = dirs.top;
                t.faceBottom = dirs.bottom;
                t.faceLeft = dirs.left;
                t.faceRight = dirs.right;
                 
            }
        }
    }
 
};

SideScroller.findObjectsByType = function(type, map, layerName) {
	var result = new Array();

	map.objects[layerName].forEach(function(element){
		if(element.type === type) {
			result.push(element);
		}
	});

	return result;
};

SideScroller.Gameover = function(){};

SideScroller.Gameover.prototype = {
	create: function(){
		this.map = this.game.add.tilemap('gameover');
		this.map.addTilesetImage('platformertiles', 'gameTiles');
		this.map.addTilesetImage('scifi_platformTiles_32x32', 'scifiTiles');
		this.map.addTilesetImage('Jungle_terrain (1)', 'jungleTiles');

		this.background = this.map.createLayer('bg');
		this.stars = this.map.createLayer('stars');
		this.text = this.map.createLayer('text');
		this.platform = this.map.createLayer('platform');	

		this.background.resizeWorld();

		this.player = new SideScroller.Player(this.game, 224, 0);

		this.game.camera.follow(this.player);

		this.map.setCollisionBetween(1, 24, true, 'platform');
		this.map.setCollisionBetween(1, 10000, true, 'text');

		this.water = this.map.createLayer('water');
	},

	update: function(){
		this.game.physics.arcade.collide(this.player, this.platform);
		this.game.physics.arcade.collide(this.player, this.text);
	}
};

SideScroller.game = new Phaser.Game(960, 640, Phaser.AUTO, '');
SideScroller.game.state.add('Boot', SideScroller.Boot);
SideScroller.game.state.add('Preload', SideScroller.Preload);
SideScroller.game.state.add('Stage1', SideScroller.Stage1);
SideScroller.game.state.add('Stage2', SideScroller.Stage2);
SideScroller.game.state.add('Stage3', SideScroller.Stage3);
SideScroller.game.state.add('Gameover', SideScroller.Gameover);


SideScroller.stage = <?=$stage?>;
SideScroller.checkpoint = <?=$checkpoint?>;
SideScroller.playerLives = <?=$lives?>;
SideScroller.leftkey = '<?=$leftkey?>'.charCodeAt(0);
SideScroller.rightkey = '<?=$rightkey?>'.charCodeAt(0);
SideScroller.duckkey = '<?=$duckkey?>'.charCodeAt(0);
SideScroller.jumpkey = '<?=$jumpkey?>'.charCodeAt(0);
SideScroller.shootkey = '<?=$shootkey?>'.charCodeAt(0);

console.log(SideScroller.stage);

SideScroller.game.state.start('Boot');
</script>