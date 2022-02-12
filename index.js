const myButton = document.getElementById('button')
const firstCard = document.getElementById("card1")
const secondCard = document.getElementById("card2")
const thirdCard = document.getElementById("card3")
const fourthCard = document.getElementById("card4")
const fifthCard = document.getElementById("card5")
let currentDeck = ''
let myStorage = window.localStorage
let drawCount = 0

const setCard = (card, url) => {
    card.src = url
    card.style.zIndex = 2
    card.style.visibility = "visible"
}

const resetCard = (card) => {
    card.src = ''
    card.style.zIndex = -1
    card.style.visibility = "hidden"
}

const getYourDeck = () => {
    if (myStorage.deckId) {
        currentDeck = myStorage.getItem('deckId')
        console.log(currentDeck)
    } else {
        fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2")
            .then(res => res.json())
            .then(data => {
                console.log(data)
                myStorage.setItem('deckId', data.deck_id)
                console.log(myStorage)
                setCard(firstCard, data.cards[0].image)
                setCard(secondCard, data.cards[1].image)
                currentDeck = data.deck_id
                drawCount = 2
            })
            .catch(e => console.log(e))
    }
}

getYourDeck()

function Draw() {
    if (drawCount === 0) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                myStorage.setItem('deckId', data.deck_id)
                setCard(firstCard, data.cards[0].image)
                setCard(secondCard, data.cards[1].image)
                drawCount += 2
                currentDeck = data.deck_id
            })
            .catch(e => console.log(e))
    } else if (drawCount === 4) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                const currentCard = document.getElementById(`card${drawCount + 1}`)
                setCard(currentCard, data.cards[0].image)
                drawCount += 1
                myButton.innerText = "New Game"
            })
            .catch(e => console.log(e))
    } else if (drawCount > 0 && drawCount < 4) {
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=1`)
            .then(res => res.json())
            .then(data => {
                const currentCard = document.getElementById(`card${drawCount + 1}`)
                setCard(currentCard, data.cards[0].image)
                drawCount += 1
            })
            .catch(e => console.log(e))
    } else {
        drawCount = 0
        resetCard(thirdCard)
        resetCard(fourthCard)
        resetCard(fifthCard)
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/shuffle/`)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log(e))
        fetch(`https://deckofcardsapi.com/api/deck/${currentDeck}/draw/?count=2`)
            .then(res => res.json())
            .then(data => {
                setCard(firstCard, data.cards[0].image)
                setCard(secondCard, data.cards[1].image)
                drawCount = 2
                myButton.innerText = "Draw"
            })
            .catch(e => console.log(e))
    }
}



// if (sum <= 20) {
//     console.log("Want to draw another card? 🙂")
// } else if (sum === 21) {
//     console.log("Blackjack! 🥳")
// } else {
//     console.log("Busted! 😭")
// }