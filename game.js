// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var text2
var winningMessage;
var losingMessage;
var won = false;
var currentScore = 0;
var winningScore = 105;
var lives = 3;
var lost = false;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(10, 310, "coin");
  createItem(370, 90, "coin");
  createItem(480, 180, "coin");
  createItem(480, 320, "coin");
  createItem(480, 520, "coin");
  createItem(480, 20, "coin");
  createItem(480, 420, "coin");
  createItem(80, 420, "coin");
  createItem(280, 420, "coin");
  createItem(100,100, "poison");
  createItem(200,100, "poison");
  createItem(300,100, "poison");
  createItem(500,10, "star");
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(10, 350, "platform");
  platforms.create(250, 150, "platform");
  platforms.create(450, 250, "platform");
  platforms.create(450, 5, "platform2");
  platforms.create(450, 150, "platform");
  platforms.create(450, 50, "platform");
  platforms.create(650, 400, "platform2");
  platforms.create(50, 400, "platform");
  platforms.create(250, 400, "platform");
  platforms.setAll("body.immovable", true);
}


// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add("spin");
  item.animations.play("spin", 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, "badge");
  badge.animations.add("spin");
  badge.animations.play("spin", 10, true);
}

// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  if(item.key == "coin"){
    currentScore = currentScore + 10;
  }
  if(item.key == "poison"){
    currentScore = currentScore -25;
    lives = lives -1;
  }
  if(item.key == "star"){
    currentScore = currentScore + 25;
  }
  if(lives === 0){
    lost = true;
  }
  if (currentScore === winningScore) {
    createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(900, 600, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update,
    render: render,
  });

  // before the game begins
  function preload() {
    game.stage.backgroundColor = "#5db1ad";

    //Load images
    game.load.image("platform", "assets/platform_1.png");
    game.load.image("platform2", "assets/obstacle.png");
    
    

    //Load spritesheets
    game.load.spritesheet("player", "assets/dog.png", 159.5, 165);
    game.load.spritesheet("coin", "assets/coin.png", 36, 44);
    game.load.spritesheet("badge", "assets/badge.png", 42, 54);
    game.load.spritesheet("poison", "assets/poison.png", 32, 32);
    game.load.spritesheet("star", "assets/star.png", 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, "player");
    player.animations.add("walk");
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 500;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, {
      font: "bold 24px Arial",
      fill: "white",
    });
    text2 = game.add.text(16, 40, "LIVES: " + lives, {
      font: "bold 24px Arial",
      fill: "white",
    });
    winningMessage = game.add.text(game.world.centerX, 275, "", {
      font: "bold 48px Arial",
      fill: "white",
    });
    winningMessage.anchor.setTo(0.5, 1);
    losingMessage = game.add.text(game.world.centerX, 275, "", {
      font: "bold 48px Arial",
      fill: "red",
    });
    losingMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    text2.text = "LIVES: "+lives;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play("walk", 10, true);
      player.body.velocity.x = -300;
      player.scale.x = -1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play("walk", 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }

    if (
      jumpButton.isDown &&
      (player.body.onFloor() || player.body.touching.down)
    ) {
      player.body.velocity.y = -800;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
    if(lost) {
      losingMessage.text = "YOU LOST:(";
    }
  }

  function render() {}
};
