import { Injectable } from "@angular/core";

import { Feature, Collection } from 'ol';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Snap } from 'ol/interaction';
import { LineString } from 'ol/geom';
import { Style } from 'ol/style';

import * as turf from '@turf/turf';

@Injectable({
  providedIn: 'root',
})
export class GuideSnapService {
  snapLayer: VectorLayer;

  edgeSnapInteraction: Snap;
  vertexSnapInteraction: Snap;

  intersectionLineString: LineString;
  guideCollection: Collection;

  constructor() {
    this.initializeInteractions();
  }

  addDrawGuides(basePoint, extent) {
    // Add Horizontal Guide
    const horizontalCoords = [[extent[0], basePoint[1]], [extent[2], basePoint[1]]];
    const horizontalGuide = new Feature({
        geometry: new LineString(horizontalCoords),
        isIntersectionLineString: false
    });
    if(this.compareToOtherGuides(horizontalGuide) == true) {
        this.guideCollection.push(horizontalGuide)  
    } 

    // Add Vertical Guide
    const verticalCoords = [[basePoint[0], extent[1]], [basePoint[0], extent[3]]];
    const verticalGuide = new Feature({
        geometry: new LineString(verticalCoords),
        isIntersectionLineString: false
    });
    if(this.compareToOtherGuides(verticalGuide) == true) {
        this.guideCollection.push(verticalGuide)    
    }
  }

  clearDrawGuides() {
      this.intersectionLineString.getGeometry().setCoordinates([]);
      this.guideCollection.clear();
  }

  private initializeInteractions() {
    this.guideCollection = new Collection();

    this.snapLayer = new VectorLayer({
        source: new VectorSource({
      features: this.guideCollection
    }),
      //  style: new Style({})
    });

    this.edgeSnapInteraction = new Snap({
        features: this.guideCollection,
        vertex: false,
        edge: true,
        pixelTolerance: 15
    });

    this.intersectionLineString = new Feature({
        geometry:new LineString([])
    });

    this.vertexSnapInteraction = new Snap({
        features: new Collection([this.intersectionLineString]),
        vertex: true,
        edge: false,
        pixelTolerance: 30
    });
  }

  private checkLinesEqual(line1, line2): boolean {
    let result = (line1[0][0] == line2[0][0] && line1[0][1] == line2[0][1] && line1[1][0] == line2[1][0] && line1[1][1] == line2[1][1]);
    return (line1[0][0] == line2[0][0] && line1[0][1] == line2[0][1] && line1[1][0] == line2[1][0] && line1[1][1] == line2[1][1]);
  }  

  private compareToOtherGuides(newGuide): boolean {
    const guides = this.guideCollection.getArray();
    const newGuideCoords = newGuide.getGeometry().getCoordinates();
    let isDuplicate = false;

    for (let i = 0; i< guides.length; i++) {
        const g = guides[i];
        const existingGuideCoords = g.getGeometry().getCoordinates();
        if(this.checkLinesEqual(newGuideCoords, existingGuideCoords)) {
            isDuplicate = true;
            break;
        }
        let intersects = turf.lineIntersect(turf.lineString(existingGuideCoords).geometry, turf.lineString(newGuideCoords).geometry);
        if(intersects.features.length > 0) {

            let intersectPoint = intersects.features[0].geometry.coordinates;
            this.intersectionLineString.getGeometry().appendCoordinate(intersectPoint);
        }
    }
    return !isDuplicate; 
  }

}