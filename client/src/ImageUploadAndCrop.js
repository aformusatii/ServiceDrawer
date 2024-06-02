import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import {Button} from "react-bootstrap";
import {isNotSet, isSet} from "./Utils.js";

const ImageUploadAndCrop = ({src, defaultSrc, onChange}) => {
    const [imageSrc, setImageSrc] = useState(null)
    const [cropImage, setCropImage] = useState(null)
    const [editable, setEditable] = useState(false)

    useEffect(() => {
        if (src) {
            setImageSrc(src);
        } else {
            setImageSrc(null);
        }
    }, [src]);

    const handleCrop = (event) => {
        const imageData = event.target.cropper.getCroppedCanvas().toDataURL();
        setCropImage(imageData);
    };

    const handleStartCrop = (event) => {
        setEditable(true);
    }

    const handleCompleteCrop = (event) => {
        setImageSrc(cropImage);
        onChange(cropImage);
        setEditable(false);
    }

    const handleCancelCrop = (event) => {
        setEditable(false);
    }

    const handleDropImage = (imageDataUrl) => {
        setImageSrc(imageDataUrl);
        setCropImage(imageDataUrl);
        onChange(imageDataUrl);
        //console.log('Image dropped', imageDataUrl);
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {'image/*': ['.jpeg', '.jpg', '.png']},
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                const reader = new FileReader()
                reader.addEventListener('load', () => handleDropImage(reader.result))
                reader.readAsDataURL(acceptedFiles[0])
            }
        },
    });

    useEffect(() => {
        const pasteImage = (event) => {
            if (event.clipboardData && event.clipboardData.items.length > 0) {
                for (let i = 0; i < event.clipboardData.items.length; i++) {
                    const item = event.clipboardData.items[i];
                    if (item.kind === "file") {
                        const file = item.getAsFile();
                        const reader = new FileReader();
                        reader.addEventListener('load', () => handleDropImage(reader.result))
                        //reader.onload = (event) => setImageSrc(event.target.result);
                        reader.readAsDataURL(file);
                        break;
                    }
                }
            }
        };

        window.addEventListener('paste', pasteImage);
        return () => {
            window.removeEventListener('paste', pasteImage);
        }
    }, []);

    const Dropzone =
        <div {...getRootProps()} style={{ border: '2px dashed #cccccc', padding: '20px 0 10px 0', textAlign: 'center' }}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <p>Drop the files here...</p>
            ) : (
                <p>Drag 'n' drop some files here, or click to select files</p>
            )}
        </div>;

    const EditableImage =
        <div>
            <div style={{marginTop: '10px'}}>
                <Cropper
                    src={imageSrc}
                    style={{ height: 400, width: "100%" }}
                    // Cropper.js options
                    initialAspectRatio={16 / 9}
                    guides={true}
                    crop={handleCrop}
                    checkCrossOrigin={true}
                    viewMode={1}
                />
            </div>

            <div style={{marginTop: '10px'}}>
                <Button variant="success" onClick={handleCompleteCrop}>Save Crop</Button>
                <Button variant="danger" onClick={handleCancelCrop} style={{marginLeft: '10px'}}>Cancel</Button>
            </div>
        </div>;

    const ReadonlyImage =
         <div>
            <div style={{marginTop: '10px'}}>
                <img src={imageSrc} style={{ maxWidth: '100%', maxHeight: '300px' }} alt="logo"/>
            </div>

            <div style={{marginTop: '10px'}}>
                <Button variant="primary" onClick={handleStartCrop}>Edit</Button>
            </div>
        </div>;

    return (
        <div>
            {Dropzone}

            {isSet(imageSrc) && (
                <div>
                    {editable && EditableImage}
                    {!editable && ReadonlyImage}
                </div>
            )}

            {isNotSet(imageSrc) && isSet(defaultSrc) && (
                <img src={defaultSrc} style={{ height: '50px' }} alt="no image"/>
            )}

        </div>
    )
}

export default ImageUploadAndCrop;