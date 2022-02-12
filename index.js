const myButton = document.getElementById('button')
// const userCard1 = document.getElementById("card1")
// const userCard2 = document.getElementById("card2")
// const userCard3 = document.getElementById("card3")
// const userCard4 = document.getElementById("card4")
// const userCard5 = document.getElementById("card5")
// const houseCard1 = document.getElementById("house-card1")
// const houseCard2 = document.getElementById("house-card2")
// const houseCard3 = document.getElementById("house-card3")
// const houseCard4 = document.getElementById("house-card4")
// const houseCard5 = document.getElementById("house-card5")
const message = document.getElementById("message-el")
const sumDisplay = document.getElementById("sum")
const userCardsContainer = document.getElementById("user-cards-container")
const houseCardsContainer = document.getElementById("house-cards-container")
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
let houseCards = []
let houseCountHigh
let houseCountLow
let gameOver = false

function shuffleDeck() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
        .then(res => res.json())
        .then(data => console.log("Shuffled"))
        .catch(e => console.log(e))
}

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
        myButton.innerText = "Hit Me"
    }
    console.log(myCards)
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

const addUserCard = (url) => {
    var cardImg = document.createElement("IMG")
    cardImg.src = url
    cardImg.alt = "card"
    cardImg.id = `card${drawCount}`
    cardImg.className = "card"
    userCardsContainer.appendChild(cardImg)
}

const addHouseCard = (url) => {
    var houseCardImg = document.createElement("IMG")
    houseCardImg.src = url
    houseCardImg.alt = "card"
    houseCardImg.id = `house-card${drawCount}`
    houseCardImg.className = "card"
    houseCardsContainer.appendChild(houseCardImg)
}

// const resetCard = (card) => {
//     card.src = ''
//     card.style.visibility = "hidden"
// }

function holdEm() {
    console.log("Hold Please")
}

function removeMyCards() {
    const userCard1 = document.getElementById("card1")
    const userCard2 = document.getElementById("card2")
    const userCard3 = document.getElementById("card3")
    const userCard4 = document.getElementById("card4")
    const userCard5 = document.getElementById("card5")
    const houseCard1 = document.getElementById("house-card1")
    const houseCard2 = document.getElementById("house-card2")
    const houseCard3 = document.getElementById("house-card3")
    const houseCard4 = document.getElementById("house-card4")
    const houseCard5 = document.getElementById("house-card5")
    userCard1 && userCard1.remove()
    userCard2 && userCard2.remove()
    userCard3 && userCard3.remove()
    userCard4 && userCard4.remove()
    userCard5 && userCard5.remove()
    houseCard1 && houseCard1.remove()
    houseCard2 && houseCard2.remove()
    houseCard3 && houseCard3.remove()
    houseCard4 && houseCard4.remove()
    houseCard5 && houseCard5.remove()
}

function drawUserCard() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            data.cards.map(obj => myCards.push(obj.value))
            drawCount += 1
            addUserCard(data.cards[0].image)
            theDrawHandler()
        })
        .catch(e => console.log(e))
}

function Draw() {
    //FIRST DRAW
    if (drawCount === 0) {
        //FETCH USERS FIRST 2 CARDS
        drawUserCard()
        drawUserCard()
        //FETCH HOUSE FIRST 2 CARDS
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => houseCards.push(obj.value))
                drawCount = 1
                addHouseCard(data.cards[0].image)
                drawCount = 2
                addHouseCard(data.cards[1].image)
                // theDrawHandler()
            })
            .catch(e => console.log(e))
            //LAST DRAW
        // } else if (drawCount === 4) {
            // drawCount += 1
            // fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            // .then(res => res.json())
            // .then(data => {
            //     data.cards.map(obj => myCards.push(obj.value))
            //     addUserCard(data.cards[0].image)
            //     theDrawHandler()
            // })
            // .catch(e => console.log(e))
            //IN BETWEEN DRAWS
    } else if (drawCount > 0 && drawCount < 5) {
        drawUserCard()
            // drawCount += 1
            // fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            // .then(res => res.json())
            // .then(data => {
            //     data.cards.map(obj => myCards.push(obj.value))
            //     addUserCard(data.cards[0].image)
            //     theDrawHandler()
            // })
            // .catch(e => console.log(e))
        //NEW GAME START WITH 2 CARDS
    } else {
        //RESET STATE
        drawCount = 0
        myCards = []
        myCountHigh = 0
        myCountLow = 0
        gameOver = false
        message.innerText = "Big Money Big Money Big Money"
        myButton.innerText = "Hit Me"
        //REMOVE THE PREVIOUS GAME'S CARDS
        removeMyCards()
        //RETURN CARDS TO DECK AND SHUFFLE
        shuffleDeck()
        // fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
        //     .then(res => res.json())
        //     .then(data => console.log(data))
        //     .catch(e => console.log(e))
        //FETCH USER FIRST 2 CARDS
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => myCards.push(obj.value))
                drawCount = 1
                addUserCard(data.cards[0].image)
                drawCount = 2
                addUserCard(data.cards[1].image)
                theDrawHandler()
            })
            .catch(e => console.log(e))
        // FETCH HOUSE FIRST 2 CARDS
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                data.cards.map(obj => houseCards.push(obj.value))
                drawCount = 1
                addHouseCard(data.cards[0].image)
                drawCount = 2
                addHouseCard(data.cards[1].image)
                // theDrawHandler()
            })
            .catch(e => console.log(e))
    }
}

const getYourDeck = () => {
    if (myStorage.deckId) {
        currentDeck = myStorage.getItem('deckId')
        shuffleDeck()
        // fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
        //     .then(res => res.json())
        //     .then(data => console.log(data))
        //     .catch(e => console.log(e))
    } else {
        fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2")
            .then(res => res.json())
            .then(data => {
                myStorage.setItem('deckId', data.deck_id)
                data.cards.map(obj => myCards.push(obj.value))
                drawCount = 1
                addUserCard(data.cards[0].image)
                drawCount = 2
                addUserCard(data.cards[1].image)
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