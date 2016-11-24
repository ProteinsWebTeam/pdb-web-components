const pdbIdPattern = /^[A-Z0-9]{4}$/;

const idToUrl = ((url) => id => `${url}&q=pdb_id:(${id.toLowerCase()})`)(`
  //www.ebi.ac.uk/pdbe/search/pdb/select?
  fl=pdb_id,organism_synonyms,number_of_bound_entities%2C+
  number_of_protein_chains%2Cexperimental_method%2C+
  experiment_data_available%2Cexpression_host_sci_name%2C+citation_year%2C+
  entry_organism_scientific_name,number_of_RNA_chains,number_of_DNA_chains,
  sample_preparation_method,emdb_id&wt=json
`.trim().replace('\n', ''));

class PdbDataLoader extends HTMLElement {
  static get observedAttributes () {
    return ['pdbid'];
  }

  _render () {
    const id = this.pdbid;
    // Clean up the DOM
    const sources = this.querySelectorAll('source');
    for (const source of sources) {
      source.parentElement.removeChild(source);
    }
    // If no ID, skip
    if (!id) return;
    // We have an ID, add or modify a data-loader element to fetch the data
    const source = document.createElement('source');
    source.src = idToUrl(id);
    let dataLoader = this.querySelector(PdbDataLoader.dataLoaderElementName);
    // If no data loader yet, create and add it
    if (!dataLoader) {
      dataLoader = document.createElement(PdbDataLoader.dataLoaderElementName);
      dataLoader.appendChild(source);
      this.appendChild(dataLoader);
    } else {
      dataLoader.appendChild(source);
    }
  }

  _planRender () {
    // If render is already planned, skip
    if (this._plannedRender) return;
    this._plannedRender = true;
    requestAnimationFrame(() => {
      this._plannedRender = false;
      this._render();
    });
  }

  // Getters/Setters
  // pdbid
  get pdbid () {
    return this._pdbid;
  }

  set pdbid (value) {
    const _value = (value || '').trim().toUpperCase();
    if (_value && !pdbIdPattern.test(_value)) {
      throw new Error(`${value} is not a valid PDB ID`);
    }
    this._pdbid = _value || null;
    if (this._pdbid) {
      this.setAttribute('pdbid', this.pdbid);
      this._planRender();
    } else {
      this.removeAttribute('pdbid');
    }
  }

  // Custom element reactions
  constructor () {
    super();
    // set defaults
    this._pdbid = null;
    // bind functions
    this._planRender = this._planRender.bind(this);
    this._render = this._render.bind(this);
  }

  connectedCallback () {
    this._planRender();
  }

  disconnectedCallback () {
    this._plannedRender = false;
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}
PdbDataLoader.dataLoaderElementName = 'data-loader';

export default PdbDataLoader;
