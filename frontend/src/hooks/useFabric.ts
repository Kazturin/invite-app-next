'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import GIF from 'gif.js';
// @ts-ignore
import gifWorkerScript from 'gif.js/dist/gif.worker.js?raw';
// @ts-ignore
import { parseGIF, decompressFrames } from 'gifuct-js';

let gifWorkerUrl = '';
if (typeof window !== 'undefined') {
    const gifWorkerBlob = new Blob([gifWorkerScript], { type: 'application/javascript' });
    gifWorkerUrl = URL.createObjectURL(gifWorkerBlob);
}

import { BASE_WIDTH, BASE_HEIGHT } from '@/data/invitation-constants';
import apiClient from '@/lib/api-client';

interface UseFabricProps {
    template: any;
    content: any;
    bg_img?: string | null;
}

interface UseFabricEmit {
    onUpdateContent: (content: any) => void;
}

const isSameImageSrc = (src1: string | null | undefined, src2: string | null | undefined) => {
    if (!src1 || !src2) return false;
    try {
        const url1 = new URL(src1, 'http://localhost');
        const url2 = new URL(src2, 'http://localhost');
        return url1.pathname === url2.pathname;
    } catch {
        return src1 === src2;
    }
};

export function useFabric(props: UseFabricProps, emit: UseFabricEmit) {
    const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasWrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<fabric.Canvas | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

    const isLoadingRef = useRef(false);
    const propsRef = useRef(props);

    useEffect(() => {
        propsRef.current = props;
    }, [props]);

    const saveCanvasState = useCallback(() => {
        if (isLoadingRef.current) return;
        const canvas = canvasRef.current;
        if (canvas) {
            const canvasData = (canvas as any).toJSON(['isTemplateFrame', 'isUserImage', 'src']);

            const templateSrc = propsRef.current.template?.without_text;

            // Filter out the template frame from the saved data
            canvasData.objects = (canvasData.objects || []).filter((obj: any) => {
                if (obj.isTemplateFrame) return false;
                if (isSameImageSrc(obj.src, templateSrc)) return false;
                return true;
            });
            emit.onUpdateContent(canvasData);
        }
    }, [emit]);

    const loadFonts = useCallback(async (fontFamilies: string[]) => {
        try {
            await Promise.all(
                fontFamilies.map((family) => {
                    if (!family) return Promise.resolve();
                    return document.fonts.load(`1em ${family}`);
                })
            );
        } catch (error) {
            console.error('Error loading fonts:', error);
        }
    }, []);

    const manageLayers = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects();
        const userImage = objects.find((o: any) =>
            o.isUserImage === true ||
            ((['image', 'Image'].includes(o.type) || o instanceof fabric.Image) && o.isTemplateFrame !== true)
        );
        const templateFrame = objects.find((o: any) => o.isTemplateFrame === true);

        // 1. Move templateFrame to the absolute back
        if (templateFrame) {
            canvas.sendObjectToBack(templateFrame);
        }

        // 2. Move userImage to the absolute back (pushes templateFrame forward by 1 index to cover the userImage)
        if (userImage) {
            canvas.sendObjectToBack(userImage);
        }

        canvas.requestRenderAll();
    }, []);

    const lastLoadedTemplateIdRef = useRef<string | null>(null);

    const loadCanvasState = useCallback(async (contentToLoad?: any) => {
        const canvas = canvasRef.current;
        if (!canvas || !canvas.contextContainer || isLoadingRef.current) return;

        isLoadingRef.current = true;
        let targetContent = contentToLoad || props.content;

        try {
            if (targetContent && targetContent.objects) {
                // Filter out existing template images to prevent duplication from older saved states
                const templateSrc = props.template?.without_text;
                const filteredObjects = targetContent.objects.map((obj: any) => {
                    if (obj.src && typeof obj.src === 'string') {
                        if (obj.src.startsWith('/')) {
                            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                            obj.src = `${baseUrl.replace(/\/+$/, '')}${obj.src}`;
                        }
                        // Add cache-buster to prevent iOS Safari from using non-CORS cached images (which leads to transparent Canvas)
                        if (!obj.src.includes('cb=')) {
                            obj.src = obj.src + (obj.src.includes('?') ? '&' : '?') + 'cb=' + Date.now();
                        }
                    }
                    return obj;
                }).filter((obj: any) => {
                    if (obj.isTemplateFrame) return false;
                    if (isSameImageSrc(obj.src, templateSrc)) return false;
                    return true;
                });

                targetContent = { ...targetContent, objects: filteredObjects };
            }

            if (targetContent && targetContent.objects) {
                const fontsToLoad = [
                    ...new Set(
                        targetContent.objects
                            .filter((obj: any) => ['i-text', 'IText'].includes(obj.type) && obj.fontFamily)
                            .map((obj: any) => obj.fontFamily)
                    ),
                ] as string[];
                if (fontsToLoad.length > 0) {
                    await loadFonts(fontsToLoad);
                }
            }

            if (!canvas || !canvas.contextContainer) return;

            const currentBg = canvas.backgroundColor;
            canvas.clear();
            canvas.backgroundColor = currentBg;

            if (targetContent && Object.keys(targetContent).length > 0) {
                try {
                    await canvas.loadFromJSON(targetContent);
                } catch (error) {
                    console.error('Error loading JSON into canvas:', error);
                }
            }

            if (props.template?.without_text) {
                const objects = canvas.getObjects();
                let templateFrame = objects.find((o: any) => (o as any).isTemplateFrame === true);

                if (!templateFrame) {
                    try {
                        const imgUrl = props.template.without_text;
                        const corsBypassUrl = imgUrl + (imgUrl.includes('?') ? '&' : '?') + 'cb=' + Date.now();

                        const frameImg = await fabric.FabricImage.fromURL(corsBypassUrl, {
                            crossOrigin: 'anonymous'
                        });

                        const scale = Math.max(BASE_WIDTH / frameImg.width, BASE_HEIGHT / frameImg.height);

                        frameImg.set({
                            selectable: false,
                            evented: false,
                            scaleX: scale,
                            scaleY: scale,
                            left: BASE_WIDTH / 2,
                            top: BASE_HEIGHT / 2,
                            originX: 'center',
                            originY: 'center',
                            isTemplateFrame: true,
                        });

                        canvas.add(frameImg);
                        canvas.sendObjectToBack(frameImg);
                    } catch (error) {
                        console.error('CRITICAL: Error loading template frame:', error, props.template.without_text);
                    }
                }
            }

            manageLayers();
            canvas.requestRenderAll();
            saveCanvasState();
            lastLoadedTemplateIdRef.current = props.template?.id;
        } catch (error) {
            console.error('CRITICAL: Error in loadCanvasState:', error);
        } finally {
            isLoadingRef.current = false;
        }
    }, [props.template, loadFonts, manageLayers]); // content removed from deps

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const canvasWrapper = canvasWrapperRef.current;
        if (!canvas || !canvasWrapper) return;

        const containerWidth = canvasWrapper.clientWidth;
        if (containerWidth === 0) return;

        const scale = containerWidth / BASE_WIDTH;
        const containerHeight = BASE_HEIGHT * scale;

        canvas.setDimensions({
            width: containerWidth,
            height: containerHeight,
        });

        canvas.setZoom(scale);
        canvas.calcOffset();
        canvas.renderAll();
    }, []);

    useEffect(() => {
        if (!fabricCanvasRef.current) return;

        const controls = fabric.controlsUtils.createObjectDefaultControls() as any;
        delete controls.mt;
        delete controls.mb;
        delete controls.ml;
        delete controls.mr;

        // @ts-ignore
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

        const canvas = new fabric.Canvas(fabricCanvasRef.current, {
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            backgroundColor: 'transparent',
            preserveObjectStacking: true,
        });

        canvasRef.current = canvas;

        canvas.on('selection:created', (e) => setSelectedObject(e.selected[0]));
        canvas.on('selection:updated', (e) => setSelectedObject(e.selected[0]));
        canvas.on('selection:cleared', () => setSelectedObject(null));

        canvas.on('object:modified', saveCanvasState);
        canvas.on('object:added', saveCanvasState);
        canvas.on('object:removed', saveCanvasState);

        // Initial load
        loadCanvasState().then(() => {
            resizeCanvas();
        });

        // Setup ResizeObserver
        if (canvasWrapperRef.current) {
            resizeObserverRef.current = new ResizeObserver(() => {
                resizeCanvas();
            });
            resizeObserverRef.current.observe(canvasWrapperRef.current);
        }

        return () => {
            if (resizeObserverRef.current && canvasWrapperRef.current) {
                resizeObserverRef.current.unobserve(canvasWrapperRef.current);
            }
            canvas.dispose();
            canvasRef.current = null;
        };
    }, []); // Only on mount

    useEffect(() => {
        if (canvasRef.current && props.template?.id && props.template.id !== lastLoadedTemplateIdRef.current) {
            loadCanvasState();
        }
    }, [props.template?.id, loadCanvasState]);

    const addText = async () => {
        const canvas = canvasRef.current;
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

    const changeFontSize = (delta: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            const newSize = (obj.fontSize || 40) + delta;
            obj.set('fontSize', Math.max(1, newSize));
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const setFontSize = (size: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fontSize', parseInt(size, 10) || 40);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeTextColor = (color: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fill', color);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFontStyle = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFontWeight = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const centerText = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject();
        if (obj) {
            canvas.viewportCenterObjectH(obj);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeFont = async (fontFamily: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
        if (obj && ['i-text', 'IText'].includes(obj.type)) {
            await loadFonts([fontFamily]);
            obj.set('fontFamily', fontFamily);
            canvas.requestRenderAll();
            saveCanvasState();
        }
    };

    const changeTextCase = (type: 'uppercase' | 'lowercase') => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const obj = canvas.getActiveObject() as any;
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

    const deleteSelected = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            if (confirm('Удалить выбранный объект?')) {
                canvas.remove(activeObject);
                // @ts-ignore
                if (activeObject.isUserImage) {
                    saveCanvasState();
                }
            }
        }
    };

    const uploadImageToServer = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await apiClient.post('/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let url = response.data.url;
            if (url && url.startsWith('/')) {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                url = `${baseUrl.replace(/\/+$/, '')}${url}`;
            }
            return url;
        } catch (error: any) {
            console.error('Error uploading image:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
                alert(errorMessages);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Қателік орын алды. Файлды жүктеу мүмкін емес.');
            }
            return null;
        }
    };

    const addImage = async (file: File) => {
        const canvas = canvasRef.current;
        if (!file || !canvas) return;
        try {
            const imageUrl = await uploadImageToServer(file);
            if (!imageUrl) return;

            // Удаляем как любые предыдущие загруженные пользователем картинки, так и картинки-заглушки из самого шаблона
            const oldImages = canvas.getObjects().filter((o: any) => {
                return o.isUserImage === true || ((['image', 'Image'].includes(o.type) || o instanceof fabric.Image) && o.isTemplateFrame !== true);
            });
            oldImages.forEach((img: any) => canvas.remove(img));

            const imgEl = await fabric.FabricImage.fromURL(imageUrl, {
                crossOrigin: 'anonymous'
            });
            imgEl.set({
                top: BASE_HEIGHT / 2,
                left: BASE_WIDTH / 2,
                originX: 'center',
                originY: 'center',
                // @ts-ignore
                isUserImage: true,
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

    const exportAsGif = async (gifUrl: string): Promise<string | null> => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        try {
            const resp = await fetch(gifUrl);
            const buff = await resp.arrayBuffer();
            const gif = parseGIF(buff);
            const frames = decompressFrames(gif, true);

            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return null;
            tempCanvas.width = BASE_WIDTH;
            tempCanvas.height = BASE_HEIGHT;

            // Prepare Fabric overlay (everything EXCEPT the template frame)
            // 1. Hide template frame
            const objects = canvas.getObjects();
            const templateFrame = objects.find((o: any) => o.isTemplateFrame === true);
            const originalVisibility = templateFrame ? templateFrame.visible : true;
            if (templateFrame) templateFrame.visible = false;

            // 2. Render overlay to data URL
            canvas.renderAll();
            const overlayDataUrl = canvas.toDataURL({ format: 'png', multiplier: BASE_WIDTH / canvas.getWidth() });
            const overlayImg = new Image();
            await new Promise((r) => { overlayImg.onload = r; overlayImg.src = overlayDataUrl; });

            // 3. Restore visibility
            if (templateFrame) templateFrame.visible = originalVisibility;
            canvas.renderAll();

            // Initialize GIF encoder
            const gifEncoder = new GIF({
                workers: 2,
                quality: 2,
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                workerScript: gifWorkerUrl
            });

            // Composite frames
            for (const frame of frames) {
                // Draw GIF frame
                const frameImageData = (tempCtx as any).createImageData(frame.dims.width, frame.dims.height);
                frameImageData.data.set(frame.patch);
                (tempCtx as any).putImageData(frameImageData, frame.dims.left, frame.dims.top);

                // Draw overlay
                tempCtx.drawImage(overlayImg, 0, 0, BASE_WIDTH, BASE_HEIGHT);

                // Add to encoder
                gifEncoder.addFrame(tempCanvas, { copy: true, delay: frame.delay });
            }

            return new Promise((resolve, reject) => {
                gifEncoder.on('finished', (blob: Blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
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

    const exportAsImage = async (): Promise<string | null> => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        // Check if template is GIF
        const templateSrc = props.template?.without_text;
        if (templateSrc && templateSrc.toLowerCase().endsWith('.gif')) {
            try {
                return await exportAsGif(templateSrc);
            } catch (e) {
                console.error("Failed to export as GIF, falling back to static", e);
            }
        }

        return canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: (BASE_WIDTH * 1.5) / canvas.getWidth()
        });
    };

    return {
        fabricCanvasRef,
        canvasWrapperRef,
        selectedObject,
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
        exportAsImage,
    };
}
