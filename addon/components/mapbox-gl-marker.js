import Ember from 'ember';
import layout from '../templates/components/mapbox-gl-marker';
import MapboxGl from 'mapbox-gl';

const {
  assert,
  assign,
  Component,
  get,
  getOwner,
  getProperties,
  run
} = Ember;

export default Component.extend({
  layout,

  map: null,
  initOptions: null,
  lngLat: null,

  init() {
    this._super(...arguments);

    this.marker = null;
  },

  didInsertElement() {
    this._super(...arguments);

    run.scheduleOnce('afterRender', this, this._setup);
  },

  didUpdateAttrs() {
    this._super(...arguments);

    if (this.marker !== null) {
      const lngLat = get(this, 'lngLat');
      assert('mapbox-gl-marker requires lngLat, maybe you passed latLng?', lngLat);

      this.marker.setLngLat(lngLat);
    }
  },

  destroy() {
    console.log('destroy');
    if(this.marker) {
      this.marker.remove();
    }
  },

  willDestroy() {
    console.log('will destroy');
    this._super(...arguments);

    if (this.marker !== null) {
      this.marker.remove();
    }
  },

  click() {
    this.sendAction("showCountries", "europe");
    let zoom = this.get("zoom");
    this.map.easeTo(
      {
        center: this.lngLat,
        zoom: zoom
      });

  },

  _setup() {
    const {lngLat, initOptions} = getProperties(this, 'lngLat', 'initOptions');

    assert('mapbox-gl-marker requires lngLat, maybe you passed latLng?', lngLat);

    const options = assign({},
      get(getOwner(this).resolveRegistration('config:environment'), 'mapbox-gl.marker'),
      initOptions);

    let width = this.get('width');
    this.element.style.width = `${200*width}px`;
    this.element.style.height = `${200*width}px`;

    const marker = new MapboxGl.Marker(this.element, options)
      .setLngLat(lngLat)
      .addTo(this.map);

    this.set('marker', marker);
  }
});
