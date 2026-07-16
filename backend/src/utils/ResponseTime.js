export default function responseTime(req, res, next) {

    const inicio = process.hrtime();

    res.on("finish", () => {

        const diferencia = process.hrtime(inicio);

        const tiempo =
            (diferencia[0] * 1000) +
            (diferencia[1] / 1000000);

        console.log(

            `${req.method} ${req.originalUrl} ${tiempo.toFixed(2)} ms`

        );

    });

    next();

}