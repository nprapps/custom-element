class CustomElement extends HTMLElement {
  constructor() {
    super();
    var def = new.target;

    this.elements = {};

    // create a shadow root and get tagged element references
    if (def.template) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = def.template;
      this.shadowRoot.querySelectorAll(`[as]`).forEach(el => {
        var name = el.getAttribute("as");
        this.elements[name] = el;
      });
    }

    // bind class methods
    if (def.boundMethods) {
      for (var f of def.boundMethods) {
        this[f] = this[f].bind(this);
      }
    }

    // add getters/setters for mirrored props
    if (def.mirroredProps) {
      def.mirroredProps.forEach(f => {
        Object.defineProperty(this, f, {
          get() {
            return this.getAttribute(f);
          },

          set(v) {
            return this.setAttribute(f, v);
          }
        })
      });
    }
  }
  
  broadcast(event, detail = {}) {
    var e = new CustomEvent(event, { bubbles: true, composed: true, detail });
    this.dispatchEvent(e);
  }

  static define(tag) {
    try {
      window.customElements.define(tag, this);
    } catch (err) {
      console.log(`Unable to (re)define ${tag} for this window - does it already exist?`);
    }
  }

}

export default CustomElement;