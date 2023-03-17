import React from 'react';
import {createRoot} from 'react-dom/client';
import {StaticMap, MapContext, NavigationControl} from 'react-map-gl';
import DeckGL, {GeoJsonLayer, ArcLayer} from 'deck.gl';
import geoJson from './data/경북GeoJSON.geojson'
// import topoJSon from './data/gbmap_topo.json'
import testData from './data/도내 시군간 및 시도간 전출입 및 순이동자.json'
import { ScatterplotLayer } from 'deck.gl';
import { CPUGridLayer } from 'deck.gl';

// source: Natural Earth http://www.naturalearthdata.com/ via geojson.xyz
const AIR_PORTS =
  'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson';
const country = geoJson;

const INITIAL_VIEW_STATE = {
  latitude: 37.3236563, 
  longitude: 127.9745613,
  zoom: 7,
  bearing: 0,
  pitch: 30
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
const NAV_CONTROL_STYLE = {
  position: 'absolute',
  top: 5,
  left: 5
};

const ArcData = 
[
  {
    inbound: 72633,
    outbound: 74735,
    from: {
      name: '19th St. Oakland (19TH)',
      coordinates: [129.269029, 36.80787]
    },
    to: {
      name: '12th St. Oakland City Center (12TH)',
      coordinates: [127.271604, 37.803664]
  },
}
];

const ScatterplotData = 
[
  {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [127.271604, 35.803664], radiusScale: 300},
  {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [125.271604, 35.803664], radiusScale: 100},
]

const CPUGridData = [
  {COORDINATES: [128.271604, 36.803664]}
]


function Root() {
  const onClick = info => {
    if (info.object) {
      // eslint-disable-next-line
      alert(info.object.properties.SGG_NM);
    }
  };

  const layers = [
    new GeoJsonLayer({
      id: 'airports',
      data: country,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getPointRadius: f => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick
    }),

    new ArcLayer({
      id: 'arc-layer',
      data: ArcData,
      pickable: true,
      getWidth: 12,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: d => [Math.sqrt(d.inbound), 140, 0],
      getTargetColor: d => [Math.sqrt(d.outbound), 140, 0],
    }),

    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: ScatterplotData,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 300,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: d => d.coordinates,
      getRadius: d => Math.sqrt(d.exits),
      getFillColor: d => [255, 140, 0],
      getLineColor: d => [0, 0, 0]
    }),

    new CPUGridLayer({
      id: 'grid-layer',
      data: CPUGridData,
      pickable: true,
      extruded: true,
      cellSize: 20000,
      elevationScale: 2000,
      count: 10,
      getPosition: d => d.COORDINATES
    })
  ];

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
      ContextProvider={MapContext.Provider}
    >
      <StaticMap mapStyle={MAP_STYLE} />
      <NavigationControl style={NAV_CONTROL_STYLE} />
    </DeckGL>
  );
}

/* global document */
const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);