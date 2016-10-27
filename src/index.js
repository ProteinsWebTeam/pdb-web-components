import _PdbPrints from './components/pdb-prints';
import _PdbDataLoader from './components/pdb-data-loader';
import DataLoader from 'data-loader';

if (window.customElements) {
  customElements.define('pdb-prints', _PdbPrints);
  customElements.define('pdb-data-loader', _PdbDataLoader);
  customElements.define('data-loader', DataLoader);
}

export const PdbDataLoader = _PdbDataLoader;
export const PdbPrints = _PdbPrints;
