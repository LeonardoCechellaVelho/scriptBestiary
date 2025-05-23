const observerCallback = () => {
  setTimeout(() => console.log("Mutation"), 3000);
  try {
    if (button) {
        errorStart();
        handleStart();
        handleEndbattle();
        handleStamina();
    }
  } catch (error) {
    console.error("⚠️ Error in observer:", error);
    observer.disconnect();
  }
};

const { button, observer } = handleStartObserver();
const rarityWanted = 5;
const creatureWanted = "Frost Troll";
var hasPotions = true;

// Seta velocidade global do jogo mais rápida
globalThis.state.board.on('newGame', (event) => {
    event.world.tickEngine.setTickInterval(31.25) 
})

function handleStartObserver() {
  const observer = new MutationObserver(observerCallback);

  const button = Array.from(document.querySelectorAll("button"))
    .find(btn => btn.textContent.trim() === "Selecionar mapa");

  if (button) {
    observer.observe(button, {
      childList: true,
      subtree: true,
      attributes: true
    });

    setInterval(() => {
      console.log("🔄 Manually triggering observer...");
      observerCallback();
    }, 10000);
  }
  return { button, observer };
}

const stamina = [...document.querySelectorAll("p")].find(
  (div) => div.textContent.trim() === "Loja"
);

function handleStamina() {
  const stamina = [...document.querySelectorAll("button")].find(
    (div) => div.textContent.trim() === "stamina"
  );

  setTimeout(() => {
    const usePotion = [...document.querySelectorAll("button")].find(
      (div) => div.textContent.includes("Usar poção")
    );

    if (usePotion) {
      const potionContainer = usePotion.closest('div');
      const mainContainer = potionContainer.closest('.justify-end');;
      const closeButton = [...mainContainer.querySelectorAll("button")].find(
        (btn) => btn.textContent.trim() === "Fechar"
      );

      if (closeButton) {
        closeButton.click();
      }
    }
    if (stamina && hasPotions) {
      stamina.click();
      if (usePotion) {
        usePotion.click();
      } else {
        const loja = [...document.querySelectorAll("p")].find(
          (div) => div.textContent.trim() === "Loja"
        );

        if (loja) {
          hasPotions = false;
          const lojaContainer = loja.closest('div');
          const closeButton = [...lojaContainer.querySelectorAll("button")].find(
            (btn) => btn.textContent.trim() === "Fechar"
          );

          if (closeButton) {
            closeButton.click();
          }
        }
      }
    }
  }, 3000);
}

function handleStart() {
  setTimeout(() => {
    const button = [...document.querySelectorAll("button")].find(
      (btn) => btn.textContent.trim() === "Iniciar"
    );

    if (button && !button.disabled) {
      button.click();
      return;
    }
  }, 3000);
}

function errorStart() {
  const errorStart = [...document.querySelectorAll("div")].find(
    (div) => div.textContent.trim() === "Battle still ongoing"
  );

  if (errorStart) {
    setTimeout(() => {
      observer.takeRecords();
      console.log("Battle stil ongoing");
    }, 30000);
  }
}

function handleEndbattle() {
  const victorySection = [...document.querySelectorAll("span")].find(
    (el) => el.textContent.trim().includes("Vitória")
  );

  if (victorySection) {
    const mainContainer = victorySection.closest('div');
    const creature = [...mainContainer.querySelectorAll("div")].find(
      (el) => el.textContent.trim() === "Drop de criatura"
    ).parentElement;
    const rarityDiv = creature?.querySelector('div.has-rarity[data-rarity]');
    const creatureName = [...creature?.querySelectorAll("span")].find(
      (el) => el.textContent.trim() === creatureWanted
    )

    if (!creatureName && creature) {
      var rarity = 0;
      if (rarityDiv) {
        rarity = parseInt(rarityDiv.getAttribute('data-rarity'), 10);
        console.log('Found rarity:', rarity);
      }

      if (rarity < rarityWanted) {
        const sellButton = [...document.querySelectorAll("button")].find(
          (btn) => btn.textContent.trim() === "Vender"
        );
        if (sellButton) {
          hasPotions = true;
          sellButton.click();
          console.log("💰 Clicked 'Vender'");
        }
      }
    }
    
    const closeButton = [...mainContainer.querySelectorAll("button")].find(
      (btn) => btn.textContent.trim() === "Fechar"
    );

    setTimeout(() => {
      closeButton.click();
      console.log("🛑 Clicked 'Fechar'");
    }, 3000);
  } else {
    const defeatSection = [...document.querySelectorAll("span")].find(
      (el) => el.textContent.trim().includes("Derrota")
    );

    if (defeatSection) {
      const mainContainer = defeatSection.closest('div');

      const closeButton = [...mainContainer.querySelectorAll("button")].find(
        (btn) => btn.textContent.trim() === "Fechar"
      );

      setTimeout(() => {
        closeButton.click();
        console.log("🛑 Clicked 'Fechar'");
      }, 2000);
    }
  }
}
