'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodePage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentUrl, setCurrentUrl] = useState('');
    const [isGenerating, setIsGenerating] = useState(true);

    // Generate QR code when canvas is ready
    const generateQRCode = async (url: string) => {
        if (!canvasRef.current) {
            console.error('Canvas ref is not available');
            setIsGenerating(false);
            return;
        }

        try {
            console.log('Generating QR code for URL:', url);
            await QRCode.toCanvas(canvasRef.current, url, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            console.log('QR code generated successfully');
            setIsGenerating(false);
        } catch (error) {
            console.error('Error generating QR code:', error);
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        // Get the current URL
        const url = window.location.origin + '/demo';
        setCurrentUrl(url);
        setIsGenerating(false);

        // Try to generate QR code immediately, then retry if needed
        const tryGenerate = () => {
            if (canvasRef.current) {
                generateQRCode(url);
            } else {
                // Retry after a short delay
                setTimeout(tryGenerate, 100);
            }
        };

        // Start trying to generate
        tryGenerate();
    }, []);

    const downloadQR = () => {
        if (canvasRef.current) {
            const link = document.createElement('a');
            link.download = 'wedding-seat-locator-qr.png';
            link.href = canvasRef.current.toDataURL();
            link.click();
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">QR Code</h2>

            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Locate your seat
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Print this QR code onto a sign to help others search their name and locate their seat.
                    </p>

                    {/* QR Code Display */}
                    <div className="flex justify-center mb-6">
                        <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
                            {isGenerating ? (
                                <div className="w-[300px] h-[300px] flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : (
                                <div className="w-[300px] h-[300px] flex items-center justify-center">
                                    <canvas ref={canvasRef} className="rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={downloadQR}
                        disabled={isGenerating}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Download QR Code</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
