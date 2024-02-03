//#Variables Declaration Region
const prepare = {};
prepare.cards = [];
prepare.progress = 0;
prepare.fullTrack = new Audio('./assets/audio/fulltrack.mp3');
prepare.flipAudio = new Audio('./assets/audio/flip.mp3');
prepare.goodAudio = new Audio('./assets/audio/good.mp3');
prepare.failAudio = new Audio('./assets/audio/fail.mp3');
prepare.winAudio = new Audio('./assets/audio/win.mp3');
prepare.fullTrack.loop = true;
const numberOfCards = 24;
const tempNumbers = [];
let cardsHtmlContent = '';
//#Functions Declaration Region 
//Return a Unique Random Number
const getRandomInt = (min, max) => {
    let result;
    let exists = true;
    min = Math.ceil(min);
    max = Math.floor(max);
    while (exists) {
        result = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!tempNumbers.find(no => no === result.toString())) {
            exists = false;
            tempNumbers.push(result.toString());
        }
    }
    return result;
};
//Toggle Flip and Select Card and playFullTrack
const toggleFlip = (index) => {
    prepare.fullTrack.play();
    const card = prepare.cards[index];
    if (!card.flip && card.clickable) {
        flip(card, index);
        selectCard(card, index);
    }
};
//Flip Card
const flip = (card, index) => {
    prepare.flipAudio.play();
    if (card) {
        card.flip = card.flip === '' ? 'flip' : '';
        document.getElementById(`card-flip-${index}`).classList.value = card.flip;
    }
};
//handle the selection logic and flip
const selectCard = (card, index) => {
    if (!prepare.selectedCard_1) {
        prepare.selectedCard_1 = card;
        prepare.selectedIndex_1 = index;
    }
    else if (!prepare.selectedCard_2) {
        prepare.selectedCard_2 = card;
        prepare.selectedIndex_2 = index;
    }
    if (prepare.selectedCard_1 && prepare.selectedCard_2) {
        if (prepare.selectedCard_1.src === prepare.selectedCard_2.src) {
            prepare.selectedCard_1.clickable = false;
            prepare.selectedCard_2.clickable = false;
            prepare.selectedCard_1 = null;
            prepare.selectedCard_2 = null;
            stopAudio(prepare.failAudio);
            stopAudio(prepare.goodAudio);
            prepare.goodAudio.play();
            changeProgress();
            checkFinish();
        }
        else {
            setTimeout(() => {
                stopAudio(prepare.failAudio);
                stopAudio(prepare.goodAudio);
                prepare.failAudio.play();
                flip(prepare.selectedCard_1, prepare.selectedIndex_1);
                flip(prepare.selectedCard_2, prepare.selectedIndex_2);
                prepare.selectedCard_1 = null;
                prepare.selectedCard_2 = null;
            }, 1000);
        }
    }
};
//Update the progress bar element in the document 
const changeProgress = () => {
    const progress = (prepare.cards.filter(card => !card.clickable).length / numberOfCards * 100).toFixed(2);
    const progressElement = document.getElementById('progress');
    progressElement.style.width = `${progress}%`;
    progressElement.innerText = `${progress}%`;
};
//Checks if all the cards are not clickable and end the Game
const checkFinish = () => {
    if (prepare.cards.filter(card => !card.clickable).length === numberOfCards) {
        stopAudio(prepare.fullTrack);
        stopAudio(prepare.failAudio);
        stopAudio(prepare.goodAudio);
        prepare.winAudio.play();
    }
};
//stop Audio from playing
const stopAudio = (audio) => {
    if (audio && audio.played) {
        audio.pause();
        audio.currentTime = 0;
    }
};
//#Game Logic Region
//creates an array of card objects 
for (let index = 0; index < numberOfCards / 2; index++) {
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}.jpg`,
        flip: '',
        clickable: true,
        index
    });
    prepare.cards.push({
        id: getRandomInt(0, numberOfCards),
        src: `./assets/images/${index}.jpg`,
        flip: '',
        clickable: true,
        index
    });
}
prepare.cards.sort((a, b) => a.id > b.id ? 1 : -1);
//Generates HTML content for each item
prepare.cards.forEach((item, index) => {
    cardsHtmlContent += `
    <span class="col-sm-3 col-lg-2">
        <!-- Card Flip -->
        <div onclick="toggleFlip(${index})" class="card-flip">
            <div id="card-flip-${index}">
                <div class="front">
                    <!-- front content -->
                    <div class="card">
                        <img class="card-image" src="./assets/back.jpg" alt="Loading..." loading="lazy">
                        <span class="card-content">${index + 1}</span>
                    </div>
                </div>
                <div class="back">
                    <!-- back content -->
                    <div class="card">
                        <img src="./assets/images/${item.index}.jpg" alt="Image [100%x180]" data-holder-rendered="true"
                            style="height: 120px; width: 100%; display: block;">
                    </div>
                </div>
            </div>
        </div>
        <!-- End Card Flip -->
    </span>
    `;
});
document.getElementById('cards').innerHTML = cardsHtmlContent;
