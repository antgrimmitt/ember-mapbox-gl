import Ember from 'ember';

const {
  assign,
  Component,
  get,
  getOwner,
  getProperties,
  guidFor
} = Ember;

export default Component.extend({
  tagName: '',

  map: null,
  coordinates: null,
  layoutOptions: null,
  paintOptions: null,


  layerType: 'line',
  sourceId: null,

  init() {
    this._super(...arguments);

    const { layerType, sourceId, hoverLayer} = getProperties(this, 'layerType', 'sourceId', 'hoverLayer');

    this.layerId =  guidFor(this);
    const layerConfig = get(
      getOwner(this).resolveRegistration('config:environment'),
      `mapbox-gl.${layerType}`) || {};

    if(hoverLayer) {
      this.map.addLayer({
        id: 'country-fill-hover',
        type: layerType,
        source: sourceId,
        layout: assign({}, layerConfig.layout, get(this, 'layoutOptions')),
        paint: assign({}, layerConfig.hoverpaint, get(this, 'paintOptions')),
        filter: ["==", "name", ""]
      });
    } else {
      this.map.addLayer({
        id: 'country-fill',
        type: layerType,
        source: sourceId,
        paint: assign({}, layerConfig.paint, get(this, 'paintOptions')),
      });
    }

    let layout = assign({}, layerConfig.layout, get(this, 'layoutOptions'));
    console.log("layout == ", layout);
    // this.map.addLayer({
    //   id: 'country-val',
    //   type: "circle",
    //   so§urce: sourceId,
    //   layout: layout,
    //   // layout: {
    //   //   "icon-image": name
    //   // },
    //   paint: {
    //   // make circles larger as the user zooms from z12 to z22
    //   'circle-radius': {
    //     'base': 1.75,
    //       'stops': [[12, 2], [22, 180]]
    //   }
    //   }
    // });

    this.map.on("mouseover", 'country-fill', function(e) {
      console.log("hover");
      this.setFilter("country-fill-hover", ["==", "CONTINENT", e.features[0].properties.CONTINENT]);
    });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    this.map.on("mouseleave", 'country-fill', function() {
      this.setFilter("country-fill-hover", ["==", "name", ""]);
    });
  },

  willDestroy() {
    this._super(...arguments);

    this.map.removeLayer(this.layerId);
  }
});
