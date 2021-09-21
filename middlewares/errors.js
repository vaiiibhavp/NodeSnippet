

module.exports = (app) => {

    // app errors handler
    app.use((err, req, res, next) => {
        let response = {
            success: false,
            error_code: err.code || 'BadRequest',
            message: err.message,
            //   errors: [],
            //  data: null
        };
        let status_code = err.statusCode || 400;

        /** Moongose bad object id */
        if (err.name === "CastError") {
            if (err.code === "ERR_ASSERTION") {
                response.message = err.message;
            } else {
                response.message = err.message;
                response.error_code = "404NotFound";
                status_code = 404;
            }

        }
        res.status(status_code).json(response);
    });

    // 404 error handler
    app.use((req, res) => {
        res.status(404);
        res.json({
            success: false,
            message: "404 Not found",
            error_code: "404NotFound"
        });
    });
}