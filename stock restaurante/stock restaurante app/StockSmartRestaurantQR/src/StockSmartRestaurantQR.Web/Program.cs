using System.Globalization;
using System.Security.Claims;
using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.IdentityModel.Tokens;
using MudBlazor.Services;
using StockSmartRestaurantQR.Application.DTOs;
using StockSmartRestaurantQR.Application.Interfaces;
using StockSmartRestaurantQR.Application.Validation;
using StockSmartRestaurantQR.Infrastructure;
using StockSmartRestaurantQR.Infrastructure.Auth;
using StockSmartRestaurantQR.Infrastructure.Persistence;
using StockSmartRestaurantQR.Web;
using StockSmartRestaurantQR.Web.Components;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseStaticWebAssets();
var culture = CultureInfo.GetCultureInfo("es-AR");
CultureInfo.DefaultThreadCurrentCulture = culture;
CultureInfo.DefaultThreadCurrentUICulture = culture;
builder.Services.AddRazorComponents().AddInteractiveServerComponents();
var keyDirectory = Path.Combine(builder.Environment.ContentRootPath, ".keys");
Directory.CreateDirectory(keyDirectory);
builder.Services.AddDataProtection().PersistKeysToFileSystem(new DirectoryInfo(keyDirectory)).SetApplicationName("StockSmartRestaurantQR");
builder.Services.AddMudServices();
builder.Services.AddControllers();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddValidatorsFromAssemblyContaining<ProductRequestValidator>();
builder.Services.AddInfrastructure(builder.Configuration);

var jwt = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>()
    ?? throw new InvalidOperationException("Falta JwtSettings.");
builder.Services.AddAuthentication(options => { options.DefaultScheme = "Smart"; options.DefaultChallengeScheme = "Smart"; })
    .AddPolicyScheme("Smart", "Cookie o JWT", options =>
    {
        options.ForwardDefaultSelector = context => context.Request.Headers.Authorization.ToString().StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase)
            ? JwtBearerDefaults.AuthenticationScheme : CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        options.LoginPath = "/login"; options.AccessDeniedPath = "/acceso-denegado";
        options.ExpireTimeSpan = TimeSpan.FromHours(jwt.ExpirationHours); options.SlidingExpiration = true;
        options.Cookie.HttpOnly = true; options.Cookie.SameSite = SameSiteMode.Strict; options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.Events = new CookieAuthenticationEvents
        {
            OnRedirectToLogin = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            },
            OnRedirectToAccessDenied = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            }
        };
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, ValidIssuer = jwt.Issuer, ValidateAudience = true, ValidAudience = jwt.Audience,
            ValidateLifetime = true, ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Secret)), ClockSkew = TimeSpan.FromMinutes(1)
        };
    });
builder.Services.AddAuthorization(options => options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin")));

var app = builder.Build();
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost
});
app.UsePathBase("/stock");
app.UseRouting();
if (!app.Environment.IsDevelopment()) { app.UseExceptionHandler("/Error", createScopeForErrors: true); app.UseHsts(); }
app.UseWhen(context => !context.Request.Path.StartsWithSegments("/api"), branch =>
    branch.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true));
app.UseHttpsRedirection(); app.UseStaticFiles();
app.UseRequestLocalization(new RequestLocalizationOptions { DefaultRequestCulture = new RequestCulture(culture), SupportedCultures = [culture], SupportedUICultures = [culture] });
app.UseAuthentication(); app.UseAuthorization(); app.UseAntiforgery();

app.MapPost("/auth/login", async ([FromForm] LoginRequest request, IAuthService auth, HttpContext context) =>
{
    var result = await auth.LoginAsync(request, context.RequestAborted);
    if (!result.Success || result.Value is null) return Results.LocalRedirect($"{context.Request.PathBase}/login?error=1");
    var value = result.Value;
    var claims = new[] { new Claim(ClaimTypes.NameIdentifier, value.UserId), new Claim(ClaimTypes.Name, value.Username),
        new Claim("FullName", value.FullName), new Claim(ClaimTypes.Role, value.Role) };
    await context.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme)));
    return Results.LocalRedirect($"{context.Request.PathBase}/");
}).AllowAnonymous();
app.MapPost("/auth/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.LocalRedirect($"{context.Request.PathBase}/login");
}).RequireAuthorization();

app.MapStockApi(); app.MapControllers(); app.MapStaticAssets();
app.MapRazorComponents<App>().AddInteractiveServerRenderMode();
await InitializeAsync(app);
app.Run();

static async Task InitializeAsync(WebApplication app)
{
    Directory.CreateDirectory(Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "productos"));
    await using var scope = app.Services.CreateAsyncScope();
    var logger = scope.ServiceProvider.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    try
    {
        await scope.ServiceProvider.GetRequiredService<DataSeeder>().SeedAsync();
        await scope.ServiceProvider.GetRequiredService<IUserService>().SeedAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Las bases de datos todavía no están disponibles. La aplicación requiere completar la configuración.");
    }
}

public partial class Program;
