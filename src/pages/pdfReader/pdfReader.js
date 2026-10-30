import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { pdfList } from "../../bento/aboutPageData";

const containerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 0',
};

const iframeStyle = {
    width: 'min(1120px, 95%)',
    height: '85dvh',
    border: 0,
};

const titles = {
    "release-notes-pdf": "C3DC Release Notes PDF",
    "user-guide": "C3DC User Guide PDF",
};

export default function PdfReader() {
    const { pathname } = useLocation();
    const key = pathname.replace(/^\/|\/$/g, "");
    const pdfUrl = pdfList[key];

    if (!pdfUrl) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={containerStyle}>
            <iframe style={iframeStyle} src={pdfUrl} title={titles[key]} />
        </div>
    );
}
