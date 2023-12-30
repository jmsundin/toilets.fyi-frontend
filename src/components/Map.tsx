import { Fragment, useRef, useEffect } from "react";
import ReactDOMServer from 'react-dom/server';
// import NearMeIcon from '@mui/icons-material/NearMe';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

import Script from 'next/script';

let map: google.maps.Map, infoWindow: google.maps.InfoWindow;

declare global {
    interface Window {
        google: any;
        initMap: () => void;
    }
}

export default function Map() {
    useEffect(() => {
        const div = document.getElementById('__next');
        div!.classList.add('h-full');

        window.initMap = () => {
            const google = window.google;
            map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 6,
            });
            infoWindow = new google.maps.InfoWindow();
            
            const locationIcon = ReactDOMServer.renderToString(<LocationOnOutlinedIcon />);
            const locationButton = document.createElement("button");
            locationButton.style.width = "40px";
            locationButton.style.height = "40px";
            locationButton.style.textAlign = "center";
            locationButton.style.verticalAlign = "middle";
            locationButton.style.backgroundColor = "rgb(255, 255, 255)";
            locationButton.style.borderRadius = "2px";
            locationButton.style.boxShadow = "rgba(0, 0, 0, 0.3) 0px 1px 4px -1px";
            locationButton.style.marginRight = "10px";

            locationButton.innerHTML = locationIcon;

            locationButton.addEventListener("click", handleGetLocation);

            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);
        };

    }, []);

    return (
        <Fragment>
            <div id="map" className="w-full h-full"></div>
            <Script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&callback=initMap&v=weekly`} strategy="afterInteractive"></Script>
        </Fragment>
    );
}

function handleGetLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
            const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("Location found.");
            infoWindow.open(map);
            map.setCenter(pos);
            map.setZoom(15);
        },
        () => {
            handleLocationError(true, infoWindow, map.getCenter()!);
        }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter()!);
    }
};

function handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: google.maps.InfoWindow,
    pos: google.maps.LatLng
) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
    browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}