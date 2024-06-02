import React, {Component, useEffect, useState} from "react";

function DisplayImage({width, src, defaultSrc, onChange}) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (src) {
            setPreview(src);
        } else {
            setPreview(defaultSrc);
        }
    }, [src]);

    const onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setPreview(URL.createObjectURL(img));
            onChange(img);
        }
    }

    return (
        <div>
            <img src={preview} width={width} className="mb-5"/><br/>
            <input type="file" name="myImage" onChange={onImageChange} />
        </div>
    )
}

export default DisplayImage;
