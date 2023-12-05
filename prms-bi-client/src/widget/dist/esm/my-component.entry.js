import { r as registerInstance, h } from './index-aaa6f18b.js';

function format(first, middle, last) {
    return (first || '') + (middle ? ` ${middle}` : '') + (last ? ` ${last}` : '');
}

const myComponentCss = ":host{display:block}";

const MyComponent = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.first = undefined;
        this.middle = undefined;
        this.last = undefined;
    }
    getText() {
        return format(this.first, this.middle, this.last);
    }
    render() {
        return h("div", null, "Hello, World! I'm ", this.getText());
    }
};
MyComponent.style = myComponentCss;

export { MyComponent as my_component };

//# sourceMappingURL=my-component.entry.js.map