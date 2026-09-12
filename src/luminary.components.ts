import {
    type LumComponent,

    LumColorPickerElement,

    registerComponent,
} from './components/components.barrel.js';

const components: LumComponent[] = [
    LumColorPickerElement
];

components.forEach((c: LumComponent) => {
    registerComponent(c);
});
