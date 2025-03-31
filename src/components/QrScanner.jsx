import { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRScanner = ({ onScan }) => {
    const [result, setResult] = useState(null);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold">Scan Booking QR Code</h2>

            <QrReader
                onResult={(scanData) => {
                    if (scanData?.text) {
                        setResult(scanData.text);
                        onScan(scanData.text);
                    }
                }}
                style={{ width: "100%" }}
            />

            {result && (
                <p className="mt-3 text-green-500">
                    Scanned Booking ID: {result}
                </p>
            )}
        </div>
    );
};

export default QRScanner;
