import LumButton from "./components/lum-button.js";

const componentRegistry = {
  "lum-button": LumButton
};

function registerComponent(tagName, componentClass) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, componentClass);
  }
}

function registerAllComponents() {
  Object.entries(componentRegistry).forEach(([tagName, componentClass]) => {
    registerComponent(tagName, componentClass);
  });
}

export { LumButton, registerAllComponents, registerComponent };
