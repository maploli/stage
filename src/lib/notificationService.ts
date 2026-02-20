export const sendApprovalEmail = async (inscription: any, pdfBlob: Blob) => {
    try {
        // Convert Blob to Base64 for the Function
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
        });
        reader.readAsDataURL(pdfBlob);
        const pdfBase64 = await base64Promise;

        // Call the Netlify Function
        const response = await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            body: JSON.stringify({
                inscription,
                pdfBase64,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send email');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
