import { Component, Input, OnInit } from '@angular/core';
import { GuideSnapService } from './guide-snap.service';

import { View, Map } from 'ol';
import { Vector as VectorLayer, Image as ImageLayer, Tile as TileLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Draw } from 'ol/interaction';
import { Polygon } from 'ol/geom';
import { never, platformModifierKeyOnly, noModifierKeys } from 'ol/events/condition'

@Component({
  selector: 'openlayers-map',
  templateUrl: './openlayers-map.component.html'
})
export class OpenlayersMapComponent implements OnInit {
  map: Map;
  drawInteraction: Draw;
  private pointCount: number = 0;

  constructor(private guideSnapService: GuideSnapService) { }

  ngOnInit() {
    this.drawInteraction = new Draw({
      source: new VectorSource({}),
      type: 'Polygon',
      freehandCondition: never,
      condition: (e) => {
        return (platformModifierKeyOnly(e) || noModifierKeys(e));
      },
      geometryFunction: (coords, geom) => {
        return this.polygonGeomFunction(coords, geom);
      }
    });
    this.drawInteraction.on('drawend', (e) => {
      this.guideSnapService.clearDrawGuides();
    });


    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({ url: 'https://{a-c}.tile.osm.org/{z}/{x}/{y}.png' })
        }),
        this.guideSnapService.snapLayer
      ],
      view: new View({
        center: [288626, 5885039],
        zoom: 5
      }),
      interactions: [
        this.drawInteraction,
        this.guideSnapService.edgeSnapInteraction,
        this.guideSnapService.vertexSnapInteraction
      ]
    });

  }

  private polygonGeomFunction(coords, geom) {
    if(!geom) {
      this.pointCount = 0;
      geom = new Polygon(coords);
    };
    if (coords[0].length > this.pointCount) {
      this.pointCount = coords[0].length;

      //ADD DRAW GUIDES
      this.guideSnapService.addDrawGuides(coords[0][coords[0].length-1], this.map.getView().calculateExtent());
    }
    geom.setCoordinates(coords);
    return geom;
  }

}
