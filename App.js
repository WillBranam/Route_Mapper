/*RouteMapper Branam
description: 
this app allows users to track a run and are given data about their run

function: 
the app has a home and map screen which are navigated by buttons.
the home app is shown by default and navigates to the map
the map screen has information shown at the top, with buttons on the bottom.
on the map, the user location is tracked and followed with a polyline while 
the run is active. The reset button resets the run an data, the start button
starts the run and begins recording data, and the finish button saves and 
sends the data. the location obtained using built in native event function
and that data is sent to an array where it is used to ping the markers and
draw the poly line. Using various methods and hooks, I save and display data
about the user's run. However I did import a timer at the top of the map 
screen which I use to display and obtain time. Using multiple hooks, methods, 
and turnary operators, I logically display components on the map.

bugs/limitations:
there is an error if user location is unavailable, but i have only ran into this
issue using a simulator.
distance is calculated from the starting point, not from point to point making 
distance and speed slightly inaccurate.
If the user goes back to the home screen using the blue arrow at the top, 
data is not saved.
Using the blue arrow at the top resets the map page and all the data.
*/

import React, {useState} from 'react';
import home from "./screens/home"
import Navigator from './routes/homeStack';
import map from "./screens/map"

export default function App(){
  console. disableYellowBox = true;
  return(
    <Navigator />
  )
}