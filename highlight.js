(async function () {
    const xmlFileUrl = "https://raw.githubusercontent.com/CodeKey-1/Code-Coverage/main/workflow.xml"; // Update this if needed

    async function fetchCoverageData() {
        try {
            const response = await fetch(xmlFileUrl);
            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml");

            const coverageData = {};
            const lines = xmlDoc.querySelectorAll("line");

            lines.forEach(line => {
                const lineNumber = parseInt(line.getAttribute("number"), 10);
                const hits = parseInt(line.getAttribute("hits"), 10);
                
                if (hits > 0) {
                    const fileName = "kuka_code.src"; // Adjust based on XML if needed
                    if (!coverageData[fileName]) {
                        coverageData[fileName] = [];
                    }
                    coverageData[fileName].push(lineNumber);
                }
            });

            return coverageData;
        } catch (error) {
            console.error("Error fetching XML:", error);
            return {};
        }
    }

    async function highlightCoveredLines() {
        if (!window.location.href.includes("?coverage=true")) return; // Only trigger on special links

        const coverageData = await fetchCoverageData();
        const fileName = document.querySelector("strong.final-path")?.innerText.trim(); // Get filename

        if (!coverageData[fileName]) return;

        document.querySelectorAll(".blob-code").forEach((line, index) => {
            if (coverageData[fileName].includes(index + 1)) {
                line.style.backgroundColor = "rgba(144, 238, 144, 0.5)"; // Light green
            }
        });
    }

    window.addEventListener("load", highlightCoveredLines);
})();
