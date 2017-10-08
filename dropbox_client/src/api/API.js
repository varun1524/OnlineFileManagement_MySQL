const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:3001';

const headers = {
    'Accept': 'application/json'
};

export const doSignUp = (payload) =>
    fetch (`${api}/signup/doSignUp`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
            return res.status;
    }).catch(error => {
        console.log("Error: "+error);
        return error;
    });

export const doLogin = (payload) =>
    fetch(`${api}/login/doLogin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getSession = () =>
    fetch(`${api}/login/getSession`, {
        method: 'GET',
        credentials:'include'
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const doLogout = (payload) =>
    fetch(`${api}/login/doLogout`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });

export const getDirectoryData = (payload) =>
    fetch(`${api}/users/getDirData`,{
        method:'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {return res;})
        .catch(error => {
            console.log("This is error.");
            return error;
        });

export const uploadFile = (payload) =>
    fetch(`${api}/users/upload`, {
        method: 'POST',
        body: payload,
        credentials:'include'
    }).then(res => {
        return res.status;
    }).catch(error => {
        console.log("This is error");
        return error;
    });


export const createDirectory = (payload) =>
    fetch(`${api}/users/createDir`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const sendDirectorayPath = (payload) =>
    fetch(`${api}/users/setdirPath`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(payload),
        credentials:'include'
    }).then(res => {
        return res;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


/*
export const doCalculate = (payload) =>
    fetch (`${api}/users/doCalculate`,
        {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => {
        return res.json();
    }).catch(error => {
        console.log("Error: "+error);
        return error;
    });*/
