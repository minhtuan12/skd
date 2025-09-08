'use client'

import {Viewer, Worker} from '@react-pdf-viewer/core';
import {defaultLayoutPlugin} from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';


export default function PdfViewer({url, downloadable}: any) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div style={{height: '750px'}}>
                <Viewer
                    fileUrl={url}
                    plugins={[
                        defaultLayoutPluginInstance,
                    ]}
                />
                {!downloadable ?
                    <div className="w-full max-w-5xl flex justify-start">
                        <a className={'underline flex justify-start mt-2 text-lg text-blue-600 w-fit cursor-pointer'} href={url}>
                            Tải xuống PDF
                        </a>
                    </div> : ''
                }
            </div>
        </Worker>
    );
}
