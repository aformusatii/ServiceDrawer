import React, {useEffect, useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import {isSet} from "./Utils";

//console.log(ClassicEditor.builtinPlugins.map(plugin => plugin.pluginName));

function RichTextEditor({value, onChange}) {
    const [editorValue, setEditorValue] = useState('');

    useEffect(() => {
        if (isSet(value)) {
            setEditorValue(value);
        }
    }, [value]);

    return (
        <div>
            <CKEditor
                editor={Editor}
                data={editorValue}
                onReady={ editor => {
                    // You can store the "editor" and use when it is needed.
                    //console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    onChange(data);
                } }
                onBlur={ ( event, editor ) => {
                    //console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    //console.log( 'Focus.', editor );
                } }
            />
        </div>
    )
}

export default RichTextEditor;