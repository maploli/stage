export const sendApprovalEmail = async (inscription: any, pdfBlob: Blob) => {
    return sendEmailNotification(inscription, 'APPROVAL', pdfBlob);
};

export const sendRejectionEmail = async (inscription: any) => {
    return sendEmailNotification(inscription, 'REJECTION');
};

const sendEmailNotification = async (inscription: any, type: 'APPROVAL' | 'REJECTION', pdfBlob?: Blob) => {
    try {
        let pdfBase64 = null;
        
        if (pdfBlob) {
            // Convert Blob to Base64 for the Function
            const reader = new FileReader();
            const base64Promise = new Promise<string>((resolve) => {
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    resolve(base64String);
                };
            });
            reader.readAsDataURL(pdfBlob);
            pdfBase64 = await base64Promise;
        }

        // Call the Vercel Serverless Function
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inscription,
                type,
                pdfBase64,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send email');
        }

        return await response.json();
    } catch (error) {
        console.error(`Error sending ${type} email:`, error);
        throw error;
    }
};
