"use client";

import Head from 'next/head'
import {useEffect} from "react"

export default function Alexoth() {
  useEffect(() => {
    document.fonts.ready.then(() => {
      tryRun()
    })
  }, []);

  return (
    <>
      <Head>
        <title>Alexoth</title>
        <meta name="viewport" content="width=500"/>
        <link rel="icon" type="image/png" href="/alexoth/favico.ico"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Tagesschrift&display=swap" rel="stylesheet"/>
        <script src="https://pixijs.download/release/pixi.min.js"></script>
      </Head>
      <div className={`
        m-0 p-0 pt-2 sm:p-0 
        overflow-hidden w-full min-h-screen h-full min-w-[500px] 
        bg-black 
        flex sm:items-center justify-center
      `}>
        <div id="view" className={`w-[480px] h-[640px] m-auto flex justify-center`}>
          <p className={`font-tagesschrift text-white`}>Loading...</p>
        </div>
      </div>
    </>
  )
}

function tryRun() {
  setTimeout(() => {
    run()
      .catch((err => {
        console.error("Error running Alexoth:", err);
        tryRun()
      }))
  }, 1000)
}

async function run() {
  if (window.alexothRunning === true) {
    return
  }
  window.alexothRunning = true;

  console.log('Running Alexoth...')

  const bgSound = new Audio('/alexoth/bg.mp3');

  let background = new PIXI.Graphics()
  background.rect(0, 0, 480, 640)
  background.fill(0x2e2e2e)

  const noiseTexture = createNoiseTexture(480, 100)
  const ground1 = new PIXI.Sprite(noiseTexture)
  const ground2 = new PIXI.Sprite(noiseTexture)

  ground1.position.set(0, 540)
  ground2.position.set(ground1.width, 540)

  let grass = new PIXI.Graphics()
  grass.rect(0, 0, 480, 10)
  grass.fill(0x3e9131)
  grass.position.set(0, 540)

  let countText = new PIXI.Text('0', {
    fontFamily: 'Tagesschrift',
    fontSize: 64,
    fill: 0xffffff,
    align: 'center'
  })
  countText.x = 20

  let xText = new PIXI.Text('x', {
    fontFamily: 'Tagesschrift',
    fontSize: 32,
    fill: 0xffffff,
    align: 'center'
  })
  xText.x = 80
  xText.y = 30

  await PIXI.Assets.load('/alexoth/szlug/szlug.png')
  let szlugCountIconSprite = PIXI.Sprite.from('/alexoth/szlug/szlug.png')
  szlugCountIconSprite.y = 0
  szlugCountIconSprite.x = 105
  szlugCountIconSprite.width = 100
  szlugCountIconSprite.height = 100

  let equalText = new PIXI.Text('=', {
    fontFamily: 'Tagesschrift',
    fontSize: 54,
    fill: 0xffffff,
    align: 'center'
  })
  equalText.x = 195
  equalText.y = 14

  let valueText = new PIXI.Text('0zł', {
    fontFamily: 'Tagesschrift',
    fontSize: 52,
    fill: 0xffffff,
    align: 'center'
  })
  valueText.x = 250
  valueText.y = 10

  let szlugSprite = PIXI.Sprite.from('/alexoth/szlug/szlug.png')
  szlugSprite.width = 70
  szlugSprite.height = 70
  szlugSprite.x = 500
  szlugSprite.y = 470
  let szlugCount = 0
  let szlugActive = false
  let szlugHit = false

  await PIXI.Assets.load('/alexoth/alex/base.png')
  let alexSprite = PIXI.Sprite.from('/alexoth/alex/base.png')
  const alexBaseY = 350
  alexSprite.y = alexBaseY
  alexSprite.x = 40

  let floatingText = new PIXI.Text('Alex', {
    fontFamily: 'Tagesschrift',
    fontSize: 32,
    fill: 0xffffff,
    align: 'center'
  })
  floatingText.anchor.set(0.5)
  floatingText.x = alexSprite.x + alexSprite.width / 2
  floatingText.y = alexSprite.y - 30

  let targetY = alexSprite.y
  let isJumping = false
  let velocityY = 0
  const gravity = 0.7
  const jumpStrength = -20

  const collisionSound = new Audio('/alexoth/fail.mp3');

  function handleJump() {
    if (!isJumping) {
      isJumping = true
      targetY = alexBaseY - 350
      velocityY = jumpStrength;
      setTimeout(() => {
        targetY = alexBaseY
      }, 600)
    }
  }

  const app = new PIXI.Application({
    eventMode: 'passive',
    eventFeatures: {
      move: true,
      globalMove: true,
      click: true,
      wheel: true
    },
  })
  await app.init({
    width: 480,
    height: 640
  })
  document.getElementById("view").replaceWith(app.canvas)

  const startScreen = new PIXI.Container();
  app.stage.addChild(startScreen);

// Add a background to the start screen
  const startBackground = new PIXI.Graphics();
  startBackground.rect(0, 0, app.screen.width, app.screen.height);
  startBackground.fill(0x000000);
  startScreen.addChild(startBackground);

  const startButton = new PIXI.Text('-----\n🚬 START 🚬\n-----', {
    fontFamily: 'Tagesschrift',
    fontSize: 32,
    fill: 0xffffff,
    align: 'center',
  });
  startButton.anchor.set(0.5);
  startButton.x = (app.screen.width / 2) - 1;
  startButton.y = app.screen.height / 2;
  startButton.interactive = true;
  startButton.buttonMode = true;
  startScreen.addChild(startButton);

  let byText = new PIXI.Text('@bambileilo', {
    fontFamily: 'Tagesschrift',
    fontSize: 20,
    fill: 0x494949,
    align: 'center'
  })
  byText.x = (app.screen.width / 2) - 55
  byText.y = app.screen.height - 60
  startScreen.addChild(byText)

// Add click event to the start button
  startButton.on('pointerdown', () => {
    startGame();
    bgSound.play()
    bgSound.loop = true
    bgSound.volume = 0.3
  });

  let elapsed = 0.0;
  app.ticker.maxFPS = 60;

  const gameScreen = new PIXI.Container();
  gameScreen.addChild(background)
  gameScreen.addChild(ground1, ground2)
  gameScreen.addChild(grass)
  gameScreen.addChild(countText)
  gameScreen.addChild(xText)
  gameScreen.addChild(szlugCountIconSprite)
  gameScreen.addChild(equalText)
  gameScreen.addChild(valueText)
  gameScreen.addChild(szlugSprite)
  gameScreen.addChild(floatingText)
  gameScreen.addChild(alexSprite)
  app.stage.addChild(gameScreen)
  gameScreen.visible = false

  function startGame() {
    startScreen.visible = false;
    gameScreen.visible = true;

    app.ticker.start()
    app.ticker.add((ticker) => {
      bgSound.play()
      elapsed += ticker.deltaTime

      if (isJumping) {
        velocityY += gravity
        alexSprite.y += velocityY

        if (alexSprite.y >= alexBaseY) {
          alexSprite.y = alexBaseY;
          isJumping = false;
          velocityY = 0;
        }
      }

      if (alexSprite.y.toFixed(0) === alexBaseY.toFixed(0)) {
        isJumping = false
      }

      floatingText.x = alexSprite.x + alexSprite.width / 2;
      floatingText.y = alexSprite.y - 30;

      const additionalSpeed = szlugCount * 0.1
      ground1.x -= 4 + additionalSpeed
      ground2.x -= 4 + additionalSpeed

      if (ground1.x <= -ground1.width) {
        ground1.x = ground2.x + ground2.width;
      }
      if (ground2.x <= -ground2.width) {
        ground2.x = ground1.x + ground1.width;
      }

      if (szlugActive) {
        valueText.text = `${(szlugCount * 1.48).toFixed(2)}zł`

        szlugSprite.x -= 4 + additionalSpeed
        if (szlugSprite.x < -100) {
          szlugActive = false

          if (!szlugHit) {
            szlugCount += 1
            countText.text = szlugCount
            if (szlugCount > 9) {
              xText.x = 95
            }
          } else {
            szlugCount -= 1
          }

          szlugHit = false
        }
      } else {
        if (Math.random() < 0.03) {
          spawnSzlug()
        }
      }

      const alexBounds = getReducedBounds(alexSprite, 0.5)
      const szlugBounds = getReducedBounds(szlugSprite, 0.9)

      if (
        alexBounds.x < szlugBounds.x + szlugBounds.width &&
        alexBounds.x + alexBounds.width > szlugBounds.x &&
        alexBounds.y < szlugBounds.y + szlugBounds.height &&
        alexBounds.y + alexBounds.height > szlugBounds.y
      ) {
        alexSprite.tint = 0xFF0000;

        // Reset color after 200ms
        setTimeout(() => {
          alexSprite.tint = 0xFFFFFF;
        }, 200);
        collisionSound.play();
        szlugHit = true
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        handleJump()
      } else if (e.code === 'KeyR' || e.code === 'Escape') {
        window.location.reload()
      }
    })

    document.addEventListener('click', (e) => {
      handleJump()
    })
  }

  function spawnSzlug() {
    szlugActive = true
    szlugSprite.x = 500
  }

  function createNoiseTexture(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width / 16;
    canvas.height = height / 16;
    const ctx = canvas.getContext('2d');

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const brown = 100 + Math.random() * 100;
      data[i] = brown;
      data[i + 1] = brown * 0.7;
      data[i + 2] = brown * 0.4;
      data[i + 3] = 100;
    }

    ctx.putImageData(imageData, 0, 0);

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = width;
    scaledCanvas.height = height;
    const scaledCtx = scaledCanvas.getContext('2d');
    scaledCtx.imageSmoothingEnabled = false;
    scaledCtx.drawImage(canvas, 0, 0, width, height);

    return PIXI.Texture.from(scaledCanvas);
  }

  function getReducedBounds(sprite, reductionFactor = 0.7) {
    const bounds = sprite.getBounds();
    const reducedWidth = bounds.width * (1 - reductionFactor);
    const reducedHeight = bounds.height * (1 - reductionFactor);

    return {
      x: bounds.x + reducedWidth / 2,
      y: bounds.y + reducedHeight / 2,
      width: bounds.width * reductionFactor,
      height: bounds.height * reductionFactor,
    };
  }
}
