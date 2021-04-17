// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow, geocoder, mark=null;
const defaultPos={ lat: 13.5335485, lng: -84.8663777 };
const managuaPos={ lat: 12.137242553675303, lng: -86.26943906044922 };

function initMap() {
  map = new google.maps.Map(document.getElementById("rfmap"), {
    center: defaultPos,
    zoom: 6,
  });
  geocoder=new google.maps.Geocoder();
  infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent("Ubicación actual");
  const locationButton = document.createElement("button");
  locationButton.textContent = "Ir a ubicación actual";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", (event) => {
    // Try HTML5 geolocation.
    event.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          //infoWindow.setPosition(pos);
          map.setCenter(pos);
          map.setZoom(16);
          setMarker(map, pos);
        },
        () => {
          handleLocationError(true);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false);
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  alert((browserHasGeolocation) 
  ? "Error: El Servicio de geolocalización falló. \nSeleccione su ubicación manualmente"
  : "Error: Su navegador no soporta geolocalización. \nSeleccione su ubicación manualmente");
  map.setCenter(managuaPos);
  map.setZoom(14);
  setMarker(map, managuaPos);
}
/**
   * Caputra la ubicación del marcador y la asigna al input
   */
function setMarkPosition(){
position=mark.getPosition();
addressInput=document.getElementById("rfgeoaddress");
addressInput.value=`https://www.google.com/maps/search/?api=1&query=${position.lat()},${position.lng()}`;
}
/**
 * Crea el marcador en la posición georeferenciada
 * @param map 
 * @param pos 
 */
function setMarker(map, pos){
  if(mark!=null){
    mark.setMap(null); 
    mark=null;
  }
  mark=new google.maps.Marker({
      position:pos,
      map,
      draggable:true,
  });
  setMarkPosition();
  /**
   * captura la nueva ubicación cuando termina de moverse el marcador
   */
  google.maps.event.addListener(mark, 'dragend',()=>{
    setMarkPosition();
    infoWindow.open(map, mark);
  });
  /**
   * Muestra el infowindow al pasar el currsor sobre el marcador
   */
  google.maps.event.addListener(mark, 'mouseover',()=>{
      infoWindow.open(map, mark);
  });
  /**
   * oculta el infowindow al ser arrastrado
   */
    google.maps.event.addListener(mark, 'drag',()=>{
    infoWindow.close();
  });
  /**
   * cierra el infowindow cundo el cursor sale del marcador
   */
  google.maps.event.addListener(mark, 'mouseout',()=>{
      infoWindow.close();
  })
    
}
