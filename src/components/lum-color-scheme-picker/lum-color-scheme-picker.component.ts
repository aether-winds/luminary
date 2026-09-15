import { LumComponent } from '../base-component/base-component.barrel.js';
import css from './lum-color-scheme-picker.component.css';

enum ColorScheme {
    Dark = '0',
    System = '1',
    Light = '2',
}

const ColorSchemeDisplay = {
    [ColorScheme.Dark]: 'Dark',
    [ColorScheme.System]: 'System',
    [ColorScheme.Light]: 'Light',
}

const ColorSchemePropertyValue = {
    [ColorScheme.Dark]: 'dark',
    [ColorScheme.System]: 'light dark',
    [ColorScheme.Light]: 'light',
}

const ColorSchemeSaveValue = {
    [ColorScheme.Dark]: ColorScheme.Dark,
    [ColorScheme.System]: undefined,
    [ColorScheme.Light]: ColorScheme.Light,
};

export class LumColorPickerElement extends LumComponent {
    static tagName = 'lum-color-schema-picker';
    readonly prefLocation: string = 'userPreference.color.scheme';
    private shadow: ShadowRoot;
    private userPreference: ColorScheme;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        this.shadow.adoptedStyleSheets = [sheet];

        this.userPreference = this.getUserPreference();
        this.changePageColorScheme(this.userPreference);

        this.shadow.addEventListener('change', this.handlePickerChange.bind(this));
    }

    public connectedCallback(): void {
        this.shadow.innerHTML = this.sanitizeHTML(`
            <label for="color-scheme-picker">Choose Color Scheme</label>
            <input type="range" id="color-scheme-picker" list="color-scheme-options" min="0" max="2" value="${this.userPreference}" />
            <span id="selected-scheme">${ColorSchemeDisplay[this.userPreference]}</span>
            <datalist id="color-scheme-options">
                <option value="0" label="dark"></option>
                <option value="1" label="system"></option>
                <option value="2" label="light"></option>
            </datalist>
        `) as unknown as string;
    }

    private getUserPreference(): ColorScheme {
        switch(localStorage.getItem('userPreference.color.scheme')) {
            case ColorScheme.Dark:  return ColorScheme.Dark;
            case ColorScheme.Light: return ColorScheme.Light;
            default:                return ColorScheme.System;
        }
    }

    private handlePickerChange(event: Event): void {
        let colorScheme: ColorScheme;

        switch((event.target as HTMLInputElement).value) {
            case ColorScheme.Dark:  colorScheme = ColorScheme.Dark;     break;
            case ColorScheme.Light: colorScheme = ColorScheme.Light;    break;
            default:                colorScheme = ColorScheme.System;   break;
        }

        this.saveUserPreference(colorScheme);
        this.changePageColorScheme(colorScheme);
        this.updateSelectedSchemeLabel(colorScheme);
    }

    private changePageColorScheme(colorScheme: ColorScheme): void {
        document.documentElement.style.setProperty('color-scheme', ColorSchemePropertyValue[colorScheme]);
    }

    private saveUserPreference(colorScheme: ColorScheme): void {
        switch(colorScheme) {
            case ColorScheme.Dark:
            case ColorScheme.Light:
                localStorage.setItem(this.prefLocation, ColorSchemeSaveValue[colorScheme]);
                break;
            default:
                localStorage.removeItem(this.prefLocation);
                break;
        }
    }

    private updateSelectedSchemeLabel(colorScheme: ColorScheme): void {
        const element = this.shadow.querySelector('#selected-scheme')
        if (element) element.innerHTML = this.sanitizeHTML(ColorSchemeDisplay[colorScheme]) as unknown as string;
    }
}
