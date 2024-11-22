import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create icons directory if it doesn't exist
const iconsDir = join(__dirname, 'public', 'icons');
if (!existsSync(iconsDir)) {
    mkdirSync(iconsDir, { recursive: true });
}

const svgPath = join(__dirname, 'public', 'petanque.svg');
const sizes = [192, 512];

async function convertToIcons() {
    try {
        for (const size of sizes) {
            const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
            await sharp(svgPath)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            console.log(`Created ${outputPath}`);
        }
    } catch (error) {
        console.error('Error converting icons:', error);
    }
}

convertToIcons();
