import React from 'react';

// Icon svgs are from tabler-icons.io

const Icon = ({ type, width = 24, strokeWidth = 2 }) => {
    let iconType = '';

    switch (type) {
        case 'selector':
            iconType =
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-selector" width={width} height="24" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 9l4 -4l4 4"></path>
                    <path d="M16 15l-4 4l-4 -4"></path>
                </svg>
            break;
        case 'chevrons-up':
            iconType =
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-up" width={width} height="24" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 11l5 -5l5 5"></path>
                    <path d="M7 17l5 -5l5 5"></path>
                </svg>
            break;
        case 'chevrons-down':
            iconType =
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevrons-down" width={width} height="24" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M7 7l5 5l5 -5"></path>
                    <path d="M7 13l5 5l5 -5"></path>
                </svg>
            break;
        case 'chevron-up':
            iconType =
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-up" width={width} height="24" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M6 15l6 -6l6 6"></path>
                </svg>
            break;
        case 'chevron-down':
            iconType =
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-chevron-down" width={width} height="24" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M6 9l6 6l6 -6"></path>
                </svg>
            break;
        case 'eyeglass':
            iconType =
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eyeglass" width="24" height="24" viewBox="0 0 24 24" stroke-width={strokeWidth} stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 4h-2l-3 10"></path>
                    <path d="M16 4h2l3 10"></path>
                    <path d="M10 16l4 0"></path>
                    <path d="M21 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5"></path>
                    <path d="M10 16.5a3.5 3.5 0 0 1 -7 0v-2.5h7v2.5"></path>
                </svg>
            break;

        default: iconType;
    }
    return iconType;
}

export default Icon;