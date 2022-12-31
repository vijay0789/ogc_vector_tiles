import MVT from 'ol/format/MVT.js';
import Map from 'ol/Map.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import View from 'ol/View.js';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Fill, Stroke, Style} from 'ol/style.js';
import {transform} from 'ol/proj';
import Feature from 'ol/Feature.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import TileWMS from 'ol/source/TileWMS';
import XYZ from 'ol/source/XYZ.js';

const state = new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(20,20,20,0.4)',
    }),
  });


  const district = new Style({
    stroke: new Stroke({
      color: 'brown',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(20,20,20,0.4)',
    }),
  });

  const vtLayer = new VectorTileLayer({
    minZoom: 3,
    maxZoom: 5,
    declutter: true,
    source: new VectorTileSource({
      format: new MVT({
        idProperty: 'gid',
      }),
      // url: `http://localhost:7800/public.india_states/{z}/{x}/{y}.pbf`
      url: `http://localhost:5000/collections/StatesMVT/tiles/WorldCRS84Quad/{z}/{x}/{y}?f=mvt`
    }),
    style: function (feature) {
      return state;
    },
  });
  
  const vtLayer1 = new VectorTileLayer({
    minZoom: 6,
    maxZoom: 8,
    declutter: true,
    source: new VectorTileSource({
      format: new MVT({
        idProperty: 'gid',
      }),
      url: `http://localhost:7800/public.india_districts/{z}/{x}/{y}.pbf`
    }),
    style: function (feature) {
      // console.log(feature);
      return district;
    },
  });
  
  const vtLayer2 = new VectorTileLayer({
    minZoom: 9,
    maxZoom: 11,
    declutter: true,
    source: new VectorTileSource({
      format: new MVT({
        idProperty: 'gid',
      }),
      url: `http://localhost:7800/public.india_waterbody/{z}/{x}/{y}.pbf`
    }),
    // style: new Style()
  });

const vtLayer3 = new VectorTileLayer({
    minZoom: 12,
    maxZoom: 15,
    declutter: true,
    source: new VectorTileSource({
    format: new MVT({
        idProperty: 'gid',
    }),
    url: `http://localhost:7800/public.india_points/{z}/{x}/{y}.pbf`
    }),
    // style: new Style()
});

  var osmLayer = new TileLayer({
    source: new OSM()
  });

  const map = new Map({
    layers: [ 
      osmLayer, 
      // satMap,
      vtLayer, vtLayer1, vtLayer2, vtLayer3],
    target: 'map',
    view: new View({
      center: transform([82.35, 20.5], 'EPSG:4326', 'EPSG:3857'),
      zoom: 4,
      multiWorld: true,
    }),
  });

vtLayer1.setVisible(false);
vtLayer2.setVisible(false);
vtLayer3.setVisible(false);
  
  map.on('moveend', showLayer);
  const info1 = document.getElementById('info1');

function showLayer() {
    var zLevel = parseInt(map.getView().getZoom());
    
    console.log(zLevel);

    info1.innerHTML = 'Zoom Level is <b>' + zLevel + '</b>';

        if( zLevel == 3 || zLevel == 4 || zLevel == 5  )
        {
            vtLayer.setVisible(true);
            vtLayer1.setVisible(false);
            vtLayer2.setVisible(false);
            vtLayer3.setVisible(false);
        }

        if( zLevel == 6 || zLevel == 7 || zLevel == 8  )
        {
            vtLayer1.setVisible(true);
            vtLayer.setVisible(false);
            vtLayer2.setVisible(false);
            vtLayer3.setVisible(false);
        }

        if( zLevel == 9 || zLevel == 10 || zLevel == 11  )
        {
            vtLayer2.setVisible(true);
            vtLayer1.setVisible(false);
            vtLayer.setVisible(false);
            vtLayer3.setVisible(false);
        }

        if( zLevel == 12 || zLevel == 13 || zLevel == 14  )
        {
            vtLayer3.setVisible(true);
            vtLayer1.setVisible(false);
            vtLayer.setVisible(false);
            vtLayer2.setVisible(false);
        }

        // if( zLevel == 16 || zLevel == 17 || zLevel == 18)
        // {
        //     layer2.setVisibility(false);
        //     layer3.setVisibility(true);
        // }
}

map.on('pointermove', showInfo);

const info = document.getElementById('info');
function showInfo(event) {
  const features = map.getFeaturesAtPixel(event.pixel);

  console.log('hell', features);
  
  if(!features) return;

  if (features.length == 0) {
    info.innerText = '';
    info.style.opacity = 0;
    return;
  }
  const properties = features[0].getProperties();
  info.innerText = JSON.stringify(properties, null, 2);
  info.style.opacity = 1;
}