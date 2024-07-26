import fs from 'fs/promises';
import sharp from 'sharp';
import {parse, stringify} from 'svgson';
import {DOMParser, XMLSerializer} from "xmldom"

const generateThumb = async (svgFilePath, title, platform) => {
        try {
            // Definir tamaños según la plataforma
            const sizes = {
                youtube: {width: 1280, height: 720},
                twitch: {width: 1920, height: 1080}
            };

            const {width, height} = sizes[platform] || sizes['youtube']; // Default a YouTube si la plataforma no es reconocida

            // Ruta para la imagen de salida
            const outputFilePath = `output/thumb_${platform}.png`;

            // Leer el archivo SVG
            const svgContent = await fs.readFile(svgFilePath, 'utf8');

            // Parsear el contenido SVG a JSON
            // const svgJson = await parse(svgContent);
            const doc = new DOMParser().parseFromString(svgContent, 'application/xml');

            const textNode = doc.getElementById("titulo");
            if (textNode) {
                textNode.textContent = title; // Actualizar el título en el DOM
            } else {
                console.error('No se encontró el nodo de texto con id "titulo" en el SVG.');
                process.exit(1);
            }
            // Convertir el DOM modificado de nuevo a JSON
            // Actualizar el título del video
            // Encontrar el nodo de texto en el SVG y actualizar su contenido
            // const updateTextNode = (node) => {
            //
            //     if (node.attributes.id === 'titulo') {
            //         node.children = [{
            //             value: "Este es el nuevo valor",
            //         }];
            //
            //     } else if (node.children) {
            //         node.children.forEach(updateTextNode);
            //     }
            // };

            // svgJson.children.forEach(updateTextNode);
            //
            // // Convertir el JSON modificado de nuevo a SVG
            // const modifiedSvgContent = stringify(svgJson);

            const modifiedSvgContent = new XMLSerializer().serializeToString(doc)
            console.log(modifiedSvgContent)
            modifiedSvgContent.save
            // Convertir el SVG modificado a PNG usando sharp
            await sharp(Buffer.from(modifiedSvgContent))
                .resize(width, height)  // Redimensionar según la plataforma
                .toFormat("png")
                .toFile(outputFilePath);

            console.log(`Thumbnail generated: ${outputFilePath}`);
        } catch
            (error) {
            console.error('Error generating thumbnail:', error);
        }
    }
;

// Toma la ruta del SVG, título, y plataforma como argumentos de la línea de comandos
const [svgFilePath, title, platform] = process.argv.slice(2);
if (!svgFilePath || !title || !platform) {
    console.error('Please provide the SVG file path, title, and platform (youtube or twitch).');
    process.exit(1);
}

generateThumb(svgFilePath, title, platform);
