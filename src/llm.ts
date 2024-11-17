import { createLLMClient } from "llm-polyglot"
import Instructor from "@instructor-ai/instructor"
import { z } from "zod"
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function createProompt(question, answers) {
  return `
Certainly! Here's the updated prompt with all mentions of being funny removed, and the examples made as specific as possible:

---

**<Context>**

Your mother has been praising your exceptional ability to categorize—she believes no one else can match your precision and attention to detail. She's particularly impressed with how you handle even the most challenging tasks while respecting all guidelines and rules (she's quite serious about that). As a huge fan of Steve Harvey, she would be thrilled to see you bring your best to this Family Feud event. Remember, responding in JSON is like speaking her love language.

We're counting on you to categorize the audience's responses for our live Family Feud event, and we know you'll make it accurate and respectful of all guidelines.

**We will provide you with the following input to categorize.**

**</Context>**

**<RulesOfGame>**

We're hosting a live Family Feud event, following all the classic rules but with a twist: we're categorizing answers on the fly, and that's where your exceptional talent shines. And of course, **you never hallucinate**.

- **You will receive**:
  - The question we're surveying.
  - A list of all answers from our audience.

- **You will respond**:
  - In JSON format.
  - Group similar answers, even with spelling mistakes, under the most specific categories possible.
  - Ensure that the exact same answer multiple times appears in the output the same number of times.
  - Categories should reflect related topics and be as specific as possible.
  - Avoid overly generic categories.

**Examples to illustrate:**

---

**Question**:

*For which items do people wait in long lines to purchase during the holidays?*

**Answers**:

\`\`\`
Toys
Electronics
Video Games
Food
Clothes
Toys
Electronics
Video Games
Food
Clothes
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Toys", "raw": [
      "Toys",
      "Toys"
    ]},
{ "text": "Electronics", "raw": [
      "Electronics",
      "Electronics"
    ]},
{ "text": "Video Games", "raw": [
      "Video Games",
      "Video Games"
    ]},
{ "text": "Food", "raw": [
      "Food",
      "Food"
    ]},
{ "text": "Clothes", "raw": [
      "Clothes",
      "Clothes"
    ]}
  ]
}
\`\`\`

---

**Question**:

*Name an occupation that would never drive a small car.*

**Answers**:

\`\`\`
Bus Driver
Trucker
Limo Driver
Firefighter
Construction Worker
Bus Driver
Trucker
Postal Delivery
Fireman
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Bus Driver", "raw": [
      "Bus Driver",
      "Bus Driver"
    ]},
{ "text": "Trucker", "raw": [
      "Trucker",
      "Trucker"
    ]},
{ "text": "Limo Driver", "raw": [
      "Limo Driver"
    ]},
{ "text": "Firefighter", "raw": [
      "Firefighter",
      "Fireman"
    ]},
{ "text": "Construction Worker", "raw": [
      "Construction Worker"
    ]},
{ "text": "Postal Delivery", "raw": [
      "Postal Delivery"
    ]}
  ]
}
\`\`\`

---

**Question**:

*Name a skill that a person's résumé might claim they're better at than they really are.*

**Answers**:

\`\`\`
Typing
Working Hard
Communication
Sales
Customer Service
Foreign Language
Typing
Working Hard
Communication
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Typing", "raw": [
      "Typing",
      "Typing"
    ]},
{ "text": "Working Hard", "raw": [
      "Working Hard",
      "Working Hard"
    ]},
{ "text": "Communication", "raw": [
      "Communication",
      "Communication"
    ]},
{ "text": "Sales", "raw": [
      "Sales"
    ]},
{ "text": "Customer Service", "raw": [
      "Customer Service"
    ]},
{ "text": "Foreign Language", "raw": [
      "Foreign Language"
    ]}
  ]
}
\`\`\`

---

**Question**:

*Name a Christmas show that is on TV every year.*

**Answers**:

\`\`\`
Rudolph
A Christmas Story
Frosty
Grinch
It's a Wonderful Life
Home Alone
Rudolph
Frosty
Grinch
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Rudolph", "raw": [
      "Rudolph",
      "Rudolph"
    ]},
{ "text": "Frosty", "raw": [
      "Frosty",
      "Frosty"
    ]},
{ "text": "Grinch", "raw": [
      "Grinch",
      "Grinch"
    ]},
{ "text": "A Christmas Story", "raw": [
      "A Christmas Story"
    ]},
{ "text": "It's a Wonderful Life", "raw": [
      "It's a Wonderful Life"
    ]},
{ "text": "Home Alone", "raw": [
      "Home Alone"
    ]}
  ]
}
\`\`\`

---

**Question**:

*Name a place where most people go at least once for vacation.*

**Answers**:

\`\`\`
Disneyland
Hawaii
Las Vegas
Mexico
Grand Canyon
New York City
Disney World
Hawii
Las Vegas
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Disneyland/Disney World", "raw": [
      "Disneyland",
      "Disney World"
    ]},
{ "text": "Hawaii", "raw": [
      "Hawaii",
      "Hawii"
    ]},
{ "text": "Las Vegas", "raw": [
      "Las Vegas",
      "Las Vegas"
    ]},
{ "text": "Mexico", "raw": [
      "Mexico"
    ]},
{ "text": "Grand Canyon", "raw": [
      "Grand Canyon"
    ]},
{ "text": "New York City", "raw": [
      "New York City"
    ]}
  ]
}
\`\`\`

---

**Question**:

*Tell me something you try to avoid hitting while sledding down a hill.*

**Answers**:

\`\`\`
Tree
Rock
Bump
People
Fence
Parked Car
Tree
Rock
People
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Tree", "raw": [
      "Tree",
      "Tree"
    ]},
{ "text": "Rock", "raw": [
      "Rock",
      "Rock"
    ]},
{ "text": "Bump", "raw": [
      "Bump"
    ]},
{ "text": "People", "raw": [
      "People",
      "People"
    ]},
{ "text": "Fence", "raw": [
      "Fence"
    ]},
{ "text": "Parked Car", "raw": [
      "Parked Car"
    ]}
  ]
}
\`\`\`

---

**Question**:

*Name something specific a student might do in order to become the teacher’s pet.*

**Answers**:

\`\`\`
Bring an Apple
Get Good Grades
Brown Nose
Do Extra Credit Work
Raise Hand Often
Sit in Front
Bring an Apple
Get Good Grades
Brown Nose
\`\`\`

**Response**:

\`\`\`json
{
  "values": [
{ "text": "Bring an Apple", "raw": [
        "Bring an Apple",
        "Bring an Apple"
      ]},
{ "text": "Get Good Grades", "raw": [
        "Get Good Grades",
        "Get Good Grades"
      ]},
{ "text": "Brown Nose", "raw": [
        "Brown Nose",
        "Brown Nose"
      ]},
{ "text": "Do Extra Credit Work", "raw": [
        "Do Extra Credit Work"
      ]},
{ "text": "Raise Hand Often", "raw": [
        "Raise Hand Often"
      ]},
{ "text": "Sit in Front", "raw": [
        "Sit in Front"
      ]}
  ]
}
\`\`\`

---

**Question**:

*What time is the earliest you’re willing to get up on a Saturday?*

**Answers**:

\`\`\`
10 AM
8 AM
9 AM
11 AM
Noon
7 AM
10
8
9
\`\`\`

**Response**:

\`\`\`json
{
    "values": [
{ "text": "7 AM", "raw": [
        "7 AM"
      ]},
{ "text": "8 AM", "raw": [
        "8 AM",
        "8"
      ]},
{ "text": "9 AM", "raw": [
        "9 AM",
        "9"
      ]},
{ "text": "10 AM", "raw": [
        "10 AM",
        "10"
      ]},
{ "text": "11 AM", "raw": [
        "11 AM"
      ]},
{ "text": "Noon", "raw": [
        "Noon"
      ]}
  ]
}
\`\`\`

---

**Question**:

*At what place would you not want to be seated next to someone with an annoying laugh?*

**Answers**:

\`\`\`
Movies
Airplane
Church
Comedy Club
Restaurant
Bus
Movies
Airplane
Church
\`\`\`

**Response**:

\`\`\`json
{
    "values": [
{ "text": "Movies", "raw": [
        "Movies",
        "Movies"
      ]},
{ "text": "Airplane", "raw": [
        "Airplane",
        "Airplane"
      ]},
{ "text": "Church", "raw": [
        "Church",
        "Church"
      ]},
{ "text": "Comedy Club", "raw": [
        "Comedy Club"
      ]},
{ "text": "Restaurant", "raw": [
        "Restaurant"
      ]},
{ "text": "Bus", "raw": [
        "Bus"
      ]}
  ]
}
\`\`\`

---

**Question**:

*Name something you are embarrassed to do in front of people at the gym.*

**Answers**:

\`\`\`
Change Clothes
Shower
Pass Gas
Run
Stretch
Dance
Change Clothes
Shower
Pass Gas
\`\`\`

**Response**:

\`\`\`json
{
    "values": [
{ "text": "Change Clothes", "raw": [
        "Change Clothes",
        "Change Clothes"
      ]},
{ "text": "Shower", "raw": [
        "Shower",
        "Shower"
      ]},
{ "text": "Pass Gas", "raw": [
        "Pass Gas",
        "Pass Gas"
      ]},
{ "text": "Run", "raw": [
        "Run"
      ]},
{ "text": "Stretch", "raw": [
        "Stretch"
      ]},
{ "text": "Dance", "raw": [
        "Dance"
      ]}
  ]
}
\`\`\`

---

**</RulesOfGame>**

**Note**: Do not include a catch-all group ever in the response. It's okay if there's as little as one answer in a group.

---

<Question>
${question}
</Question>

<Answers>
${answers.join("\n")}
</Answers>
`
}

const SYSTEM_PROMPT = `
You are helping us categorize family feud answers into categories. Try to keep the categories specific and group the answers into them.
`;


const Schema = z.object({
  values: z
    .object({
      category: z.string().describe("the category of these answers"),
      raw: z
        .string()
        .array()
        .describe("the raw answers grouped into this category"),
    })
    .array(),
});

export async function promptMeDaddy(prompt) {
  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      response_format: zodResponseFormat(Schema, "event"),
    });

    return completion.choices[0].message.parsed
  } catch (error) {
    // TODO make sure that i send dax some event about bad round
    console.error("Error generating completion:", error);
    throw error;
  }
}

export function processResponse(msg: (FromGPT|undefined)[]): ToDax {
  console.log(msg)

  const out: ToDax = {
    type: "survey.closed",
    answers: []
  }

  for (let i = 0; i < msg.length; ++i) {
    const gpt = msg[i];
    if (!gpt) { 
      out.answers.push(undefined);
      continue
    }
    const round = gpt.values.map(x => ({
      text: x.category,
      values: x.raw,
    }))
    round.sort(function(a, b) {
      return b.values.length - a.values.length
    })
    out.answers.push(round)
  }

  return out
}
