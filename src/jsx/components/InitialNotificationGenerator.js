import { useEffect } from 'react';

const InitialNotificationGenerator = () => {
    useEffect(() => {
        const hasNotified = sessionStorage.getItem('hasNotified');
        if (!hasNotified) {
            sendNotification().then(() => {});
            sessionStorage.setItem('hasNotified', true);
        }
    }, []);

    const sendNotification = async () => {
        let jwt = 0;
        try {
            jwt = JSON.parse(localStorage.getItem('authTokens')).access;
        } catch(ignored) {
            return;
        }
        console.log(jwt);
        if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
                if (permission !== "granted") {
                    return null;
                }
            });
        }
        let response = await fetch(`http://127.0.0.1:8000/api/myitems/expiring/?jwt=${jwt}`, {
            method:'GET'
        })
        let data = await response.json()
        if (response.status === 200) {
            console.log(data);
            if (data.length >= 1) {
                setTimeout(() => {
                    new Notification("Item Expiration Reminder", {
                        body: `${data.length} of your items will expire tomorrow.`,
                    })
                }, 3 * 1000);
            }
        }
    };
    return null;
};

export default InitialNotificationGenerator;