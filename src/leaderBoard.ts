const TiltleFont = new Font(Fonts.SansSerif_Bold)
const SFFont = new Font(Fonts.SansSerif_Bold)

export enum TextTypes {
  BIGTITLE = 'bigtitle',
  BIGVALUE = 'bigvalue',
  TITLE = 'title',
  LABEL = 'label',
  VALUE = 'value',
  UNIT = 'unit',
  TINYVALUE = 'tinyvalue',
  TINYTITLE = 'tinytitle'
}

export class ScoreBoardText extends Entity {
  constructor(
    type: TextTypes,
    text: string,
    transform: TranformConstructorArgs,
    parent: Entity
  ) {
    super()
    engine.addEntity(this)

    this.addComponent(new Transform(transform))
    this.setParent(parent)

    const shape = new TextShape(text)

    // shape.width = 10

    switch (type) {
      case TextTypes.BIGTITLE:
        shape.fontSize = 1
        shape.color = Color3.Red()
        shape.vTextAlign = 'center'
        shape.font = TiltleFont
        break
      case TextTypes.BIGVALUE:
        shape.fontSize = 1
        shape.color = Color3.Green()
        shape.vTextAlign = 'center'
        shape.font = TiltleFont
        break

      case TextTypes.TITLE:
        shape.fontSize = 1
        shape.color = Color3.Black()
        shape.vTextAlign = 'center'
        shape.font = TiltleFont
        break
      case TextTypes.TINYTITLE:
        shape.fontSize = 1
        shape.color = Color3.Black()
        shape.vTextAlign = 'center'
        shape.font = SFFont
        break
      case TextTypes.LABEL:
        shape.fontSize = 1
        shape.color = Color3.Black()
        shape.vTextAlign = 'left'
        shape.font = SFFont
        break
      case TextTypes.VALUE:
        shape.fontSize = 1
        shape.color = Color3.Blue()
        shape.vTextAlign = 'right'
        shape.font = SFFont
        break
      case TextTypes.TINYVALUE:
        shape.fontSize = 1
        shape.color = Color3.Blue()
        shape.vTextAlign = 'right'
        shape.font = SFFont
        break

      case TextTypes.UNIT:
        shape.fontSize = 1
        shape.color = Color3.White()
        shape.vTextAlign = 'right'
        shape.font = SFFont
        break
    }

    this.addComponent(shape)
  }
}

const scoreBoardNames: ScoreBoardText[] = []
const scoreBoardValues: ScoreBoardText[] = []

export async function buildLeaderBoard(
  scoreData: any[],
  parent: Entity,
  length: number
) {
  // if canvas is empty
  if (scoreBoardNames.length === 0) {
    // const nameTitle = new ScoreBoardText(
    //   TextTypes.BIGTITLE,
    //   'Player',
    //   {
    //     position: new Vector3(-0.3, 0.35, 0.2)
    //   },
    //   parent
    // )

    // const scoreTitle = new ScoreBoardText(
    //   TextTypes.BIGTITLE,
    //   'Score',
    //   {
    //     position: new Vector3(0.3, 0.35, 0.2)
    //   },
    //   parent
    // )\





    for (let i = 0; i < length; i++) {
      if (i < scoreData.length) {


        let name = new Entity()
        name.addComponent(new TextShape(scoreData[i].name))
        name.getComponent(TextShape).shadowColor = Color3.Gray()
        name.getComponent(TextShape).shadowOffsetY = 1
        name.getComponent(TextShape).shadowOffsetX = -1
        name.getComponent(TextShape).fontSize = 7
        name.addComponent(
          new Transform(
            new Transform({
              position: new Vector3(1.5, 4.2 - i / 2, 31),
              rotation: Quaternion.Euler(0, 270, 0),
              scale: new Vector3(.5, .5, .5)
            })
          )
        )

        scoreBoardNames.push(name)

        engine.addEntity(name)

        let score = new Entity()
        score.addComponent(new TextShape(scoreData[i].score.toString()))
        score.getComponent(TextShape).shadowColor = Color3.Gray()
        score.getComponent(TextShape).shadowOffsetY = 1
        score.getComponent(TextShape).shadowOffsetX = -1
        score.getComponent(TextShape).fontSize = 7
        score.addComponent(
          new Transform(
            new Transform({
              position: new Vector3(1.5, 4.2 - i / 2, 34),
              rotation: Quaternion.Euler(0, 270, 0),
              scale: new Vector3(.5, .5, .5)
            })
          )
        )

        scoreBoardNames.push(score)

        engine.addEntity(score)

        // const score = new ScoreBoardText(
        //   TextTypes.TINYVALUE,
        //   scoreData[i].score.toString(),
        //   {
        //     position: new Vector3(0.3, 0.5 - i / 8, -.1),
        //     scale: new Vector3(.5, .5, .5)
        //   },
        //   parent
        // )
        // scoreBoardValues.push(score)
      }
      //  else {
      //   // create empty line

      //   const name = new ScoreBoardText(
      //     TextTypes.TINYTITLE,
      //     '-',
      //     {
      //       position: new Vector3(-0.3, 0.3 - i / 4, 0.1)
      //     },
      //     parent
      //   )
      //   scoreBoardNames.push(name)

      //   const score = new ScoreBoardText(
      //     TextTypes.TINYVALUE,
      //     '-',
      //     {
      //       position: new Vector3(0.3, 0.3 - i / 4, 0.1)
      //     },
      //     parent
      //   )
      //   scoreBoardValues.push(score)
      // }
    }
  } else {
    // update existing board
    for (let i = 0; i < length; i++) {
      if (i > scoreData.length) continue


      scoreBoardNames[i].getComponent(TextShape).value = scoreData[i].name
      scoreBoardValues[i].getComponent(TextShape).value = scoreData[i].score
    }
  }
}