const gameData = {
    steps: [
      {
        title: "Prepare the Meat",
        description: "Drag the meat into the center area to begin cooking.",
        image: "../assets/images/step1-meat.jpg",
        ingredients: ["meat"],
        completed: false
      },
      {
        title: "Boil the Broth",
        description: "Place the meat, pour 3 L of water, add 1 TBSP of salt. Turn the heat on and bring the water to a slight boil.",
        image: "../assets/images/step2-boiling.jpg",
        ingredients: ["meat", "water", "salt"],
        completed: false
      },
      {
        title: "Knead the Dough",
        description: "Place warm water, 1/2 TBSP of salt and egg. Give all the ingredients a stir with a fork. Start adding the flour, 1 cup at a time. The dough should not be too hard and not too soft, as to stick to your hands",
        image: "../assets/images/step3-dough.jpg",
        ingredients: ["water", "salt", "egg", "flour"],
        completed: false
      },
      {
        title: "Cut the Noodles",
        description: "Add cut noodles into the center.",
        image: "../assets/images/step4-noodles.jpg",
        ingredients: ["noodles"],
        completed: false
      },
      {
        title: "Serve with Love",
        description: "Drag meat, noodles, onion and herbs to the plate.",
        image: "../assets/images/step5-plating.jpg",
        ingredients: ["meat", "noodles", "onion", "herbs"],
        completed: false
      }
    ],
    currentStep: 0
  };
  
  const INGREDIENT_IMAGES = {
    meat: "../assets/images/meat.svg",
    onion: "../assets/images/onion.svg",
    salt: "../assets/images/salt.svg",
    garlic: "assets/images/garlic.svg",
    flour: "../assets/images/flour.svg",
    water: "../assets/images/water.svg",
    egg: "../assets/images/egg.svg",
    herbs: "../assets/images/herbs.svg",
    noodles: "../assets/images/noodles.svg"
  };

  let gameElements = {};
  
  document.addEventListener("DOMContentLoaded", function () {
    gameElements = {
      startBtn: document.getElementById("start-btn"),
      nextBtn: document.getElementById("next-btn"),
      restartBtn: document.getElementById("again-btn"),
      welcomeScreen: document.getElementById("welcome-screen"),
      gameScreen: document.getElementById("game-screen"),
      successScreen: document.getElementById("success-screen"),
      stepTitle: document.getElementById("step-title"),
      stepDescription: document.getElementById("step-description"),
      progressBar: document.querySelector(".progress-fill"),
      ingredientsPanel: document.getElementById("ingredients"),
      dropArea: document.getElementById("drop-area")
    };
  
    gameElements.startBtn.addEventListener("click", startGame);
    gameElements.nextBtn.addEventListener("click", nextStep);
    gameElements.restartBtn.addEventListener("click", resetGame);
  });
  
  function startGame() {
    gameElements.welcomeScreen.classList.add("hidden");
    gameElements.gameScreen.classList.remove("hidden");
    showStep(0);
  }
  
  function showStep(stepIndex) {
    const step = gameData.steps[stepIndex];
    gameElements.stepTitle.textContent = step.title;
    gameElements.stepDescription.textContent = step.description;
    gameElements.dropArea.style.backgroundImage = "none";
    gameElements.dropArea.innerHTML = "Drop ingredients here";
    gameElements.nextBtn.disabled = true;
  
    loadIngredients(step.ingredients);
    updateProgressBar(stepIndex);
  
    setupDropZone(step.ingredients);
  }
  
  function loadIngredients(needed) {
    gameElements.ingredientsPanel.innerHTML = "";
  
    let allIngredients = Array.from(new Set(needed));

  
    allIngredients.forEach((ingredient) => {
      const img = document.createElement("img");
      img.src = INGREDIENT_IMAGES[ingredient];
      img.alt = ingredient;
      img.draggable = true;
      img.dataset.ingredient = ingredient;
      img.addEventListener("dragstart", dragStart);
      gameElements.ingredientsPanel.appendChild(img);
    });
  }
  
  
  function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.ingredient);
  }
  
  function setupDropZone(validIngredients) {
    const dropped = new Set();
  
    gameElements.dropArea.ondragover = (e) => {
      e.preventDefault();
    };
  
    gameElements.dropArea.ondrop = (e) => {
      e.preventDefault();
      const ingredient = e.dataTransfer.getData("text/plain");
  
      if (validIngredients.includes(ingredient) && !dropped.has(ingredient)) {
        gameElements.dropArea.innerHTML = "";
        dropped.add(ingredient);
  
        const img = document.createElement("img");
        img.src = INGREDIENT_IMAGES[ingredient];
      
        gameElements.dropArea.appendChild(img);
      }
  
      if (dropped.size === validIngredients.length) {

        gameElements.dropArea.innerHTML = "";
      
        const stepImage = document.createElement("img");
        stepImage.src = gameData.steps[gameData.currentStep].image;
        stepImage.alt = "Step result";
        stepImage.style.position = "absolute";
        stepImage.style.top = "0";
        stepImage.style.left = "0";
        stepImage.style.width = "100%";
        stepImage.style.height = "100%";
        stepImage.style.objectFit = "cover";
        stepImage.style.borderRadius = "12px";
        stepImage.style.zIndex = "0";

        gameElements.dropArea.appendChild(stepImage);

        completeStep();
      }
      
    };
  }
  
  function completeStep() {
    const currentStepData = gameData.steps[gameData.currentStep];
  
  
    currentStepData.completed = true;
    gameElements.nextBtn.disabled = false;
    gameElements.nextBtn.innerHTML = "";
  }
  
  
  function nextStep() {
    gameData.currentStep++;
    if (gameData.currentStep >= gameData.steps.length) {
      showSuccess();
    } else {
      gameElements.nextBtn.innerHTML = "";
      showStep(gameData.currentStep);
    }
  }
  
  function showSuccess() {
    gameElements.gameScreen.classList.add("hidden");
    gameElements.successScreen.classList.remove("hidden");
  }
  
  function resetGame() {
    gameData.currentStep = 0;
    gameData.steps.forEach((step) => (step.completed = false));
    gameElements.successScreen.classList.add("hidden");
    gameElements.welcomeScreen.classList.remove("hidden");
    gameElements.progressBar.style.width = "0%";
  }
  
  function updateProgressBar(stepIndex) {
    const progress = ((stepIndex + 1) / gameData.steps.length) * 100;
    gameElements.progressBar.style.width = `${progress}%`;
  }
  