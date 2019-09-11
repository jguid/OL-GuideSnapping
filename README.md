# OL-GuideSnapping
Angular app with OpenLayers map and a GuideSnapService.

When drawing a polygon, the GuideSnapService draws invisible horizontal and vertical guides from each point placed to make drawing 90 degree lines easier.

The GuideSnapService also creates an OpenLayers LineString that connects each of the horizontal/vertical guide intersections for stronger vertex snapping. Uses turf.js library's lineIntersect function to identify intersections of guides.


Demo: https://stackblitz.com/edit/angular-ol-90degreesnapping
