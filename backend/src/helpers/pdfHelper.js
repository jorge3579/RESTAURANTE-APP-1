import PDFDocument from "pdfkit";

export function generarReportePDF(titulo, secciones) {

    return new Promise((resolve) => {

        const doc = new PDFDocument({
            margin: 40
        });

        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        doc.fontSize(18).text(titulo, {
            align: "center"
        });

        doc.moveDown();

        for (const seccion of secciones) {

            doc.fontSize(14).text(seccion.titulo);

            doc.moveDown(0.5);

            if (!seccion.data || seccion.data.length === 0) {

                doc.fontSize(10).text("Sin datos.");

                doc.moveDown();

                continue;

            }

            for (const item of seccion.data) {

                doc.fontSize(9).text(
                    JSON.stringify(item)
                );

            }

            doc.moveDown();

        }

        doc.end();

    });

}