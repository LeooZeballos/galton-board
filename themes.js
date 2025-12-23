/**
 * Metadata for all available themes, grouped by category.
 * Each theme contains a display label and a palette of colors.
 * @type {Array<{group: string, themes: Object<string, {label: string, colors: string[]}>}>}
 */
const themeMetadata = [
    {
        group: "Aesthetic & Abstract",
        themes: {
            neon: { label: "Neon", colors: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#22d3ee'] },
            cyberpunk: { label: "Cyberpunk", colors: ['#fcee0a', '#00f0ff', '#ff00ff', '#39ff14', '#7df9ff'] },
            sunset: { label: "Sunset/Vaporwave", colors: ['#2d00f7', '#6a00f4', '#8900f2', '#a100f2', '#b100e8', '#bc00dd', '#d100d1', '#db00b6', '#e500a4', '#f20089', '#ff9e00', '#ff0000'] },
            ocean: { label: "Ocean", colors: ['#006d77', '#83c5be', '#edf6f9', '#00b4d8', '#ade8f4'] },
            toxic: { label: "Toxic", colors: ['#ccff33', '#9ef01a', '#70e000', '#38b000', '#008000'] },
            fire: { label: "Fire / Volcanic", colors: ['#fca5a5', '#f87171', '#ef4444', '#b91c1c', '#fbbf24'] },
            matrix: { label: "Matrix", colors: ['#22c55e', '#4ade80', '#16a34a', '#15803d', '#86efac'] },
            rainbow: { label: "Rainbow", colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'] },
            pastel: { label: "Pastel Dream", colors: ['#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff'] },
            midnight: { label: "Midnight", colors: ['#191970', '#000080', '#483d8b', '#6a5acd', '#7b68ee'] },
            coffee: { label: "Coffee", colors: ['#3e2723', '#4e342e', '#6d4c41', '#8d6e63', '#a1887f', '#d7ccc8'] }
        }
    },
    {
        group: "Football Clubs",
        themes: {
            sanlorenzo: { label: "San Lorenzo", colors: ['#1e3a8a', '#1d4ed8', '#dc2626', '#991b1b', '#2563eb'] },
            boca: { label: "Boca Juniors", colors: ['#00338d', '#fbe224ff', '#1d4ed8', '#e2f50bff', '#2563eb'] },
            river: { label: "River Plate", colors: ['#ffffff', '#f87171', '#dc2626', '#991b1b', '#000000'] },
            racing: { label: "Racing Club", colors: ['#75aadb', '#ffffff', '#3b82f6', '#75aadb', '#ffffff'] },
            independiente: { label: "Independiente", colors: ['#ef4444', '#dc2626', '#ffffff', '#991b1b', '#ef4444'] },
            newells: { label: "Newell's Old Boys", colors: ['#000000', '#dc2626', '#000000', '#dc2626', '#ffffff'] },
            velez: { label: "Vélez Sarsfield", colors: ['#ffffff', '#1e3a8a', '#ffffff', '#1d4ed8', '#ffffff'] },
            estudiantes: { label: "Estudiantes LP", colors: ['#e30613', '#ffffff', '#e30613', '#000000', '#ffffff'] },
            central: { label: "Rosario Central", colors: ['#003067', '#ffcc00', '#003067', '#ffcc00', '#003067'] },
            talleres: { label: "Talleres", colors: ['#001f5b', '#ffffff', '#001f5b', '#ffffff', '#001f5b'] },
            belgrano: { label: "Belgrano", colors: ['#6cacde', '#000000', '#6cacde', '#ffffff', '#6cacde'] }
        }
    },
    {
        group: "Countries",
        themes: {
            argentina: { label: "Argentina", colors: ['#75aadb', '#ffffff', '#fbbf24', '#75aadb', '#ffffff'] },
            brazil: { label: "Brazil", colors: ['#009c3b', '#ffdf00', '#002776', '#009c3b', '#ffdf00'] },
            uruguay: { label: "Uruguay", colors: ['#55cdfc', '#ffffff', '#55cdfc', '#ffffff', '#fcd116'] },
            usa: { label: "USA", colors: ['#b22234', '#ffffff', '#3c3b6e', '#b22234', '#ffffff'] },
            france: { label: "France", colors: ['#0055a4', '#ffffff', '#ef4135', '#0055a4', '#ffffff'] },
            germany: { label: "Germany", colors: ['#000000', '#dd0000', '#ffce00', '#000000', '#dd0000'] },
            italy: { label: "Italy", colors: ['#009246', '#ffffff', '#ce2b37', '#009246', '#ffffff'] },
            spain: { label: "Spain", colors: ['#aa151b', '#f1bf00', '#aa151b', '#f1bf00', '#aa151b'] },
            japan: { label: "Japan", colors: ['#ffffff', '#bc002d', '#ffffff', '#bc002d', '#ffffff'] }
        }
    },
    {
        group: "Nature",
        themes: {
            forest: { label: "Forest", colors: ['#0f3d0f', '#2d6a4f', '#40916c', '#52b788', '#d8f3dc'] },
            cherryBlossom: { label: "Cherry Blossom", colors: ['#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff', '#cdb4db'] },
            desert: { label: "Desert", colors: ['#edc9af', '#d2b48c', '#c2b280', '#e6be8a', '#d4a373'] },
            arctic: { label: "Arctic Ice", colors: ['#e0f7fa', '#b2ebf2', '#81d4fa', '#4fc3f7', '#FFFFFF'] }
        }
    },
    {
        group: "Space",
        themes: {
            galaxy: { label: "Galaxy", colors: ['#3a0ca3', '#4361ee', '#f72585', '#7209b7', '#480ca8'] },
            nebula: { label: "Nebula", colors: ['#ff0099', '#493240', '#9900cc', '#330066', '#ff6600'] },
            mars: { label: "Mars", colors: ['#993300', '#cc3300', '#ff6600', '#660000', '#ff9966'] },
            aurora: { label: "Aurora", colors: ['#00ff99', '#00ccff', '#cc00ff', '#330066', '#003300'] }
        }
    },
    {
        group: "Dessert",
        themes: {
            cottonCandy: { label: "Cotton Candy", colors: ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'] },
            chocolate: { label: "Chocolate", colors: ['#3e2723', '#5d4037', '#795548', '#8d6e63', '#a1887f'] },
            mintChoco: { label: "Mint Choco", colors: ['#3EB489', '#2E8B57', '#3e2723', '#5d4037', '#e0f2f1'] }
        }
    },
    {
        group: "Monochrome",
        themes: {
            grayscale: { label: "Grayscale", colors: ['#eeeeee', '#bdbdbd', '#9e9e9e', '#757575', '#424242', '#000000'] },
            sepia: { label: "Sepia", colors: ['#704214', '#8b4513', '#d2b48c', '#deb887', '#f4a460'] },
            blueprint: { label: "Blueprint", colors: ['#003366', '#004080', '#0059b3', '#ffffff', '#cccccc'] }
        }
    },
    {
        group: "Seasonal",
        themes: {
            christmas: { label: "Christmas", colors: ['#ef4444', '#22c55e', '#ffffff', '#eab308', '#dc2626'] },
            halloween: { label: "Halloween", colors: ['#f97316', '#000000', '#a855f7', '#fb923c', '#581c87'] },
            valentine: { label: "Valentine's", colors: ['#ff0000', '#ff69b4', '#ffc0cb', '#ffffff', '#8b0000'] },
            easter: { label: "Easter", colors: ['#ffff99', '#99ff99', '#99ffff', '#ff99ff', '#ffcc99'] }
        }
    }
];

const themes = {};
themeMetadata.forEach(group => {
    Object.entries(group.themes).forEach(([key, value]) => {
        themes[key] = value.colors;
    });
});
