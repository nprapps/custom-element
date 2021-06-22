NPR's Custom Element base class
===============================

This is the base class that we've used for multiple projects now, including our 2020 primary election results, Science of Joy, Louder than a Riot, and embedded graphics. It's minimal, and mainly tries to remove sharp edges from the experience of using web components.

Example Usage
-------------

::

    import CustomElement from "@nprapps/custom-element";

    class NPRElement extends CustomElement {
      
      // automatically bind functions to a specific instance
      static boundMethods = ["onClick"];

      // optional template string is used to fill the shadow DOM
      // [as=X] will be available as this.elements.X
      static template = `
        <button as="clicker">
          <slot></slot>
        </button>
      `;

      constructor() {
        super();
        this.elements.clicker.addEventListener("click", this.onClick);
      }

      onClick() {
        console.log(this.message);
      }

      // custom elements must declare any attributes that will trigger a callback
      static observedAttributes = ["message"];

      // mirrored props allow you to get/set the attribute from the property
      static mirroredProps = ["message"];

      attributeChangedCallback(attr, was, value) {
        switch (attr) {
          case "message":
            console.log(value);
            // potentially do something with the attribute
            break;
        }
      }

    }

    // Subclasses of CustomElement can be defined from the class
    NPRElement.define("npr-element");

Static config
-------------

Since the browser's custom element API already uses static class fields for flagging `observed attributes <https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks>`_, this class extends that pattern to some utility functions. All static fields are optional.

``boundMethods`` accepts an array of function names that you want to bind to each individual class instance. This is extremely useful for creating event listeners and callbacks that will always have a predictable ``this`` value, without cluttering up your constructor with a lot of ``this.method = this.method.bind(this)`` nonsense.

``mirroredProps`` accepts an array of attributes that should automatically have getter/setters created for accessing them. Note that since this goes through the attribute interface, all values will be typed as strings. If you need to handle complex data or richer types, you should write your own getter/setter functions.

``template`` allows you to provide an optional string template that will be used to populate the element's shadow DOM. The element will only automatically create a shadow root if this is provided. Within the template, any elements that are tagged with an ``as`` attribute will be added to the lookup object at ``this.elements``. This is useful for performing selective updates and adding event listeners without having to repeatedly query the insides of your own element.

Class Methods
-------------

Most of the value of the base class is in the constructor, controlled by the above static fields, but we also provide a couple of utility methods.

``broadcast(type, detail)`` will dispatch a custom event up the DOM tree, automatically setting ``detail`` with the provided data. Events created this way will bubble automatically and be marked as "composed," meaning that they cross shadow DOM boundaries.

``define(tagName)`` is a static class method that calls ``window.customElements.define()`` for you. It will catch errors from defining the same element multiple times, which is useful when your custom element is used in embedding scripts (and may therefore be invoked multiple times per page).

Building
--------

This project is built using Rollup, which is included in the dev dependencies. By default, it's defined as a standard ES module, with ``custom-element.umd.js`` providing a compatible wrapper for other module systems.

We do not include any polyfills with this class. If you need your tags to work in older browsers, you should probably include the `polyfills for custom elements and shadow DOM <https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs>`_.