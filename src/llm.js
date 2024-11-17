import * as Bus from "./events.js"
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY // Make sure to set your API key
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
  "Toys": ["Toys", "Toys"],
  "Electronics": ["Electronics", "Electronics"],
  "Video Games": ["Video Games", "Video Games"],
  "Food": ["Food", "Food"],
  "Clothes": ["Clothes", "Clothes"]
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
  "Bus Driver": ["Bus Driver", "Bus Driver"],
  "Trucker": ["Trucker", "Trucker"],
  "Limo Driver": ["Limo Driver"],
  "Firefighter": ["Firefighter", "Fireman"],
  "Construction Worker": ["Construction Worker"],
  "Postal Delivery": ["Postal Delivery"]
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
  "Typing": ["Typing", "Typing"],
  "Working Hard": ["Working Hard", "Working Hard"],
  "Communication": ["Communication", "Communication"],
  "Sales": ["Sales"],
  "Customer Service": ["Customer Service"],
  "Foreign Language": ["Foreign Language"]
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
  "Rudolph": ["Rudolph", "Rudolph"],
  "Frosty": ["Frosty", "Frosty"],
  "Grinch": ["Grinch", "Grinch"],
  "A Christmas Story": ["A Christmas Story"],
  "It's a Wonderful Life": ["It's a Wonderful Life"],
  "Home Alone": ["Home Alone"]
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
  "Disneyland/Disney World": ["Disneyland", "Disney World"],
  "Hawaii": ["Hawaii", "Hawii"],
  "Las Vegas": ["Las Vegas", "Las Vegas"],
  "Mexico": ["Mexico"],
  "Grand Canyon": ["Grand Canyon"],
  "New York City": ["New York City"]
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
  "Tree": ["Tree", "Tree"],
  "Rock": ["Rock", "Rock"],
  "Bump": ["Bump"],
  "People": ["People", "People"],
  "Fence": ["Fence"],
  "Parked Car": ["Parked Car"]
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
  "Bring an Apple": ["Bring an Apple", "Bring an Apple"],
  "Get Good Grades": ["Get Good Grades", "Get Good Grades"],
  "Brown Nose": ["Brown Nose", "Brown Nose"],
  "Do Extra Credit Work": ["Do Extra Credit Work"],
  "Raise Hand Often": ["Raise Hand Often"],
  "Sit in Front": ["Sit in Front"]
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
  "7 AM": ["7 AM"],
  "8 AM": ["8 AM", "8"],
  "9 AM": ["9 AM", "9"],
  "10 AM": ["10 AM", "10"],
  "11 AM": ["11 AM"],
  "Noon": ["Noon"]
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
  "Movies": ["Movies", "Movies"],
  "Airplane": ["Airplane", "Airplane"],
  "Church": ["Church", "Church"],
  "Comedy Club": ["Comedy Club"],
  "Restaurant": ["Restaurant"],
  "Bus": ["Bus"]
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
  "Change Clothes": ["Change Clothes", "Change Clothes"],
  "Shower": ["Shower", "Shower"],
  "Pass Gas": ["Pass Gas", "Pass Gas"],
  "Run": ["Run"],
  "Stretch": ["Stretch"],
  "Dance": ["Dance"]
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

export async function proomptMeDaddy(prompt) {

    const msg = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 8192,
        messages: [
            { role: "user", content: prompt },
            { role: "assistant", content: "{\"" },
        ],
    });

    return msg
}
