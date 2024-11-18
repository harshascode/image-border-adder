document.getElementById('upload').addEventListener('change', function (event) {
    const files = event.target.files;
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Clear previous images
    const zipButton = document.getElementById('downloadAllButton');
    zipButton.style.display = 'none';

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-wrapper';

            const uploadedImage = new Image();
            uploadedImage.src = e.target.result;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            uploadedImage.onload = function () {
                const width = uploadedImage.width;
                const height = uploadedImage.height;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(uploadedImage, 0, 0);

                const borderSize = parseInt(document.getElementById('borderSize').value, 10);
                const borderColor = document.getElementById('borderColor').value;
                const watermarkText = document.getElementById('watermark').value;
                const watermarkSize = parseInt(document.getElementById('watermarkSize').value, 10);

                ctx.fillStyle = borderColor;
                ctx.fillRect(0, 0, width, borderSize); // Top border
                ctx.fillRect(0, 0, borderSize, height); // Left border
                ctx.fillRect(width - borderSize, 0, borderSize, height); // Right border
                ctx.fillRect(0, height - borderSize, width, borderSize); // Bottom border

                // Add watermark text at the bottom
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
                ctx.font = `${watermarkSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(watermarkText, width / 2, height - borderSize - 10);

                imageWrapper.appendChild(uploadedImage);
                const borderedImage = new Image();
                borderedImage.src = canvas.toDataURL();
                imageWrapper.appendChild(borderedImage);

                const downloadButton = document.createElement('button');
                downloadButton.innerText = `Download ${file.name}`;
                downloadButton.onclick = function () {
                    const link = document.createElement('a');
                    link.download = file.name.replace(/\.\w+$/, '') + '_bordered.png';
                    link.href = canvas.toDataURL();
                    link.click();
                };
                imageWrapper.appendChild(downloadButton);
                imageContainer.appendChild(imageWrapper);
            };

            imageContainer.appendChild(imageWrapper); // Append the imageWrapper before the onload to avoid null error
        };
        reader.readAsDataURL(file);
    });

    zipButton.style.display = 'block';
});

document.getElementById('borderSize').addEventListener('input', updateBorders);
document.getElementById('borderColor').addEventListener('input', updateBorders);
document.getElementById('watermark').addEventListener('input', updateBorders);
document.getElementById('watermarkSize').addEventListener('input', updateBorders);

function updateBorders() {
    const files = document.getElementById('upload').files;
    const imageContainer = document.getElementById('imageContainer');
    imageContainer.innerHTML = ''; // Clear previous images

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-wrapper';

            const uploadedImage = new Image();
            uploadedImage.src = e.target.result;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            uploadedImage.onload = function () {
                const width = uploadedImage.width;
                const height = uploadedImage.height;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(uploadedImage, 0, 0);

                const borderSize = parseInt(document.getElementById('borderSize').value, 10);
                const borderColor = document.getElementById('borderColor').value;
                const watermarkText = document.getElementById('watermark').value;
                const watermarkSize = parseInt(document.getElementById('watermarkSize').value, 10);

                ctx.fillStyle = borderColor;
                ctx.fillRect(0, 0, width, borderSize); // Top border
                ctx.fillRect(0, 0, borderSize, height); // Left border
                ctx.fillRect(width - borderSize, 0, borderSize, height); // Right border
                ctx.fillRect(0, height - borderSize, width, borderSize); // Bottom border

                // Add watermark text at the bottom
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
                ctx.font = `${watermarkSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(watermarkText, width / 2, height - borderSize - 10);

                imageWrapper.appendChild(uploadedImage);
                const borderedImage = new Image();
                borderedImage.src = canvas.toDataURL();
                imageWrapper.appendChild(borderedImage);

                const downloadButton = document.createElement('button');
                downloadButton.innerText = `Download ${file.name}`;
                downloadButton.onclick = function () {
                    const link = document.createElement('a');
                    link.download = file.name.replace(/\.\w+$/, '') + '_bordered.png';
                    link.href = canvas.toDataURL();
                    link.click();
                };
                imageWrapper.appendChild(downloadButton);
                imageContainer.appendChild(imageWrapper);
            };

            imageContainer.appendChild(imageWrapper); // Append the imageWrapper before the onload to avoid null error
        };
        reader.readAsDataURL(file);
    });
}

document.getElementById('downloadAllButton').onclick = function () {
    const zip = new JSZip();
    const files = document.getElementById('upload').files;
    const zipFilename = 'bordered_images.zip';

    Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const width = img.width;
                const height = img.height;
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0);
                const borderSize = parseInt(document.getElementById('borderSize').value, 10);
                const borderColor = document.getElementById('borderColor').value;
                const watermarkText = document.getElementById('watermark').value;
                const watermarkSize = parseInt(document.getElementById('watermarkSize').value, 10);

                ctx.fillStyle = borderColor;
                ctx.fillRect(0, 0, width, borderSize); // Top border
                ctx.fillRect(0, 0, borderSize, height); // Left border
                ctx.fillRect(width - borderSize, 0, borderSize, height); // Right border
                ctx.fillRect(0, height - borderSize, width, borderSize); // Bottom border

                // Add watermark text at the bottom
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Semi-transparent white
                ctx.font = `${watermarkSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(watermarkText, width / 2, height - borderSize - 10);

                canvas.toBlob(function (blob) {
                    zip.file(file.name.replace(/\.\w+$/, '') + '_bordered.png', blob);
                    if (index === files.length - 1) {
                        zip.generateAsync({ type: 'blob' }).then(function (content) {
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(content);
                            link.download = zipFilename;
                            link.click();
                        });
                    }
                });
            };
        };
        reader.readAsDataURL(file);
    });
};
