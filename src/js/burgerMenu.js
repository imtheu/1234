const burgerMenu = document.getElementById("burgerMenu");
const burgerMenuButton = document.getElementById("burgerMenu-button");
const backdrop = document.getElementById("backdrop");

const initialize = () => {
  burgerMenuButton.addEventListener("click", () => {
    if (burgerMenu.open) {
      burgerMenu.close();
    } else {
      burgerMenu.show();
    }
  });

  backdrop.addEventListener("click", () => burgerMenu.close());
};

export default { initialize };
