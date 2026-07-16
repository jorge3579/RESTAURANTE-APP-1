import XLSX from "xlsx";

export function generarExcelDesdeHojas(hojas) {

    const workbook = XLSX.utils.book_new();

    for (const hoja of hojas) {

        const worksheet = XLSX.utils.json_to_sheet(hoja.data);

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            hoja.nombre
        );

    }

    return XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx"
    });

}