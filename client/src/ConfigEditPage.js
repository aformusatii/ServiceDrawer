import React, {useEffect, useState} from 'react';
import AceEditor from "react-ace";
import {resolveApiUrl} from './Utils.js';
import {Button} from "react-bootstrap";

import ConfigurationRepository from "./ConfigurationRepository";

const configurationRepository = new ConfigurationRepository();

const ConfigEditPage = () => {

    const [editorContent, setEditorContent] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [saveEnabled, setSaveEnabled] = useState(false);

    const handleEditorChange = (newValue) => {
        setEditorContent(newValue);
        setSaveEnabled(newValue !== originalContent);
    }

    const fetchContent = async () => {
        const configuration = await configurationRepository.fetch();
        setEditorContent(configuration);
        setOriginalContent(configuration);
        setSaveEnabled(false);
    }

    const handleSave = async () => {
        await configurationRepository.save(editorContent);
        await fetchContent();
    }

    useEffect(() => {
        fetchContent();
    }, []);

    const editorStyle = {
        width: '100%',
        height: 400,
        fontWeight: 'normal !important'
    };

    return (
        <div>
            <div>
                <AceEditor
                    mode="yaml"
                    theme="monokai"
                    name="ACE_EDITOR"
                    value={editorContent}
                    onChange={handleEditorChange}
                    fontSize={16}
                    editorProps={{
                        $blockScrolling: true,
                        $highlightPending: false,
                        $highlightTagPending: false
                    }}
                    style={editorStyle}
                />
            </div>

            <div className={'mt-2'}>
                <Button variant="primary" onClick={handleSave} disabled={!saveEnabled}>
                    Save Changes
                </Button>
            </div>

        </div>
    );
};

export default ConfigEditPage;