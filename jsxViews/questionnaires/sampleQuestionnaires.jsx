define(function (require) {
    var questionType = require("./questionTypes");
    return {
        isJumbaled: true,
        isSame: false,
        records: [{
            type: questionType.SINGLE_ANSWER,
            question: "Grand Central Terminal, Park Avenue, New York is the world's",
            answers: [{
                text: "Largest railway station", isCorrect: true
            }, {
                text: "Highest railway station", isCorrect: false
            }, {
                text: "Longest railway station", isCorrect: false
            }, {
                text: "None of the above", isCorrect: false
            }],
            userAnswer: null,
            weightage: 1
        }, {
            type: questionType.MULTIPLE_ANSWER,
            question: "Which are capital city",
            answers: [{
                text: "Delhi", isCorrect: true
            }, {
                text: "Hosur", isCorrect: false
            }, {
                text: "Mumbai", isCorrect: true
            }, {
                text: "Rome", isCorrect: true
            }],
            userAnswer: null,
            weightage: 2
        }, {
            type: questionType.BOOLEAN_ANSWER,
            question: "Is whale mammal",
            answers: [{
                text: "Yes", isCorrect: true
            }, {
                text: "No", isCorrect: false
            }],
            userAnswer: null,
            weightage: 0.5
        }, {
            type: questionType.DESCRIPTION,
            question: "Are you happy with your wife?",
            userAnswer: null,
            weightage: 10
        }, {
            type: questionType.DATE,
            question: "Your date of birth?",
            userAnswer: null,
            weightage: 10
        }, {
            type: questionType.NUMBER,
            question: "Your marriage anniversary?",
            userAnswer: null,
            weightage: 10
        }]
    };
});