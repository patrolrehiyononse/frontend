import React, { useEffect, useState } from 'react';
import {Feature, Map, Overlay, View} from 'ol/index.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Point, MultiPoint} from 'ol/geom.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {useGeographic} from 'ol/proj.js';
import {Attribution, defaults as defaultControls} from 'ol/control.js';


export const LocatePerson = (props: any) => {

  const place = props.location
//   const place = [125.643030, 7.132380]

  const [target, setTarget] = useState<any>("map")
  const attribution = new Attribution({
    collapsible: false,
  });

  useGeographic();
  const point = new Point(place);
  
  
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



