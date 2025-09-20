
export enum Expression {
  Neutral,
  Happy,
  Smile,
  Sad,
  Angry,
  Confuse,
  Cry,
  Thinking,
  Sleeping,
  Listening,
  Tired,
  LaserEyes,
  DemonEyes,
  Dead,
  Singing,
  Dancing,
  Walking,
  Surprised,
  Focused,
  // New positive expressions
  Excited,
  Playful,
  Loving,
  Proud,
  Relaxed,
  // New negative expressions
  Frustrated,
  Embarrassed,
  Scared,
  // New action expressions
  Charging,
  ChangeBattery,
  DrinkOil,
  EatChip,
  Gaming,
}

export type RobotType = 'aros' | 'cute' | 'slime';