function createCanonsAnimation(scene: Phaser.Scene) {
    if (!scene.anims.exists('canonShootSide')) {
        scene.anims.create({  
            key: 'canonShootSide',
            frames: scene.anims.generateFrameNumbers('canonSheet', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 0
        });
    }
        if (!scene.anims.exists('canonTopDown')) {
        scene.anims.create({  
            key: 'canonTopDown',
            frames: scene.anims.generateFrameNumbers('canonSheet', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: 0
        });
    }
    if(!scene.anims.exists('diskSheet'))
        {
            scene.anims.create({
            key: 'diskSheet',
            frames: scene.anims.generateFrameNumbers('diskSheet', { start: 0, end:  1 }),
            frameRate: 10,
            repeat: 0,
        });
    }
}

function createCoinsAnimation(scene: Phaser.Scene)
{
    if (!scene.anims.exists('coins')) {
        scene.anims.create({  
            key: 'coins',
            frames: scene.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
    }
    else
    {
        console.log("existe déjà")
    }
}

function createBarilsAnimation(scene: Phaser.Scene)
{
    if (!scene.anims.exists('destroyBaril')) {
        scene.anims.create({  
            key: 'destroyBaril',
            frames: scene.anims.generateFrameNumbers('destroyBaril', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });
    }
    else
    {
        console.log("existe déjà")
    }
}

function createBoxsAnimation(scene: Phaser.Scene)
{
    if (!scene.anims.exists('destroyBox')) {
        scene.anims.create({  
            key: 'destroyBox',
            frames: scene.anims.generateFrameNumbers('destroyBox', { start: 0, end: 1 }),
            frameRate: 1,
            repeat: 0
        });
    }
    else
    {
        console.log("existe déjà")
    }
}

function createJumperAnimation(scene: Phaser.Scene)
{
    if (!scene.anims.exists('kingJumper')) {
        scene.anims.create({  
            key: 'kingJumper',
            frames: scene.anims.generateFrameNumbers('kingJumper', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
    }
    else
    {
        console.log("existe déjà")
    }
}




export { createCanonsAnimation, createCoinsAnimation, createBarilsAnimation, createBoxsAnimation, createJumperAnimation };