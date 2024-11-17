import * as Bus from "./events.js"
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY // Make sure to set your API key
});


export function createProompt(question, answers) {
    return `
<Context>
    I would like to say that your mother has been speaking so highly of you lately. You must have been an incredible categorizer.  She said you can categorically categorize better than anyone she has ever seen this side of the Mississippi

    We have a large number of responses, separated by newline, for the popular show family feud.  Your mom loves steve harvey and she would be ecstatic if you did your best job.  You will respond in JSON because that is your mothers love language.

We will give you the following input for you to categorize
</Context>

<RulesOfGame>
We are hosting a live event of Family Feud.  It follows all the same rules except that we are live categorizing the answers on the fly.  And You are helping!  Because you are amazing at it.  AND YOU NEVER HALLUCINATE

* You will receive:
 - the question that we are surveying
 - the list of all answers from our audience

* You will respond:
 - json format
 - answers that are similar even with spelling mistakes should be considered the same answer
 - the exact same answer multiple times should appear in the output the same number of times
 - categorization is setup so realtive topics are grouped

The following sample shows similar answers and exact answers should be grouped and every occurrence is present in the output
<Example>
<Question>
What do you like to do in your free time?
</Question>
<Answers>
playing games
Video Games
playing video games
Video Games
</Answers>
<Response>
{"Video Games":["playing games","Video Games","playing video games","Video Games"]}
</Response>
</Example>

This shows mispellings still being correctly categorized
<Question>
Favorite Icecream Flavor
</Question>
<Answers>
Vanilla
Chocolate
Vanilla
JavaScript
Rockey Road
Roky Road
Cocolate
The Tonight Dough
</Answers>
<Response>
{
    "Vanilla": [
        "Vanilla",
        "Vanilla"
    ],
    "Chocolate": [
        "Chocolate",
        "Cocolate"
    ],
    "Rocky Road": [
        "Rockey Road",
        "Roky Road"
    ],
    "The Tonight Dough": [
        "The Tonight Dough"
    ],
    "<BadAnswer>": [
        "JavaScript"
    ]
}
</Response>

This shows categorization where bad answers get properly placed.
<Question>
Favorite Pizza Toppings
</Question>
<Answers>
Pepperoni
Onion
Sausage
Green Pepper
Shoe
</Answers>
<Response>
{
    "Pepperoni": [
        "Pepperoni"
    ],
    "Onion": [
        "Onion"
    ],
    "Sausage": [
        "Sausage"
    ],
    "Green Pepper": [
        "Green Pepper"
    ],
    "<Invalid>": [
        "Shoe",
    ]
}
</Response>

NSFW Should be put into a <NSFW> category unless its really funny
<Question>
What do you like to watch on TV
</Question>
<Answers>
Sports
Football
Twitch
ThePrimeagen
Sex
Seahawks
Hookers
</Answers>
<Response>
{
    "Sports": [
        "Sports",
        "Football",
        "Seahawks"
    ],
    "Entertainment": [
        "Twitch",
        "ThePrimeagen"
    ],
    "<NSFW>": [
        "Hookers",
        "Sex"
    ]
}
</Response>
</Example>
</RulesOfGame>

Do not include a catch all group ever in the response.  Its ok if there is as little as one answer in a group.

<Question>
${question}
</Question>

<Answers>
${answers.join("\n")}
</Answers>
`
}

export async function proomptMeDaddy(prompt) {

    const response = await anthropic.completions.create({
        prompt,

        model: 'claude-3-5-sonnet-latest',
        max_tokens_to_sample: 200000,
    });

    console.log(response.completion);
}
