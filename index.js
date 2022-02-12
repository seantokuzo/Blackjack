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
let userCountHigh
let userCountLow
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

function theDrawHandler(drawCount, userCountHigh, userCountLow, houseCountHigh, houseCountLow) {
    //SETTING THE USERS COUNTS
    const userCardsValueArray = myCards.map(card => cardValues[card])
    userCountHigh = userCardsValueArray.reduce((acc, num) => acc + num)

    const userCardsValueArrayLow = myCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    userCountLow = userCardsValueArrayLow.reduce((acc, num) => acc + num)
    
    //SETTING THE HOUSE COUNTS
    const houseCardsValueArray = houseCards.map(card => cardValues[card])
    houseCountHigh = houseCardsValueArray.reduce((acc, num) => acc + num)
    

    const houseCardsValueArrayLow = houseCards.map(card => {
        if (card === "ACE") {
            return 1
        } else return cardValues[card]
    })
    houseCountLow = houseCardsValueArrayLow.reduce((acc, num) => acc + num)

    //SETTING THE SUM DISPLAY
    if (userCountHigh === 21 || userCountLow == 21) {
        sumDisplay.innerText = `Sum: ${userCountLow}`
    } else if (userCountHigh > 21 && userCountLow < 21) {
        sumDisplay.innerText = `Sum: ${userCountLow}`
    } else if (userCountHigh === userCountLow) {
        sumDisplay.innerText = `Sum: ${userCountHigh}`
    } else if (userCountLow > 21) {
        sumDisplay.innerText = `Sum: ${userCountLow}`
    } else {
        sumDisplay.innerText = `Sum: High - ${userCountHigh}, Low - ${userCountLow}`
    }
    //SETTING THE BUTTON AND MESSAGE TEXT
    if (userCountHigh === 21 || userCountLow === 21) {
        message.innerText = "YOU WIN!"
        myButton.innerText = "Run It Back"
        gameOver = true
        drawCount = 5
        console.log(drawCount)
    } else if (drawCount === 5 && userCountLow < 21) {
        message.innerText = "YOU WIN!"
        myButton.innerText = "Run It Back"
        drawCount = 5
        gameOver = true
    } else if (userCountLow > 21) {
        message.innerText = "YOU LOSER!"
        myButton.innerText = "Try Again"
        gameOver = true
        drawCount = 5
        console.log(drawCount)
    } else {
        message.innerText = "Draw another card or stay?"
        myButton.innerText = "Hit Me"
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

const addUserCard = (url, dc) => {
    var cardImg = document.createElement("IMG")
    cardImg.src = url
    cardImg.alt = "card"
    cardImg.id = `card${dc}`
    cardImg.className = "card"
    userCardsContainer.appendChild(cardImg)
}

const addHouseCard = (url, dc) => {
    var houseCardImg = document.createElement("IMG")
    houseCardImg.src = url
    houseCardImg.alt = "card"
    houseCardImg.id = `house-card${dc}`
    houseCardImg.className = "card"
    houseCardsContainer.appendChild(houseCardImg)
}

function holdEm() {
    console.log("Hold Please")
}

function removeCards() {
    let userCard1 = document.getElementById("card1")
    let userCard2 = document.getElementById("card2")
    let userCard3 = document.getElementById("card3")
    let userCard4 = document.getElementById("card4")
    let userCard5 = document.getElementById("card5")
    let houseCard1 = document.getElementById("house-card1")
    let houseCard2 = document.getElementById("house-card2")
    let houseCard3 = document.getElementById("house-card3")
    let houseCard4 = document.getElementById("house-card4")
    let houseCard5 = document.getElementById("house-card5")
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

function drawUserCard(drawCount) {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            myCards.push(data.cards[0].value)
            console.log(drawCount)
            addUserCard(data.cards[0].image, drawCount)
            theDrawHandler(drawCount, userCountHigh, userCountLow, houseCountHigh, houseCountLow)
        })
        .catch(e => console.log(e))
}

function drawHouseCard(drawCount) {
    fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
        .then(res => res.json())
        .then(data => {
            houseCards.push(data.cards[0].value)
            addHouseCard(data.cards[0].image, drawCount)
            // theDrawHandler()
        })
        .catch(e => console.log(e))
}

function Draw(drawCount, userCountHigh, userCountLow, houseCountHigh, houseCountLow) {
    //FIRST DRAW
    if (drawCount === 0) {
        //FETCH HOUSE FIRST 2 CARDS
        drawCount += 1
        drawHouseCard(drawCount, userCountHigh, userCountLow, houseCountHigh, houseCountLow)
        drawCount = 2
        drawHouseCard(drawCount, userCountHigh, userCountLow, houseCountHigh, houseCountLow)
        //FETCH USERS FIRST 2 CARDS
        drawCount = 1
        drawUserCard(drawCount)
        drawCount = 2
        drawUserCard(drawCount)
        console.log(userCountHigh)
        console.log(userCountLow)
        console.log(houseCountHigh)
        console.log(houseCountLow)
        // console.log(myCards)
            //IN BETWEEN DRAWS
    } else if (drawCount > 0 && drawCount < 5) {
        drawCount += 1
        drawUserCard(drawCount)
        //NEW GAME START WITH 2 CARDS
    } else {
        //RESET STATE
        drawCount = 0
        console.log(drawCount)
        myCards = []
        userCountHigh = 0
        userCountLow = 0
        gameOver = false
        message.innerText = "Big Money Big Money Big Money"
        myButton.innerText = "Hit Me"
        //REMOVE THE PREVIOUS GAME'S CARDS
        removeCards()
        //RETURN CARDS TO DECK AND SHUFFLE
        shuffleDeck()
        //FETCH USER FIRST 2 CARDS
        drawCount = 1
        drawUserCard()
        drawCount = 2
        drawUserCard(drawCount)
        // FETCH HOUSE FIRST 2 CARDS
        drawCount = 1
        drawHouseCard()
        drawCount = 2
        drawHouseCard(drawCount)
    }
}

const getYourDeck = () => {
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
                data.cards.map(obj => myCards.push(obj.value))
                drawCount = 1
                addUserCard(data.cards[0].image)
                drawCount = 2
                addUserCard(data.cards[1].image)
                // theDrawHandler()
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
    }
}
getYourDeck()


//ALL THESE FUNCTIONS WERE COMBINED INTO 
// function addUpHigh() {
//     console.log(myCards)
//     const userCardsValueArray = myCards.map(card => cardValues[card])
//     userCountHigh = userCardsValueArray.reduce((acc, num) => acc + num)
//     console.log(userCountHigh)
// }

// function addUpLow() {
//     console.log(myCards)
//     const userCardsValueArray = myCards.map(card => {
//         if (card === "ACE") {
//             return 1
//         } else return cardValues[card]
//     })
//     userCountLow = userCardsValueArray.reduce((acc, num) => acc + num)
//     console.log(userCountLow)
// }

// const handleSum = () => {
//     if (userCountHigh === 21 || userCountLow == 21) {
//         sumDisplay.innerText = `Sum: ${userCountLow}`
//     } else if (userCountHigh > 21 && userCountLow < 21) {
//         sumDisplay.innerText = `Sum: ${userCountLow}`
//     } else if (userCountHigh === userCountLow) {
//         sumDisplay.innerText = `Sum: ${userCountHigh}`
//     } else if (userCountLow > 21) {
//         sumDisplay.innerText = `Sum: ${userCountLow}`
//     } else {
//         sumDisplay.innerText = `Sum: High - ${userCountHigh}, Low - ${userCountLow}`
//     }
// }

// const checkStatus = () => {
//     if (userCountHigh === 21 || userCountLow === 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//         drawCount = 5
//     } else if (drawCount === 5 && userCountLow < 21) {
//         message.innerText = "YOU WIN!"
//         myButton.innerText = "Run It Back"
//     } else if (userCountLow > 21) {
//         message.innerText = "YOU LOSER!"
//         myButton.innerText = "Try Again"
//         drawCount = 5
//     } else {
//         message.innerText = "Want another card?"
//     }
// }