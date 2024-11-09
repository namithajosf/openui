const selectImageBtn = document.getElementById('selectImageBtn');
        const uploadImageBtn = document.getElementById('uploadImageBtn');
        const removeImageBtn = document.getElementById('removeImageBtn');
        const imageInput = document.getElementById('imageInput');
        const imagePreview = document.getElementById('imagePreview');
        const imageResult = document.getElementById('imageResult');
        const progressElement = document.getElementById('imageProgress');

        selectImageBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                imagePreview.innerHTML = `<img src="${URL.createObjectURL(file)}" alt="Preview">`;
                uploadImageBtn.disabled = false;
                removeImageBtn.style.display = 'inline';
            }
        });

        uploadImageBtn.addEventListener('click', async () => {
            const file = imageInput.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                progressElement.style.display = 'block';
                progressElement.querySelector('.progress-bar').style.width = '0%';

                const response = await fetch('http://localhost:8000/process-media', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) throw new Error('Processing failed');

                const blob = await response.blob();
                imagePreview.innerHTML = `<img src="${URL.createObjectURL(blob)}" alt="Processed">`;

                imageResult.className = 'result success';
                imageResult.textContent = 'Image processed successfully!';
            } catch (error) {
                imageResult.className = 'result error';
                imageResult.textContent = `Error: ${error.message}`;
            } finally {
                progressElement.querySelector('.progress-bar').style.width = '100%';
            }
        });

        removeImageBtn.addEventListener('click', () => {
            imageInput.value = '';
            imagePreview.innerHTML = '';
            uploadImageBtn.disabled = true;
            removeImageBtn.style.display = 'none';
            imageResult.textContent = '';
            progressElement.style.display = 'none';
        });