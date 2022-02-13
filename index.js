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
let gameState = {
    currentDeck: '',
    userCards: [],
    userCountHigh: 0,
    userCountLow: 0,
    houseCards: [],
    houseCountHigh: 0,
    houseCountLow: 0,
    gameOver: false,
    wins: 0,
    losses: 0
}
let myStorage = window.localStorage

function shuffleDeck() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
        .then(res => res.json())
        .then(data => console.log("Shuffled", data))
        .catch(e => console.log(e))
}

function setSumDisplay() {
    if (gameState.userCountHigh === 21 || gameState.userCountLow == 21) {
        sumDisplay.innerText = `Sum: ${gameState.userCountLow}`
    } else if (gameState.userCountHigh > 21 && gameState.userCountLow < 21) {
        sumDisplay.innerText = `Sum: ${gameState.userCountLow}`
    } else if (gameState.userCountHigh === gameState.userCountLow) {
        sumDisplay.innerText = `Sum: ${gameState.userCountHigh}`
    } else if (gameState.userCountLow > 21) {
        sumDisplay.innerText = `Sum: ${gameState.userCountLow}`
    } else {
        sumDisplay.innerText = `Sum: High - ${gameState.userCountHigh}, Low - ${gameState.userCountLow}`
    }
}

const addUserCard = (url) => {
    var cardImg = document.createElement("IMG")
    cardImg.src = url
    cardImg.alt = "card"
    console.log(gameState.userCards)
    cardImg.id = `card${gameState.userCards.length}`
    cardImg.className = "card"
    userCardsContainer.appendChild(cardImg)
}

const addHouseCard = (url) => {
    var houseCardImg = document.createElement("IMG")
    houseCardImg.src = url
    houseCardImg.alt = "card"
    // console.log(gameState.houseCards)
    // console.log(gameState.houseCards.length)
    houseCardImg.id = `card${gameState.houseCards.length}`
    houseCardImg.className = "card"
    houseCardsContainer.appendChild(houseCardImg)
}

function holdEm() {
    console.log("Hold Please")
}

// function removeCards() {
//     let userCard1 = document.getElementById("card1")
//     let userCard2 = document.getElementById("card2")
//     let userCard3 = document.getElementById("card3")
//     let userCard4 = document.getElementById("card4")
//     let userCard5 = document.getElementById("card5")
//     let houseCard1 = document.getElementById("house-card1")
//     let houseCard2 = document.getElementById("house-card2")
//     let houseCard3 = document.getElementById("house-card3")
//     let houseCard4 = document.getElementById("house-card4")
//     let houseCard5 = document.getElementById("house-card5")
//     userCard1 && userCard1.remove()
//     userCard2 && userCard2.remove()
//     userCard3 && userCard3.remove()
//     userCard4 && userCard4.remove()
//     userCard5 && userCard5.remove()
//     houseCard1 && houseCard1.remove()
//     houseCard2 && houseCard2.remove()
//     houseCard3 && houseCard3.remove()
//     houseCard4 && houseCard4.remove()
//     houseCard5 && houseCard5.remove()
// }

function drawUserCard() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            gameState.userCards.push(data.cards[0].value)
            // console.log(gameState.userCards)
            addUserCard(data.cards[0].image)
            sumUserCards()
            setSumDisplay()
            if (gameState.userCards.length === 2) {
                setButtons()
            } else return
        })
        .catch(e => console.log(e))
}

function drawHouseCard() {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            gameState.houseCards.push(data.cards[0].value)
            // console.log(gameState.userCards)
            addHouseCard(data.cards[0].image)
            sumHouseCards()
        })
        .catch(e => console.log(e))
}

function sumUserCards() {
    const userCardsValueArray = gameState.userCards.map(card => cardValues[card])
    gameState.userCountHigh = userCardsValueArray.reduce((acc, num) => acc + num)

    const userCardsValueArrayLow = gameState.userCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    gameState.userCountLow = userCardsValueArrayLow.reduce((acc, num) => acc + num)
    console.log(`User Count High: ${gameState.userCountHigh}`)
    console.log(`User Count Low: ${gameState.userCountLow}`)
}

function sumHouseCards() {
    const houseCardsValueArray = gameState.houseCards.map(card => cardValues[card])
    gameState.houseCountHigh = houseCardsValueArray.reduce((acc, num) => acc + num)

    const houseCardsValueArrayLow = gameState.houseCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    gameState.houseCountLow = houseCardsValueArrayLow.reduce((acc, num) => acc + num)
    console.log(`House Count High: ${gameState.houseCountHigh}`)
    console.log(`House Count Low: ${gameState.houseCountLow}`)
}

function setButtons() {
    const buttonsDiv = document.getElementById("buttons-div")
    console.log(gameState.userCards.length)
    if (gameState.userCards.length > 0 && gameState.userCards.length < 5) {
        myButton.innerText = "Hit Me"
        let holdButton = document.createElement("button")
        holdButton.id = "hold-button"
        holdButton.onclick = holdEm()
        holdButton.innerText = "Stay"
        console.log("hi!")
        buttonsDiv.appendChild(holdButton)
    } else if (gameState.userCards.length === 5) {
        holdButton.remove()
    }
}

function Draw() {
    //FIRST DRAW
    if (gameState.userCards.length === 0) {
        //FETCH USERS FIRST 2 CARDS
        drawUserCard()
        drawUserCard()
        //FETCH HOUSE FIRST 2 CARDS
        drawHouseCard()
        drawHouseCard()
        //IN BETWEEN DRAWS
    } else if (gameState.userCards.length > 0 && gameState.userCards.length < 5) {
        drawUserCard()
        //NEW GAME START WITH 2 CARDS
    } else {
        //RESET STATE
        gameState.userCards.length = 0
        gameState.userCards = []
        gameState.userCountHigh = 0
        gameState.userCountLow = 0
        gameState.gameOver = false
        message.innerText = "Big Money Big Money Big Money"
        myButton.innerText = "Hit Me"
        //REMOVE THE PREVIOUS GAME'S CARDS
        removeCards()
        //RETURN CARDS TO DECK AND SHUFFLE
        shuffleDeck()
        //FETCH USER FIRST 2 CARDS
        drawUserCard()
        drawUserCard(userCards.length)
        // FETCH HOUSE FIRST 2 CARDS
        drawHouseCard()
        drawHouseCard()
    }
}

const getYourDeck = (gameState) => {
    if (myStorage.deckId) {
        currentDeck = myStorage.getItem('deckId')
        console.log(currentDeck)
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
                data.cards.map(obj => gameState.userCards.push(obj.value))
                drawUserCard(gameState.userCards.length, gameState.userCards)
                // theDrawHandler()
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
    }
}
getYourDeck(gameState)

// function theDrawHandler() {
//     //SETTING THE BUTTON AND MESSAGE TEXT
//     if (userCountHigh === 21 || userCountLow === 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//         gameOver = true
//         userCards.length = 5
//         console.log(userCards.length)
//     } else if (userCards.length === 5 && userCountLow < 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//         userCards.length = 5
//         gameOver = true
//     } else if (userCountLow > 21) {
//         message.innerText = "YOU LOSER!"
//         myButton.innerText = "Try Again"
//         gameOver = true
//         userCards.length = 5
//         console.log(userCards.length)
//     } else {
//         message.innerText = "Draw another card or stay?"
//         myButton.innerText = "Hit Me"
//     }
//ADD HOLD BUTTON
// if (userCards.length > 0 && userCards.length < 5 && gameOver === false) {
//     let holdButton = document.createElement("button")
//     holdButton.id = "hold-button"
//     holdButton.onclick = holdEm()
//     holdButton.value = "HOLD"
//     buttonsDiv.appendChild(holdButton)
// }
// }

// const setCard = (card, url) => {
//     card.src = url
//     card.style.visibility = "visible"
// }