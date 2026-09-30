import { SprintMission } from "./types";

export const MISSIONS: SprintMission[] = [
  {
    id: "variables",
    title: "Hackathon Seats",
    topic: "Variables",
    topicKey: "variables",
    topicIcon: "🎟️",
    topicColor: "#a855f7",
    description: "Your school's hackathon has a hard cap. Group A initializes remaining seats. Group B updates the count as teams check in.",
    xpReward: 400,
    groupA: {
      role: "Check-in Lead",
      challenge: "Initialize remaining seats for the venue",
      questions: [
        {
          prompt: "Why store remaining seats in a variable instead of writing 120 in every print and if-statement?",
          options: [
            "It looks cooler",
            "To make the code longer",
            "So one update changes the value everywhere it is used",
            "Variables are required by the school handbook"
          ],
          answer: "So one update changes the value everywhere it is used",
          explanation: "A variable is a single source of truth. When a team checks in, you change remaining once — not every hardcoded 120.",
        },
        {
          prompt: "Which name is most useful for someone else on the robotics/CS club reading this?",
          options: ["RS", "remaining_seats", "x", "blue_stuff"],
          answer: "remaining_seats",
          explanation: "High school group projects die on cryptic names. remaining_seats tells the next person what the state actually is.",
        },
        {
          prompt: "Start the check-in script with 120 open seats.",
          code: `# venue capacity leftover`,
          options: [
            "remaining_seats = 120",
            "120 = remaining_seats",
            "set seats to 120",
            "remaining_seats == 120"
          ],
          answer: "remaining_seats = 120",
          explanation: "Assignment is left ← right. == would ask a question, not store a value.",
        },
        {
          prompt: "Trace: remaining_seats starts at 120. Two teams of 8 check in: remaining_seats = remaining_seats - 8, twice. What's left?",
          code: `remaining_seats = 120\nremaining_seats = remaining_seats - 8\nremaining_seats = remaining_seats - 8`,
          options: ["104", "112", "8", "0"],
          answer: "104",
          explanation: "120 − 8 = 112, then 112 − 8 = 104. Tracing state is the AP CS skill — not guessing.",
        },
      ],
    },
    handoffMessage: "Check-in Lead set `remaining_seats = 120`. Door crew: walk-ins just hit. Update the count without losing the invariant.",
    groupB: {
      role: "Door Crew",
      challenge: "Update remaining seats as teams arrive",
      questions: [
        {
          prompt: "A team of 12 checks in. How do you actually change remaining_seats in Python?",
          code: `# Current: remaining_seats = 120
# Update:`,
          options: [
            "remaining_seats - 12",
            "remaining_seats = 108",
            "remaining_seats = remaining_seats - 12",
            "minus 12"
          ],
          answer: "remaining_seats = remaining_seats - 12",
          explanation: "Hardcoding 108 only works this once. Read-modify-write keeps the script correct for any team size.",
        },
        {
          prompt: "If you run remaining_seats = remaining_seats - 40 three times from 120, what happens?",
          options: [
            "It stays at 80",
            "It becomes 0",
            "The program crashes",
            "Nothing"
          ],
          answer: "It becomes 0",
          explanation: "State accumulates: 120 → 80 → 40 → 0. No crash — just a sold-out venue.",
        },
        {
          prompt: "A sponsor unlocks overflow seating: triple remaining seats.",
          options: [
            "remaining_seats = remaining_seats * 3",
            "remaining_seats = 3",
            "remaining_seats + remaining_seats + remaining_seats",
            "remaining_seats = remaining_seats + 3"
          ],
          answer: "remaining_seats = remaining_seats * 3",
          explanation: "Scale with operators. Adding 3 is a different (wrong) story.",
        },
      ],
    },
    successMessage: "Doors closed clean. You tracked live venue state with variables — the same pattern as inventory, GPA credits, and game scores.",
  },

  {
    id: "conditionals",
    title: "Honor Roll Gate",
    topic: "If / Else Logic",
    topicKey: "logic",
    topicIcon: "📜",
    topicColor: "#3b82f6",
    description: "Counseling wants a script: honor roll if GPA and attendance both pass. Group A writes the rules. Group B wires the outcomes.",
    xpReward: 450,
    groupA: {
      role: "Policy Coders",
      challenge: "Define honor-roll eligibility",
      questions: [
        {
          prompt: "Honor roll needs GPA strictly above 3.5. Which check is that?",
          options: [
            "gpa < 3.5",
            "gpa > 3.5",
            "gpa == 3.5",
            "gpa != 3.5"
          ],
          answer: "gpa > 3.5",
          explanation: "3.5 even is not 'above' 3.5. If policy includes 3.5, you'd use >= — that's a real counseling bug.",
        },
        {
          prompt: "You also need absences under 5. Which keyword requires BOTH GPA and attendance?",
          options: ["or", "and", "plus", "also"],
          answer: "and",
          explanation: "and is a stricter gate. One failing condition blocks honor roll.",
        },
        {
          prompt: "Write: absences under 5 OR the student has a counselor waiver.",
          options: [
            "if absences < 5 and waiver == True:",
            "if absences < 5 or waiver == True:",
            "if absences < 5:",
            "if absences < 5 || waiver == True:"
          ],
          answer: "if absences < 5 or waiver == True:",
          explanation: "or is inclusive. Python uses or, not ||.",
        },
      ],
    },
    handoffMessage: "Policy is `if gpa > 3.5 and absences < 5:`. Transcripts team: attach the actions — print honor roll vs ineligible.",
    groupB: {
      role: "Transcripts",
      challenge: "Attach actions to the eligibility rules",
      questions: [
        {
          prompt: "Why does the indented body of an if matter?",
          code: `if gpa > 3.5:
    print("honor roll")`,
          options: [
            "To make it look like steps",
            "It tells Python print only runs when the if is True",
            "It's just for style",
            "It makes the code run faster"
          ],
          answer: "It tells Python print only runs when the if is True",
          explanation: "Indentation is scope in Python. Mis-indent and you ship honor roll to everyone.",
        },
        {
          prompt: "gpa is exactly 3.5 and the check is `if gpa > 3.5:`. Do they get honor roll?",
          options: [
            "Yes",
            "No — 3.5 is not greater than 3.5",
            "Error",
            "Half credit"
          ],
          answer: "No — 3.5 is not greater than 3.5",
          explanation: "Boundary bugs fail AP FRQs and fail real students. >= if policy includes 3.5.",
        },
        {
          prompt: "If they miss honor roll, print ineligible. What's the keyword for the other branch?",
          options: ["expect:", "else:", "otherwise:", "stop:"],
          answer: "else:",
          explanation: "else is the default path when the first condition fails.",
        },
        {
          prompt: "Work-permit script for 16+. Which is a logic bug?",
          code: `if age > 16:\n    approve_permit()`,
          options: [
            "if age > 16: (skips exactly 16)",
            "if age >= 16: (includes 16)",
            "if age == 16:",
            "if age is 16:"
          ],
          answer: "if age > 16: (skips exactly 16)",
          explanation: "A 16-year-old is eligible in most states. > 16 quietly denies them. That's an off-by-boundary bug.",
        },
      ],
    },
    successMessage: "Honor roll script ships. You encoded school policy in conditionals — including the boundary that usually bites people.",
  },

  {
    id: "loops",
    title: "Saturday Shift",
    topic: "Loops & Iteration",
    topicKey: "loops",
    topicIcon: "⏰",
    topicColor: "#10b981",
    description: "You work the school store on Saturday. Group A starts the checkout loop. Group B makes sure it actually terminates.",
    xpReward: 500,
    groupA: {
      role: "Shift Leads",
      challenge: "Start processing the checkout line",
      questions: [
        {
          prompt: "Why a while loop instead of writing charge() 40 times for a long line?",
          options: [
            "Typing is hard",
            "It scales to any line length with the same logic",
            "Computers prefer loops",
            "It uses less battery on the register"
          ],
          answer: "It scales to any line length with the same logic",
          explanation: "Friday night game vs empty Saturday morning: same loop, different n.",
        },
        {
          prompt: "What starts a loop block in Python?",
          options: [")", ";", ":", "{"],
          answer: ":",
          explanation: "Colon opens the indented block — same as if and def.",
        },
        {
          prompt: "`while tickets > 0:` keeps selling until...",
          options: [
            "The bell rings",
            "Inventory hits zero",
            "The tickets variable hits 0",
            "It never stops"
          ],
          answer: "The tickets variable hits 0",
          explanation: "The condition is the only gate. When tickets is 0, the loop stops — unless you forget to decrement.",
        },
      ],
    },
    handoffMessage: "Register started: `while tickets > 0:`. Closers: make sure each sale actually reduces tickets.",
    groupB: {
      role: "Closers",
      challenge: "Prevent infinite loops and update state",
      questions: [
        {
          prompt: "The loop is while tickets > 0. If you never subtract from tickets inside, what happens?",
          options: [
            "Register stops instantly",
            "Infinite loop — the register never closes",
            "It works fine",
            "Tickets vanish"
          ],
          answer: "Infinite loop — the register never closes",
          explanation: "If the condition never becomes False, Python will not 'notice' you're done. That's a real freeze.",
        },
        {
          prompt: "Sell one ticket and update the count.",
          options: [
            "tickets = 1",
            "tickets - 1",
            "tickets -= 1",
            "del tickets"
          ],
          answer: "tickets -= 1",
          explanation: "tickets -= 1 is the escape hatch. tickets - 1 with no assignment does nothing useful.",
        },
        {
          prompt: "tickets = 3. How many times does print('sold') run in while tickets > 0: with a decrement each pass?",
          options: ["2", "3", "4", "Infinite"],
          answer: "3",
          explanation: "3, then 2, then 1, then 0 and stop. Off-by-one if you use >= 0 without care.",
        },
      ],
    },
    successMessage: "Shift closed. You controlled a live queue with iteration — same idea as SAT timers, roster scans, and bot polling.",
  },

  {
    id: "debugging",
    title: "Club Bot Meltdown",
    topic: "Debugging & Tracing",
    topicKey: "debugging",
    topicIcon: "🛰️",
    topicColor: "#ef4444",
    description: "The CS club Discord bot runs, but attendance is wrong. Trace the logic — it isn't a syntax error.",
    xpReward: 550,
    groupA: {
      role: "On-call",
      challenge: "Name the class of bug",
      questions: [
        {
          prompt: "The bot doesn't crash, but it marks seniors as juniors. What kind of bug is that?",
          options: [
            "Missing a colon",
            "Spelling print as prnt",
            "Adding instead of multiplying (or the wrong comparison)",
            "Forgetting to indent"
          ],
          answer: "Adding instead of multiplying (or the wrong comparison)",
          explanation: "Syntax errors explode. Logic bugs smile and lie. Those are the ones internships actually test.",
        },
        {
          prompt: "You want 16+ for late-night hackathon access. Why is `if age > 16:` wrong for a 16-year-old?",
          options: [
            "It's not a bug",
            "Because '>' doesn't include 16. It should be '>='.",
            "Age needs to be a string",
            "16 is unlucky"
          ],
          answer: "Because '>' doesn't include 16. It should be '>='.",
          explanation: "Same boundary bug as honor roll. Graders and users both notice.",
        },
        {
          prompt: "Fastest way to see why attendance_count is 12 when 11 people signed in?",
          options: [
            "Restart the Chromebook",
            "Stare at the screen",
            "print() the variables at each step",
            "Delete the bot and start over"
          ],
          answer: "print() the variables at each step",
          explanation: "Print tracing is still the move before a debugger. If the counter is 12 after the loop, you found the off-by-one.",
        },
      ],
    },
    handoffMessage: "Syntax is clean. Attendance math is lying. Tracers: walk the algorithm like the interpreter.",
    groupB: {
      role: "Tracers",
      challenge: "Execute the code by hand",
      questions: [
        {
          prompt: "What does tracing mean here?",
          options: [
            "Drawing the Discord logo",
            "Following execution line-by-line until the value goes wrong",
            "Hunting missing colons",
            "Deleting old comments"
          ],
          answer: "Following execution line-by-line until the value goes wrong",
          explanation: "You are the CPU for a minute. That's how AP CS free-response is graded.",
        },
        {
          prompt: "Mental trace: `n = 10`, `n = n + 5`, `if n > 12: n = 0`. What is n?",
          options: ["15", "0", "10", "12"],
          answer: "0",
          explanation: "10 → 15 → 15 > 12 so n becomes 0. Sequence, then branch.",
        },
        {
          prompt: "The bot file is 400 lines. What's decomposition?",
          options: [
            "Deleting until it works",
            "Splitting check-in, scoring, and DMs into separate functions",
            "Renaming everything to a, b, c",
            "Adding more loops"
          ],
          answer: "Splitting check-in, scoring, and DMs into separate functions",
          explanation: "Don't debug the whole club platform at once. Isolate the attendance function, then the rest.",
        },
      ],
    },
    successMessage: "Bot's honest again. You debug like a high schooler who ships: trace, isolate, fix the boundary.",
  },
];
