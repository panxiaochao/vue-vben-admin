class GlobalShareState {
  #components = {};
  #message = {};
  defineMessage({ copyPreferencesSuccess }) {
    this.#message = {
      copyPreferencesSuccess,
    };
  }
  getComponents() {
    return this.#components;
  }
  getMessage() {
    return this.#message;
  }
  setComponents(value) {
    this.#components = value;
  }
}
export const globalShareState = new GlobalShareState();
