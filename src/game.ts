import { movePlayerTo } from '@decentraland/RestrictedActions'
import * as ui from '@dcl/ui-scene-utils'
import * as utils from '@dcl/ecs-scene-utils'

const pitch = new Entity()
pitch.addComponent(new GLTFShape("models/football_new.glb"))
pitch.addComponent(new Transform({
  scale: new Vector3(1, 1, 1),
  rotation: Quaternion.Euler(0, 180, 0),
  position: new Vector3(16, -0.1, 2.5)
}))
engine.addEntity(pitch)

const ball = new Entity()
ball.addComponent(new GLTFShape("models/football.glb"))
ball.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(3, 3, 3)
}))

ball.addComponent(
  new utils.TriggerComponent(
    new utils.TriggerSphereShape(0.3),
	{
    layer: 1
	
	}
    
  )
)

engine.addEntity(ball)


const goal_area = new Entity()
goal_area.addComponent(new BoxShape())
goal_area.getComponent(BoxShape).visible = false
goal_area.addComponent(new Transform({ position: new Vector3(16, 1, 53), scale: new Vector3(9, 6, 3) }))


goal_area.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(9, 6, 3)),
	{
    layer: 2,
    triggeredByLayer: 1,
		onTriggerEnter :() => {
      resetBall(true, ball_x, ball_z)
		},
    enableDebug: false
	}    
  )
)

engine.addEntity(goal_area)

const crossbar = new Entity()
crossbar.addComponent(new BoxShape())
crossbar.getComponent(BoxShape).visible = false
crossbar.addComponent(new Transform({ position: new Vector3(16, 3.9, 50), scale: new Vector3(9, 0.3, 1) }))
engine.addEntity(crossbar)

crossbar.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(9, 0.3, 1)),
{
  layer: 3,
  triggeredByLayer: 1,
  onTriggerEnter :() => {
    horizontal = horizontal*-0.5
    tan_direction = tan_direction*-1
  },
  enableDebug: false
}    
)
)


const left_post = new Entity()
left_post.addComponent(new BoxShape())
left_post.getComponent(BoxShape).visible = false
left_post.addComponent(new Transform({ position: new Vector3(11.6, 1, 50), scale: new Vector3(0.3, 6, 0.3) }))
engine.addEntity(left_post)

left_post.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(0.3, 6, 1)),
{
  layer: 3,
  triggeredByLayer: 1,
  onTriggerEnter :() => {
    horizontal = horizontal*-0.5
    tan_direction = tan_direction*-1
  },
  enableDebug: false
}    
)
)

const right_post = new Entity()
right_post.addComponent(new BoxShape())
right_post.getComponent(BoxShape).visible = false
right_post.addComponent(new Transform({ position: new Vector3(20.4, 1, 50), scale: new Vector3(0.3, 6, 0.3) }))
engine.addEntity(right_post)

right_post.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(0.3, 6, 1)),
{
  layer: 3,
  triggeredByLayer: 1,
  onTriggerEnter :() => {
    horizontal = horizontal*-0.5
    tan_direction = tan_direction*-1
  },
  enableDebug: false
}    
)
)

const wallshape = new BoxShape()
wallshape.visible = true


function add_wall(x: number, y: number, z: number, length: number, width: number) {
  const wall = new Entity()
  wall.addComponent(wallshape)
  engine.addEntity(wall)
  wall.addComponentOrReplace(new Transform({
    position: new Vector3(x, y, z),
    scale: new Vector3(length, width, 0.1)
  }))
  var wall_shape = new utils.TriggerBoxShape(new Vector3(length, width, 2))
  wall.removeComponent(utils.TriggerComponent)
  wall.addComponent(new utils.TriggerComponent(wall_shape,
    {
      layer: 3,
      triggeredByLayer: 1 ,
      onTriggerEnter :() => {
        horizontal = horizontal*-0.1
        tan_direction = tan_direction*-1
      },
      enableDebug: false
    
    }    
    )
    )
    return wall
}



// SHOT POWER SELECTION

const input = Input.instance

let power_icon = new ui.MediumIcon('images/power-icon.png', 10, 545, 200, 65)
let power_counter = new ui.UICounter(0, -10, 570, Color4.Red(), 30, true)
let power_bar = new ui.UIBar(0, 0, 550, Color4.Red(), ui.BarStyles.SQUAREBLACK, 1)


export class PowerCounter implements ISystem {
  update() {
    power_counter.increase(2)
    power_bar.increase(0.02)
    if (power_counter.read() == 100) {
      power_counter.decrease(100)
      power_bar.set(0)
    }
  }
}

const power_system = new PowerCounter()

var count = 0

input.subscribe("BUTTON_DOWN", ActionButton.ACTION_3, false, (e) => {
  if (count == 0){
    engine.addSystem(power_system)
  }
})

input.subscribe("BUTTON_UP", ActionButton.ACTION_3, false, (e) => {
  engine.removeSystem(power_system)
  count += 1
  power = power_counter.read()/50
})


// SHOT ANGLE SELECTION

let angle_icon = new ui.MediumIcon('images/angle-icon.png', 10, 465, 200, 65)
let angle_counter = new ui.UICounter(0, -10, 490, Color4.Blue(), 30, true)
let angle_bar = new ui.UIBar(0, 0, 470, Color4.Blue(), ui.BarStyles.SQUAREBLACK, 1)

export class AngleCounter implements ISystem {
  update() {
    angle_counter.increase(1)
    angle_bar.increase(1/45)
    if (angle_counter.read() == 45) {
      angle_counter.decrease(45)
      angle_bar.set(0)
    }
  }
}

const angle_system = new AngleCounter()

var count1 = 0

input.subscribe("BUTTON_DOWN", ActionButton.ACTION_4, false, (e) => {
  if (count1 == 0){
    engine.addSystem(angle_system)
  }
})

input.subscribe("BUTTON_UP", ActionButton.ACTION_4, false, (e) => {
  engine.removeSystem(angle_system)
  count1 += 1
  angle = angle_counter.read()
  sin_angle = (Math.sin((Math.PI/180)*angle))
  cos_angle = (Math.cos((Math.PI/180)*angle))
})


// SHOT DIRECTION SELECTION

let direction_icon = new ui.MediumIcon('images/direction-icon.png', 10, 385, 200, 66)
let direction_counter = new ui.UICounter(0, -10, 410, Color4.Green(), 30, true)
let direction_bar_right = new ui.UIBar(0, 0, 390, Color4.Green(), ui.BarStyles.SQUAREBLACK, 0.5)
let direction_bar_left = new ui.UIBar(0, -70, 390, Color4.Green(), ui.BarStyles.SQUAREBLACK, 0.5)

export class DirectionCounter implements ISystem {
  update() {
    direction_counter.increase(1)
    if (direction_counter.read() > 0) {
      direction_bar_right.increase(1/30)
    }
    if (direction_counter.read() == 30) {
      direction_counter.decrease(60)
      direction_bar_right.set(0)
    }
    if (direction_counter.read() < 0){
      direction_bar_left.increase(1/30)
    }
  }
}

const direction_system = new DirectionCounter()

var count2 = 0

input.subscribe("BUTTON_DOWN", ActionButton.ACTION_5, false, (e) => {
  if (count2 == 0){
    engine.addSystem(direction_system)
  }
})

input.subscribe("BUTTON_UP", ActionButton.ACTION_5, false, (e) => {
  engine.removeSystem(direction_system)
  count2 += 1
  direction = direction_counter.read()
  tan_direction = (Math.tan(direction * Math.PI / 180))
})

const sphere = new SphereShape()

const ball_1 = new Entity()
ball_1.addComponent(sphere)
ball_1.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_1)

const ball_2 = new Entity()
ball_2.addComponent(sphere)
ball_2.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_2)

const ball_3 = new Entity()
ball_3.addComponent(sphere)
ball_3.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_3)

const ball_4 = new Entity()
ball_4.addComponent(sphere)
ball_4.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_4)

const ball_5 = new Entity()
ball_5.addComponent(sphere)
ball_5.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_5)

const ball_6 = new Entity()
ball_6.addComponent(sphere)
ball_6.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_6)

const ball_7 = new Entity()
ball_7.addComponent(sphere)
ball_7.addComponent(new Transform({
  position: new Vector3(16, 0.2, 35),
  scale: new Vector3(0.2, 0.2, 0.2)
}))
engine.addEntity(ball_7)


export class BallPath implements ISystem {
  update() {
    let temp_power = power_counter.read()/50
    let temp_angle = angle_counter.read()
    let temp_direction = direction_counter.read()

    let temp_sin_angle = (Math.sin((Math.PI/180)*temp_angle))
    let temp_cos_angle = (Math.cos((Math.PI/180)*temp_angle))
    let temp_tan_direction = (Math.tan(temp_direction * Math.PI / 180))

    ball_1.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle, 0.2 + temp_power*temp_sin_angle + 0.5*-gravity, ball_z + temp_power*temp_cos_angle)
    }))
    ball_2.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle*2, 0.2 + temp_power*temp_sin_angle*2 + 0.5*-gravity*4, ball_z + temp_power*2*temp_cos_angle)
    }))
    ball_3.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle*3, 0.2 + temp_power*temp_sin_angle*3 + 0.5*-gravity*9, ball_z + temp_power*3*temp_cos_angle)
    }))
    ball_4.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle*4, 0.2 + temp_power*temp_sin_angle*4 + 0.5*-gravity*16, ball_z + temp_power*4*temp_cos_angle)
    }))
    ball_5.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle*5, 0.2 + temp_power*temp_sin_angle*5 + 0.5*-gravity*25, ball_z + temp_power*5*temp_cos_angle)
    }))
    ball_6.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle*6, 0.2 + temp_power*temp_sin_angle*6 + 0.5*-gravity*36, ball_z + temp_power*6*temp_cos_angle)
    }))
    ball_7.addComponentOrReplace(new Transform({
      scale: new Vector3(0.2, 0.2, 0.2),
      position: new Vector3(ball_x + temp_tan_direction*temp_power*temp_cos_angle*7, 0.2 + temp_power*temp_sin_angle*7 + 0.5*-gravity*49, ball_z + temp_power*7*temp_cos_angle)
    }))
  }
}

let ballPath = new BallPath()
engine.addSystem(ballPath)

var level = 1
var level_counter = new ui.UICounter(1, -700, 600, Color4.White(), 70, false)
var wind = 0


// BALL RESET FUNCTION

var wall_1 = add_wall(0,0,0,0,0)
var wall_2 = add_wall(0,0,0,0,0)

var ball_x = 16
var ball_z = 35

function resetBall(goal_scored: boolean, x: number, z: number) {
  ball.addComponentOrReplace(new Transform({
    position: new Vector3(x, 0.2, z),
    scale: new Vector3(3, 3, 3)
  }))
  sphere.visible = true
  if (goal_scored == false) {
    ui.displayAnnouncement('MISS!', 2, Color4.Red(), 50, true)
    level = 1
    level_counter.set(1)
  } else {
    ui.displayAnnouncement('GOAL!', 2, Color4.Yellow(), 50, true)
    level += 1
    level_counter.increase(1)
  }
  power_bar.set(0)
  angle_bar.set(0)
  direction_bar_left.set(0)
  direction_bar_right.set(0)

  // LEVEL DESIGNS


  if (level == 1) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 35),
      scale: new Vector3(3, 3, 3)
    }))
    ball_x = 16
    ball_z = 35
    engine.removeEntity(wall_1)
    engine.removeEntity(wall_2)
  }

  if (level == 2) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 2', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 2.8, 50, 8, 1.7)
    })
  }

  if (level == 3) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 3', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 0, 50, 8, 3)
    })
  }

  if (level == 4) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 4', 3, Color4.White(), 50, false)
      wall_1 = add_wall(14, 1.8, 50, 4.3, 3.7)
    })
  }

  if (level == 5) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 5', 3, Color4.White(), 50, false)
      wall_1 = add_wall(18, 1.8, 50, 4.3, 3.7)
    })
  }

  if (level == 6) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 6', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 1.8, 50, 4.3, 3.7)
      })
  }

  if (level == 7) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 7', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 0, 43, 5, 3)
    })
  }

  if (level == 8) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 8', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 0, 50, 8, 5)
    })
  }

 
  if (level == 9) {
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 9', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 0, 43, 8, 3)
      wall_2 = add_wall(16, 2.8, 50, 8, 1.7)
    })
    

  }

  if (level == 10) {
    engine.removeEntity(wall_1)
    engine.removeEntity(wall_2)
    ball.addComponentOrReplace(new Transform({
      position:new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 10', 3, Color4.White(), 50, false)
    })
    movePlayerTo({x:16, y:0, z:20})
    ball_x = 16
    ball_z = 25
  }

  if (level == 11) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 11', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 2.8, 50, 8, 1.7)
    })
  }

  if (level == 12) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 12', 3, Color4.White(), 50, false)
      wall_1 = add_wall(16, 0, 50, 8, 3)
    })

  }

  if (level == 13) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(12, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    engine.removeEntity(wall_1)
    utils.setTimeout(1500, ()=>{
      ui.displayAnnouncement('LEVEL 13', 3, Color4.White(), 50, false)
      wall_1 = add_wall(14, 2, 50, 4.6, 4)
    })
  }

  // if (level == 14) {
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(20, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wall_1.addComponentOrReplace(new Transform({
  //     position: new Vector3(18, 2, 50),
  //     scale: new Vector3(4.6, 4, 0.1)
  //   }))
  // }

  // if (level == 15) {
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wall_1.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 2, 50),
  //     scale: new Vector3(4.6, 4, 0.1)
  //   }))
  // }

  // if (level == 16) {
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wall_1.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0, 43),
  //     scale: new Vector3(5, 3, 0.1)
  //   }))
  //   wall_1_length = 5
  //   wall_1_height = 3
  // }

  // if (level == 17) {
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wall_1.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0, 50),
  //     scale: new Vector3(8, 5, 0.1)
  //   }))
  //   wall_1_length = 8
  //   wall_1_height = 5
  // }

 
  // if (level == 18) {
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wall_1.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0, 43),
  //     scale: new Vector3(8, 3, 0.1)
  //   }))
  //   wall_2.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 3, 50),
  //     scale: new Vector3(8, 2, 0.1)
  //   }))
  //   wall_1_length = 8
  //   wall_1_height = 3

  //   wall_2_length = 8
  //   wall_2_height = 2

  // }

  // if (level == 19) {
  //   movePlayerTo({x:16, y:0, z:20})
  //   hideWalls()
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wind = 0.1
  // }

  // if (level == 20) {
  //   movePlayerTo({x:16, y:0, z:20})
  //   hideWalls()
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wind = -0.2
  // }

  // if (level == 21) {
  //   movePlayerTo({x:16, y:0, z:20})
  //   hideWalls()
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   wind = 0
  //   gravity = 0.01
  // }

  // if (level == 22) {
  //   movePlayerTo({x:16, y:0, z:20})
  //   hideWalls()
  //   ball.addComponentOrReplace(new Transform({
  //     position: new Vector3(16, 0.2, 25),
  //     scale: new Vector3(3, 3, 3)
  //   }))
  //   gravity = 0.06
  // }


  count = 0
  count1 = 0
  count2 = 0
  power_counter.set(0)
  angle_counter.set(0)
  direction_counter.set(0)
  power = 0
  angle = 0
  direction = 0
  sin_angle = 0
  cos_angle = 1
  tan_direction = 0


  engine.removeSystem(ballMove)
}




// DEFAULT BALL SETTINGS

var power = 0
var angle = 0
var direction = 0

var sin_angle = (Math.sin((Math.PI/180)*angle))
var cos_angle = (Math.cos((Math.PI/180)*angle))
var tan_direction = (Math.tan(direction * Math.PI / 180))
var horizontal = power*cos_angle
var vertical = power*sin_angle
var direct = horizontal*tan_direction


var gravity = 0.03


export class BallMove implements ISystem {
  update() {

    direct = horizontal*tan_direction
    ball.getComponent(Transform).translate(Vector3.Forward().scale(horizontal))
    ball.getComponent(Transform).translate(Vector3.Up().scale(vertical))
    ball.getComponent(Transform).translate(Vector3.Right().scale(direct))
    ball.getComponent(Transform).translate(Vector3.Right().scale(wind))

    vertical -= gravity

    // BALL BOUNCE

    if (ball.getComponent(Transform).position.y < 0.1) {
      vertical = vertical*-0.65
      horizontal = horizontal*0.85
    }  

    // BALL STOPS

    if (horizontal < 0.01 && horizontal > -0.01) {
      resetBall(false, ball_x, ball_z)
    }  


  }
}

const ballMove = new BallMove()


ball.addComponent(
  new OnPointerDown((e) => {
    sphere.visible = false

    if (power != 0) {
      horizontal = power*cos_angle
      vertical = power*sin_angle
      direct = horizontal*tan_direction
      engine.addSystem(ballMove)
    } else {
      count = 0
      ui.displayAnnouncement('SELECT POWER', 5, Color4.Red(), 50, true)
    }
  },
    { button: ActionButton.POINTER, hoverText: "Kick Ball" }
  )
)

const button = new Entity()
button.addComponent(new BoxShape())
button.addComponent(new Transform({
  position: new Vector3 (17, 0, 35)
}))
button.addComponent(
  new OnPointerDown((e) => {
    level += 1
    level_counter.increase()
  },
    { button: ActionButton.POINTER, hoverText: "Skip Level" }
  )
)
engine.addEntity(button)

const instructions = new Entity()
instructions.addComponent(new BoxShape())
instructions.addComponent(new Transform({
  position: new Vector3 (15, 0, 35)
}))
instructions.addComponent(
  new OnPointerDown((e) => {
    ui.displayAnnouncement('HOLD 1 TO SELECT POWER \n HOLD 2 TO SELECT VERTICAL ANGLE \n HOLD 3 TO SELECT HORIZONTAL ANGLE', 5, Color4.White(), 50, true)
  },
    { button: ActionButton.POINTER, hoverText: "Show Controls" }
  )
)
engine.addEntity(instructions)