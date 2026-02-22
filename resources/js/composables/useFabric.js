import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import * as fabric from 'fabric';
import GIF from 'gif.js';
import gifWorkerScript from 'gif.js/dist/gif.worker.js?raw';
const gifWorkerBlob = new Blob([gifWorkerScript], { type: 'application/javascript' });
const gifWorkerUrl = URL.createObjectURL(gifWorkerBlob);
import { parseGIF, decompressFrames } from 'gifuct-js';
import { BASE_WIDTH, BASE_HEIGHT } from '../data/invitation-constants';

export function useFabric(props, emit) {
    const fabricCanvas = ref(null);
    const canvasWrapper = ref(null);
    let canvas = null;
    let resizeObserver = null;
    const selectedObject = ref(null);
    let didClickOnce = false;

    // --- Canvas Initialization & Configuration ---

    const initCanvas = () => {
        if (!fabricCanvas.value) return;

        // Custom controls configuration
        const controls = fabric.controlsUtils.createObjectDefaultControls();
        delete controls.mt;
        delete controls.mb;
        delete controls.ml;
        delete controls.mr;

        fabric.InteractiveFabricObject.ownDefaults = {
            ...fabric.InteractiveFabricObject.ownDefaults,
            controls: controls,
            cornerStyle: 'circle',
            cornerStrokeColor: 'blue',
            cornerColor: 'lightblue',
            padding: 5,
            transparentCorners: false,
            borderColor: 'orange',
        };

        canvas = new fabric.Canvas(fabricCanvas.value, {
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            backgroundColor: 'transparent',
            preserveObjectStacking: true
        });

        fabric.InteractiveFabricObject.createControls = () => {
            return {};
        }

        // Extend toObject to include custom properties
        fabric.FabricObject.prototype.toObject = (function (toObject) {
            return function (propertiesToInclude) {
                return toObject.call(this, ['isTemplateFrame', 'isUserImage', ...propertiesToInclude]);
            };
        })(fabric.FabricObject.prototype.toObject);

        canvas.on('selection:created', e => (selectedObject.value = e.selected[0]));
        canvas.on('selection:updated', e => (selectedObject.value = e.selected[0]));
        canvas.on('selection:cleared', () => (selectedObject.value = null));

        canvas.on('object:modified', saveCanvasState);
        canvas.on('object:added', saveCanvasState);
        canvas.on('object:removed', saveCanvasState);
    };

    const resizeCanvas = () => {
        if (!canvas || !canvasWrapper.value) return;

        const containerWidth = canvasWrapper.value.clientWidth;
        const scale = containerWidth / BASE_WIDTH;
        const containerHeight = BASE_HEIGHT * scale;

        canvas.setDimensions({
            width: containerWidth,
            height: containerHeight,
        });

        canvas.setZoom(scale);
        canvas.calcOffset(); // Important for correct cursor positioning
        canvas.renderAll();
    };

    const setupResizeObserver = () => {
        if (canvasWrapper.value) {
            resizeObserver = new ResizeObserver(() => {
                resizeCanvas();
            });
            resizeObserver.observe(canvasWrapper.value);
        }
    };

    // --- State Management ---

    const saveCanvasState = () => {
        if (canvas) {
            const canvasData = canvas.toJSON();
            // Filter out the template frame from the saved data
            canvasData.objects = canvasData.objects.filter(obj => !obj.isTemplateFrame);
            emit('update:content', canvasData);
        }
    };

    const loadFonts = async (fontFamilies) => {
        try {
            const fontFaces = await Promise.all(
                fontFamilies.map(family => document.fonts.load(`1em ${family}`))
            );
        } catch (error) {
            console.error('Error loading fonts:', error);
        }
    };

    const loadCanvasState = async () => {
        if (!canvas) return;

        // Load fonts first
        if (props.content && props.content.objects) {
            const fontsToLoad = [...new Set(
                props.content.objects
                    .filter(obj => ['i-text', 'IText'].includes(obj.type) && obj.fontFamily)
                    .map(obj => obj.fontFamily)
            )];
            if (fontsToLoad.length > 0) {
                await loadFonts(fontsToLoad);
            }
        }

        const currentBg = canvas.backgroundColor;
        canvas.clear();
        canvas.backgroundColor = currentBg;

        // 1. Load user content
        if (props.content && Object.keys(props.content).length > 0) {
            await new Promise(resolve => {
                canvas.loadFromJSON(props.content, () => {
                    canvas.requestRenderAll();
                    resolve();
                });
            });
        }

        // 2. Load Template Frame
        if (props.template?.without_text) {
            let templateFrame = canvas.getObjects().find(o => o.isTemplateFrame === true);

            if (!templateFrame) {
                try {
                    const frameImg = await fabric.FabricImage.fromURL(props.template.without_text);
                    frameImg.set({
                        scaleX: BASE_WIDTH / frameImg.width,
                        scaleY: BASE_HEIGHT / frameImg.height,
                        selectable: false,
                        evented: false,
                        isTemplateFrame: true
                    });

                    frameImg.scaleToWidth(BASE_WIDTH);
                    frameImg.scaleToHeight(BASE_HEIGHT);

                    canvas.add(frameImg);
                } catch (error) {
                    console.error('Error loading template frame:', error);
                }
            }
        }

        manageLayers();
        canvas.requestRenderAll();
        saveCanvasState();
    };

    const manageLayers = () => {
        if (!canvas) return;
        const userImage = canvas.getObjects().find(o => o.isUserImage === true);
        const templateFrame = canvas.getObjects().find(o => o.isTemplateFrame === true);

        if (userImage) {
            canvas.sendObjectToBack(userImage);
        }
        if (templateFrame) {
            if (userImage) {
                // If user image exists, frame goes above it (index 1)
                canvas.moveObjectTo(templateFrame, 1);
            } else {
                // Otherwise frame at back
                canvas.sendObjectToBack(templateFrame);
            }
        }
        canvas.requestRenderAll();
    };

    // --- Text Manipulation ---

    const addText = async () => {
        if (!canvas) return;
        if (confirm('Текст енгізесіз бе?')) {
            await loadFonts(['Academy']);
            const text = new fabric.IText('Новый текст', {
                left: 10,
                top: 10,
                width: 500,
                fontSize: 60,
                fill: '#000000',
                fontFamily: 'Academy',
                textAlign: 'center',
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFontSize = (delta) => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            const newSize = (obj.fontSize || 40) + delta;
            obj.set('fontSize', Math.max(1, newSize));
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const setFontSize = (size) => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fontSize', parseInt(size, 10) || 40);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeTextColor = (color) => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fill', color);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFontStyle = () => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFontWeight = () => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const centerText = () => {
        const obj = canvas.getActiveObject();
        if (obj) {
            canvas.viewportCenterObjectH(obj);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFont = async (fontFamily) => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            await loadFonts([fontFamily]);
            obj.set('fontFamily', fontFamily);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeTextCase = (type) => {
        const obj = canvas.getActiveObject();
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            const currentText = obj.text;
            if (type === 'uppercase') {
                obj.set('text', currentText.toUpperCase());
            } else if (type === 'lowercase') {
                obj.set('text', currentText.toLowerCase());
            }
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    // --- Image Manipulation ---

    const deleteSelected = () => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (confirm('Удалить выбранный объект?')) {
                canvas.remove(activeObject);
                if (activeObject.isUserImage) {
                    saveCanvasState();
                }
            }
        }
    };

    const uploadImageToServer = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            if (!response.ok) throw new Error('Server upload failed');
            const result = await response.json();
            return result.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };

    const addImage = async (file) => {
        if (!file || !canvas) return;
        try {
            const imageUrl = await uploadImageToServer(file);
            if (!imageUrl) return;

            const oldImage = canvas.getObjects().find(o => o.isUserImage === true);
            if (oldImage) {
                canvas.remove(oldImage);
            }

            const imgEl = await fabric.FabricImage.fromURL(imageUrl);
            imgEl.set({
                top: BASE_HEIGHT / 2,
                left: BASE_WIDTH / 2,
                originX: 'center',
                originY: 'center',
                isUserImage: true
            });

            imgEl.scaleToWidth(BASE_WIDTH * 0.8);
            canvas.add(imgEl);
            canvas.setActiveObject(imgEl);
            manageLayers();
            saveCanvasState();

        } catch (error) {
            console.error('Error adding image:', error);
        }
    };

    const exportAsGif = async (gifUrl) => {
        try {
            const resp = await fetch(gifUrl);
            const buff = await resp.arrayBuffer();
            const gif = parseGIF(buff);
            const frames = decompressFrames(gif, true);

            // Prepare temporary canvas for GIF frames
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCanvas.width = BASE_WIDTH;
            tempCanvas.height = BASE_HEIGHT;

            // Prepare Fabric overlay (everything EXCEPT the template frame)
            // 1. Hide template frame
            const templateFrame = canvas.getObjects().find(o => o.isTemplateFrame === true);
            const originalVisibility = templateFrame ? templateFrame.visible : true;
            if (templateFrame) templateFrame.visible = false;

            // 2. Render overlay to data URL
            canvas.renderAll();
            const overlayDataUrl = canvas.toDataURL({ format: 'png', multiplier: 1 });
            const overlayImg = new Image();
            await new Promise(r => { overlayImg.onload = r; overlayImg.src = overlayDataUrl; });

            // 3. Restore visibility
            if (templateFrame) templateFrame.visible = originalVisibility;
            canvas.renderAll();

            // Initialize GIF encoder
            const gifEncoder = new GIF({
                workers: 2,
                quality: 10,
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                workerScript: gifWorkerUrl
            });

            // Composite frames
            for (const frame of frames) {
                // Clear temp canvas
                // tempCtx.clearRect(0, 0, BASE_WIDTH, BASE_HEIGHT); // Not strictly needed if we draw over fully, but good practice if transparency

                // Draw GIF frame
                // Note: gifuct-js gives patch. We might need full frame handling if disposal methods are complex.
                // For simple full-frame GIFs:
                const frameImageData = tempCtx.createImageData(frame.dims.width, frame.dims.height);
                frameImageData.data.set(frame.patch);
                tempCtx.putImageData(frameImageData, frame.dims.left, frame.dims.top);

                // Draw overlay
                tempCtx.drawImage(overlayImg, 0, 0, BASE_WIDTH, BASE_HEIGHT);

                // Add to encoder
                gifEncoder.addFrame(tempCtx, { copy: true, delay: frame.delay });
            }

            return new Promise((resolve, reject) => {
                gifEncoder.on('finished', (blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                gifEncoder.render();
            });

        } catch (e) {
            console.error("GIF export error", e);
            throw e;
        }
    };

    const exportAsImage = async () => {
        if (!canvas) return null;

        // Check if template is GIF
        const templateSrc = props.template?.without_text;
        console.log(templateSrc);
        if (templateSrc && templateSrc.toLowerCase().endsWith('.gif')) {
            try {
                console.log('exporting as gif');
                return await exportAsGif(templateSrc);
            } catch (e) {
                console.error("Failed to export as GIF, falling back to static", e);
            }
        }

        return canvas.toDataURL({ format: 'png', quality: 0.8, multiplier: 2 });
    };

    // --- Lifecycle ---

    onBeforeUnmount(() => {
        if (resizeObserver && canvasWrapper.value) {
            resizeObserver.unobserve(canvasWrapper.value);
        }
        if (canvas) {
            canvas.dispose();
        }
    });

    return {
        fabricCanvas,
        canvasWrapper,
        selectedObject,
        initCanvas,
        loadCanvasState,
        setupResizeObserver,
        resizeCanvas,
        addText,
        changeFontSize,
        setFontSize,
        changeTextColor,
        changeFontStyle,
        changeFontWeight,
        centerText,
        changeFont,
        changeTextCase,
        deleteSelected,
        addImage,
        exportAsImage
    };
}
