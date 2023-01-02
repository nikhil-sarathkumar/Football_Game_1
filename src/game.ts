import { movePlayerTo } from '@decentraland/RestrictedActions'
import * as ui from '@dcl/ui-scene-utils'
import * as utils from '@dcl/ecs-scene-utils'



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
		onCameraEnter :() => {
		}
	
	}
    
  )
)

engine.addEntity(ball)

const goal = new Entity()
goal.addComponent(new GLTFShape("models/goalposts.glb"))
goal.addComponent(new Transform({
  position: new Vector3(20.4, 0, 50)
}))
engine.addEntity(goal)

const goal_area = new Entity()
goal_area.addComponent(new BoxShape())
goal_area.getComponent(BoxShape).visible = false
goal_area.addComponent(new Transform({ position: new Vector3(16, 1, 53), scale: new Vector3(9, 6, 3) }))


goal_area.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(9, 6, 3)),
	{
		onTriggerEnter :() => {
      resetBall(true)
		}
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
  onTriggerEnter :() => {
    horizontal = horizontal*-0.5
    tan_direction = tan_direction*-1
  }
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
  onTriggerEnter :() => {
    horizontal = horizontal*-0.5
    tan_direction = tan_direction*-1
  }
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
  onTriggerEnter :() => {
    horizontal = horizontal*-0.5
    tan_direction = tan_direction*-1
  }
}    
)
)


const wall_1 = new Entity()
wall_1.addComponent(new BoxShape())
engine.addEntity(wall_1)
var wall_1_length = 1
var wall_1_height = 1

wall_1.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(wall_1_length, wall_1_height, 2)),
{
onTriggerEnter :() => {
  horizontal = horizontal*-0.1
  tan_direction = tan_direction*-1
}

}    
)
)

const wall_2 = new Entity()
wall_2.addComponent(new BoxShape())
engine.addEntity(wall_2)
var wall_2_length = 1
var wall_2_height = 1

wall_2.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(wall_2_length, wall_2_height, 2)),
{
onTriggerEnter :() => {
  horizontal = horizontal*-0.1
  tan_direction = tan_direction*-1
}
}    
)
)



const wall_3 = new Entity()
wall_3.addComponent(new BoxShape())
engine.addEntity(wall_3)
var wall_3_length = 1
var wall_3_height = 1

wall_3.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(wall_3_length, wall_3_height, 2)),
{
onTriggerEnter :() => {
  horizontal = horizontal*-0.1
  tan_direction = tan_direction*-1
}
}    
)
)

const wall_4 = new Entity()
wall_4.addComponent(new BoxShape())
engine.addEntity(wall_4)
var wall_4_length = 1
var wall_4_height = 1

wall_4.addComponent(new utils.TriggerComponent(new utils.TriggerBoxShape(new Vector3(wall_4_length, wall_4_height, 2)),
{
onTriggerEnter :() => {
  horizontal = horizontal*-0.1
  tan_direction = tan_direction*-1
}
}    
)
)


// SHOT POWER SELECTION

const input = Input.instance

let power_counter = new ui.UICounter(0, 0, 570, Color4.Red(), 30, true)

export class PowerCounter implements ISystem {
  update() {
    power_counter.increase(2)
    if (power_counter.read() == 100) {
      power_counter.decrease(100)
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

let angle_counter = new ui.UICounter(0, 0, 530, Color4.Blue(), 30, true)

export class AngleCounter implements ISystem {
  update() {
    angle_counter.increase(1)
    if (angle_counter.read() == 45) {
      angle_counter.decrease(45)
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

let direction_counter = new ui.UICounter(0, 0, 490, Color4.Green(), 30, true)

export class DirectionCounter implements ISystem {
  update() {
    direction_counter.increase(1)
    if (direction_counter.read() == 30) {
      direction_counter.decrease(60)
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

var level = 1
var level_counter = new ui.UICounter(1, -700, 600, Color4.White(), 70, false)
var wind = 0

var goal_scored = false

// BALL RESET FUNCTION

function resetBall(goal_scored: boolean) {
  ball.addComponentOrReplace(new Transform({
    position: new Vector3(16, 0.2, 35),
    scale: new Vector3(3, 3, 3)
  }))
  if (goal_scored == false) {
    ui.displayAnnouncement('MISS!', 3, Color4.Red(), 50, true)
    level = 1
    level_counter.set(1)
  } else {
    ui.displayAnnouncement('GOAL!', 3, Color4.Yellow(), 50, true)
    level += 1
    level_counter.increase(1)
  }

  // LEVEL DESIGNS

  if (level == 1) {
    hideWalls()
  }

  if (level == 2) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 3, 50),
      scale: new Vector3(8, 2, 0.1)
    }))
    wall_1_length = 8
    wall_1_height = 2
  }

  if (level == 3) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 50),
      scale: new Vector3(8, 3, 0.1)
    }))
    wall_1_height = 3
  }

  if (level == 4) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(14, 2, 50),
      scale: new Vector3(4.6, 4, 0.1)
    }))
    wall_1_length = 4.6
    wall_1_height = 4
  }

  if (level == 5) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(18, 2, 50),
      scale: new Vector3(4.6, 4, 0.1)
    }))
  }

  if (level == 6) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 2, 50),
      scale: new Vector3(4.6, 4, 0.1)
    }))
  }

  if (level == 7) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 43),
      scale: new Vector3(5, 3, 0.1)
    }))
    wall_1_length = 5
    wall_1_height = 3
  }

  if (level == 8) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 50),
      scale: new Vector3(8, 5, 0.1)
    }))
    wall_1_length = 8
    wall_1_height = 5
  }

 
  if (level == 9) {
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 43),
      scale: new Vector3(8, 3, 0.1)
    }))
    wall_2.addComponentOrReplace(new Transform({
      position: new Vector3(16, 3, 50),
      scale: new Vector3(8, 2, 0.1)
    }))
    wall_1_length = 8
    wall_1_height = 3

    wall_2_length = 8
    wall_2_height = 2

  }

  if (level == 10) {
    movePlayerTo({x:16, y:0, z:20})
    hideWalls()
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
  }

  if (level == 11) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 3, 50),
      scale: new Vector3(8, 2, 0.1)
    }))
    wall_1_length = 8
    wall_1_height = 2
  }

  if (level == 12) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 50),
      scale: new Vector3(8, 3, 0.1)
    }))
    wall_1_height = 3
  }

  if (level == 13) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(12, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(14, 2, 50),
      scale: new Vector3(4.6, 4, 0.1)
    }))
    wall_1_length = 4.6
    wall_1_height = 4
  }

  if (level == 14) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(20, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(18, 2, 50),
      scale: new Vector3(4.6, 4, 0.1)
    }))
  }

  if (level == 15) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 2, 50),
      scale: new Vector3(4.6, 4, 0.1)
    }))
  }

  if (level == 16) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 43),
      scale: new Vector3(5, 3, 0.1)
    }))
    wall_1_length = 5
    wall_1_height = 3
  }

  if (level == 17) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 50),
      scale: new Vector3(8, 5, 0.1)
    }))
    wall_1_length = 8
    wall_1_height = 5
  }

 
  if (level == 18) {
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wall_1.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0, 43),
      scale: new Vector3(8, 3, 0.1)
    }))
    wall_2.addComponentOrReplace(new Transform({
      position: new Vector3(16, 3, 50),
      scale: new Vector3(8, 2, 0.1)
    }))
    wall_1_length = 8
    wall_1_height = 3

    wall_2_length = 8
    wall_2_height = 2

  }

  if (level == 19) {
    movePlayerTo({x:16, y:0, z:20})
    hideWalls()
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wind = 0.1
  }

  if (level == 20) {
    movePlayerTo({x:16, y:0, z:20})
    hideWalls()
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wind = -0.2
  }

  if (level == 21) {
    movePlayerTo({x:16, y:0, z:20})
    hideWalls()
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    wind = 0
    gravity = 0.01
  }

  if (level == 22) {
    movePlayerTo({x:16, y:0, z:20})
    hideWalls()
    ball.addComponentOrReplace(new Transform({
      position: new Vector3(16, 0.2, 25),
      scale: new Vector3(3, 3, 3)
    }))
    gravity = 0.06
  }


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

  once = true

  engine.removeSystem(ballMove)
}

function hideWalls() {
  wall_1.addComponentOrReplace(new Transform({
    position: new Vector3(0, 1, 0)
  }))
  wall_2.addComponentOrReplace(new Transform({
    position: new Vector3(0, 3, 0)
  }))
  wall_3.addComponentOrReplace(new Transform({
    position: new Vector3(0, 5, 0)
  }))
  wall_4.addComponentOrReplace(new Transform({
    position: new Vector3(0, 7, 0)
  }))
  wind = 0
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

var once = true
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
      resetBall(false)
    }  


  }
}

const ballMove = new BallMove()


ball.addComponent(
  new OnPointerDown((e) => {
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