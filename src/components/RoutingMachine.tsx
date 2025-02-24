import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import type { Control, LatLng } from 'leaflet';

// Extend the L (Leaflet) type to include Routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: RoutingControlOptions): Control;
    interface RoutingControlOptions {
      waypoints: LatLng[];
      routeWhileDragging?: boolean;
      showAlternatives?: boolean;
      show?: boolean;
      lineOptions?: {
        styles?: {
          color: string;
          weight: number;
        }[];
      };
    }
  }
}

interface RoutingMachineProps {
  userLocation: [number, number];
  destination: [number, number];
}

export function RoutingMachine({ userLocation, destination }: RoutingMachineProps) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      routeWhileDragging: true,
      showAlternatives: true,
      lineOptions: {
        styles: [{ color: '#0b57d0', weight: 4 }]
      },
      show: true, // Show the instructions panel
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    // Style the instructions container
    const container = routingControl.getContainer();
    if (container) {
      container.style.backgroundColor = 'white';
      container.style.padding = '12px';
      container.style.borderRadius = '8px';
      container.style.maxHeight = '300px';
      container.style.overflowY = 'auto';
      container.style.margin = '12px';
      container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination]);

  return null;
} 