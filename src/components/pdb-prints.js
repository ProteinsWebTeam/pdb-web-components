const selector = raw => raw.response.docs[0];
const supportedSizes = new Set([36, 48, 64, 128]);

const organismMap = new Map([
  ['dinophyceae', 'algae'],
  ['embryophyta', 'plant'],
  ['streptophyta', 'plant'],
  ['saccharomyces cerevisiae', 'yeast'],
  ['saccharomyces', 'yeast'],
  ['drosophila', 'fly'],
  ['gallus gallus', 'chicken'],
  ['homo sapiens', 'human'],
  ['sus scrofa', 'pig'],
  ['bos taurus', 'cow'],
  ['mus musculus', 'mouse'],
  ['rattus', 'rat'],
  ['rat', 'rat'],
  ['mammalia', 'mammal'],
  ['fungi', 'fungi'],
  ['ascomycota', 'fungi'],
  ['viruses', 'virus'],
  ['bacteria', 'bacteria'],
  ['archaea', 'archaea'],
  ['eukaryota', 'eukaryote'],
  ['synthetic constructor', 'artificial'],
]);

const categoryUrls = new Map([
  [
    'PrimaryCitation',
    {
      url: 'citations',
      responseData (data) {
        return data.citation_year ? 'published' : 'unpublished';
      },
      title (responseData) {
        switch (responseData) {
          case 'published':
            return 'A paper describing this entry has been published';
          case 'unpublished':
            return (
              'The PDB does not have any information about ' +
              'a published paper describing this entry'
            );
          default:
            return (
              'This icon conveys information about whether or not a paper ' +
              'describing this entry has been published'
            );
        }
      },
    },
  ],
  [
    'Taxonomy',
    {
      url: 'analysis',
      responseData (data) {
        const org = data.entry_organism_scientific_name;
        // If not all the same
        if (new Set(org).size > 1) return 'multiple';
        // Get from organism map variable;
        const output = organismMap.get(org[0].split('|')[0].toLowerCase());
        return output || 'other';
      },
      title (responseData) {
        switch (responseData) {
          case 'artificial':
            return (
              'The biomacromolecules in this entry were artificially designed'
            );
          case 'other':
            return (
              'Information about the source organism of the biomacromolecules' +
              ' in this entry can be obtained by clicking on the icon'
            );
          case 'multiple':
            return (
              'The biomacromolecules in this entry derive ' +
              'from multiple organisms'
            );
          case 'fly':
            return (
              'The source organism of the biomacromolecules ' +
              'in this entry is fruit-fly'
            );
          case 'CGIlogoUnknown':
            return (
              'This icon conveys information about the source organism ' +
              'of the biomacromolecules in this entry'
            );
          default:
            return (
              'The source organism of the biomacromolecules in this entry is ' +
              responseData
            );
        }
      },
    },
  ],
  [
    'Expressed',
    {
      url: 'analysis',
      responseData (data) {
        const spm = data.sample_preparation_method;
        if (!spm) {
          const scientificName = data.entry_organism_scientific_name;
          if (scientificName.toLowerCase().contains('synthetic construct')) {
            return 'synthetic';
          }
          return 'CGIlogoUnknown';
        }
        // If not all the same
        if (new Set(spm).size > 1) return 'multiple';
        switch (spm[0].toLowerCase()) {
          case 'engineered':
            return 'expressed';
          case 'synthetic':
            return 'synthetic';
          case 'natural':
            return 'purified';
          default:
            return 'other';
        }
      },
      title (responseData) {
        switch (responseData) {
          case 'expressed':
            return (
              'The sample of the biomacromolecules in this entry was ' +
              'obtained by expression and purification'
            );
          case 'synthetic':
            return (
              'The sample of the biomacromolecules in this entry was ' +
              'obtained by chemical synthesis'
            );
          case 'purified':
            return (
              'The sample of the biomacromolecules in this entry was ' +
              'extracted and purified from a biological source'
            );
          case 'multiple':
            return (
              'The sample of the biomacromolecules in this entry was ' +
              'obtained using multiple techniques'
            );
          case 'other':
            return (
              'The sample of the biomacromolecules in this entry was ' +
              'obtained using techniques other than expression, ' +
              'chemical synthesis or extraction from a biological source'
            );
          case 'CGIlogoUnknown':
            return (
              'This icon conveys information about the production techniques ' +
              'used to obtain the biomacromolecular samples for this entry'
            );
          default:
            throw new Error('Something wrong happened');
        }
      },
    },
  ],
  [
    'Experimental',
    {
      url: 'experiment',
      responseData (data) {
        let output;
        switch (data.experimental_method[0].toLowerCase()) {
          case 'x-ray diffraction':
            output = 'xray';
            break;
          case 'solution nmr':
          case 'solid-state nmr':
            output = 'nmr';
            break;
          case 'electron microscopy':
            output = 'em';
            break;
          default:
            return 'other';
        }
        if (data.experimental_method.length !== 1) {
          output = 'hybrid';
        }
        if (data.experiment_data_available !== 'y') {
          output += 'NoData';
        }
        return output;
      },
      title (responseData) {
        let output;
        switch (responseData.replace('NoData', '')) {
          case 'xray':
            output = (
              'The structure was determined using X-ray crystallography'
            );
            break;
          case 'nmr':
            output = 'The structure was determined using NMR spectroscopy';
            break;
          case 'em':
            output = 'The structure was determined using Electron Microscopy';
            break;
          case 'multiple':
            output = (
              'The structure was determined using Electron Crystallography'
            );
            break;
          case 'extal':
            output = (
              'The sample of the biomacromolecules in this entry was ' +
              'obtained using techniques other than expression, ' +
              'chemical synthesis or extraction from a biological source'
            );
            break;
          case 'hybrid':
            output = (
              'The structure was determined using a hybrid technique'
            );
            break;
          case 'other':
            output = (
              'The structure was determined using a technique other than ' +
              'X-ray, NMR, EM, or a hybrid thereof'
            );
            break;
          default:
            return (
              'This icon conveys information about the ' +
              'structure-determination technique for this entry'
            );
        }
        return `${output} (${
          responseData.endsWith('NoData') ? 'no ' : ''
        }experimental data available)`;
      },
    },
  ],
  [
    'Protein',
    {
      url: 'analysis',
      responseData (data) {
        return data.number_of_protein_chains ? 'present' : 'absent';
      },
      title (responseData) {
        switch (responseData) {
          case 'present':
            return 'This entry contains protein';
          case 'absent':
            return 'This entry does not contain protein';
          case 'CGIlogoUnknown':
            return (
              'This icon conveys information about the presence ' +
              'of protein in the entry'
            );
          default:
            throw new Error('Something bas happened');
        }
      },
    },
  ],
  [
    'NucleicAcid',
    {
      url: 'analysis',
      responseData (data) {
        const present = data.number_of_RNA_chains || data.number_of_DNA_chains;
        return present ? 'present' : 'absent';
      },
      title (responseData) {
        switch (responseData) {
          case 'present':
            return 'This entry contains nucleic acid (DNA, RNA)';
          case 'absent':
            return 'This entry does not contain nucleic acid (DNA, RNA)';
          case 'CGIlogoUnknown':
            return (
              'This icon conveys information about the presence ' +
              'of nucleic acid (DNA, RNA) in the entry'
            );
          default:
            throw new Error('Something bas happened');
        }
      },
    },
  ],
  [
    'Ligands',
    {
      url: 'ligands',
      responseData (data) {
        return data.number_of_bound_entities ? 'present' : 'absent';
      },
      title (responseData) {
        switch (responseData) {
          case 'present':
            return 'This entry contains one or more ligands';
          case 'absent':
            return 'This entry does not contain any ligand';
          case 'CGIlogoUnknown':
            return (
              'This icon conveys information about the presence ' +
              'of ligands in the entry'
            );
          default:
            throw new Error('Something bas happened');
        }
      },
    },
  ],
]);

// Unique id, for each instance, used for namespacing
let uniqueId = 1;

const categories = new Set(categoryUrls.keys());

// Custom Element definition
class PdbPrints extends HTMLElement {
  static get observedAttributes () {
    return ['orientation', 'size', 'include', 'exclude'];
  }

  _handleLoadEvent (event) {
    this.data = selector(event.detail);
  }

  _render () {
    if (!this.data) return;
    const id = this.data.entry_entity.slice(0, 4);
    const sizePx = `${this.size}px`;
    // If first render
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.classList.add(this._namespace);
    }
    const style = `
      <style>
        :host {
          font-family: "Courier New";
          font-size: ${this.size / 3}px;
          font-weight: bold;
          display: inline-block;
          overflow: hidden;
        }
        
        :host a {
          text-decoration: none;
          cursor: pointer;
        }
        
        :host > .root {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          ${this.orientation === 'horizontal'
            ? `-webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;`
            : `-ms-flex-direction: column;
            flex-direction: column;`
          };
        }
        
        :host > .root > * {
          height: ${sizePx};
          width: ${sizePx};
        }
        
        :host > .root > span {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }
        
        :host > .root > a {
          border-radius: 10%;
          background-color: #81C16E;
          background-color: var(--theme-color, #81C16E);
        }
      </style>
    `.trim();
    (this.shadyRoot || this.shadowRoot).innerHTML = `
      ${this.shadyRoot ? style.replace(/:host/g, `.${this._namespace}`) : style}
      <span class="root">
        <span>
          <a
            title="${
              'For more information about key features of this entry, ' +
              'click on the individual icons'
            }"
            href="//www.ebi.ac.uk/pdbe/entry/pdb/${id}/"
          >
            ${id}
          </a>
          <a title="pdbe.org" href="//www.ebi.ac.uk/pdbe">
            <img
              src="//www.ebi.ac.uk/pdbe/widgets/html/PDBeWatermark_horizontal_${
                this.size
              }.png"
            >
          </a>
        </span>
        ${[...categoryUrls.entries()]
            .filter(([c]) => this._include.has(c) && !this._exclude.has(c))
            .map(
            ([category, {url, responseData, title}]) => {
              const _responseData = responseData(this.data);
              const _title = title(_responseData);
              return `
                <a
                  href="//www.ebi.ac.uk/pdbe/entry/pdb/${id}/${url}"
                  title="${_title}"
                >
                  <img
                    src="//www.ebi.ac.uk/pdbe/widgets/pdblogos/transparent/${
                      this.size
                    }/${category}_${_responseData}.png"
                    alt="${_title}"
                  >
                </a>
              `.trim();
            }
          ).join('')}
      </span>
    `.trim();
  }

  _planRender () {
    if (this._plannedRender) return;
    this._plannedRender = true;
    requestAnimationFrame(() => {
      this._plannedRender = false;
      this._render();
    });
  }

  // Getters/Setters
  // data
  get data () {
    return this._data;
  }

  set data (value) {
    this._data = value;
    this._planRender();
  }

  // orientation
  get orientation () {
    return this._orientation;
  }

  set orientation (value) {
    let orientation;
    switch (value.toLowerCase()[0]) {
      case 'v':
        orientation = 'vertical';
        break;
      case 'h':
        orientation = 'horizontal';
        break;
      default:
        throw new Error(`${value} is not a supported orientation`);
    }
    this._orientation = orientation;
    this.setAttribute('orientation', orientation);
    this._planRender();
  }

  // size
  get size () {
    return this._size;
  }

  set size (value) {
    // Parses to number, accepts strings with px unit
    let _value = Number(`${value}`.toLowerCase().replace('px', ''));
    // If not a valid number, or had a non-px unit, throws
    if (isNaN(_value)) throw new Error(`${value} is not a supported size`);
    // If not a supported size, finds closest supported one to use instead
    if (!supportedSizes.has(_value)) {
      _value = [...supportedSizes]
        .sort((a, b) => Math.abs(a - _value) - Math.abs(b - _value))[0];
      console.warn(
        `${value} is not a supported value, setting to closest one: ${_value}`
      );
    }
    this._size = _value;
    this.setAttribute('size', `${_value}px`);
    this._planRender();
  }

  // include
  get include () {
    return [...this._include];
  }

  set include (value) {
    let _values = value;
    // If falsy value, sets to empty array
    if (!_values) _values = [];
    // If it's a string, might be coming from DOM attribute, clean up and parse
    if (typeof _values === 'string') {
      _values = _values.replace(/[[\]'"]/m).split(/\s*,\s*/);
    }
    // Removes invalid values
    _values = _values.filter(v => categories.has(v));
    if (_values.length) {
      this._include = new Set(_values);
      // Reflect values to DOM
      this.setAttribute('include', _values.join(' '));
    } else {
      // If empty, uses default values and removes attribute from DOM
      this._include = new Set(categories);
      this.removeAttribute('include');
    }
    this._planRender();
  }

  // exclude
  get exclude () {
    return [...this._exclude];
  }

  set exclude (value) {
    let _values = value;
    // If falsy value, sets to empty array
    if (!_values) _values = [];
    // If it's a string, might be coming from DOM attribute, clean up and parse
    if (typeof _values === 'string') {
      _values = _values.replace(/[[\]'"]/m).split(/\s*,\s*/);
    }
    // Removes invalid values
    _values = _values.filter(v => categories.has(v));
    // Saves internally
    this._exclude = new Set(_values);
    if (_values.length) {
      // Reflect values to DOM
      this.setAttribute('exclude', _values.join(' '));
    } else {
      // If empty, removes DOM attribute
      this.removeAttribute('exclude');
    }
    this._planRender();
  }

  // Custom element actions
  constructor () {
    super();
    // defaults
    this._data = null;
    this._orientation = 'horizontal';
    this._size = 36;
    this._include = new Set(categories);
    this._exclude = new Set();
    // bind functions
    this._handleLoadEvent = this._handleLoadEvent.bind(this);
    this._planRender = this._planRender.bind(this);
    this._render = this._render.bind(this);
    // class namespacing (for pseudo-scoped CSS)
    this._namespace = `${this.tagName.toLowerCase()}-${uniqueId++}`;
  }

  connectedCallback () {
    this.addEventListener('load', this._handleLoadEvent);
  }

  disconnectedCallback () {
    this.removeEventListener('load', this._handleLoadEvent);
  }

  attributeChangedCallback (attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }
}

export default PdbPrints;
