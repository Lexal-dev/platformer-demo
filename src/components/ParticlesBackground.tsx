"use client";

import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback, useMemo } from "react";
import { Engine } from "tsparticles-engine";


export default function ParticlesBackground() {
  	const options = useMemo(() => {
		return {
			fullScreen: { enable: true, zIndex: -1 },
			background: { color: { value: "#000000" } },
			particles: {
				number: {
					value: 350,
    				density: { enable: true },
    				limit: 350,
				},
				shape: {
					type: "polygon",
					options: {
					  polygon: {
						sides: 5,
					  },
					},
				  },
				stroke: {
					width: 0.5,
					color: "#ffffff"
				},
				size: {
					value: {min: 1, max: 3}, 
				},
				links: {
					enable: true,          
					distance: 100,         
					color: "#f0fff4",      
					opacity: 0.4,    
					width: 1.5,
					frequency: 1,
				  },
				rotate: {
					value: { min: 0, max: 360 }, 
					direction: "random",
					animation: {
					  enable: true,
					  speed: {min: 1, max: 10}, 
					  sync: false 
					}
				},
				move: {
					enable: true,
					outMode: "bounce" as "bounce" | "none" | "out" | "destroy" | "split",
					speed: {min: 0.20, max: 3},
				}
			},
			interactivity: {
				events: {
					onHover: {
						enable: true,
						mode: "repulse", 
					},
				},
				modes: {
					repulse: {
						distance: 100,   
						duration: 1,    
						factor: 2,     
					  },
				},
				
			},
		};
  	},[] )

	const particlesInit = useCallback(async (engine: Engine) => {
		await loadSlim(engine);
	}, [])
	
  	return (
  	  <Particles init={particlesInit} options={options} />
  	);
}
