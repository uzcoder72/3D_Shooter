document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const exportBtn = document.getElementById('exportBtn');
    const progressBar = document.getElementById('progressBar');
    let currentSlide = 0;

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        currentSlide = index;
        updateProgress();
    }

    function updateProgress() {
        const progress = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            showSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            showSlide(currentSlide - 1);
        }
    }

    // --- Export Logic ---
    async function exportToPPTX() {
        exportBtn.innerText = "Generating...";
        exportBtn.disabled = true;

        const slidesData = [];
        slides.forEach(slide => {
            const title = slide.getAttribute('data-title') || "Slide";
            const contentNodes = slide.querySelectorAll('p, li');
            const content = Array.from(contentNodes).map(node => ({
                text: node.innerText,
                type: node.tagName
            }));

            slidesData.push({
                title: title,
                content: content
            });
        });

        try {
            const response = await fetch('http://localhost:3000/generate-pptx', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ slides: slidesData })
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "3D_Shooter_Presentation.pptx";
                document.body.appendChild(a);
                a.click();
                a.remove();
                exportBtn.innerText = "Download PPTX";
            } else {
                alert("Failed to generate PPTX. Ensure server is running (node server.js).");
                exportBtn.innerText = "Export Failed";
            }
        } catch (error) {
            console.error("Export error:", error);
            alert("Error connecting to server. Is it running?");
            exportBtn.innerText = "Export to PPTX";
        }
        exportBtn.disabled = false;
    }

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    exportBtn.addEventListener('click', exportToPPTX);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    // Initialize
    showSlide(0);
});
