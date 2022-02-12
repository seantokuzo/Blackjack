const myButton = document.getElementById('button')
const firstCard = document.getElementById("card1")
const secondCard = document.getElementById("card2")
const thirdCard = document.getElementById("card3")
const fourthCard = document.getElementById("card4")
const fifthCard = document.getElementById("card5")
const message = document.getElementById("message-el")
const sumDisplay = document.getElementById("sum")
const cardsContainer = document.getElementById("cards-container")
const buttonsDiv = document.getElementById("buttons-div")
const cardValues = {
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'JACK': 10,
    'QUEEN': 10,
    'KING': 10,
    'ACE': 11
}
const aceLow = {
    'ACE': 1
}
let currentDeck = ''
let myStorage = window.localStorage
let drawCount = 0
let myCards = []
let myCountHigh
let myCountLow
let gameOver = false



function theDrawHandler() {
    //SETTING THE USERS COUNTS
    const myCardsValueArray = myCards.map(card => cardValues[card])
    myCountHigh = myCardsValueArray.reduce((acc, num) => acc + num)

    const myCardsValueArrayLow = myCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    myCountLow = myCardsValueArrayLow.reduce((acc, num) => acc + num)

    //SETTING THE SUM DISPLAY
    if (myCountHigh === 21 || myCountLow == 21) {
        sumDisplay.innerText = `Sum: ${myCountLow}`
    } else if (myCountHigh > 21 && myCountLow < 21) {
        sumDisplay.innerText = `Sum: ${myCountLow}`
    } else if (myCountHigh === myCountLow) {
        sumDisplay.innerText = `Sum: ${myCountHigh}`
    } else if (myCountLow > 21) {
        sumDisplay.innerText = `Sum: ${myCountLow}`
    } else {
        sumDisplay.innerText = `Sum: High - ${myCountHigh}, Low - ${myCountLow}`
    }
    //SETTING THE BUTTON AND MESSAGE TEXT
    if (myCountHigh === 21 || myCountLow === 21) {
        message.innerText = "YOU WIN!"
        myButton.innerText = "Run It Back"
        gameOver = true
        drawCount = 5
    } else if (drawCount === 5 && myCountLow < 21) {
        message.innerText = "YOU WIN!"
        myButton.innerText = "Run It Back"
        gameOver = true
    } else if (myCountLow > 21) {
        message.innerText = "YOU LOSER!"
        myButton.innerText = "Try Again"
        gameOver = true
        drawCount = 5
    } else {
        message.innerText = "Draw another card or stay?"
        myButton.innerText = "HIT ME"
    }
    //ADD HOLD BUTTON
    // if (drawCount > 0 && drawCount < 5 && gameOver === false) {
    //     let holdButton = document.createElement("button")
    //     holdButton.id = "hold-button"
    //     holdButton.onclick = holdEm()
    //     holdButton.value = "HOLD"
    //     buttonsDiv.appendChild(holdButton)
    // }
}

// const setCard = (card, url) => {
//     card.src = url
//     card.style.visibility = "visible"
// }

const addCard = (url) => {
    var cardImg = document.createElement("IMG")
    cardImg.src = url
    cardImg.alt = "card"
    cardImg.id = `card${drawCount}`
    cardImg.className = "card"
    cardsContainer.appendChild(cardImg)
}

// const resetCard = (card) => {
//     card.src = ''
//     card.style.visibility = "hidden"
// }

function holdEm() {
    console.log("Hold Please")
}

function removeMyCards() {
    const firstCard = document.getElementById("card1")
    const secondCard = document.getElementById("card2")
    const thirdCard = document.getElementById("card3")
    const fourthCard = document.getElementById("card4")
    const fifthCard = document.getElementById("card5")
    firstCard && firstCard.remove()
    secondCard && secondCard.remove()
    thirdCard && thirdCard.remove()
    fourthCard && fourthCard.remove()
    fifthCard && fifthCard.remove()
}

function Draw() {
    //FIRST DRAW
    if (drawCount === 0) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                drawCount += 1
                // setCard(firstCard, data.cards[0].image)
                addCard(data.cards[0].image)
                drawCount += 1
                // setCard(secondCard, data.cards[1].image)
                addCard(data.cards[1].image)
                theDrawHandler()
                myStorage.setItem('deckId', data.deck_id)
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
            //LAST DRAW
        } else if (drawCount === 4) {
            drawCount += 1
            fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => myCards.push(obj.value))
                console.log(myCards)
                // const currentCard = document.getElementById(`card${drawCount}`)
                addCard(data.cards[0].image)
                theDrawHandler()
                myButton.innerText = "New Game"
            })
            .catch(e => console.log(e))
            //IN BETWEEN DRAWS
        } else if (drawCount > 0 && drawCount < 4) {
            drawCount += 1
            fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => myCards.push(obj.value))
                // const currentCard = document.getElementById(`card${drawCount}`)
                // setCard(currentCard, data.cards[0].image)
                addCard(data.cards[0].image)
                theDrawHandler()
            })
            .catch(e => console.log(e))
        //NEW GAME START WITH 2 CARDS
    } else {
        drawCount = 0
        myCards = []
        myCountHigh = 0
        myCountLow = 0
        gameOver = false
        removeMyCards()
        // resetCard(thirdCard)
        // resetCard(fourthCard)
        // resetCard(fifthCard)
        message.innerText = "Big Money Big Money Big Money"
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                drawCount = 2
                data.cards.map(obj => myCards.push(obj.value))
                addCard(data.cards[0].image)
                addCard(data.cards[1].image)
                theDrawHandler()
                myButton.innerText = "Draw"
            })
            .catch(e => console.log(e))
    }
}

const getYourDeck = () => {
    if (myStorage.deckId) {
        currentDeck = myStorage.getItem('deckId')
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
    } else {
        fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2")
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => myCards.push(obj.value))
                myStorage.setItem('deckId', data.deck_id)
                drawCount = 1
                addCard(data.cards[0].image)
                drawCount = 2
                addCard(data.cards[1].image)
                theDrawHandler()
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
    }
}
getYourDeck()


//ALL THESE FUNCTIONS WERE COMBINED INTO 
// function addUpHigh() {
//     console.log(myCards)
//     const myCardsValueArray = myCards.map(card => cardValues[card])
//     myCountHigh = myCardsValueArray.reduce((acc, num) => acc + num)
//     console.log(myCountHigh)
// }

// function addUpLow() {
//     console.log(myCards)
//     const myCardsValueArray = myCards.map(card => {
//         if (card === "ACE") {
//             return 1
//         } else return cardValues[card]
//     })
//     myCountLow = myCardsValueArray.reduce((acc, num) => acc + num)
//     console.log(myCountLow)
// }

// const handleSum = () => {
//     if (myCountHigh === 21 || myCountLow == 21) {
//         sumDisplay.innerText = `Sum: ${myCountLow}`
//     } else if (myCountHigh > 21 && myCountLow < 21) {
//         sumDisplay.innerText = `Sum: ${myCountLow}`
//     } else if (myCountHigh === myCountLow) {
//         sumDisplay.innerText = `Sum: ${myCountHigh}`
//     } else if (myCountLow > 21) {
//         sumDisplay.innerText = `Sum: ${myCountLow}`
//     } else {
//         sumDisplay.innerText = `Sum: High - ${myCountHigh}, Low - ${myCountLow}`
//     }
// }

// const checkStatus = () => {
//     if (myCountHigh === 21 || myCountLow === 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//         drawCount = 5
//     } else if (drawCount === 5 && myCountLow < 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//     } else if (myCountLow > 21) {
//         message.innerText = "YOU LOSER!"
//         myButton.innerText = "Try Again"
//         drawCount = 5
//     } else {
//         message.innerText = "Want another card?"
//     }
// }