import { LumApplication } from './lum-application.elem.js';
import { registerElement } from '../../utils/customElements.utils.js';

registerElement('lum-application', LumApplication, { extends: 'body' });