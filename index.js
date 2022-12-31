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

const country = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 1,
  }),
  fill: new Fill({
    color: 'rgba(20,20,20,0.4)',
  }),
});

const vtLayer = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    format: new MVT({
      idProperty: 'gid',
    }),
    // url: `http://localhost:7800/public.india_states/{z}/{x}/{y}.pbf`
    url: `http://localhost:5000/collections/StatesMVT/tiles/WorldCRS84Quad/{z}/{x}/{y}?f=mvt`
  }),
  style: function (feature) {
    return country;
  },
});

const vtLayer1 = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    format: new MVT({
      idProperty: 'gid',
    }),
    url: `http://localhost:7800/public.india_districts/{z}/{x}/{y}.pbf`
  }),
  style: function (feature) {
    // console.log(feature);
    return country;
  },
});

const vtLayer2 = new VectorTileLayer({
  declutter: true,
  source: new VectorTileSource({
    format: new MVT({
      idProperty: 'gid',
    }),
    url: `http://localhost:7800/public.india_waterbody/{z}/{x}/{y}.pbf`
  }),
  // style: new Style()
});

// const vtLayer3 = new VectorTileLayer({
//   declutter: true,
//   source: new VectorTileSource({
//     format: new MVT({
//       idProperty: 'gid',
//     }),
//     url: `http://localhost:7800/public.india_points/{z}/{x}/{y}.pbf`
//   }),
//   // style: new Style()
// });

var featureCount = document.getElementById('features').value;

var url = `http://localhost:5000/collections/Waterbodies/items?limit=${featureCount}&f=json`;

var s1 = new VectorSource({
  format: new GeoJSON(),
  url: `http://localhost:5000/collections/Waterbodies/items?limit=100&f=json`,
});

var s2 = new VectorSource({
  format: new GeoJSON(),
  url: `http://localhost:5000/collections/Waterbodies/items?limit=1000&f=json`,
});

var s3 = new VectorSource({
  format: new GeoJSON(),
  url: `http://localhost:5000/collections/Waterbodies/items?limit=10000&f=json`,
});

var s4 = new VectorSource({
  format: new GeoJSON(),
  url: `http://localhost:5000/collections/Waterbodies/items?limit=50000&f=json`,
});

const vtLayer3 = new VectorLayer({
  source: s1,
});

var osmLayer = new TileLayer({
  source: new OSM()
});

var bhuvanLayer = new TileLayer({
  source: new TileWMS({
    url: 'https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms',
    params: { 'LAYERS': 'indiainf', 'TILED': true},
    projection: 'EPSG:4326',
  })
});

var satMap = new TileLayer ({
  source: new XYZ({
    url:
      'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  }),
})  

// https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/5/12/21

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


function getLayer(el) {
  console.log('val', el);


  if(el == 'vtLayer') {
    vtLayer.setVisible(true);
    vtLayer1.setVisible(false);
    vtLayer2.setVisible(false);
    vtLayer3.setVisible(false);
    document.getElementById('drop').style.display = 'none';
  }

  if(el == 'vtLayer1') {
    vtLayer1.setVisible(true);
    vtLayer.setVisible(false);
    vtLayer2.setVisible(false);
    vtLayer3.setVisible(false);
    document.getElementById('drop').style.display = 'none';
  }

  if(el == 'vtLayer2') {
    vtLayer2.setVisible(true);
    vtLayer1.setVisible(false);
    vtLayer.setVisible(false);
    vtLayer3.setVisible(false);
    document.getElementById('drop').style.display = 'none';
  }

  if(el == 'vtLayer3') {
    vtLayer3.setVisible(true);
    vtLayer1.setVisible(false);
    vtLayer2.setVisible(false);
    vtLayer.setVisible(false);
    document.getElementById('drop').style.display = 'block';
  }
}


map.on('pointermove', showInfo);

const selectStyle = new Style({
  fill: new Fill({
    color: '#eeeeee',
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.7)',
    width: 2,
  }),
});

let selected = null;

const info = document.getElementById('info');
function showInfo(event) {
  const features = map.getFeaturesAtPixel(event.pixel);

  // console.log('hell', features);

  // map.forEachFeatureAtPixel(event.pixel, function (f) {
  //   selected = f;
  //   console.log(selected);
  //   selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
  //   f.setStyle(selectStyle);
  //   return true;
  // });

  
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

var radios = document.querySelectorAll('input[type=radio][name="rate"]');
radios.forEach(radio => radio.addEventListener('change', () => getLayer(radio.value)));

document.getElementById("features").onchange = function(){
  var value = document.getElementById("features").value;
  let sou;

  switch(value) {
    case '100':
      sou = s1;
      // code block
      break;
    case '1000':
      sou = s2;
      // code block
      break;
    case '10000':
      sou = s3;
      // code block
      break;
    case '100000':
      sou = s4;
      // code block
      break;
    default:
      sou = s1;
      // code block
  }

  vtLayer3.setSource(sou);
  
  vtLayer3.changed();




};

// var currZoom = map.getView().getZoom();
// map.on('moveend', function(e) {
//   var newZoom = map.getView().getZoom();
//   if (currZoom != newZoom) {
//     getVisibility(newZoom);
//     // console.log('zoom end, new zoom: ' + newZoom);
//     currZoom = newZoom;
//   }
// });


// function getVisibility(z) {
//   console.log('Zoom', z);

//   if (z<5) {
//     vtLayer.setVisible(true);
//     vtLayer1.setVisible(false);
//     vtLayer2.setVisible(false);
//     vtLayer3.setVisible(false);
//   }

//   if (5<=z<8) {
//     vtLayer1.setVisible(true);
//     vtLayer.setVisible(false);
//     vtLayer2.setVisible(false);
//     vtLayer3.setVisible(false);
//   }

//   if (8<=z<10) {
//     vtLayer2.setVisible(true);
//     vtLayer1.setVisible(false);
//     vtLayer.setVisible(false);
//     vtLayer3.setVisible(false);
//   }

//   if (10<=z<14) {
//     vtLayer3.setVisible(true);
//     vtLayer1.setVisible(false);
//     vtLayer2.setVisible(false);
//     vtLayer.setVisible(false);
//   }
// }