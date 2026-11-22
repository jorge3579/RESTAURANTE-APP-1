using ClosedXML.Excel;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using StockSmartRestaurantQR.Application.DTOs;
using StockSmartRestaurantQR.Application.Interfaces;
using StockSmartRestaurantQR.Infrastructure.Persistence;

namespace StockSmartRestaurantQR.Infrastructure.Services;

public sealed class ReportService(ApplicationDbContext db) : IReportService
{
    private static readonly string CurrencyFormat = "$ #,##0.00";

    public async Task<byte[]> SalesPdfAsync(ReportFilter filter, CancellationToken cancellationToken = default)
    {
        var sales = await SalesQuery(filter).ToListAsync(cancellationToken);
        return BuildPdf("Reporte de ventas", $"Período: {Period(filter)}", table =>
        {
            table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); });
            table.Header(h => { Header(h.Cell(), "Fecha"); Header(h.Cell(), "Número"); Header(h.Cell(), "Cliente"); Header(h.Cell(), "Total"); });
            foreach (var sale in sales)
            {
                Cell(table.Cell(), Local(sale.SaleDate).ToString("dd/MM/yyyy HH:mm")); Cell(table.Cell(), sale.SaleNumber);
                Cell(table.Cell(), sale.CustomerName ?? "Consumidor final"); Cell(table.Cell(), sale.TotalAmount.ToString("C", EsAr()));
            }
        });
    }

    public async Task<byte[]> InventoryPdfAsync(CancellationToken cancellationToken = default)
    {
        var products = await db.Products.AsNoTracking().Include(x => x.Category).OrderBy(x => x.Name).ToListAsync(cancellationToken);
        return BuildPdf("Inventario valorizado", $"Generado: {DateTime.Now:dd/MM/yyyy HH:mm}", table =>
        {
            table.ColumnsDefinition(c => { c.RelativeColumn(); c.RelativeColumn(2); c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn(); });
            table.Header(h => { Header(h.Cell(), "Código"); Header(h.Cell(), "Producto"); Header(h.Cell(), "Stock"); Header(h.Cell(), "Costo"); Header(h.Cell(), "Valor"); });
            foreach (var p in products)
            {
                Cell(table.Cell(), p.Code); Cell(table.Cell(), p.Name); Cell(table.Cell(), $"{p.Stock:0.###} {p.Unit}");
                Cell(table.Cell(), p.Cost.ToString("C", EsAr())); Cell(table.Cell(), (p.Stock * p.Cost).ToString("C", EsAr()));
            }
        });
    }

    public async Task<byte[]> SalesExcelAsync(ReportFilter filter, CancellationToken cancellationToken = default)
    {
        var sales = await SalesQuery(filter).ToListAsync(cancellationToken);
        using var workbook = new XLWorkbook(); var sheet = workbook.Worksheets.Add("Ventas");
        var headers = new[] { "Fecha", "Número", "Cliente", "Usuario", "Total" };
        for (var i = 0; i < headers.Length; i++) sheet.Cell(1, i + 1).Value = headers[i];
        for (var i = 0; i < sales.Count; i++)
        {
            var s = sales[i]; var row = i + 2; sheet.Cell(row, 1).Value = Local(s.SaleDate); sheet.Cell(row, 2).Value = s.SaleNumber;
            sheet.Cell(row, 3).Value = s.CustomerName ?? "Consumidor final"; sheet.Cell(row, 4).Value = s.UserId; sheet.Cell(row, 5).Value = s.TotalAmount;
        }
        StyleSheet(sheet, 5); sheet.Column(5).Style.NumberFormat.Format = CurrencyFormat;
        return Save(workbook);
    }

    public async Task<byte[]> InventoryExcelAsync(CancellationToken cancellationToken = default)
    {
        var products = await db.Products.AsNoTracking().Include(x => x.Category).OrderBy(x => x.Name).ToListAsync(cancellationToken);
        using var workbook = new XLWorkbook(); var sheet = workbook.Worksheets.Add("Inventario");
        var headers = new[] { "Código", "Producto", "Categoría", "Unidad", "Stock", "Mínimo", "Costo", "Precio", "Valor" };
        for (var i = 0; i < headers.Length; i++) sheet.Cell(1, i + 1).Value = headers[i];
        for (var i = 0; i < products.Count; i++)
        {
            var p = products[i]; var row = i + 2; sheet.Cell(row, 1).Value = p.Code; sheet.Cell(row, 2).Value = p.Name;
            sheet.Cell(row, 3).Value = p.Category.Name; sheet.Cell(row, 4).Value = p.Unit; sheet.Cell(row, 5).Value = p.Stock;
            sheet.Cell(row, 6).Value = p.MinStock; sheet.Cell(row, 7).Value = p.Cost; sheet.Cell(row, 8).Value = p.Price; sheet.Cell(row, 9).Value = p.Stock * p.Cost;
        }
        StyleSheet(sheet, 9); sheet.Columns(7, 9).Style.NumberFormat.Format = CurrencyFormat;
        return Save(workbook);
    }

    public async Task<byte[]> SaleReceiptPdfAsync(int saleId, CancellationToken cancellationToken = default)
    {
        var sale = await db.Sales.AsNoTracking().Include(x => x.Details).ThenInclude(x => x.Product).FirstOrDefaultAsync(x => x.Id == saleId, cancellationToken)
            ?? throw new KeyNotFoundException("Venta no encontrada.");
        return BuildPdf($"Comprobante {sale.SaleNumber}", $"Fecha: {Local(sale.SaleDate):dd/MM/yyyy HH:mm} - Cliente: {sale.CustomerName ?? "Consumidor final"}", table =>
        {
            table.ColumnsDefinition(c => { c.RelativeColumn(3); c.RelativeColumn(); c.RelativeColumn(); c.RelativeColumn(); });
            table.Header(h => { Header(h.Cell(), "Producto"); Header(h.Cell(), "Cantidad"); Header(h.Cell(), "Precio"); Header(h.Cell(), "Subtotal"); });
            foreach (var d in sale.Details)
            {
                Cell(table.Cell(), d.Product.Name); Cell(table.Cell(), d.Quantity.ToString("0.###")); Cell(table.Cell(), d.UnitPrice.ToString("C", EsAr())); Cell(table.Cell(), d.SubTotal.ToString("C", EsAr()));
            }
            table.Cell().ColumnSpan(3).AlignRight().Padding(5).Text("TOTAL").Bold(); table.Cell().Padding(5).Text(sale.TotalAmount.ToString("C", EsAr())).Bold();
        });
    }

    private IQueryable<Domain.Entities.Sale> SalesQuery(ReportFilter filter)
    {
        var query = db.Sales.AsNoTracking().AsQueryable();
        if (filter.From.HasValue) query = query.Where(x => x.SaleDate >= filter.From.Value.ToUniversalTime());
        if (filter.To.HasValue) query = query.Where(x => x.SaleDate < filter.To.Value.Date.AddDays(1).ToUniversalTime());
        return query.OrderByDescending(x => x.SaleDate);
    }

    private static byte[] BuildPdf(string title, string subtitle, Action<TableDescriptor> content) => Document.Create(document =>
    {
        document.Page(page =>
        {
            page.Size(PageSizes.A4); page.Margin(30); page.DefaultTextStyle(x => x.FontSize(9));
            page.Header().Column(c => { c.Item().Text("StockSmart Restaurant").FontSize(18).Bold().FontColor(Colors.Blue.Darken2); c.Item().Text(title).FontSize(14).SemiBold(); c.Item().Text(subtitle).FontColor(Colors.Grey.Darken1); });
            page.Content().PaddingVertical(15).Table(content);
            page.Footer().AlignCenter().Text(x => { x.Span("Página "); x.CurrentPageNumber(); x.Span(" de "); x.TotalPages(); });
        });
    }).GeneratePdf();

    private static void Header(IContainer container, string text) => container.Background(Colors.Blue.Darken2).Padding(5).Text(text).FontColor(Colors.White).Bold();
    private static void Cell(IContainer container, string text) => container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5).Text(text);
    private static byte[] Save(XLWorkbook workbook) { using var stream = new MemoryStream(); workbook.SaveAs(stream); return stream.ToArray(); }
    private static void StyleSheet(IXLWorksheet sheet, int columns) { var range = sheet.Range(1, 1, 1, columns); range.Style.Font.Bold = true; range.Style.Fill.BackgroundColor = XLColor.DarkBlue; range.Style.Font.FontColor = XLColor.White; sheet.Columns().AdjustToContents(); sheet.SheetView.FreezeRows(1); }
    private static string Period(ReportFilter f) => $"{f.From?.ToString("dd/MM/yyyy") ?? "inicio"} a {f.To?.ToString("dd/MM/yyyy") ?? "hoy"}";
    private static DateTime Local(DateTime utc) => TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.SpecifyKind(utc, DateTimeKind.Utc), "Argentina Standard Time");
    private static System.Globalization.CultureInfo EsAr() => System.Globalization.CultureInfo.GetCultureInfo("es-AR");
}
