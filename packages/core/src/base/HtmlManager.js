import { Event } from "../utils/Event.js";

export class HtmlManager {
  constructor(world, canvasElement) {
    this.world = world;
    this.canvasElement = canvasElement;
    this.width = 0;
    this.height = 0;
    this.isResized = false;

    this.blurEvent = new Event();
    this.focusEvent = new Event();
    this.resizedEvent = new Event();

    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);

    this.init();
  }
  init() {
    window.addEventListener("blur", this._onBlur);
    window.addEventListener("focus", this._onFocus);

  }
  destroy() {
    window.removeEventListener("blur", this._onBlur);
    window.removeEventListener("focus", this._onFocus);
  }
  update() {
    this.isResized = false;

    const element = this.canvasElement;
    let width = element.clientWidth;
    let height = element.clientHeight;
    if (this.width !== width || this.height !== height) {
      this.isResized = true;
      this.width = element.width = width;
      this.height = element.height = height;
      this.resizedEvent.pub(width, height);
    }

  }

  _onBlur() {
    this.blurEvent.pub();
  }
  _onFocus() {
    this.focusEvent.pub();
  }
}
