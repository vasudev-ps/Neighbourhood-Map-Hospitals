# Neighbourhood-Map
Neighbourhood-Map is a project where users can fetch details of their near by hospitals.

###File Structure
* css
  * `style.css` - Takes care of the web-page style.
* js
  * `app.js` - Works with `knockout.js` for wikipedia lists.
  * `map.js` - Works with Google Maps API for map related things.
* `index.html` - Main page

###Manual
User will first see their location on the map.(location service of browser should be on if not app will prompt the user).
and Hospitals arround the area within 5Km radius.

For more options user should click on the **hamburger menu on the top left side** of application.
Which will have Wikipedia links about the marked city. to explore more user can select and enter the options.

User can select the required Hospitals to be searched on the map directly **or** search a reqired place and then select the Hospitals.

The Markers will apear on the map **which can be filtered** on basis of distance from place.

Every time the user filters the marker List of marker will be updated and appear on **pressing a button**.

###How does it work?
Project Uses 
* API: Google maps and Wikipedia.
* javascript libraries: jQuery and Knockout

* Googles geolocations Service is used to set the map to user area.

* Project uses google places library to search the place of user input.Autocomlete service is used.
  Depending upon the input Wikipedia API returns the result of related wiki links, which will be automatically binded to DOM using  knockout JS.
* The Map will be focused upon the user input city and a marker will be placed.
* If user selects any type of establishments. Markers will be placed based on the results of google places library.
* On clicked on the marker the details of the places will be displayed in infowindow.
* Marker list appears and can be filtered.
