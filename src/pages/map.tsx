import React, { useEffect, useState } from 'react';
import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point, MultiPoint} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import {Attribution, defaults as defaultControls} from 'ol/control.js';


export const GetMap = (props: any) => {
  // const place = [
  //   [props.lng, props.lat],
  //   [125.626345, 7.118871],
  //   [125.643030, 7.132380]
  // ];
  const place = [125.643030, 7.132380]
  // const center_place = [props.lng, props.lat]
  const [target, setTarget] = useState<any>("map")
  const attribution = new Attribution({
    collapsible: false,
  });
  // const place: any = [131.6361044, 7.1315888]
  useGeographic();
  const point = new Point(place);
  // const point = new MultiPoint(place);
  
  
  useEffect(() => {
      const map: any = new Map({
      target: target,
      controls: defaultControls({attribution: false}),
      view: new View({
        center: place,
        zoom: 14,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource({
            features: [new Feature(point)],
          }),
          style: {
            'circle-radius': 9,
            'circle-fill-color': 'red',
          },
        }),
      ],
      
    });
      map.on('pointermove', function (event: any) {
      const type: any = map.hasFeatureAtPixel(event.pixel) ? 'pointer' : 'inherit';
      map.getViewport().style.cursor = type;
    });
      return () => {
        map.setTarget("")
      }
  }, [])



  return (
    <div style={{height:'100vh',width:'100%'}} id="map" className="map" />
  )

}



