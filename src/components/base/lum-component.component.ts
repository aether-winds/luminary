import { Maybe } from "../../utils";
import { LumShadowElement, LumShadowElementConfiguration } from "./lum-shadow-element.component";

export interface LumComponentConfiguration extends LumShadowElementConfiguration {}

export abstract class LumComponent extends LumShadowElement {
    static observedAttributes = [];

    constructor(configuration?: LumComponentConfiguration) {
        super(configuration);
    }

    public attributeChangedCallback(name: string, oldValue: Maybe<string>, newValue: Maybe<string>): void {
        if (this.hasInterfaceMethod('onAttributeChange'))
            this['onAttributeChange'](name, oldValue, newValue);
    }

    private hasInterfaceMethod(methodName: string): boolean {
        return methodName in this
            && typeof (this as unknown as { [methodName]?: unknown })[methodName] === 'function';
    }
}
