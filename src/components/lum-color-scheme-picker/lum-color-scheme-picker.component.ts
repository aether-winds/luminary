import { LumComponent } from '../base-component/base-component.barrel.js';
import css from './lum-color-scheme-picker.component.css';

enum SchemeOption {
    System = 'light dark',
    Light = 'light',
    Dark = 'dark',
}

export class LumColorPickerElement extends LumComponent {
    static tagName = 'lum-color-schema-picker';
    readonly prefLocation: string = 'userPreference.color.scheme';
    private shadow: ShadowRoot;
    private userPreference: SchemeOption | null;

    public get value(): string | undefined {
        return this.userPreference?.toString();
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        this.shadow.adoptedStyleSheets = [sheet];

        this.userPreference = this.getUserPreference();
        this.changePageColorScheme(this.userPreference ?? SchemeOption.System);

        this.shadow.addEventListener('change', this.handlePickerChange.bind(this));
    }

    public connectedCallback(): void {
        this.shadow.innerHTML = this.sanitizeHTML(`
            <label for="color-scheme-picker">Choose Color Scheme</label>
            <select id="color-scheme-picker">
                <option value="light dark" ${this.userPreference === SchemeOption.System ? 'selected' : ''}>System</option>
                <option value="light" ${this.userPreference === SchemeOption.Light ? 'selected' : ''}>Light</option>
                <option value="dark" ${this.userPreference === SchemeOption.Dark ? 'selected' : ''}>Dark</option>
            </select>
        `) as unknown as string;
    }

    private getUserPreference(): SchemeOption | null {
        return localStorage.getItem(this.prefLocation) as SchemeOption | null;
    }

    private handlePickerChange(event: Event): void {
        const colorScheme: SchemeOption = (event.target as HTMLSelectElement).value as SchemeOption;

        this.saveUserPreference(colorScheme);
        this.changePageColorScheme(colorScheme);
    }

    private changePageColorScheme(colorScheme: SchemeOption): void {
        switch(colorScheme) {
            case SchemeOption.Dark:
            case SchemeOption.Light:
                document.documentElement.style.setProperty('color-scheme', colorScheme);
                break;
            default:
                document.documentElement.style.setProperty('color-scheme', SchemeOption.System);
        }
    }

    private saveUserPreference(colorScheme: SchemeOption): void {
        switch(colorScheme) {
            case SchemeOption.Dark:
            case SchemeOption.Light:
                localStorage.setItem(this.prefLocation, colorScheme);
                break;
            default:
                localStorage.removeItem(this.prefLocation);
                break;
        }
    }
}
