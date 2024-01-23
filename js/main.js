// =============================================================================
// sprites
// =============================================================================

//
// hero sprite
//
function Hero(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);

    // all about physic
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;

    // all animations
    this.animations.add('stop', [14])
    this.animations.add('walk', [0, 1, 2, 3, 4], 8, true);
    this.animations.add('jump', [13]);
    this.animations.add('fall', [6]);

    
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.lastVelocity = 0;

Hero.prototype.move = function (direction) {
    const SPEED = 200;
    this.body.velocity.x = direction * SPEED;
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.setLastVelocity = function(int) {
    Hero.prototype.lastVelocity = int;
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;
    let canJump = this.body.touching.down;

    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};

Hero.prototype.velocity = function () {
    return this.body.velocity.y
}

Hero.prototype.plunge = function () {
    const JUMP_SPEED = 600;
    let canPlunge = !this.body.touching.down;

    if (canPlunge) {
        this.body.velocity.y = JUMP_SPEED;
    }

    return canPlunge;
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'walk';
    }

    return name;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

// =============================================================================
// game states
// =============================================================================

PlayState = {};

const LEVEL_COUNT = 3;

PlayState.init = function (data) {
    this.game.renderer.renderSession.roundPixels = true;

    // variables about level
    this.lettersToFind = [];
    this.lettersFound = [];
    this.positionsForLetters = [];
    this.letterFoundPosition = 0;

    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP,
        down: Phaser.KeyCode.DOWN
    });
    this.keys.up.onDown.add(function () {
        this.hero.jump();
    }, this);
    this.keys.down.onDown.add(function () {
        this.hero.plunge();
    }, this);

    this.level = (data.level || 0) % LEVEL_COUNT;
};

PlayState.preload = function () {
    //levels
    this.game.load.json('level:0', 'data/level01.json')
    this.game.load.json('level:1', 'data/level02.json');
    this.game.load.json('level:2', 'data/level03.json');

    this.game.load.image('background', 'images/background.png');
    this.game.load.spritesheet('hero', 'images/hero_animated.png', 47, 62);

    //plateforms
    this.game.load.image('ground', 'images/platforms/ground.png');
    this.game.load.image('underground', 'images/platforms/underground.png');
    this.game.load.image('snow', 'images/platforms/snow.png');
    this.game.load.image('snow_4corners', 'images/platforms/snow_4corners.png');
    this.game.load.image('snow_2left_corners', 'images/platforms/snow_2left_corners.png');
    this.game.load.image('snow_2right_corners', 'images/platforms/snow_2right_corners.png');
    this.game.load.image('snow_breakRight', 'images/platforms/snow_breakRight.png');
    this.game.load.image('snow_breakLeft', 'images/platforms/snow_breakLeft.png');
    this.game.load.image('snow_breakable', 'images/platforms/snow_breakable.png');
    this.game.load.image('ice', 'images/platforms/ice.png');

    // decorations
    this.game.load.image('computer', 'images/decorations/computer.png');
    this.game.load.spritesheet('portal', 'images/decorations/portal.png', 84, 84);
    this.game.load.image('button', 'images/decorations/button.png');
    this.game.load.image('button_pressed', 'images/decorations/button_pressed.png');

    // letters
    this.game.load.spritesheet('A', 'images/letters/A.png', 22, 22);
    this.game.load.spritesheet('B', 'images/letters/B.png', 22, 22);
    this.game.load.spritesheet('C', 'images/letters/C.png', 22, 22);
    this.game.load.spritesheet('D', 'images/letters/D.png', 22, 22);
    this.game.load.spritesheet('E', 'images/letters/E.png', 22, 22);
    this.game.load.spritesheet('F', 'images/letters/F.png', 22, 22);
    this.game.load.spritesheet('G', 'images/letters/G.png', 22, 22);
    this.game.load.spritesheet('H', 'images/letters/H.png', 22, 22);
    this.game.load.spritesheet('I', 'images/letters/I.png', 22, 22);
    this.game.load.spritesheet('J', 'images/letters/J.png', 22, 22);
    this.game.load.spritesheet('L', 'images/letters/L.png', 22, 22);
    this.game.load.spritesheet('N', 'images/letters/N.png', 22, 22);
    this.game.load.spritesheet('O', 'images/letters/O.png', 22, 22);
    this.game.load.spritesheet('P', 'images/letters/P.png', 22, 22);
    this.game.load.spritesheet('R', 'images/letters/R.png', 22, 22);
    this.game.load.spritesheet('S', 'images/letters/S.png', 22, 22);
    this.game.load.spritesheet('T', 'images/letters/T.png', 22, 22);
    this.game.load.spritesheet('.', 'images/letters/point.png', 6, 22);
    this.game.load.spritesheet(';', 'images/letters/point_virgule.png', 22, 22);
    this.game.load.spritesheet('=', 'images/letters/egal.png', 22, 22);
};

PlayState.create = function () {
    this.game.add.image(0, 0, 'background');
    this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
};

//
// Functions about create
//

PlayState._loadLevel = function (data) {
    // create all groups
    this.platforms = this.game.add.group();
    this.breakablePlatforms = this.game.add.group();
    this.velocityDetectors = this.game.add.group();
    this.decorations = this.game.add.group();
    this.allIce = this.game.add.group();
    this.letters = this.game.add.group();
    this.lettersFoundPosted = this.game.add.group();
    this.resultLetters = this.game.add.group();

    // makes invisible some groups
    this.velocityDetectors.visible = false;
    this.resultLetters.visible = false; 

    // load data about result
    this.lettersToFind = data.computer.result;
    this.positionsForLetters = data.computer.positionsForLetters;

    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    data.breakablePlatforms.forEach(this._spawnBreakablePlatform, this);
    data.velocityDetectors.forEach(this._spawnVelocityDetector, this);
    data.allIce.forEach(this._spawnIce, this);

    // spawn hero
    this._spawnHero({hero: data.hero});
    
    //spawn letters
    data.letters.forEach(this._spawnLetter, this);
    data.lettersPosted.forEach(this._spawnLetter, this);
    data.resultLetters.forEach(this._spawnResultLetter, this);

    //spawn all decorations
    this._spawnPortal(data.portal.x, data.portal.y);
    this._spawnComputer(data.computer.x, data.computer.y);
    this._spawnButtonPressed(data.button_pressed.x, data.button_pressed.y)
    this._spawnButton(data.button.x, data.button.y);
    
    // enable gravity
    const GRAVITY = 1200;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

// All spawn functions about _loadLevel

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

};

PlayState._spawnBreakablePlatform = function (breakablePlatform) {
    let sprite = this.breakablePlatforms.create(
        breakablePlatform.x, breakablePlatform.y, 'snow_breakable');

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
};

PlayState._spawnVelocityDetector = function (velocityDetector) {
    let sprite = this.velocityDetectors.create(
        velocityDetector.x, velocityDetector.y, 'snow_breakable');

    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

};

PlayState._spawnIce = function(ice) {
    let sprite = this.allIce.create(
        ice.x, ice.y, 'ice');

    this.game.physics.enable(sprite);
}

PlayState._spawnPortal = function(x, y) {
    this.portal = this.decorations.create(x, y, 'portal');
    this.portal.animations.add('close', [0, 1, 2, 3, 4, 5, 6, 7], 6, true);
    this.portal.animations.add('opening', [8, 9, 10, 11, 12, 13, 14, 15], 6);
    this.portal.animations.add('open', [16, 17, 18, 19, 20, 21, 22, 23], 6, true);
    this.portal.IsOpen = false;
    this.game.physics.enable(this.portal);
    this.portal.body.allowGravity = false;
}

PlayState._spawnComputer = function(x, y) {
    this.computer = this.decorations.create(x, y, 'computer');
    this.game.physics.enable(this.computer);
    this.computer.body.allowGravity = false;
}

PlayState._spawnButtonPressed = function(x, y) {
    this.button_pressed = this.decorations.create(x, y, 'button_pressed');
    this.game.physics.enable(this.button_pressed);
    this.button_pressed.body.allowGravity = false;
    this.button_pressed.body.immovable = true;
}

PlayState._spawnButton = function(x, y) {
    this.button = this.decorations.create(x, y, 'button');
    this.game.physics.enable(this.button);
    this.button.body.allowGravity = false;
    this.button.body.immovable = true;
}

PlayState._spawnLetter = function(letter) {
    this.letter = this.letters.create(letter.x, letter.y, letter.image);
    this.letter.animations.add('turn', letter.animation, 6, true);
    this.letter.animations.play('turn');
    this.letter.name = letter.image;
    this.game.physics.enable(this.letter);
    this.letter.body.allowGravity = false;
}

PlayState._spawnResultLetter = function(letter) {
    this.letter = this.resultLetters.create(letter.x, letter.y, letter.image);
    this.letter.animations.add('turn', letter.animation, 6, true);
    this.letter.animations.play('turn');
    this.letter.name = letter.image;
    this.game.physics.enable(this.letter);
    this.letter.body.allowGravity = false;
}

PlayState._spawnHero = function (data) {
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
    this.hero.frame = 0;

};

//
// Functions about update
//

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.hero, this.platforms);
    this.game.physics.arcade.collide(this.hero, this.breakablePlatforms, this._breakPlatform, null, this);
    this.game.physics.arcade.collide(this.allIce, this.platforms);
    this.game.physics.arcade.collide(this.allIce, this.hero);
    this.game.physics.arcade.overlap(this.hero, this.velocityDetectors, this._velocityDetector, null, this);
    this.game.physics.arcade.overlap(this.hero, this.letters, this._findLetter, null, this);
    this.game.physics.arcade.collide(this.hero, this.button_pressed);
    if (this.button_pressed.body.touching.up) {
        this._pressButton(this.hero, this.button);
    } else {
        this._unpressButton(this.hero, this.button);
    }
    this.game.physics.arcade.overlap(this.hero, this.computer, this._touchingComputer, null, this);
    if (this.computer.body.touching.right || this.computer.body.touching.left || this.computer.body.touching.up) {
        this.resultLetters.visible = false;
    }
    this.game.physics.arcade.overlap(this.hero, this.portal, this._levelUp, null, this);
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else {
        this.hero.move(0);
    }
};

// Functions about _handleCollisions

PlayState._breakPlatform = function (hero, breakablePlatform) {
    if (hero.lastVelocity >= 700) {
        hero.lastVelocity = 0;
        breakablePlatform.kill();
    }
};

PlayState._velocityDetector = function (hero, velocityDetector) {
    if (hero.velocity() >= 700) {
        hero.lastVelocity = hero.velocity();
        velocityDetector.kill();
    }
};

PlayState._findLetter = function (hero, letter) {
    this.lettersFound.push(letter.name);
    letter.kill();
    letterPosted = this.lettersFoundPosted.create(this.positionsForLetters[this.letterFoundPosition], 558, letter.name);
    letterPosted.animations.add('stop', [0], 6, true);
    letterPosted.animations.play('stop');
    this.letterFoundPosition++;
};

PlayState._unpressButton = function (hero, button) {
    button.visible = true;
    if (this.portal.IsOpen) {
        this.portal.animations.play('open');
    } else {
        this.portal.animations.play('close');
    }
};

PlayState._pressButton = function (hero, button) {
    button.visible = false;
    this.game.state.restart(true, false, {level: this.level});

};

PlayState._touchingComputer = function (hero, computer) {
    this.resultLetters.visible = true;
    if (!this.portal.IsOpen && JSON.stringify(this.lettersFound)==JSON.stringify(this.lettersToFind)) {
        this.portal.animations.play('opening');
        this.portal.IsOpen = true;
    }
};

PlayState._levelUp = function (hero, portal) {
    if (portal.IsOpen) {
        this.game.state.restart(true, false, { level: this.level + 1 });
    }
}

// =============================================================================
// entry point
// =============================================================================

window.onload = function () {
    let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
    game.state.add('play', PlayState);
    game.state.start('play');
    game.state.start('play', true, false, {level: 0});
};
