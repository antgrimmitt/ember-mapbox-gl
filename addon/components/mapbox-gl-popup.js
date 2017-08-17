import Ember from 'ember';
import layout from '../templates/components/mapbox-gl-popup';
import MapboxGl from 'mapbox-gl';

const {
  assign,
  Component,
  get,
  getProperties,
  getOwner,
  run
} = Ember;

export default Component.extend({
  layout,
  tagName: '',

  map: null,
  marker: null,
  lngLat: null,
  initOptions: null,

  onClose: null,

  init() {
    this._super(...arguments);

    const { initOptions, marker } = getProperties(this, 'initOptions', 'marker');

    this.domContent = document.createElement('div');
    this._onClose = run.bind(this, this.sendAction, 'onClose');
    const options = assign({},
      get(getOwner(this).resolveRegistration('config:environment'), 'mapbox-gl.popup'),
      initOptions);

    options.anchor = "left";

    this.popup = new MapboxGl.Popup(options)
      .setDOMContent(this.domContent)
      .on('close', this._onClose);

    if (marker === null) {
      this.popup.addTo(this.map);
    } else {
      marker.setPopup(this.popup);
    }
    let lock = false;
    Ember.$(marker.getElement()).on("mouseenter", function() {
      if(!lock) {
        marker.togglePopup();
      }
      lock = true;
      setTimeout(function () {
        lock = false;
      },500)

    }).on("mouseleave", function () {
      if(marker.getPopup().isOpen()) {
        marker.togglePopup();
      }
    })
  },

  didReceiveAttrs() {
    this._super(...arguments);

    const lngLat = get(this, 'lngLat');

    if (lngLat) {
      this.popup.setLngLat(lngLat);
    }
  },

  willDestroy() {
    this._super(...arguments);

    this.popup.off('close', this._onClose);

    if (this.marker !== null) {
      this.popup.remove();
    }
  }
});
