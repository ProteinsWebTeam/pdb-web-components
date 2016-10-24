PDB web components
==================

_in development_

A standard web component implementation of the PDB components
([PDB Component Library](http://www.ebi.ac.uk/pdbe/pdb-component-library/index.html))

## Usage

### Examples
```html
<pdb-prints>
  <pdb-data-loader pdbid="1cbs">
</pdb-prints>
```

```html
<pdb-prints size="64" orientation="vertical" style="--theme-color: transparent;">
 <pdb-data-loader pdbid="2cbs">
</pdb-prints>
```

### Use with custom namespace

Only needed if `pdb-prints` or `pdb-data-loader` names clash with an
other existing Custom Element.

```js
import {PdbDataLoader, PdbPrints} from 'pdb-web-components';

// If `data-loader` elements also namespaced, need to pass
// new name to PdbDataLoader to use it correctly
PdbDataLoader.dataLoaderElementName = 'namespaced-data-loader';

// Register the Custom Elements
customElements.define('namespaced-pdb-data-loader', PdbDataLoader);
customElements.define('namespaced-pdb-prints', PdbPrints);
```

And then in the HTML, use like so:

```html
<namespaced-pdb-prints>
  <namespaced-pdb-data-loader pdbid="1cbs">
</namespaced-pdb-prints>
```

## Compatibility

This element assumes support for at least ES2016.
To support older browsers you might need to transpile the code you use
down to the version you are planning on supporting.

You might need to use a polyfill for browser not supporting Custom
Elements.
[webcomponents.js](https://github.com/webcomponents/webcomponentsjs) is
recommended.

## List of components included

### `pdb-data-loader`

Not a visible element. Use to retrieve data from the PDB API.

Generates a `data-loader` element with the correct `source` element to
get data from the PDB API for the PDB entry specified.

### `pdb-prints`

Visible element. Only displays data.

Generates the visual representation of the data passed to the `data`
property or coming from a `load` event bubbling from lower in the DOM
tree.

Visual representation can be modified from the public API of the
component (see after)

## API

### `pdb-data-loader`

#### Properties

|name|default value|accepted values|information|DOM attribute|writable|
|----|-------------|---------------|-----------|-------------|--------|
|`pdbid`|`null`|valid PDB ID|4 character string corresponding to an existing PDB ID|yes|yes|

#### Events

none, but the `data-loader` component generated as its child will
dispatch bubbling events
(see [data-loader](https://github.com/aurel-l/data-loader))

#### CSS custom properties

none

### `pdb-prints`

#### Properties

|name|default value|accepted values|information|DOM attribute|writable|
|----|-------------|---------------|-----------|-------------|--------|
|`data`|`null`|object|object used to access information about the PDB entry|no|yes|
|`orientation`|`'horizontal'`|any of `horizontal` or `vertical`|orientation of the logos|yes|yes|
|`size`|`36`|any of `36`, `48`, `64`, or `128`|size of the logos|yes|yes|
|`include`|`['PrimaryCitation', 'Taxonomy', 'Expressed', 'Experimental', 'Protein', 'NucleicAcid', 'Ligands']`|any one or multiple value part of the default set of values|list of rendered logos|yes|yes|
|`exclude`|`[]`|same than for `include' property used to access information about the PDB entry|list of non-rendered logos|yes|yes|

Note: the list of logos rendered is the `include` set minus the
`exclude` set.

#### Events

none

#### CSS custom properties

|name|default value|accepted values|information|
|----|-------------|---------------|-----------|
|`--theme-color`|`#81C16E`|any valid CSS value for `color`|color applied to the background of the logos|
