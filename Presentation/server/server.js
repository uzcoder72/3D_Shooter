const express = require('express');
const pptxgen = require('pptxgenjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-pptx', (req, res) => {
    const slideData = req.body.slides;

    // Create a new Presentation
    let pres = new pptxgen();

    // Add properties
    pres.title = "3D Shooter Presentation";
    pres.company = "DefaultCompany";

    // Loop through slide data and add slides
    slideData.forEach((slide) => {
        let pptxSlide = pres.addSlide();

        // Background color (matching dark theme)
        pptxSlide.background = { color: "050505" };

        // Title
        pptxSlide.addText(slide.title, {
            x: 0.5, y: 0.5, w: 9, h: 1,
            color: "00FFCC", // Accent color
            fontSize: 24,
            bold: true,
            align: pres.AlignH.center
        });

        // Content
        // We'll approximate the layout. Left col text, Right col image placeholder

        let textContent = slide.content.map(p => p.text).join('\n\n');

        pptxSlide.addText(textContent, {
            x: 0.5, y: 1.5, w: 4.5, h: 4,
            color: "F0F0F0",
            fontSize: 14,
            bullet: false
        });

        // Image Placeholder on the right
        pptxSlide.addText("[IMAGE PLACEHOLDER]", {
            x: 5.5, y: 1.5, w: 4, h: 3,
            color: "FF0055",
            fontSize: 14,
            align: pres.AlignH.center,
            shape: pres.ShapeType.rect,
            fill: { color: "1a1a1a" },
            line: { color: "FF0055", width: 2, dashType: "dash" }
        });
    });

    // Generate and send
    const filename = `3D_Shooter_Presentation_${Date.now()}.pptx`;
    const filepath = path.join(__dirname, filename);

    pres.writeFile({ fileName: filepath })
        .then(() => {
            res.download(filepath, filename, (err) => {
                if (err) {
                    console.error("Error sending file:", err);
                }
                // Cleanup file after sending
                setTimeout(() => {
                    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
                }, 5000);
            });
        })
        .catch((err) => {
            console.error("Error creating PPTX:", err);
            res.status(500).send("Error generating presentation");
        });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
