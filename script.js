// Bentuk Struktur
function root(){
 document.getElementById('root').innerHTML = `<div class="start">
        <h1 class="main-title">MineQuiz</h1>
        <div class="getnama">
            <p>Enter Your Name</p>
            <input type="text" id="inputNama" maxlength="8">
            <button id="main-button" onclick="ambilInformasi()">Start</button>
        </div>
    </div>
    <section id="section">

    <div class="container" id="container">
        <header>
            <h1>MineQuiz</h1>
            <div class="countdown">
                <p>Time Left:</p>
                <span id="stopwatch"></span>
            </div>
        </header>
        <div id="page"></div>
        <footer>
            <div class="countdown">
                <p>Time Left:</p>
                <span id="stopwatch"></span>
            </div>
            <button id="submit">
                submit
            </button>
        </footer>
        
        <div class="confirm"></div>
        </div>
        <div class="final"></div>
        <div class="side">
    <section class="side-page">
        <div class="score"></div>
        <div class="assign"></div>
        <div class="mobile-info">
            <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path></svg>
            </span>
        </div>
    </section>
</div>
</section>`
}

root()

// Fungsi toggle mobile Pada Mobile VIew
let mobileInfoToggle = document.querySelector('.mobile-info');
let sidePage = document.querySelector('.side-page');

mobileInfoToggle.addEventListener('click', function(){
    mobileInfoToggle.classList.toggle('clicked');
    sidePage.classList.toggle('active');
})

// Eksekusi Logika Quiz
let startWindow = document.querySelector(".start");
let mainbutton = document.getElementById("main-button");

let score =  0;
let nama =  '';

// Mengaktifkan Pengisian Input Nama
document.querySelector(".getNama input").addEventListener('click', function(event){
    tombolEnter()
})

//Ketika User Menekean Tombol Enter Pada Keyboard
function tombolEnter(){
    document.addEventListener('keyup', function(e){
        if(e.keyCode === 13){
            ambilInformasi()
        }
    })
}


// Fungsi Peringatan Agar Input Nama Tidak Boleh Kosong
function notEmpty(inputNama, inputValue, getNama, startWindow) {
    var input = inputValue.trim();
    var regex = /^[a-zA-Z]+$/;

    if (input === "") {
        inputNama.placeholder= "Please Enter Your Name!";
        return false;
    } else if (!regex.test(input)) {
        inputNama.value = ""
        inputNama.placeholder= "Input should contain Letters Only!";
        return false;
    }

    getNama.style.display = "none";
    startWindow.style.display = "none";
    start();

    return true;
}


// Kumpulkan Informasi dari input
function ambilInformasi(){
    let inputNama = document.querySelector(".getnama input");
    let inputValue = inputNama.value;
    let getNama = document.querySelector(".getnama");
    notEmpty(inputNama, inputValue, getNama, startWindow)
    nama = inputNama.value.toLowerCase();

    
   let quizScore = function(){
        let date = new Date();
        let scoreCard = `        <div class="score-content">
                <h3>Name : ${nama}</h3>
                <h1>Score : ${score}</h1>
            </div>`;

            document.querySelector(".score").innerHTML = scoreCard;

    }
    setInterval(quizScore, 100)
    
}

// Mulai Quiz
function start(){

let section = document.getElementById("section");
section.style.display = "grid";

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        let cards = '';
        data.forEach((e, index) => {
            let answers = ''
            let datajawaban = e.answer;
            datajawaban.forEach((m,i) => {
                answers += `<button id="button-${index}-${i}">${m.option}</button>`;
            })       
            
            cards += `<div class="quiz-section">
                <div class="question">
                    <p>${index + 1}.</p>
                    <span>${e.question}</span>
                </div>
                <div class="answer">
                ${answers}
                </div>
            </div>`
        });
        document.getElementById("page").innerHTML = cards;

        
                let assignBox = '';
               data.forEach((m, i) => {
                let assignPage  = document.querySelector('.assign');
                assignBox += `<div class="assign-box"><p>${i + 1}</p></div>`;
                assignPage.innerHTML = assignBox; 
               }) 
               
               let benar = false;
               let hitung = 0;
               let assignBoxP = document.querySelectorAll('.assign-box');
               let finalAnswer = 0;
        data.forEach((e, index) => {
            let buttonClick = 2;
            e.answer.forEach((m, i) => {
            let option = m.option;
            let hasil = m.correct;
            const button = document.getElementById(`button-${index}-${i}`);
            button.addEventListener('click', function(e, indeks){

                // soal[index].style.color = 'red';
                buttonClick--;
                if(buttonClick >= 1){
                    const opsiUser = button.textContent;
                    // cekJawaban(hasil, opsiUser, option, button);            
                    function cekJawaban(){
                        if(hasil && opsiUser === option){
                            button.classList.add("correct");
                            assignBoxP[index].classList.add('assign-correct');
                            score += 5;
                        } else {
                            button.classList.add("incorrect")
                            assignBoxP[index].classList.add("assign-incorrect")
                        }
                     }
                     if(!final){
                        cekJawaban()
                     } 

                    //  Ketika Jawaban Sudah Terjawab semua
                     finalAnswer++;
                    if(finalAnswer == data.length){
                        finalAnswer = 0;
                        if(final == true){
                            return;
                        } else {
                            finalAll();
                            return;
                        }
                    }
                }
                unAnswered = data.length - finalAnswer;
                })   
            })
        })
    })

    let unAnswered = 20;


    let submitButton = document.getElementById("submit");
    submitButton.addEventListener('click', function(){
        confirm();
    });

    let confirmSection = document.querySelector('.confirm');
    let confirmCard = '';
    function confirm(){
        confirmSection.style.display = 'flex';
        confirmCard = `<div class="confirm-content">
                <p class="confirm-question">You have <span>${unAnswered}</span> unanswered questions</p>
                <p class="confirmation">Are you sure to submit immediately?</p>

                <div class="confirm-button">
                    <input type="button" id="yes" value="Yes">
                    <input type="button" id="no" value="No">
                </div>
            </div>`;
            confirmSection.innerHTML = confirmCard;
            let yesButton = document.getElementById('yes');
            let noButton = document.getElementById('no');
            yesButton.addEventListener('click', confirmButton);
            noButton.addEventListener('click', confirmButton);
    }

// Fungsi Untuk Mengambil Konfirmasi saat submit   
    function confirmButton(e){
        let event = e.target.value;
        if(event == "Yes"){
            confirmSection.style.display = 'none';
            finalAll();
        } else {
            confirmSection.style.display = 'none';
        }
    }

    

// Popup Final
let final = false;
function finalAll(){
    mobileInfoToggle.classList.remove('clicked');
    sidePage.classList.remove('active');
    submitButton.disabled = true;
    final = true;
    menit = 0;
    detik = 1;
    submitted()
}

let grade = ''
let note = ''
function grades(score){
    if(score > 80){
        grade = 'A';
        note = `Congratulations ${nama} Keep up the excellent work!`;
    } else if (score > 65 && score <= 80 ){
        grade = 'B';
        note = `Good job ${nama}, Keep striving for excellence!`;
    } else if (score > 50 && score <= 65){
        grade = 'C';
        note = `Nice work ${nama}, Keep improving!`;
    } else {
        grade = 'D';
        note = `Keep going ${nama}, work harder next time!`;
    }
}


let finalPage = document.querySelector('.final');
let finalContent = '';
function submitted(){
    
    finalPage.style.display = 'flex';
    grades(score);
    finalContent = `<div class="final-content">
                <div class="final-confirm">
                <p>Score: <span>${score}</span> </p>
                <p>Grade: <span>${grade}</span></p>
            </div>
                <p class="note">Note: <br> </p><span class="span-note">${note}</span>
                <button class="final-button">Close</button>
            </div>
        </div>`;

    finalPage.innerHTML = finalContent;


    let finalButton = document.querySelector('.final-button');
finalButton.addEventListener('click', function(){
    finalPage.style.display = 'none';
})
}


                
// Countdown Berhenti saat waktu Habis
function stopCount(m, d, stopwatchs){
    if(m == 0){
        if(d == 0){
            clearInterval(stopwatchs);
            if(final == true){
                return;
            } else {
                finalAll()
            }
        }
    }
}


// Countdown
let menit = 5;
let detik = 0;
function countdownTimer(){
let menitString;
let detikString =''

let countdown = function hitungMundur(){
    
    if(detik < 1){
        if(menit >= 1){
            menit--;
            menitString = menit;
            detik = 59;
        } else {
            detik--;
        }
        
    } else {
        detik--;
    }

    detikString = detik;
    if(menit < 10){
        menitString = '0' + menit;
    }
    if(detik < 10){
        detikString = '0' + detik;
    }


    stopCount(menit, detik, stopwatchs);

    let stopwatch = document.querySelectorAll("#stopwatch");
    stopwatch.forEach((m, i) => {
            m.innerHTML = `${menitString} : ${detikString}`
    })
}

let stopwatchs = setInterval(countdown, 1000);
}

    
countdownTimer()
}


