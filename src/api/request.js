import axios from "axios";

const errorHandler = (error) => {
    if (error.response) {
        if (!error.response.data) {
            console.log("Error", error.message);
        } else {
            switch (error.response.status) {
                case 502:
                case 404:
                case 500: {
                    console.log("Error", error.response.statusText);
                    // showSnackbar({
                    //     text: error.response.statusText,
                    //     color: "error",
                    // });
                    break;
                }
                default: {
                    const _error = error.response.data.message;
                    if (typeof _error === "object") {
                        for (let message of _error) {
                            console.log("Error", message);
                            // showSnackbar({
                            //     text: message,
                            //     color: "error",
                            // });
                        }
                        // Object.keys(_error).forEach((key) => {
                        //     _error[key].forEach((message) => {
                        //         showSnackbar({
                        //             text: message,
                        //             color: "error",
                        //         });
                        //     });
                        // });
                    } else {
                        console.log("Error", _error);
                    }
                }
            }
        }
    }
};
export default (
    method,
    url,
    {
        headers = {},
        params = {},
        data = {},
        onSuccess = null,
        onFailure = null,
        onFinally = null,
        responseType = "json",
        onUploadProgress = null,
        onDownloadProgress = null,
        // isTokenRequired = flase,
        // cancel = false,
    } = {}
) => {
    const methods = ["get", "post", "patch", "put", "delete"];
    if (!methods.includes(method)) return `Method ${method} not allowed.`;
    if (!url) return "url is required";

    const config = {
        method,
        url,
        headers,
        params,
        data,
        responseType,
        onUploadProgress,
        onDownloadProgress,
    };
    // if (cancel) {
    //     source.cancel();
    //     source = axios.CancelToken.source();
    //     // config.cancelToken = source.token;
    // }

    // if (isTokenRequired) {
    //     // const { accessToken } = authToken.getToken();
    //     // headers["authorization"] = `Bearer ${accessToken}`;
    // }
    return axios(config)
        .then((response) => {
            if (onSuccess != null) {
                onSuccess(response);
            }
        })
        .catch((error) => {
            if (onFailure != null) {
                onFailure(error.response);
            } else errorHandler(error);
        })
        .finally(() => {
            if (onFinally != null) {
                onFinally();
            }
        });
};
