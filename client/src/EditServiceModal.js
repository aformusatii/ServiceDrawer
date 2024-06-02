// --- EditServiceModal.js ---
import React, {useEffect, useState} from 'react';
import { Modal, Button, Container, Row, Col, Alert, Tabs, Tab } from 'react-bootstrap';
import { parse, stringify } from 'yaml';
import {isNotSet, isSet, resolveImageUrl} from './Utils.js';

import defaultLogo from './images/app-store.png';
import ImageUploadAndCrop from './ImageUploadAndCrop';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/webpack-resolver";
import RichTextEditor from "./RichTextEditor";


function EditServiceModal({ show, onClose, onSave, service}) {

    const [imageSrc, setImageSrc] = useState(null);
    const [image, setImage] = useState(null);
    const [editorError, setEditorError] = useState(null);
    const [editorContent, setEditorContent] = useState('');
    const [newService, setNewService] = useState(true);

    useEffect(() => {
        if (show) {
            setImage(null);
            setImageSrc(null);

            if (isSet(service.value.logo)) {
                setImageSrc(resolveImageUrl(service.value.logo));
            }

            if (isSet(service.value.properties.string)) {
                setEditorContent(service.value.properties.string);
            } else if (isSet(service.value.properties.object)) {
                setEditorContent(stringify(service.value.properties.object));
            }

            setNewService(isNotSet(service.key));
        }
    }, [show]);

    const handleEditorChange = (newValue) => {
        setEditorContent(newValue);

        try {
            const parsed = parse(newValue);
            service.value.properties.string = newValue;
            service.value.properties.object = parsed;

            setEditorError(null);

        } catch (e) {
            console.error('Error parsing YAML', e);
            setEditorError(e.message);
        }
    }

    const handleSave = () => {
        onSave(service, image);
    }

    const handleImageChange = (img) => {
        console.log('handleImageChange', img);
        setImage(img);
    }

    const handleRichEditorChange = (value) => {
        service.value.textDetails = value;
    }

    const editorStyle = {
        width: '100%',
        height: 400,
        fontWeight: 'normal !important'
    };

    const tabStyle = {
        marginTop: 10
    }

    return (
        <Modal show={show} onHide={onClose} size="xl" autoFocus={false} restoreFocus={false} enforceFocus={false}>
            <Modal.Header closeButton>
                <Modal.Title>{newService ? 'New Service' : 'Edit Service'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Tabs defaultActiveKey="properties" id="uncontrolled-tab-example">
                        <Tab eventKey="properties" title="Properties">
                            <div style={tabStyle} className={"tab-content"}>
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

                                <Alert show={editorError} variant="danger">{editorError}</Alert>
                            </div>
                        </Tab>
                        <Tab eventKey="logo" title="Logo Image">
                            <div style={tabStyle} className={"tab-content"}>
                                <ImageUploadAndCrop src={imageSrc} defaultSrc={defaultLogo} onChange={handleImageChange}/>
                            </div>
                        </Tab>
                        <Tab eventKey="details" title="Text Details">
                            <div style={tabStyle} className={"tab-content"}>
                                <RichTextEditor value={service.value.textDetails} onChange={handleRichEditorChange}/>
                            </div>
                        </Tab>
                    </Tabs>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditServiceModal;