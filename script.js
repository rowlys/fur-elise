threatTextSize = 24;
let rejectionCount = 0;

let images = [];

let pleads = [
    "plis",
    "i beg you",
    "im on my knees",
    "love, cmon",
    "do you not love me",
    "WHY",
    "im gonna cry",
    "lisssssssss",
    "is it my fault",
    "meanie",
    ":(",
    "darling",
    "syg ayolah",
    "r u mad :(",
    "but i love you",
    "you dont love me anymore",
    "ill kidnap you",
    "must you break my heart so"
];

document.addEventListener("DOMContentLoaded", () => {
    loadImages();

    const noButton = document.querySelector(".no");
    
    const yesButton = document.querySelector(".yes");
    
    noButton.addEventListener("click", moveButton);
    
    yesButton.addEventListener("mouseover", () => {
        spawnHearts();
        heartSpawnInterval = setInterval(spawnHearts, 400);
    });
    
    yesButton.addEventListener("mouseleave", () => {
        clearInterval(heartSpawnInterval);
    });
    
    yesButton.addEventListener("click", yesTransition);
    
    function moveButton(){
        const x = (Math.random()*2 - 1) * (window.innerWidth/2 - noButton.clientWidth);
        const y = (Math.random()*2 - 1) * (window.innerHeight/2 - noButton.clientHeight);
        
        if (x < 0){
            x = 0;
        }
        noButton.style.position = "absolute";
        noButton.style.left = x + "px"
        noButton.style.top = y + "px"
        
        spawnText();
    }
    
    function spawnText(){
        rejectionCount++;
        
        const text = document.createElement("div");
        text.classList.add("paksaan");
        
        if (rejectionCount < 7){
            text.innerText = "HARUS MAU >:(";
        }
        else {
            const plead = pleads[Math.floor(Math.random() * pleads.length)];
            text.innerText = plead;
        }
        
        text.style.fontWeight = "bold";
        text.style.fontSize = threatTextSize + "px"
        
        document.body.appendChild(text);
        
        const x = Math.random() * (window.innerWidth -  text.clientWidth);
        const y = Math.random() * (window.innerHeight -  text.clientHeight);
        
        text.style.position = "absolute";
        text.style.left = x + "px";
        text.style.top = y + "px";

        setTimeout(() => text.classList.add("fadeOut"), 10000);
        
        threatTextSize = Math.min(threatTextSize + 12, 100);
    }
    
    function spawnHearts(){
        for (let i = 0; i < 3; i++){
            const heart = document.createElement("div");
            heart.innerText = "❤️";
            heart.classList.add("heart");
            
            const x = (Math.random() - 0.5) * 50;
            const y = (Math.random() - 0.5) * 50;
            
            const rect = yesButton.getBoundingClientRect();
            
            document.body.appendChild(heart);
            
            heart.style.left = (rect.left + rect.width/2 + x - heart.clientWidth/2) + "px";
            heart.style.top = (rect.top + rect.height/2 + y - heart.clientHeight) + "px";
            
            setTimeout(() => {
                heart.remove();
            }, 2000);
            
        }
    }
    
    async function yesTransition(){
        document.body.classList.add("fadeOut");
        
        const messageText = await loadMessage();
        
        setTimeout(() => {
            document.body.innerHTML = "";
            document.body.classList.remove("fadeOut");
            
            
            const message = document.createElement("div");
            message.innerText = messageText;
            
            message.style.opacity = "0";
            message.classList.add("container");
            message.classList.add("message");
            message.classList.add("fadeIn");
            
            document.body.appendChild(message);
            
            eliseSpawnInterval = setInterval(spawnElise, 500);
        }, 3000);
        
        clearInterval(heartSpawnInterval);
        
    }
    
    function spawnElise(){
        const img = document.createElement("img");
        
        img.src = images[Math.floor(Math.random() * images.length)];
        
        img.style.position = "absolute";
        img.style.visibility = "hidden";
        
        document.body.appendChild(img);
        
        img.onload = function() {
            const fromLeft = Math.random() > 0.5;
            
            img.style.left = fromLeft ? -img.clientWidth + "px" : window.innerWidth + "px";
            img.style.top = Math.random() * (window.innerHeight - img.clientHeight) + "px";
            
            img.style.visibility = "visible";
            
            const random = Math.random() * 5000;
            
            img.animate([
                { transform: `translateX(${fromLeft ? "130vw" : "-130vw"})` }
            ], {
                duration: 7000 + random,
                easing: "linear",
                iterations: 1
            });
            
            setTimeout(() => {
                img.remove();
            }, 7000 + random);
        };
        
    }

    async function loadImages() {
        try {
            const response = await fetch("pictures.txt");
            const text = await response.text();
    
            const decodedText = text.replace(/\x00/g, "");
            images = decodedText.split("\n").map(line => line.trim()).filter(line => line !== ""); 
    
            console.log("Images loaded:", images); 
        } catch (error) {
            console.error("Error loading images:", error);
        }
    }
    
    async function loadMessage() {
        try {
            const response = await fetch("meToYou.txt");
            const text = await response.text();
    
            console.log("Message loaded:", text); 
            return text;
        } catch (error) {
            console.error("Error loading message:", error);
            return "Error loading message.";
        }
    }
});