import { SprintMission } from "./types";

export const MISSIONS: SprintMission[] = [
  // ── MISSION 1: Real-World Scenario: Space Solar Salvage ───────────────────────
  {
    id: "variables",
    title: "Space Solar Salvage",
    topic: "Variables",
    topicIcon: "🛸",
    topicColor: "#a855f7",
    description: "A satellite's energy is low! Group A sets the base power level. Group B must calculate the boost needed to save the mission.",
    xpReward: 400,
    groupA: {
      role: "Mission Control",
      challenge: "Initialize the satellite's power core",
      questions: [
        {
          prompt: "We need a way to 'remember' the current power level throughout the flight. Why do programmers use variables instead of just writing the number 100 everywhere?",
          options: [
            "It looks cooler",
            "To make the code longer",
            "So we can easily update the value in one place if it changes",
            "Variables are required by law"
          ],
          answer: "So we can easily update the value in one place if it changes",
          explanation: "Coding is about logical efficiency! Variables allow one name ('power') to represent a changing value, keeping our logic consistent.",
        },
        {
          prompt: "Which variable name is most logical for 'Current Oxygen Level'?",
          options: ["COL", "oxygen_level", "x", "blue_stuff"],
          answer: "oxygen_level",
          explanation: "Logical thinking starts with clear names! Someone else should be able to read your 'Logic Cube' and understand what it does.",
        },
        {
          prompt: "Code the power core startup. Setting the power level variable to 100.",
          code: `# Initialize Power Core`,
          options: [
            "power = 100",
            "100 = power",
            "set core to 100",
            "power == 100"
          ],
          answer: "power = 100",
          explanation: "In Python logic, the variable on the left takes on the value on the right.",
        },
      ],
    },
    handoffMessage: "Mission Control (A) successfully initialized: `power = 100`. Engineers (B), the satellite is entering shadow! You must recalculate the power.",
    groupB: {
      role: "Satellite Engineers",
      challenge: "Modify the variables as the environment changes",
      questions: [
        {
          prompt: "The satellite entered a shadow. Power dropped by 40%. How do you mathematically update the power variable in Python?",
          code: `# Current: power = 100
# Update:`,
          options: [
            "power - 40",
            "power = 60",
            "power = power - 40",
            "minus 40"
          ],
          answer: "power = power - 40",
          explanation: "This is a logic bridge: Take the OLD power, subtract 40, and store it back into the NEW power level.",
        },
        {
          prompt: "Critical Thinking: If you run `power = power - 40` three times, and you started at 100, what happens?",
          options: [
            "Power stays at 60",
            "Power becomes -20",
            "Program crashes",
            "Nothing"
          ],
          answer: "Power becomes -20",
          explanation: "Variables have memory! Each line of code changes the state of your system. 100 -> 60 -> 20 -> -20.",
        },
        {
          prompt: "You found a solar flare! Triple the remaining power instantly.",
          options: [
            "power = power * 3",
            "power = 3",
            "power + power + power",
            "power = power + 3"
          ],
          answer: "power = power * 3",
          explanation: "Multiplying variables is how we scale logic quickly in a real-world system.",
        },
      ],
    },
    successMessage: "Satellite Saved! You used dynamic memory to navigate a changing environment. That's real coding logic!",
  },

  // ── MISSION 2: Real-World Scenario: Cyber-Greenhouse ──────────────────────────
  {
    id: "conditionals",
    title: "The Smart Greenhouse",
    topic: "If / Else Logic",
    topicIcon: "🌿",
    topicColor: "#3b82f6",
    description: "Build the logic to keep rare plants alive! Group A sets the safety rules. Group B builds the emergency systems.",
    xpReward: 450,
    groupA: {
      role: "Logic Architects",
      challenge: "Define the rules for temperature control",
      questions: [
        {
          prompt: "Logical Question: If we want to turn on the fan only when it is 'Too Hot', which comparison check do we need?",
          options: [
            "temp < 30",
            "temp > 30",
            "temp == 30",
            "temp != 30"
          ],
          answer: "temp > 30",
          explanation: "Coding is about making decisions based on data. '>' checks if our limit has been exceeded.",
        },
        {
          prompt: "We need both HEAT and WATER. Which keyword ensures BOTH logical cubes are True?",
          options: ["or", "and", "plus", "also"],
          answer: "and",
          explanation: "The 'and' operator creates a stricter logical gate. Both conditions must pass to move forward.",
        },
        {
          prompt: "Write a check for 'If humidity is less than 20% OR it is Sunday'.",
          options: [
            "if humidity < 20 and day == 'Sunday':",
            "if humidity < 20 or day == 'Sunday':",
            "if humidity < 20:",
            "if humidity < 20 || day == 'Sunday':"
          ],
          answer: "if humidity < 20 or day == 'Sunday':",
          explanation: "'or' is an inclusive logic gate. If either one is true, the plants get water!",
        },
      ],
    },
    handoffMessage: "Logic set: `if temp > 30 or humidity < 10:`. Emergency Response (B), you must define the hardware actions!",
    groupB: {
      role: "Hardware Engineers",
      challenge: "Connect actions to the Logic Architect's rules",
      questions: [
        {
          prompt: "Architects gave you the trigger. If it's too hot, we must open the vents. Why is the indentation (4 spaces) required here?",
          code: `if temp > 30:
    open_vents()`,
          options: [
            "To make it look like steps",
            "It tells Python that open_vents() ONLY happens if the 'if' is True",
            "It's just for style",
            "It makes the code run faster"
          ],
          answer: "It tells Python that open_vents() ONLY happens if the 'if' is True",
          explanation: "Indentation IS logic in Python. It defines the 'scope'—what code belongs to which decision.",
        },
        {
          prompt: "Critical Thinking: What happens if `temp` is exactly 30 and our logic is `if temp > 30:`?",
          options: [
            "Vents open",
            "Vents stay closed",
            "Error",
            "Vents open halfway"
          ],
          answer: "Vents stay closed",
          explanation: "In strict logic, 30 is NOT greater than 30. It is equal! To include 30, we'd need >=.",
        },
        {
          prompt: "The rule changed: If it's > 30, vents open. OTHERWISE, turn on the heater. What's the keyword for 'Otherwise'?",
          options: ["expect:", "else:", "otherwise:", "stop:"],
          answer: "else:",
          explanation: "Else is our logical default. It handles everything that didn't pass the first check.",
        },
      ],
    },
    successMessage: "Greenhouse Optimized! You built a self-thinking system using conditional logic.",
  },

  // ── MISSION 3: Real-World Scenario: Automated Supply Chain ───────────────────
  {
    id: "loops",
    title: "Droid Delivery Loop",
    topic: "Loops & Iteration",
    topicIcon: "🤖",
    topicColor: "#10b981",
    description: "A delivery droid has 100 packages! Group A starts the delivery engine. Group B ensures the droid doesn't loop forever.",
    xpReward: 500,
    groupA: {
      role: "System Planners",
      challenge: "Start the repetitive delivery process",
      questions: [
        {
          prompt: "Loops are about dealing with patterns. Why use a 'while' loop instead of writing 'deliver()' 100 times?",
          options: [
            "Typing is hard",
            "It is more efficient and handles any number of packages",
            "Computers prefer loops",
            "It uses less battery"
          ],
          answer: "It is more efficient and handles any number of packages",
          explanation: "Logic scales! A loop can handle 5 packages or 5 million with the same two lines of code.",
        },
        {
          prompt: "What marks the start of a loop block in Python?",
          options: [")", ";", ":", "{"],
          answer: ":",
          explanation: "The colon (:) is common in all Python structures. It says 'Logical block begins now!'",
        },
        {
          prompt: "Critical Thinking: `while battery > 0:` means the droid works until...",
          options: [
            "It hits a wall",
            "It finishes all boxes",
            "The battery variable hits 0",
            "Never stops"
          ],
          answer: "The battery variable hits 0",
          explanation: "The condition is a gatekeeper. Once it becomes False, the loop breaks.",
        },
      ],
    },
    handoffMessage: "Droid Engine started: `while packages > 0:`. Loop Breakers (B), you must ensure the droid actually delivers them!",
    groupB: {
      role: "Loop Breakers",
      challenge: "Prevent infinite loops and manage state",
      questions: [
        {
          prompt: "Group A set the loop to run while `packages > 0`. If you don't subtract from `packages` inside the loop, what happens?",
          options: [
            "Droid stops instantly",
            "Infinite loop (The computer gets stuck forever)",
            "It works fine",
            "Packages disappear"
          ],
          answer: "Infinite loop (The computer gets stuck forever)",
          explanation: "Infinite loops are logic errors. The computer blindly follows instructions—if the condition stays True, it never leaves!",
        },
        {
          prompt: "Deliver one package and update the count properly in Python logic.",
          options: [
            "packages = 1",
            "packages - 1",
            "packages -= 1",
            "del packages"
          ],
          answer: "packages -= 1",
          explanation: "This is the 'Escape Route'. Every delivery brings us one step closer to finishing the loop.",
        },
        {
          prompt: "Trace the Logic: If `packages = 3`, how many times does `print('Delivered!')` run in a `while packages > 0:` loop?",
          options: ["2", "3", "4", "Infinite"],
          answer: "3",
          explanation: "Pass 1: count is 3 (Deliver). Pass 2: count is 2 (Deliver). Pass 3: count is 1 (Deliver). Then it hits 0 and stops.",
        },
      ],
    },
    successMessage: "Logistics Mastered! You controlled repetitive chaos with structured iteration.",
  },

  // ── MISSION 4: Real-World Scenario: The Logic Dungeon ────────────────────────
  {
    id: "debugging",
    title: "The Logic Dungeon",
    topic: "Debugging & Tracing",
    topicIcon: "🕵️‍♂️",
    topicColor: "#ef4444",
    description: "The code isn't crashing, but the robot is going the wrong way! Trace the error and fix the logic.",
    xpReward: 550,
    groupA: {
      role: "Bug Hunters",
      challenge: "Spot errors that break the logic",
      questions: [
        {
          prompt: "A 'Logic Bug' is when code runs perfectly but gives the wrong answer. Which is a logic bug?",
          options: [
            "Missing a colon",
            "Spelling 'print' as 'prnt'",
            "Adding two numbers instead of multiplying them",
            "Forgetting to indent"
          ],
          answer: "Adding two numbers instead of multiplying them",
          explanation: "The computer did exactly what you said, but your 'plan' was wrong. This is the hardest bug to find!",
        },
        {
          prompt: "Trace the bug: You want to check if a player is ELIGIBLE (Age 13+). Why is `if age > 13:` a bug for a 13-year-old?",
          options: [
            "It's not a bug",
            "Because '>' doesn't include 13. It should be '>='.",
            "Age needs to be a string",
            "13 is an unlucky number"
          ],
          answer: "Because '>' doesn't include 13. It should be '>='.",
          explanation: "Precision is everything. Logical operators define the boundaries of your digital world.",
        },
        {
          prompt: "What is the best way to find a logic bug while the code is running?",
          options: [
            "Restart the computer",
            "Stare at the screen really hard",
            "Use print() statements to see what's happening to variables",
            "Delete the code and start over"
          ],
          answer: "Use print() statements to see what's happening to variables",
          explanation: "Print debugging lets you 'see' into the computer's brain. If the variable says 5 but you expected 10, you found your bug!",
        },
      ],
    },
    handoffMessage: "Syntax clear! But the navigation math is off. Group B, trace the algorithm!",
    groupB: {
      role: "Code Tracers",
      challenge: "Walk through the code like a computer",
      questions: [
        {
          prompt: "Why do we call it 'Tracing'?",
          options: [
            "Because we draw pictures",
            "Following the execution line-by-line to find where logic deviates",
            "Looking for missing colons",
            "Searching for old abandoned code"
          ],
          answer: "Following the execution line-by-line to find where logic deviates",
          explanation: "Tracing is a critical thinking skill. It trains your brain to think as strictly as a processor.",
        },
        {
          prompt: "Mental Trace: `x = 10`, `x = x + 5`, `if x > 12: x = 0`. What is `x` now?",
          options: ["15", "0", "10", "12"],
          answer: "0",
          explanation: "Walkthrough: x=10. Then x becomes 15. 15 is > 12, so x becomes 0. Logical sequence matters!",
        },
        {
          prompt: "You are given a huge block of messy code. What is 'Decomposition' in logic?",
          options: [
            "Deleting the code until it works",
            "Breaking a big, scary problem into small, manageable 'Cubes'",
            "Renaming all variables to letters",
            "Adding more loops"
          ],
          answer: "Breaking a big, scary problem into small, manageable 'Cubes'",
          explanation: "This is the secret of pro coders. Don't solve the whole app at once—solve the movement, then the score, then the graphics.",
        },
      ],
    },
    successMessage: "Logic Dungeon Cleared! You've learned to think like a debugger.",
  },
];
