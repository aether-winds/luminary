import './luminary.css';
import './components/lum-components.module.js';

new EventSource('/esbuild').addEventListener('change', () => location.reload());