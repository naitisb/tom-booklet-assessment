// ToM Booklet Assessment Data
// This file contains all the items, scripts, and questions for both booklets

const BOOKLET_1_DATA = {
    introduction: {
        text: "This is a story about a classroom. These kids are all in {grade} grade, just like you! It's reading time in this classroom. The teacher, Mr. Abbott, calls all the kids over to read their books. The children all get up to look for their books. We're going to see what they do, and help them find their books, OK? Are you ready?",
        illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_01.png"
    },

    story1: {
        name: "The Classroom",
        items: [
            {
                id: "B1_S1_01",
                number: 1,
                type: "Common Desires",
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_01.png",
                script: "Here is Sam. Sam is choosing between two books. One book is about bicycles, and the other book is about fire trucks.",
                questions: [
                    {
                        id: "ToMB1_Pref_01",
                        type: "free_response",
                        text: "What do you like better- bicycles, or fire trucks?",
                        options: ["Bicycles", "Fire trucks"],
                        storeAs: "childChoice"
                    },
                    {
                        id: "ToMB1_2AFC_01",
                        type: "2AFC",
                        text: "You do? That's great! Sam also likes the book about {childChoice}! So which book will Sam choose- the one about bicycles or the one about fire trucks?",
                        options: ["Bicycles", "Fire trucks"]
                    }
                ],
                followUp: "OK, can you give Sam that one?"
            },
            {
                id: "B1_S1_02",
                number: 2,
                type: "Diverse Desires",
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_02.png",
                script: "Now here is Laura. Laura is going to pick a book off the bookshelf. Look, there are two books she can choose between. There is a book that has pictures of fish in the ocean, and there is a book that has pictures of dinosaurs.",
                questions: [
                    {
                        id: "ToMB1_Pref_02a",
                        type: "preference",
                        text: "What do you like better, fish or dinosaurs?",
                        options: ["Fish", "Dinosaurs"]
                    },
                    {
                        id: "ToMB1_2AFC_02",
                        type: "2AFC",
                        text: "You do? That's great! But Laura likes {opposite} better. So which book do you think Laura will pick? Fish or dinosaurs?",
                        options: ["Fish", "Dinosaurs"],
                        requiresPriorResponse: true,
                        dependency: "opposite_of_preference"
                    }
                ],
                followUp: "OK, can you give Laura that one?"
            },
            {
                id: "B1_S1_03",
                number: 3,
                type: "Diverse Beliefs",
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_03.png",
                script: "Here is Jonathan. Jonathan is looking for his book. His book might be under the table, or it might be behind the reading chair. Without peeking, where do you think the book is: under the table, or behind the reading chair?",
                questions: [
                    {
                        id: "ToMB1_Pref_03a",
                        type: "preference",
                        text: "Where do you think the book is?",
                        options: ["Under the table", "Behind the reading chair"]
                    },
                    {
                        id: "ToMB1_2AFC_03",
                        type: "2AFC",
                        text: "That's a good guess! But Jonathan thinks his book is {opposite}. So where will Jonathan look for his book: under the table or behind the chair?",
                        options: ["Under the table", "Behind the chair"],
                        requiresPriorResponse: true,
                        dependency: "opposite_of_preference"
                    }
                ],
                followUp: "OK, let's watch Jonathan look there.",
                conditionalFollowUp: [
                    { condition: "correct", text: "Oh great! There's his book!" },
                    { condition: "incorrect", text: "Uh oh. It's not there. Can you help Jonathan find his book?" }
                ]
            },
            {
                id: "B1_S1_04",
                number: 4,
                type: "Reference (Easy)",
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_04.png",
                script: "Here is Ryan, and Ryan just walked into the room. And here on the bookshelf right in front of Ryan is a big book about airplanes! And there's another book about airplanes, over here, on the cabinet, behind Ryan's back, behind the door.",
                questions: [
                    {
                        id: "ToMB1_2AFC_04",
                        type: "2AFC",
                        text: "So Ryan just walked in (emphasize) through the door and says 'I want that book about airplanes!' Which book does Ryan want?",
                        options: ["Book on the bookshelf (in front)", "Book on the cabinet (behind)"],
                        correctAnswer: "Book on the bookshelf (in front)"
                    },
                    {
                        id: "ToMB1_EXPL_05",
                        type: "explanation",
                        text: "How do you know?"
                    }
                ],
                followUp: "OK, can you give it to him?"
            },
            {
                id: "B1_S1_05",
                number: 5,
                type: "False Beliefs - Reality Known",
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_05.png",
                script: "Here is Madison. This morning, Madison put her book behind the chair, because she didn't want anyone to find it. But when Madison was outside playing, someone did find it! And hid it under the rug. So now it's reading time and Madison wants her book.",
                questions: [
                    {
                        id: "ToMB1_2AFC_06",
                        type: "2AFC",
                        text: "Where will Madison look first for her book? Behind the chair or under the rug?",
                        options: ["Behind the chair", "Under the rug"],
                        correctAnswer: "Behind the chair"
                    },
                    {
                        id: "ToMB1_EXPL_07",
                        type: "explanation",
                        text: "Oh, look, here is Madison looking for her book behind the chair. Why is Madison looking for her book behind the chair?"
                    }
                ],
                followUp: "And where is her book really? Can you help Madison find her book?"
            },
            {
                id: "B1_S1_06",
                number: 6,
                type: "Filler",
                scored: false,
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_06.png",
                script: "This is Noah. Noah wants a book about the planets.",
                questions: [
                    {
                        id: "ToMB1_Cont_08",
                        type: "control",
                        text: "Can you give it to him?"
                    }
                ]
            },
            {
                id: "B1_S1_07",
                number: 7,
                type: "Moral Reasoning based on False Beliefs",
                illustration: "ToM_Booklet_1_illustrations/ToM_Booklet_07.png",
                script: "This morning when he came to school, Ethan put his book above the coat hooks. What color is Ethan's book? That's right- it's blue! And then he went outside to play - see? Here's Ethan playing outside. And while he was outside playing, Ethan's book fell down from above the coat hooks to behind the coats, see? Then Paul comes in - and Paul put his book up here, above the coat hooks. What color is Paul's book? That's right- it's blue! But Ethan is still outside playing, so he didn't see what Paul was doing.",
                questions: [
                    {
                        id: "ToMB1_2AFC_09",
                        type: "2AFC",
                        text: "Now, when Ethan comes in from outside, where will he look first for his book: up on the shelf, or behind the coats?",
                        options: ["Up on the shelf", "Behind the coats"],
                        correctAnswer: "Up on the shelf"
                    },
                    {
                        id: "ToMB1_EXPL_10",
                        type: "explanation",
                        text: "Oh look, here is Ethan reaching for this (Paul's) book up on the shelf. Why is Ethan reaching for the book on the shelf?"
                    },
                    {
                        id: "ToMB1_EXPL_11",
                        type: "explanation",
                        text: "And now Paul sees Ethan reaching for that book, and he gets really upset. Why does Paul feel sad?"
                    },
                    {
                        id: "ToMB1_2AFC_12",
                        type: "2AFC_explanation",
                        text: "Is Ethan being mean and naughty for taking Paul's book?",
                        options: ["Yes", "No"],
                        correctAnswer: "No",
                        followUpExplanation: "Why/why not?"
                    },
                    {
                        id: "ToMB1_2AFC_13",
                        type: "2AFC_explanation",
                        text: "Should Ethan get in trouble with the teacher for taking Paul's book?",
                        options: ["Yes", "No"],
                        correctAnswer: "No",
                        followUpExplanation: "Why/why not?"
                    }
                ],
                followUp: "Can you give Paul back his book? Now can you help Ethan find his own book?"
            }
        ]
    }
};

const BOOKLET_2_DATA = {
    introduction: {
        text: "This is a story about a classroom. What grade are you in? Well these kids are in {grade} grade, just like you, and their teacher, Mr. Cook, just told all the kids that it is snack time. So now all of the children are going to get their snacks, and we're going to help them. Are you ready?",
        illustration: "ToM_Booklet_2_illustrations/MIT_BOOKLET_ColorFINAL_0.png"
    },

    items: [
        {
            id: "B2_01",
            number: 1,
            type: "Common Desires",
            illustration: "ToM_Booklet_2_illustrations/MIT_BOOKLET_ColorFINAL_1.png",
            script: "Here's Henry. Henry is trying to decide between the two snacks that his dad packed for him. He could eat apples, or he could eat strawberries.\n\nWhich snack do you like better, apples or strawberries?",
            questions: [
                {
                    id: "ToMS_2AFC_1.1",
                    type: "2AFC",
                    text: "You like {childChoice}? Henry also likes {childChoice} better, so which one will Henry choose to eat?",
                    options: ["Apples", "Strawberries"],
                    requiresPriorResponse: true,
                    dependency: "childChoice"
                }
            ],
            followUp: "Okay, can you give Henry that one?"
        },
        {
            id: "B2_1.5",
            number: 1.5,
            type: "Implicit False Belief",
            illustration: "ToM_Booklet_2_illustrations/MIT_BOOKLET_ColorFINAL_1.png",
            script: "This is Rachel. And Rachel brought raisins to have during snack time. Rachel walks into this room and sees two containers on the rug- There's one container on a yellow mat, and one container on a blue mat. Rachel decides to put her raisins in the container on the yellow mat. Then Rachel goes away.\n\nNow, while Rachel is away, we're going to play a trick on Rachel. We're going to take her raisins out of this container, on the yellow mat, and move them to this container on the blue mat! And then we're going to put these heavy lids on the containers.",
            questions: [
                {
                    id: "ToMS_2AFCImp_1.5.1",
                    type: "implicit_action",
                    text: "So now Rachel comes back in. What happens next- can you show me with Rachel?",
                    options: ["Goes to yellow mat", "Goes to blue mat"],
                    correctAnswer: "Goes to yellow mat"
                },
                {
                    id: "ToMS_Expl_1.5.2",
                    type: "explanation",
                    text: "Why does Rachel go there?"
                }
            ],
            followUp: "Alright, good job!"
        },
        {
            id: "B2_07",
            number: 7,
            type: "Moral Reasoning based on False Beliefs",
            illustration: "ToM_Booklet_2_illustrations/MIT_BOOKLET_ColorFINAL_7.png",
            ageRestriction: { min: 3, max: 100 },
            script: "This morning when she came to school, Allie put her snack on this shelf, above the backpack shelf. What did Allie bring her snack in? That's right- a brown paper bag! And then she went outside to play- see? Here's Allie playing outside. And while she was outside playing, Allie's snack fell down from on top of the backpack shelf to behind the backpack shelf, see? Then Sue comes in, and Sue puts her snack above the backpack shelf. What did Sue bring her snack in? That's right- a brown paper bag! But Allie is still outside playing, so she didn't see what Sue was doing.",
            questions: [
                {
                    id: "ToMS_2AFC_7.1",
                    type: "2AFC",
                    text: "Now, when Allie comes in from outside, where will she look first for her snack: up on top of the backpack shelf, or behind the backpack shelf?",
                    options: ["Up on top of the backpack shelf", "Behind the backpack shelf"],
                    correctAnswer: "Up on top of the backpack shelf"
                },
                {
                    id: "ToMS_Expl_7.2",
                    type: "explanation",
                    text: "Oh look (or, you're right!), here is Allie reaching for this snack up on top of the shelf. Why is Allie reaching for the snack on top of the shelf?"
                },
                {
                    id: "ToMS_Expl_7.3",
                    type: "explanation",
                    text: "And now Sue sees Allie reaching for that snack, and she gets really upset. Why does Sue feel sad?"
                },
                {
                    id: "ToMS_2AFC_7.4",
                    type: "2AFC",
                    text: "Is Allie being mean and naughty for taking Sue's snack?",
                    options: ["Yes", "No"],
                    correctAnswer: "No"
                },
                {
                    id: "ToMS_Expl_7.5",
                    type: "explanation",
                    text: "Why/why not?"
                },
                {
                    id: "ToMS_2AFC_7.6",
                    type: "2AFC",
                    text: "Should Allie get in trouble with their teacher (Mr. Cook) for taking Sue's snack?",
                    options: ["Yes", "No"],
                    correctAnswer: "No"
                },
                {
                    id: "ToMS_Expl_7.7",
                    type: "explanation",
                    text: "Why/why not?"
                }
            ],
            followUp: "Now can you give Sue back her snack? Great! And can you give Allie back her snack? Great!"
        },
        {
            id: "B2_19",
            number: 19,
            type: "Sarcasm",
            illustration: "ToM_Booklet_2_illustrations/MIT_BOOKLET_ColorFINAL_19.png",
            ageRestriction: { min: 5, max: 100 },
            excludeForYoung: true,
            script: "This morning, Leslie's mom asked her what she would like for snack. Leslie told her, 'I'd like something sweet!' So Mom thought about it, but Mom wanted Leslie to eat something healthy for snack, so she packed carrot sticks for Leslie.\n\nNow it's snacktime, and Leslie just opened up her brown paper bag to find the carrot sticks. She says, 'Mmm, my favorite.' (say sarcastically!)",
            questions: [
                {
                    id: "ToMS_Expl_19.1",
                    type: "explanation",
                    text: "Why did Leslie say that?"
                },
                {
                    id: "ToMS_2AFC_19.2",
                    type: "2AFC",
                    text: "How does Leslie feel about her mom packing carrots- happy or sad?",
                    options: ["Happy", "Sad"],
                    correctAnswer: "Sad"
                }
            ]
        }
    ]
};

// Simplified item list for demonstration (you would expand this with all items)
const COMPLETE_BOOKLET_2_ITEMS = [
    // ... all 19 items would be here
];
