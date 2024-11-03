function genTex(height, width, pixels) {
    return `
	    
#pragma once
	
#include "../../src/graphics/tex.hpp"

const tex_t texture = {
    GL_RGBA,
    ${width},
    ${height},
    ${pixels},
    ${pixels.length},
}
    
   `.trim();
}
    
function createPixelEditor(elementId, N, pixelSize = 20) {
    const editor = document.getElementById(elementId);
    editor.style.gridTemplateColumns = `repeat(${N}, ${pixelSize}px)`;
    editor.style.gridTemplateRows = `repeat(${N}, ${pixelSize}px)`;
    
    let selectedColor = 'black';
    
    // Create pixels
    for (let i = 0; i < N * N; i++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel');
        pixel.style.width = `${pixelSize}px`; // Set the width
        pixel.style.height = `${pixelSize}px`; // Set the height
        pixel.addEventListener('click', () => {
            pixel.style.backgroundColor = selectedColor;
        });
        editor.appendChild(pixel);
    }
    
    // Create color palette
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown'];
    const palette = document.getElementById('color-palette');
    
    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color');
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', () => {
            selectedColor = color;
        });
        palette.appendChild(colorDiv);
    });
}

function generateHppFile(elementId, name, targetElementId) {
    const editor = document.getElementById(elementId);
    const pixels = editor.children;
    const width = Math.sqrt(pixels.length); // Assuming square grid
    const height = width;
    const fmt = "GL_RGBA"; // Change this based on your needs
    const data = [];

    // Collect pixel data
    for (let i = 0; i < pixels.length; i++) {
	const pixel = pixels[i];
	const color = window.getComputedStyle(pixel).backgroundColor;
	
	// Check if the color is valid and contains RGBA values
	let rgba = [255, 255, 255, 255]; // Default to white and fully opaque
	
	if (color) {
            const match = color.match(/\d+/g);
            if (match && match.length >= 3) {
		rgba = match.map(Number);
		if (rgba.length === 3) {
                    rgba.push(255); // Add alpha if not present
		}
            }
	}
	
	data.push(...rgba); // Push R, G, B, A values
    }

    // Prepare the data array as a comma-separated string
    const dataString = data.join(', ');

    // Construct the .hpp file content
    const hppContent = `#pragma once

#include "../../src/graphics/tex.hpp"

uint8_t ${name}_arr[] = { ${dataString} };

const tex_t ${name} = {
    ${fmt}, 
    ${width}, ${height},
    ${name}_arr,
    ${data.length}
};`;

    // Write the content into the target DOM element
    document.getElementById(targetElementId).textContent = hppContent;
}

function copyToClipboard() {
    const textBuffer = document.getElementById('text-buf');
    navigator.clipboard.writeText(textBuffer.innerText).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
